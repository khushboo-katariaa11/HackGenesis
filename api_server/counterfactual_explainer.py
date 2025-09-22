"""
Counterfactual Explanation System for Medical Image Analysis

This module generates counterfactual explanations for X-ray fracture detection:
- "What would need to change in this X-ray for the AI to predict differently?"
- Visual counterfactuals showing minimal changes needed
- Quantitative analysis of decision boundaries
"""

import torch
import torch.nn.functional as F
import numpy as np
import cv2
from PIL import Image
import matplotlib.pyplot as plt
import matplotlib
matplotlib.use('Agg')
import io
import base64
from typing import Tuple, List, Dict, Optional
import warnings
warnings.filterwarnings('ignore')


class CounterfactualExplainer:
    """
    Generate counterfactual explanations for medical image classification
    """
    
    def __init__(self, model, device='cpu', target_size=224):
        self.model = model
        self.device = device
        self.target_size = target_size
        self.model.eval()
        
    def generate_adversarial_counterfactual(self, 
                                          input_tensor: torch.Tensor,
                                          target_class: int,
                                          epsilon: float = 0.1,
                                          alpha: float = 0.01,
                                          iterations: int = 100) -> Dict:
        """
        Generate adversarial counterfactual using iterative perturbation
        
        Args:
            input_tensor: Original image tensor
            target_class: Desired prediction class
            epsilon: Maximum perturbation magnitude
            alpha: Step size for each iteration
            iterations: Maximum number of iterations
            
        Returns:
            Dictionary containing counterfactual results
        """
        input_tensor = input_tensor.clone().detach().to(self.device)
        input_tensor.requires_grad_(True)
        
        original_pred = self._get_prediction(input_tensor)
        
        # If already predicting target class, return original
        if original_pred['predicted_class'] == target_class:
            return {
                'success': False,
                'message': f'Already predicting target class {target_class}',
                'original_prediction': original_pred,
                'counterfactual_image': None,
                'perturbation_magnitude': 0.0
            }
        
        # Initialize perturbation
        perturbation = torch.zeros_like(input_tensor)
        best_perturbation = None
        best_confidence = 0.0
        
        for i in range(iterations):
            # Forward pass
            output = self.model(input_tensor + perturbation)
            current_pred = F.softmax(output, dim=1)
            
            # Check if we've achieved target class
            predicted_class = torch.argmax(current_pred, dim=1).item()
            target_confidence = current_pred[0, target_class].item()
            
            if predicted_class == target_class:
                if target_confidence > best_confidence:
                    best_confidence = target_confidence
                    best_perturbation = perturbation.clone()
                    
                # Early stopping if high confidence
                if target_confidence > 0.8:
                    break
            
            # Compute loss (negative log likelihood for target class)
            loss = -F.log_softmax(output, dim=1)[0, target_class]
            
            # Backward pass
            loss.backward()
            
            # Update perturbation using gradient descent
            with torch.no_grad():
                grad_sign = perturbation.grad.sign()
                perturbation -= alpha * grad_sign
                
                # Clip perturbation to epsilon ball
                perturbation = torch.clamp(perturbation, -epsilon, epsilon)
                
                # Ensure perturbed image is in valid range [0, 1]
                perturbed_image = input_tensor + perturbation
                perturbation = torch.clamp(perturbed_image, 0, 1) - input_tensor
                
            # Zero gradients
            perturbation.grad = None
        
        # Use best perturbation found
        if best_perturbation is not None:
            final_perturbation = best_perturbation
        else:
            final_perturbation = perturbation
            
        # Generate final results
        counterfactual_image = input_tensor + final_perturbation
        final_pred = self._get_prediction(counterfactual_image)
        
        # Calculate perturbation magnitude
        perturbation_magnitude = torch.norm(final_perturbation).item()
        
        success = final_pred['predicted_class'] == target_class
        
        return {
            'success': success,
            'original_prediction': original_pred,
            'counterfactual_prediction': final_pred,
            'counterfactual_image': self._tensor_to_base64(counterfactual_image),
            'perturbation_map': self._tensor_to_base64(final_perturbation),
            'perturbation_magnitude': perturbation_magnitude,
            'iterations_used': i + 1,
            'confidence_improvement': final_pred['confidence'] - original_pred['confidence'] if success else 0.0
        }
    
    def generate_gradient_based_counterfactual(self,
                                             input_tensor: torch.Tensor,
                                             target_class: int,
                                             lambda_reg: float = 0.1) -> Dict:
        """
        Generate counterfactual using gradient-based optimization
        """
        input_tensor = input_tensor.clone().detach().to(self.device)
        
        # Initialize counterfactual as copy of original
        counterfactual = input_tensor.clone().detach()
        counterfactual.requires_grad_(True)
        
        optimizer = torch.optim.Adam([counterfactual], lr=0.01)
        
        original_pred = self._get_prediction(input_tensor)
        
        best_loss = float('inf')
        best_counterfactual = None
        
        for iteration in range(200):
            optimizer.zero_grad()
            
            # Forward pass
            output = self.model(counterfactual)
            pred_probs = F.softmax(output, dim=1)
            
            # Loss components
            # 1. Classification loss (maximize target class probability)
            classification_loss = -torch.log(pred_probs[0, target_class] + 1e-8)
            
            # 2. Proximity loss (minimize distance from original)
            proximity_loss = torch.norm(counterfactual - input_tensor, p=2)
            
            # Combined loss
            total_loss = classification_loss + lambda_reg * proximity_loss
            
            # Check if this is the best result so far
            if total_loss.item() < best_loss:
                best_loss = total_loss.item()
                best_counterfactual = counterfactual.clone().detach()
            
            # Backward pass
            total_loss.backward()
            optimizer.step()
            
            # Clamp to valid image range
            with torch.no_grad():
                counterfactual.clamp_(0, 1)
            
            # Early stopping if target achieved
            predicted_class = torch.argmax(pred_probs, dim=1).item()
            if predicted_class == target_class and pred_probs[0, target_class].item() > 0.7:
                break
        
        # Generate results with best counterfactual
        if best_counterfactual is not None:
            final_counterfactual = best_counterfactual
        else:
            final_counterfactual = counterfactual.detach()
            
        final_pred = self._get_prediction(final_counterfactual)
        
        # Calculate changes
        difference = torch.abs(final_counterfactual - input_tensor)
        perturbation_magnitude = torch.norm(difference).item()
        
        success = final_pred['predicted_class'] == target_class
        
        return {
            'success': success,
            'method': 'gradient_optimization',
            'original_prediction': original_pred,
            'counterfactual_prediction': final_pred,
            'counterfactual_image': self._tensor_to_base64(final_counterfactual),
            'difference_map': self._tensor_to_base64(difference),
            'perturbation_magnitude': perturbation_magnitude,
            'iterations_used': iteration + 1,
            'final_loss': best_loss
        }
    
    def generate_mask_based_counterfactual(self,
                                         input_tensor: torch.Tensor,
                                         target_class: int,
                                         mask_size: int = 32) -> Dict:
        """
        Generate counterfactual by systematically masking image regions
        """
        input_tensor = input_tensor.clone().detach().to(self.device)
        original_pred = self._get_prediction(input_tensor)
        
        h, w = input_tensor.shape[-2:]
        best_result = None
        best_confidence = 0.0
        
        # Try different mask positions
        for y in range(0, h - mask_size + 1, mask_size // 2):
            for x in range(0, w - mask_size + 1, mask_size // 2):
                # Create masked version
                masked_image = input_tensor.clone()
                
                # Apply mask (set to mean pixel value)
                mask_value = input_tensor.mean()
                masked_image[:, :, y:y+mask_size, x:x+mask_size] = mask_value
                
                # Get prediction
                pred = self._get_prediction(masked_image)
                
                # Check if this achieves target class
                if pred['predicted_class'] == target_class:
                    if pred['confidence'] > best_confidence:
                        best_confidence = pred['confidence']
                        best_result = {
                            'counterfactual_image': masked_image,
                            'mask_position': (x, y, x + mask_size, y + mask_size),
                            'prediction': pred
                        }
        
        if best_result is not None:
            # Create difference map
            difference = torch.abs(best_result['counterfactual_image'] - input_tensor)
            
            return {
                'success': True,
                'method': 'mask_based',
                'original_prediction': original_pred,
                'counterfactual_prediction': best_result['prediction'],
                'counterfactual_image': self._tensor_to_base64(best_result['counterfactual_image']),
                'difference_map': self._tensor_to_base64(difference),
                'mask_position': best_result['mask_position'],
                'confidence_achieved': best_confidence
            }
        else:
            return {
                'success': False,
                'method': 'mask_based',
                'message': 'No mask position achieved target class',
                'original_prediction': original_pred
            }
    
    def generate_comprehensive_counterfactuals(self,
                                             input_tensor: torch.Tensor,
                                             original_class: int) -> Dict:
        """
        Generate multiple types of counterfactual explanations
        """
        target_class = 1 - original_class  # Flip between 0 (normal) and 1 (fracture)
        
        results = {
            'original_class': original_class,
            'target_class': target_class,
            'original_prediction': self._get_prediction(input_tensor),
            'counterfactuals': {}
        }
        
        # Method 1: Adversarial perturbation
        try:
            adv_result = self.generate_adversarial_counterfactual(
                input_tensor, target_class, epsilon=0.1
            )
            results['counterfactuals']['adversarial'] = adv_result
        except Exception as e:
            results['counterfactuals']['adversarial'] = {'error': str(e)}
        
        # Method 2: Gradient optimization
        try:
            grad_result = self.generate_gradient_based_counterfactual(
                input_tensor, target_class
            )
            results['counterfactuals']['gradient_optimization'] = grad_result
        except Exception as e:
            results['counterfactuals']['gradient_optimization'] = {'error': str(e)}
        
        # Method 3: Mask-based
        try:
            mask_result = self.generate_mask_based_counterfactual(
                input_tensor, target_class
            )
            results['counterfactuals']['mask_based'] = mask_result
        except Exception as e:
            results['counterfactuals']['mask_based'] = {'error': str(e)}
        
        # Generate summary
        successful_methods = [
            method for method, result in results['counterfactuals'].items()
            if isinstance(result, dict) and result.get('success', False)
        ]
        
        results['summary'] = {
            'total_methods_tried': len(results['counterfactuals']),
            'successful_methods': len(successful_methods),
            'successful_method_names': successful_methods,
            'best_method': self._find_best_method(results['counterfactuals'])
        }
        
        return results
    
    def _get_prediction(self, tensor: torch.Tensor) -> Dict:
        """Get model prediction for a tensor"""
        with torch.no_grad():
            output = self.model(tensor)
            probabilities = F.softmax(output, dim=1)
            predicted_class = torch.argmax(probabilities, dim=1).item()
            confidence = probabilities[0, predicted_class].item()
            
            return {
                'predicted_class': predicted_class,
                'confidence': confidence,
                'probabilities': probabilities[0].cpu().numpy().tolist()
            }
    
    def _tensor_to_base64(self, tensor: torch.Tensor) -> str:
        """Convert tensor to base64 encoded PNG"""
        try:
            # Convert to numpy and normalize
            img_np = tensor.squeeze().cpu().detach().numpy()
            
            if len(img_np.shape) == 3:  # (C, H, W)
                img_np = np.transpose(img_np, (1, 2, 0))
            
            # Normalize to 0-255
            img_np = (img_np * 255).astype(np.uint8)
            
            # Convert to PIL Image
            if len(img_np.shape) == 3 and img_np.shape[2] == 3:
                img = Image.fromarray(img_np, 'RGB')
            else:
                img = Image.fromarray(img_np, 'L')
            
            # Convert to base64
            buffer = io.BytesIO()
            img.save(buffer, format='PNG')
            img_base64 = base64.b64encode(buffer.getvalue()).decode()
            
            return img_base64
            
        except Exception as e:
            print(f"Error converting tensor to base64: {e}")
            return ""
    
    def _find_best_method(self, counterfactuals: Dict) -> Optional[str]:
        """Find the best counterfactual method based on success and quality"""
        best_method = None
        best_score = 0.0
        
        for method_name, result in counterfactuals.items():
            if isinstance(result, dict) and result.get('success', False):
                # Score based on confidence and perturbation magnitude
                confidence = result.get('counterfactual_prediction', {}).get('confidence', 0)
                perturbation = result.get('perturbation_magnitude', float('inf'))
                
                # Higher confidence, lower perturbation = better score
                score = confidence / (1 + perturbation)
                
                if score > best_score:
                    best_score = score
                    best_method = method_name
        
        return best_method


def create_counterfactual_visualizations(counterfactual_results: Dict) -> Dict[str, str]:
    """
    Create visualization plots for counterfactual explanations
    """
    visualizations = {}
    
    try:
        # Create comparison plot
        fig, axes = plt.subplots(2, 3, figsize=(15, 10))
        fig.suptitle('Counterfactual Explanations for Medical Image Analysis', fontsize=16)
        
        # Original prediction info
        original_pred = counterfactual_results['original_prediction']
        target_class = counterfactual_results['target_class']
        
        class_names = ['Normal', 'Fracture']
        
        row = 0
        for method_name, result in counterfactual_results['counterfactuals'].items():
            if isinstance(result, dict) and result.get('success', False):
                # Decode images
                try:
                    cf_img_data = base64.b64decode(result['counterfactual_image'])
                    cf_img = Image.open(io.BytesIO(cf_img_data))
                    
                    # Plot counterfactual image
                    axes[row, 0].imshow(cf_img, cmap='gray')
                    axes[row, 0].set_title(f'{method_name.title()}\nCounterfactual Image')
                    axes[row, 0].axis('off')
                    
                    # Plot difference/perturbation map if available
                    if 'difference_map' in result:
                        diff_img_data = base64.b64decode(result['difference_map'])
                        diff_img = Image.open(io.BytesIO(diff_img_data))
                        axes[row, 1].imshow(diff_img, cmap='hot')
                        axes[row, 1].set_title('Difference Map')
                        axes[row, 1].axis('off')
                    
                    # Plot prediction comparison
                    cf_pred = result['counterfactual_prediction']
                    
                    categories = ['Original', 'Counterfactual']
                    normal_probs = [original_pred['probabilities'][0], cf_pred['probabilities'][0]]
                    fracture_probs = [original_pred['probabilities'][1], cf_pred['probabilities'][1]]
                    
                    x = np.arange(len(categories))
                    width = 0.35
                    
                    bars1 = axes[row, 2].bar(x - width/2, normal_probs, width, label='Normal', alpha=0.8)
                    bars2 = axes[row, 2].bar(x + width/2, fracture_probs, width, label='Fracture', alpha=0.8)
                    
                    axes[row, 2].set_ylabel('Probability')
                    axes[row, 2].set_title(f'Prediction Comparison\n{method_name.title()}')
                    axes[row, 2].set_xticks(x)
                    axes[row, 2].set_xticklabels(categories)
                    axes[row, 2].legend()
                    axes[row, 2].set_ylim(0, 1)
                    
                    # Add confidence text
                    axes[row, 2].text(0, original_pred['confidence'] + 0.05, 
                                    f"{original_pred['confidence']:.3f}", 
                                    ha='center', va='bottom')
                    axes[row, 2].text(1, cf_pred['confidence'] + 0.05, 
                                    f"{cf_pred['confidence']:.3f}", 
                                    ha='center', va='bottom')
                    
                    row += 1
                    if row >= 2:  # Limit to 2 rows
                        break
                        
                except Exception as e:
                    print(f"Error plotting {method_name}: {e}")
                    continue
        
        # Remove empty subplots
        for i in range(row, 2):
            for j in range(3):
                axes[i, j].remove()
        
        plt.tight_layout()
        
        # Convert to base64
        buffer = io.BytesIO()
        plt.savefig(buffer, format='PNG', dpi=150, bbox_inches='tight')
        plt.close()
        
        visualizations['comparison_plot'] = base64.b64encode(buffer.getvalue()).decode()
        
    except Exception as e:
        print(f"Error creating visualizations: {e}")
        visualizations['error'] = str(e)
    
    return visualizations
