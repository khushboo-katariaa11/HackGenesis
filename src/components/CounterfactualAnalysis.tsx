import React, { useState } from 'react';
import { Brain, Zap, Target, Info, ChevronDown, ChevronUp } from 'lucide-react';

interface CounterfactualMethod {
  success: boolean;
  method?: string;
  original_prediction: {
    predicted_class: number;
    confidence: number;
    probabilities: number[];
  };
  counterfactual_prediction?: {
    predicted_class: number;
    confidence: number;
    probabilities: number[];
  };
  counterfactual_image?: string;
  difference_map?: string;
  perturbation_map?: string;
  perturbation_magnitude?: number;
  iterations_used?: number;
  confidence_improvement?: number;
  mask_position?: [number, number, number, number];
  error?: string;
}

interface CounterfactualResults {
  original_class: number;
  target_class: number;
  original_prediction: {
    predicted_class: number;
    confidence: number;
    probabilities: number[];
  };
  counterfactuals: {
    adversarial?: CounterfactualMethod;
    gradient_optimization?: CounterfactualMethod;
    mask_based?: CounterfactualMethod;
  };
  summary: {
    total_methods_tried: number;
    successful_methods: number;
    successful_method_names: string[];
    best_method: string | null;
  };
}

interface CounterfactualAnalysisProps {
  imageData: File;
}

