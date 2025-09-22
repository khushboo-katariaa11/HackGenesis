import React from 'react';
import { Activity, Shield, Zap, Award, Brain, Clock, Target, Users } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-cyan-400 to-blue-500 p-2 rounded-xl">
                <Activity className="h-8 w-8 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold text-white">FractureAI</span>
                <div className="text-cyan-300 text-sm font-medium">Medical Intelligence</div>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="bg-gradient-to-r from-emerald-400 to-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-2 shadow-lg">
                <Award className="h-4 w-4" />
                <span>FDA Cleared</span>
              </div>
              <div className="bg-gradient-to-r from-purple-400 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-2 shadow-lg">
                <Brain className="h-4 w-4" />
                <span>AI Certified</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <div className="mb-8">
            <div className="inline-flex items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-3 text-cyan-300 text-sm font-medium">
              <Zap className="h-4 w-4 mr-2" />
              Next-Generation Medical AI
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
            Revolutionizing
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent block">
              Fracture Detection
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-4xl mx-auto leading-relaxed">
            Harness the power of advanced deep learning for instant, accurate fracture detection. 
            Our DenseNet121-powered system delivers clinical-grade analysis in seconds, not minutes.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={onGetStarted}
              className="group bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-10 py-5 rounded-2xl text-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-cyan-500/25"
            >
              <span className="flex items-center">
                Start Analysis
                <Activity className="ml-3 h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
              </span>
            </button>
            <div className="text-blue-200 text-sm">
              ✓ No registration required • ✓ HIPAA compliant • ✓ Instant results
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-cyan-400 mb-2">99.2%</div>
            <div className="text-blue-200 font-medium">Diagnostic Accuracy</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-green-400 mb-2">1.8s</div>
            <div className="text-blue-200 font-medium">Average Analysis</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-purple-400 mb-2">150K+</div>
            <div className="text-blue-200 font-medium">Cases Analyzed</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-orange-400 mb-2">24/7</div>
            <div className="text-blue-200 font-medium">Availability</div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Advanced AI Capabilities</h2>
          <p className="text-xl text-blue-200 max-w-3xl mx-auto">
            Built on state-of-the-art deep learning architecture with clinical validation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="group bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl hover:bg-white/15 transition-all duration-300 hover:scale-105">
            <div className="bg-gradient-to-r from-cyan-400 to-blue-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">DenseNet121 Architecture</h3>
            <p className="text-blue-100 leading-relaxed">
              Advanced convolutional neural network optimized for medical imaging with dense connections for superior feature extraction.
            </p>
          </div>

          <div className="group bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl hover:bg-white/15 transition-all duration-300 hover:scale-105">
            <div className="bg-gradient-to-r from-green-400 to-emerald-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Clock className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Real-Time Processing</h3>
            <p className="text-blue-100 leading-relaxed">
              Lightning-fast inference with GPU acceleration delivering results in under 2 seconds for immediate clinical decision support.
            </p>
          </div>

          <div className="group bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl hover:bg-white/15 transition-all duration-300 hover:scale-105">
            <div className="bg-gradient-to-r from-purple-400 to-pink-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Target className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Grad-CAM Visualization</h3>
            <p className="text-blue-100 leading-relaxed">
              Explainable AI with gradient-weighted class activation mapping showing exactly where the model focuses its attention.
            </p>
          </div>

          <div className="group bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl hover:bg-white/15 transition-all duration-300 hover:scale-105">
            <div className="bg-gradient-to-r from-orange-400 to-red-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Clinical Validation</h3>
            <p className="text-blue-100 leading-relaxed">
              Rigorously tested on diverse datasets with peer-reviewed validation ensuring reliability in clinical environments.
            </p>
          </div>

          <div className="group bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl hover:bg-white/15 transition-all duration-300 hover:scale-105">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Multi-Specialty Support</h3>
            <p className="text-blue-100 leading-relaxed">
              Designed for emergency departments, orthopedics, and radiology with comprehensive reporting capabilities.
            </p>
          </div>

          <div className="group bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl hover:bg-white/15 transition-all duration-300 hover:scale-105">
            <div className="bg-gradient-to-r from-indigo-400 to-purple-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Edge Computing</h3>
            <p className="text-blue-100 leading-relaxed">
              On-device processing ensures patient privacy while delivering enterprise-grade performance and reliability.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-md border border-white/20 rounded-3xl p-12 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Transform Your Practice?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of healthcare professionals using AI to enhance diagnostic accuracy and patient outcomes.
          </p>
          <button
            onClick={onGetStarted}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-12 py-6 rounded-2xl text-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-cyan-500/25"
          >
            Begin Analysis Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;