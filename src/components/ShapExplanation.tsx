import React, { useState } from 'react';
import { Brain, Info, Eye, BarChart3, MapPin, HelpCircle } from 'lucide-react';
import { ShapExplanation as ShapExplanationType } from '../types';

interface ShapExplanationProps {
  shapExplanation: ShapExplanationType;
  originalImageUrl: string;
  diagnosis: string;
}

const ShapExplanation: React.FC<ShapExplanationProps> = ({
  shapExplanation,
  originalImageUrl,
  diagnosis
}) => {
  const [showFeatureDetails, setShowFeatureDetails] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<number | null>(null);

  if (!shapExplanation.available) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-3">
          <Brain className="text-yellow-600" size={24} />
          <h3 className="font-semibold text-yellow-800">SHAP Analysis Unavailable</h3>
        </div>
        <p className="text-yellow-700 mb-3">
          SHAP (SHapley Additive exPlanations) analysis could not be generated for this image.
        </p>
        <div className="bg-yellow-100 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> SHAP explanations provide pixel-level importance scores showing which regions 
            of the X-ray image contributed most to the AI model's decision.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center space-x-3 mb-4">
        <Brain className="text-purple-600" size={24} />
        <h3 className="font-semibold text-gray-800">SHAP Explainability Analysis</h3>
        <div className="flex items-center bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
          <Eye size={12} className="mr-1" />
          Pixel Attribution
        </div>
      </div>

      <p className="text-gray-600 mb-6">
        {shapExplanation.description}
      </p>

      {/* SHAP Visualization */}
      {shapExplanation.image && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Original Image */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-800 flex items-center">
              <Eye size={16} className="mr-2" />
              Original X-ray
            </h4>
            <div className="border rounded-lg overflow-hidden">
              <img 
                src={originalImageUrl} 
                alt="Original X-ray" 
                className="w-full h-auto"
              />
            </div>
          </div>

          {/* SHAP Heatmap */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-800 flex items-center">
              <BarChart3 size={16} className="mr-2" />
              SHAP Importance Heatmap
            </h4>
            <div className="border rounded-lg overflow-hidden">
              <img 
                src={shapExplanation.image} 
                alt="SHAP Explanation" 
                className="w-full h-auto"
              />
            </div>
            <div className="bg-purple-50 rounded-lg p-3">
              <p className="text-sm text-purple-800">
                <strong>Interpretation:</strong> Red regions contributed positively to the "{diagnosis}" prediction, 
                while blue regions had negative influence.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Feature Importance Table */}
      {shapExplanation.topFeatures.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-800 flex items-center">
              <MapPin size={16} className="mr-2" />
              Top Contributing Regions
            </h4>
            <button
              onClick={() => setShowFeatureDetails(!showFeatureDetails)}
              className="text-purple-600 hover:text-purple-800 text-sm flex items-center"
            >
              {showFeatureDetails ? 'Hide Details' : 'Show Details'}
              <HelpCircle size={14} className="ml-1" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Region
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Importance Score
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Impact
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {shapExplanation.topFeatures.slice(0, showFeatureDetails ? 10 : 5).map((feature, index) => (
                  <tr 
                    key={index}
                    className={`hover:bg-gray-50 cursor-pointer ${
                      selectedFeature === index ? 'bg-purple-50' : ''
                    }`}
                    onClick={() => setSelectedFeature(selectedFeature === index ? null : index)}
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{index + 1}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                      ({feature.position.row}, {feature.position.col})
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-3">
                          <div 
                            className="bg-purple-600 h-2 rounded-full"
                            style={{ width: `${Math.min(feature.importance * 100, 100)}%` }}
                          ></div>
                        </div>
                        {(feature.importance * 100).toFixed(1)}%
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        feature.importance > 0.7 
                          ? 'bg-red-100 text-red-800' 
                          : feature.importance > 0.4 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {feature.importance > 0.7 ? 'High' : feature.importance > 0.4 ? 'Medium' : 'Low'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {selectedFeature !== null && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h5 className="font-medium text-purple-800 mb-2">Region Details</h5>
              <div className="space-y-1 text-sm text-purple-700">
                <p><strong>Position:</strong> Row {shapExplanation.topFeatures[selectedFeature].position.row}, Column {shapExplanation.topFeatures[selectedFeature].position.col}</p>
                <p><strong>Importance:</strong> {(shapExplanation.topFeatures[selectedFeature].importance * 100).toFixed(2)}%</p>
                <p><strong>Description:</strong> This region contributed significantly to the model's "{diagnosis}" prediction.</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Information Panel */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Info className="text-blue-600 mt-0.5" size={16} />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">About SHAP Analysis</p>
            <p>
              SHAP (SHapley Additive exPlanations) provides a unified framework for explaining model predictions. 
              Each pixel's SHAP value represents its contribution to the final prediction, helping clinicians 
              understand which anatomical regions influenced the AI's diagnosis.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShapExplanation;