const CounterfactualAnalysis: React.FC<CounterfactualAnalysisProps> = ({ imageData }) => {
  const [results, setResults] = useState<CounterfactualResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedMethod, setExpandedMethod] = useState<string | null>(null);
  const [visualizations, setVisualizations] = useState<any>(null);
  const [base64Image, setBase64Image] = useState<string>('');

  const classNames = ['Normal', 'Fracture'];

  // Convert File to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        // Remove data:image/jpeg;base64, prefix
        const base64Data = base64.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Convert image when component mounts or imageData changes
  React.useEffect(() => {
    if (imageData) {
      fileToBase64(imageData)
        .then(setBase64Image)
        .catch(err => setError(`Failed to process image: ${err.message}`));
    }
  }, [imageData]);

  const analyzeCounterfactuals = async () => {
    if (!base64Image) {
      setError('Image not processed yet');
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch('http://localhost:8000/counterfactual', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: base64Image }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setResults(data.counterfactual_results);
        setVisualizations(data.visualizations);
      } else {
        setError(data.error || 'Analysis failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const renderMethodCard = (methodName: string, method: CounterfactualMethod) => {
    const isExpanded = expandedMethod === methodName;
    const methodDisplayNames: { [key: string]: string } = {
      adversarial: 'Adversarial Perturbation',
      gradient_optimization: 'Gradient Optimization', 
      mask_based: 'Regional Masking'
    };

    const methodDescriptions: { [key: string]: string } = {
      adversarial: 'Finds minimal pixel-level changes to flip the prediction',
      gradient_optimization: 'Uses gradient descent to optimize counterfactual',
      mask_based: 'Identifies critical regions by systematic masking'
    };

    if (method.error) {
      return (
        <div key={methodName} className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-red-500" />
            <h4 className="font-semibold text-red-700">{methodDisplayNames[methodName]}</h4>
          </div>
          <p className="text-red-600">Error: {method.error}</p>
        </div>
      );
    }

    return (
      <div key={methodName} className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div 
          className="p-4 cursor-pointer hover:bg-gray-50"
          onClick={() => setExpandedMethod(isExpanded ? null : methodName)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${method.success ? 'bg-green-500' : 'bg-red-500'}`} />
              <div>
                <h4 className="font-semibold text-gray-900">{methodDisplayNames[methodName]}</h4>
                <p className="text-sm text-gray-600">{methodDescriptions[methodName]}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {method.success && (
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                  Success
                </span>
              )}
              {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
          </div>
        </div>

        {isExpanded && method.success && (
          <div className="border-t border-gray-200 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Counterfactual Image */}
              {method.counterfactual_image && (
                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Counterfactual Image</h5>
                  <img
                    src={`data:image/png;base64,${method.counterfactual_image}`}
                    alt="Counterfactual"
                    className="w-full rounded border"
                  />
                  {method.counterfactual_prediction && (
                    <div className="mt-2 p-2 bg-blue-50 rounded">
                      <p className="text-sm">
                        <strong>New Prediction:</strong> {classNames[method.counterfactual_prediction.predicted_class]}
                      </p>
                      <p className="text-sm">
                        <strong>Confidence:</strong> {(method.counterfactual_prediction.confidence * 100).toFixed(1)}%
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Difference/Perturbation Map */}
              {(method.difference_map || method.perturbation_map) && (
                <div>
                  <h5 className="font-medium text-gray-900 mb-2">
                    {method.difference_map ? 'Difference Map' : 'Perturbation Map'}
                  </h5>
                  <img
                    src={`data:image/png;base64,${method.difference_map || method.perturbation_map}`}
                    alt="Changes"
                    className="w-full rounded border"
                  />
                  <div className="mt-2 p-2 bg-yellow-50 rounded">
                    <p className="text-sm text-yellow-800">
                      Bright areas show regions that were modified to achieve the counterfactual
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Method-specific details */}
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              {method.perturbation_magnitude !== undefined && (
                <div className="bg-gray-50 p-2 rounded">
                  <p className="font-medium text-gray-600">Perturbation</p>
                  <p className="text-gray-900">{method.perturbation_magnitude.toFixed(4)}</p>
                </div>
              )}
              {method.iterations_used !== undefined && (
                <div className="bg-gray-50 p-2 rounded">
                  <p className="font-medium text-gray-600">Iterations</p>
                  <p className="text-gray-900">{method.iterations_used}</p>
                </div>
              )}
              {method.confidence_improvement !== undefined && (
                <div className="bg-gray-50 p-2 rounded">
                  <p className="font-medium text-gray-600">Confidence Δ</p>
                  <p className="text-gray-900">{(method.confidence_improvement * 100).toFixed(1)}%</p>
                </div>
              )}
              {method.mask_position && (
                <div className="bg-gray-50 p-2 rounded">
                  <p className="font-medium text-gray-600">Mask Region</p>
                  <p className="text-gray-900">
                    {method.mask_position[2] - method.mask_position[0]} × {method.mask_position[3] - method.mask_position[1]}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Brain className="w-8 h-8 text-purple-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Counterfactual Analysis</h2>
            <p className="text-gray-600">
              Discover what changes would make the AI predict differently
            </p>
          </div>
        </div>

        {!results && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-900 mb-2">What are Counterfactual Explanations?</h3>
                <p className="text-blue-800 mb-2">
                  Counterfactual explanations answer the question: "What would need to change in this X-ray 
                  for the AI to predict differently?"
                </p>
                <ul className="text-blue-800 text-sm space-y-1">
                  <li>• <strong>Adversarial:</strong> Minimal pixel changes to flip prediction</li>
                  <li>• <strong>Gradient Optimization:</strong> Systematic optimization approach</li>
                  <li>• <strong>Regional Masking:</strong> Identifies critical anatomical regions</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={analyzeCounterfactuals}
          disabled={loading || !base64Image}
          className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Generating Counterfactuals...
            </>
          ) : (
            <>
              <Target className="w-5 h-5" />
              Generate Counterfactual Explanations
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="font-medium text-red-800">Error</span>
          </div>
          <p className="text-red-700 mt-1">{error}</p>
        </div>
      )}

      {results && (
        <div className="space-y-6">
          {/* Summary */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Analysis Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{results.summary.total_methods_tried}</div>
                <div className="text-sm text-gray-600">Methods Tried</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{results.summary.successful_methods}</div>
                <div className="text-sm text-gray-600">Successful</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">
                  {classNames[results.original_class]} → {classNames[results.target_class]}
                </div>
                <div className="text-sm text-gray-600">Target Change</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-orange-600">
                  {results.summary.best_method || 'None'}
                </div>
                <div className="text-sm text-gray-600">Best Method</div>
              </div>
            </div>
          </div>

          {/* Original Prediction */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Original Prediction</h4>
            <div className="flex items-center gap-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {classNames[results.original_prediction.predicted_class]}
              </span>
              <span className="text-gray-600">
                Confidence: {(results.original_prediction.confidence * 100).toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Method Results */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Counterfactual Methods</h3>
            {Object.entries(results.counterfactuals).map(([methodName, method]) =>
              renderMethodCard(methodName, method)
            )}
          </div>

          {/* Visualizations */}
          {visualizations && visualizations.comparison_plot && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Comparison Visualization</h3>
              <img
                src={`data:image/png;base64,${visualizations.comparison_plot}`}
                alt="Counterfactual Comparison"
                className="w-full rounded border"
              />
            </div>
          )}

          {/* Clinical Interpretation */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-lg font-bold text-green-900 mb-3">Clinical Interpretation</h3>
            <div className="space-y-3 text-green-800">
              <p>
                <strong>Robustness Assessment:</strong> {results.summary.successful_methods > 0 
                  ? 'Multiple counterfactuals found - prediction may be sensitive to certain changes'
                  : 'No counterfactuals found - prediction appears robust'
                }
              </p>
              {results.summary.best_method && (
                <p>
                  <strong>Most Effective Method:</strong> {results.summary.best_method} - This approach 
                  required the smallest changes to flip the prediction.
                </p>
              )}
              <p>
                <strong>Clinical Relevance:</strong> Small perturbations that change diagnosis suggest 
                areas where additional imaging or clinical correlation may be valuable.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CounterfactualAnalysis;
