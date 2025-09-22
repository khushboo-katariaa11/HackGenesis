"""
Flask API Server for PyTorch DenseNet121 Fracture Detection Model

Place your model file (best_densenet121.pth) in the same directory as this file.

To run:
1. Install dependencies: pip install flask flask-cors torch torchvision pillow numpy opencv-python pytorch-grad-cam shap matplotlib
2. Place your model file: best_densenet121.pth
3. Run: python app.py
4. Server will start on http://localhost:8000
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from seaborn import heatmap
import torch
import torch.nn as nn
import torchvision.models as models
import torchvision.transforms as transforms
from PIL import Image
import io
import base64
import numpy as np
import cv2
import time
import os
from pytorch_grad_cam import GradCAM
from pytorch_grad_cam.utils.image import show_cam_on_image
import shap
import matplotlib.pyplot as plt
import matplotlib
matplotlib.use('Agg')  # Use non-interactive backend
from counterfactual_explainer import CounterfactualExplainer, create_counterfactual_visualizations


app = Flask(__name__)
CORS(app)  # Enable CORS for frontend requests

MODEL_CONFIG = {
    'num_classes': 2,
    'class_names': ['normal', 'fracture'],
    'input_size': 224,
    'model_path': 'best.pth'  # <-- Use just the filename if the model is in the same directory as app.py
}

model = None
shap_explainer = None
counterfactual_explainer = None
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

transform = transforms.Compose([
    transforms.Resize((MODEL_CONFIG['input_size'], MODEL_CONFIG['input_size'])),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])  # ImageNet normalization
])

def load_model():
    global model, shap_explainer, counterfactual_explainer
    if not os.path.exists(MODEL_CONFIG['model_path']):
        raise FileNotFoundError(f"Model file not found: {MODEL_CONFIG['model_path']}")
    try:
        # Build model exactly as you trained it
        model = models.densenet121(weights=None)
        num_features = model.classifier.in_features
        model.classifier = nn.Linear(num_features, MODEL_CONFIG['num_classes'])
        checkpoint = torch.load(MODEL_CONFIG['model_path'], map_location=device)
        model.load_state_dict(checkpoint)
        model.to(device)
        model.eval()
        
        # Initialize SHAP explainer
        print("Initializing SHAP explainer...")
        try:
            # For PyTorch models, use GradientExplainer instead of DeepExplainer
            # to avoid TensorFlow dependency issues
            background_data = torch.randn(5, 3, MODEL_CONFIG['input_size'], MODEL_CONFIG['input_size']).to(device)
            
            # Use GradientExplainer which works better with PyTorch
            shap_explainer = shap.GradientExplainer(model, background_data)
            print("SHAP explainer initialized successfully")
        except Exception as shap_error:
            print(f"Warning: Failed to initialize SHAP explainer: {shap_error}")
            shap_explainer = None
        
        # Initialize Counterfactual explainer
        print("Initializing Counterfactual explainer...")
        try:
            counterfactual_explainer = CounterfactualExplainer(model, device, MODEL_CONFIG['input_size'])
            print("Counterfactual explainer initialized successfully")
        except Exception as cf_error:
            print(f"Warning: Failed to initialize Counterfactual explainer: {cf_error}")
            counterfactual_explainer = None
        
        print(f"Model loaded successfully on {device}")
        return True
    except Exception as e:
        print(f"Error loading model: {str(e)}")
        return False

def preprocess_image(image_data):
    """Preprocess base64 image for model input"""
    try:
        image_bytes = base64.b64decode(image_data)
        image = Image.open(io.BytesIO(image_bytes))
        if image.mode != 'RGB':
            image = image.convert('RGB')
        input_tensor = transform(image).unsqueeze(0)  # Add batch dimension
        return input_tensor.to(device), image
    except Exception as e:
        raise ValueError(f"Error preprocessing image: {str(e)}")

def generate_gradcam(model, input_tensor, target_class=None):
    """Generate Grad-CAM visualization using pytorch-grad-cam"""
    try:
        target_layers = [model.features[-1]]
        cam = GradCAM(model=model, target_layers=target_layers)
        # Targets argument can be set for specific class, or None for max score
        grayscale_cam = cam(input_tensor=input_tensor, targets=None)[0]
        # Convert input tensor to normalized numpy image
        img_np = input_tensor.squeeze().cpu().numpy()
        img_np = np.transpose(img_np, (1, 2, 0))
        img_norm = (img_np - img_np.min()) / (img_np.max() - img_np.min() + 1e-8)
        cam_image = show_cam_on_image(img_norm, grayscale_cam, use_rgb=True)
        return cam_image
    except Exception as e:
        print(f"Grad-CAM generation failed: {str(e)}")
        # Fallback: blank heatmap
        heatmap = np.zeros((MODEL_CONFIG['input_size'], MODEL_CONFIG['input_size'], 3), dtype=np.uint8)
        return heatmap

def create_gradcam_overlay(original_image, heatmap):
    """Create Grad-CAM overlay on original image and return as base64 PNG"""
    try:
        overlay_image = Image.fromarray(heatmap)
        buffer = io.BytesIO()
        overlay_image.save(buffer, format='PNG')
        overlay_base64 = base64.b64encode(buffer.getvalue()).decode()
        return overlay_base64
    except Exception as e:
        print(f"Error creating Grad-CAM overlay: {str(e)}")
        return None

def generate_shap_explanation(input_tensor, predicted_class=None):
    """Generate SHAP explanations for model predictions"""
    try:
        if shap_explainer is None:
            print("SHAP explainer not available")
            return None, None
            
        # Get SHAP values using GradientExplainer
        input_tensor_grad = input_tensor.requires_grad_(True)
        shap_values = shap_explainer.shap_values(input_tensor_grad)
        
        # GradientExplainer returns numpy array with shape (batch, channels, height, width, num_classes)
        shap_array = shap_values
        
        # Extract values for the predicted class
        if len(shap_array.shape) == 5:  # (batch, C, H, W, num_classes)
            if predicted_class is not None and predicted_class < shap_array.shape[-1]:
                class_shap_values = shap_array[0, :, :, :, predicted_class]  # (C, H, W)
            else:
                class_shap_values = shap_array[0, :, :, :, 0]  # Use first class (C, H, W)
        else:
            class_shap_values = shap_array
        
        # Convert to numpy if needed
        if isinstance(class_shap_values, np.ndarray):
            shap_values_np = class_shap_values
        else:
            shap_values_np = class_shap_values.cpu().numpy()
        
        # Aggregate across color channels for visualization
        if len(shap_values_np.shape) == 3:  # (C, H, W)
            shap_heatmap = np.mean(np.abs(shap_values_np), axis=0)
        else:
            shap_heatmap = np.abs(shap_values_np)
        
        # Normalize for visualization
        shap_heatmap = (shap_heatmap - shap_heatmap.min()) / (shap_heatmap.max() - shap_heatmap.min() + 1e-8)
        
        # Create SHAP visualization
        plt.figure(figsize=(8, 6))
        plt.imshow(shap_heatmap, cmap='RdBu_r', alpha=0.8)
        plt.colorbar(label='SHAP Value Magnitude')
        plt.title(f'SHAP Explanation - Class {predicted_class}')
        plt.axis('off')
        
        # Save to base64
        buffer = io.BytesIO()
        plt.savefig(buffer, format='PNG', bbox_inches='tight', dpi=150)
        plt.close()
        shap_image_base64 = base64.b64encode(buffer.getvalue()).decode()
        
        # Calculate feature importance scores
        top_features = []
        flattened_shap = shap_heatmap.flatten()
        top_indices = np.argsort(flattened_shap)[-10:][::-1]  # Top 10 most important pixels
        
        for idx in top_indices:
            row, col = divmod(idx, shap_heatmap.shape[1])
            importance = flattened_shap[idx]
            top_features.append({
                'position': {'row': int(row), 'col': int(col)},
                'importance': float(importance),
                'region': f"Region ({row}, {col})"
            })
        
        return shap_image_base64, top_features
        
    except Exception as e:
        print(f"SHAP explanation generation failed: {str(e)}")
        return None, None

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None,
        'device': str(device),
        'timestamp': time.time()
    })

@app.route('/analyze', methods=['POST'])
def analyze_xray():
    """Main analysis endpoint"""
    start_time = time.time()
    try:
        if model is None:
            return jsonify({'error': 'Model not loaded'}), 500
        data = request.get_json()
        if not data or 'image' not in data:
            return jsonify({'error': 'No image data provided'}), 400

        # Preprocess image for model
        input_tensor, original_image = preprocess_image(data['image'])

        # Inference
        with torch.no_grad():
            outputs = model(input_tensor)
            probabilities = torch.softmax(outputs, dim=1)
            confidence, predicted = torch.max(probabilities, 1)
            predicted_class = predicted.item()
            confidence_score = confidence.item()

        # Generate Grad-CAM
        heatmap = generate_gradcam(model, input_tensor, predicted_class)

        # Convert Grad-CAM to base64 PNG
        gradcam_overlay = create_gradcam_overlay(original_image.resize((MODEL_CONFIG['input_size'], MODEL_CONFIG['input_size'])), heatmap)

        # Generate SHAP explanations
        shap_image, shap_features = generate_shap_explanation(input_tensor, predicted_class)

        # Prepare response
        prediction_label = MODEL_CONFIG['class_names'][predicted_class]
        processing_time = time.time() - start_time

        response = {
            'prediction': prediction_label,
            'prediction_index': predicted_class,
            'confidence': confidence_score,
            'processing_time': processing_time,
            'gradcam_image': gradcam_overlay,
            'shap_explanation': {
                'available': shap_image is not None,
                'image': shap_image,
                'top_features': shap_features if shap_features else [],
                'description': 'SHAP values explain which regions of the image contributed most to the model\'s prediction'
            },
            'counterfactual_available': counterfactual_explainer is not None,
            'model_info': {
                'architecture': 'DenseNet121',
                'input_size': MODEL_CONFIG['input_size'],
                'classes': MODEL_CONFIG['class_names']
            },
            'timestamp': time.time()
        }
        return jsonify(response)

    except Exception as e:
        import traceback
        print("Exception in /analyze:", traceback.format_exc())
        return jsonify({
            'error': str(e),
            'processing_time': time.time() - start_time
        }), 500

@app.route('/counterfactual', methods=['POST'])
def generate_counterfactual():
    """Generate counterfactual explanations for an X-ray image"""
    start_time = time.time()
    try:
        if model is None:
            return jsonify({'error': 'Model not loaded'}), 500
        
        if counterfactual_explainer is None:
            return jsonify({'error': 'Counterfactual explainer not available'}), 500
            
        data = request.get_json()
        if not data or 'image' not in data:
            return jsonify({'error': 'No image data provided'}), 400

        # Preprocess image
        input_tensor, original_image = preprocess_image(data['image'])

        # Get original prediction
        with torch.no_grad():
            outputs = model(input_tensor)
            probabilities = torch.softmax(outputs, dim=1)
            confidence, predicted = torch.max(probabilities, 1)
            predicted_class = predicted.item()

        # Generate comprehensive counterfactuals
        print(f"Generating counterfactual explanations for class {predicted_class}...")
        counterfactual_results = counterfactual_explainer.generate_comprehensive_counterfactuals(
            input_tensor, predicted_class
        )

        # Create visualizations
        visualizations = create_counterfactual_visualizations(counterfactual_results)

        # Prepare response
        processing_time = time.time() - start_time
        
        response = {
            'success': True,
            'original_prediction': {
                'class': MODEL_CONFIG['class_names'][predicted_class],
                'class_index': predicted_class,
                'confidence': confidence.item()
            },
            'counterfactual_results': counterfactual_results,
            'visualizations': visualizations,
            'processing_time': processing_time,
            'explanation': {
                'purpose': 'Counterfactual explanations show what would need to change in the X-ray for the AI to predict differently',
                'methods': {
                    'adversarial': 'Minimal pixel-level changes to flip prediction',
                    'gradient_optimization': 'Gradient-based optimization to find counterfactual',
                    'mask_based': 'Regional masking to identify critical areas'
                },
                'interpretation': 'Smaller perturbations indicate more robust predictions. Large changes suggest uncertainty.'
            },
            'timestamp': time.time()
        }
        
        return jsonify(response)

    except Exception as e:
        import traceback
        print("Exception in /counterfactual:", traceback.format_exc())
        return jsonify({
            'error': str(e),
            'processing_time': time.time() - start_time
        }), 500

@app.route('/model-info', methods=['GET'])
def model_info():
    """Get model information"""
    explainability_methods = ['grad_cam']
    if shap_explainer is not None:
        explainability_methods.append('shap')
    if counterfactual_explainer is not None:
        explainability_methods.append('counterfactual')
        
    return jsonify({
        'architecture': 'DenseNet121',
        'classes': MODEL_CONFIG['class_names'],
        'input_size': MODEL_CONFIG['input_size'],
        'device': str(device),
        'model_loaded': model is not None,
        'shap_available': shap_explainer is not None,
        'counterfactual_available': counterfactual_explainer is not None,
        'explainability_methods': explainability_methods,
        'endpoints': {
            '/analyze': 'Analyze X-ray image with basic explanations',
            '/counterfactual': 'Generate counterfactual explanations',
            '/health': 'Health check',
            '/model-info': 'Model information'
        }
    })

if __name__ == '__main__':
    print("Starting Fracture Detection API Server...")
    print(f"Device: {device}")
    if load_model():
        print("Model loaded successfully!")
        print(f"Server starting on http://localhost:8000")
        print("\nAPI Endpoints:")
        print("- POST /analyze - Analyze X-ray image")
        print("- POST /counterfactual - Generate counterfactual explanations")
        print("- GET /health - Health check")
        print("- GET /model-info - Model information")
        print("\nMake sure to place your 'best.pth' file in this directory!")
        app.run(host='0.0.0.0', port=8000, debug=True)
    else:
        print("Failed to load model. Please check your model file and try again.")
