import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  Brain,
  Shield,
  Zap,
  ArrowRight,
  Play,
  CheckCircle,
  Star,
  Users,
  Award,
  Sparkles,
  Upload,
  Scan,
  FileText,
  MessageCircle,
  Download,
  Eye,
  Database,
  Cpu,
  Network,
  BarChart3,
  Stethoscope,
  History
} from 'lucide-react';

interface HomepageProps {
  onEnterApp: () => void;
  onViewHistory?: () => void;
  onViewDashboard?: () => void;
}

const Homepage: React.FC<HomepageProps> = ({ onEnterApp, onViewHistory, onViewDashboard }) => {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [currentWorkflowStep, setCurrentWorkflowStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const featureInterval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % 3);
    }, 4000);

    const workflowInterval = setInterval(() => {
      setCurrentWorkflowStep((prev) => (prev + 1) % 8);
    }, 3000);

    return () => {
      clearInterval(featureInterval);
      clearInterval(workflowInterval);
    };
  }, []);

  const features = [
    {
      icon: Brain,
      title: "Computer-Aided Diagnosis",
      description: "Deep learning algorithms provide radiological assessment with 95%+ sensitivity and specificity for fracture detection using validated CNN architectures",
      color: "from-blue-500 to-purple-600"
    },
    {
      icon: Zap,
      title: "Real-Time Analysis",
      description: "Generate comprehensive radiological reports within seconds featuring Grad-CAM visualization and evidence-based diagnostic confidence intervals",
      color: "from-emerald-500 to-teal-600"
    },
    {
      icon: Shield,
      title: "HIPAA & FDA Compliant",
      description: "Enterprise-grade healthcare security with encrypted data transmission, audit trails, and compliance with medical device regulations",
      color: "from-amber-500 to-orange-600"
    }
  ];

  const workflowSteps = [
    {
      id: 1,
      title: "DICOM Image Acquisition",
      description: "Digital radiographs processed through standardized medical imaging protocols",
      icon: Upload,
      color: "from-blue-500 to-cyan-500",
      details: "DICOM compliance with image normalization and quality assurance"
    },
    {
      id: 2,
      title: "Deep Learning Analysis",
      description: "Convolutional neural networks trained on validated radiological datasets",
      icon: Cpu,
      color: "from-purple-500 to-pink-500",
      details: "FDA-cleared algorithms with clinical validation studies"
    },
    {
      id: 3,
      title: "Radiological Interpretation",
      description: "Grad-CAM visualization highlighting anatomical regions of interest",
      icon: Eye,
      color: "from-emerald-500 to-teal-500",
      details: "Evidence-based localization with diagnostic confidence metrics"
    },
    {
      id: 4,
      title: "Clinical Data Integration",
      description: "Multi-modal analysis incorporating patient history and imaging findings",
      icon: Network,
      color: "from-orange-500 to-red-500",
      details: "Structured reporting with clinical correlation algorithms"
    },
    {
      id: 5,
      title: "Diagnostic Report Generation",
      description: "Automated radiology reports following ACR guidelines and standards",
      icon: FileText,
      color: "from-indigo-500 to-purple-500",
      details: "Professional medical documentation with ICD-10 coding"
    },
    {
      id: 6,
      title: "Clinical Decision Support",
      description: "Interactive consultation system with evidence-based medical knowledge",
      icon: MessageCircle,
      color: "from-pink-500 to-rose-500",
      details: "Medical literature integration with differential diagnosis support"
    },
    {
      id: 7,
      title: "Quality Assurance",
      description: "Transparent AI with audit trails and clinical validation metrics",
      icon: BarChart3,
      color: "from-teal-500 to-cyan-500",
      details: "Continuous monitoring with performance analytics dashboard"
    },
    {
      id: 8,
      title: "Healthcare Integration",
      description: "Seamless EHR connectivity with HL7 FHIR compliance",
      icon: Stethoscope,
      color: "from-violet-500 to-purple-500",
      details: "Enterprise healthcare infrastructure with workflow optimization"
    }
  ];

  const stats = [
    { number: "15K+", label: "Radiological Studies", icon: Activity },
    { number: "97.3%", label: "Diagnostic Accuracy", icon: CheckCircle },
    { number: "150+", label: "Healthcare Facilities", icon: Users },
    { number: "24/7", label: "Clinical Support", icon: Star }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const floatingAnimation = {
    y: [-10, 10, -10],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            x: [-50, 50, -50],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"
        />
      </div>

      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 p-4 sm:p-6"
      >
        <div className="container mx-auto flex items-center justify-between">
          <motion.div
            className="flex items-center space-x-2 sm:space-x-3"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Activity className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
            </div>
            <div>
              <h1 className="text-lg sm:text-2xl font-bold text-white">RadiologyAI</h1>
              <p className="text-blue-200 text-xs sm:text-sm hidden sm:block">Clinical Decision Support System</p>
            </div>
          </motion.div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            {onViewDashboard && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="hidden sm:block"
              >
                <button
                  onClick={onViewDashboard}
                  className="px-3 sm:px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300 text-xs sm:text-sm flex items-center space-x-1 sm:space-x-2"
                >
                  <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Dashboard</span>
                </button>
              </motion.div>
            )}
            {onViewHistory && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="hidden sm:block"
              >
                <button
                  onClick={onViewHistory}
                  className="px-3 sm:px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300 text-xs sm:text-sm flex items-center space-x-1 sm:space-x-2"
                >
                  <Database className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>History</span>
                </button>
              </motion.div>
            )}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hidden sm:block"
            >
              <button className="px-4 sm:px-6 py-2 bg-white/10 backdrop-blur-sm text-white rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300 text-sm sm:text-base">
                Clinical Support
              </button>
            </motion.div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        className="relative z-10 container mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-16 sm:pb-32"
      >
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            variants={itemVariants}
            className="mb-6 sm:mb-8"
          >
            <motion.div
              animate={floatingAnimation}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-full border border-blue-300/30 mb-4 sm:mb-6"
            >
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-blue-300" />
              <span className="text-blue-200 text-xs sm:text-sm font-medium">FDA-Cleared Clinical Decision Support System</span>
            </motion.div>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight"
          >
            Advancing
            <motion.span
              className="block bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              Diagnostic Radiology
            </motion.span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg lg:text-xl text-blue-100 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed px-4"
          >
            Comprehensive radiological workflow from DICOM acquisition to clinical decision support.
            Powered by validated deep learning models, evidence-based diagnostics, and integrated
            clinical knowledge systems for enhanced patient care and diagnostic accuracy.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 lg:space-x-6 px-4"
          >
            <motion.button
              onClick={onEnterApp}
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              className="group w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold text-base sm:text-lg shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 flex items-center justify-center space-x-3"
            >
              <span>Begin Clinical Assessment</span>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </motion.div>
            </motion.button>

            {onViewDashboard && (
              <motion.button
                onClick={onViewDashboard}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl font-semibold text-base sm:text-lg shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 flex items-center justify-center space-x-3"
              >
                <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Analysis Dashboard</span>
              </motion.button>
            )}

            {onViewHistory && (
              <motion.button
                onClick={onViewHistory}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl font-semibold text-base sm:text-lg shadow-2xl hover:shadow-green-500/25 transition-all duration-300 flex items-center justify-center space-x-3"
              >
                <History className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>View Analysis History</span>
              </motion.button>
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white/10 backdrop-blur-sm text-white rounded-2xl font-semibold text-base sm:text-lg border border-white/20 hover:bg-white/20 transition-all duration-300 flex items-center justify-center space-x-3"
            >
              <Play className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Clinical Demo</span>
            </motion.button>
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div
          variants={itemVariants}
          className="mt-16 sm:mt-24 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 px-4"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05, y: -5 }}
              className="text-center p-4 sm:p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 + 0.5, type: "spring" }}
                className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2"
              >
                {stat.number}
              </motion.div>
              <p className="text-blue-200 text-xs sm:text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Workflow Pipeline Section */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        className="relative z-10 py-12 sm:py-16 lg:py-24 bg-white/5 backdrop-blur-sm"
      >
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            variants={itemVariants}
            className="text-center mb-8 sm:mb-12 lg:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
              Clinical Workflow Integration
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-blue-100 max-w-3xl mx-auto px-4">
              From DICOM imaging to evidence-based clinical decision support -
              our integrated platform enhances diagnostic accuracy, clinical efficiency, and patient outcomes
            </p>
          </motion.div>

          {/* Animated Workflow Flowchart */}
          <div className="relative">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
              {workflowSteps.map((step, index) => (
                <motion.div
                  key={step.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, y: -10 }}
                  className={`relative p-4 sm:p-6 rounded-3xl bg-gradient-to-br ${currentWorkflowStep === index ? step.color : 'from-white/10 to-white/5'
                    } backdrop-blur-sm border border-white/20 transition-all duration-500`}
                >
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <motion.div
                      animate={currentWorkflowStep === index ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-2xl flex items-center justify-center"
                    >
                      <step.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </motion.div>
                    <div className="text-xl sm:text-2xl font-bold text-white/60">
                      {step.id}
                    </div>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-white mb-2">
                    {step.title}
                  </h3>

                  <p className="text-blue-100 text-xs sm:text-sm mb-2 sm:mb-3 leading-relaxed">
                    {step.description}
                  </p>

                  <p className="text-blue-200 text-xs hidden sm:block">
                    {step.details}
                  </p>

                  {currentWorkflowStep === index && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute -top-2 -right-2 w-5 h-5 sm:w-6 sm:h-6 bg-yellow-400 rounded-full flex items-center justify-center"
                    >
                      <Star className="w-2 h-2 sm:w-3 sm:h-3 text-yellow-900" />
                    </motion.div>
                  )}

                  {/* Connection arrows for larger screens */}
                  {index < workflowSteps.length - 1 && index % 4 !== 3 && (
                    <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-white/40"
                      >
                        <ArrowRight className="w-6 h-6" />
                      </motion.div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Workflow Summary */}
            <motion.div
              variants={itemVariants}
              className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-3xl p-4 sm:p-6 lg:p-8 border border-white/20"
            >
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-4 sm:mb-6 text-center">
                🏥 Clinical Workflow Overview
              </h3>
              <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm">
                <div className="flex items-center space-x-2 bg-white/10 px-3 sm:px-4 py-2 rounded-full">
                  <Upload className="w-3 h-3 sm:w-4 sm:h-4 text-blue-300" />
                  <span className="text-blue-100">DICOM Acquisition</span>
                </div>
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 text-white/60 hidden sm:block" />
                <div className="flex items-center space-x-2 bg-white/10 px-3 sm:px-4 py-2 rounded-full">
                  <Scan className="w-3 h-3 sm:w-4 sm:h-4 text-purple-300" />
                  <span className="text-blue-100">AI Diagnosis</span>
                </div>
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 text-white/60 hidden sm:block" />
                <div className="flex items-center space-x-2 bg-white/10 px-3 sm:px-4 py-2 rounded-full">
                  <Eye className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-300" />
                  <span className="text-blue-100">Clinical Visualization</span>
                </div>
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 text-white/60 hidden lg:block" />
                <div className="flex items-center space-x-2 bg-white/10 px-3 sm:px-4 py-2 rounded-full">
                  <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-orange-300" />
                  <span className="text-blue-100">Radiology Report</span>
                </div>
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 text-white/60 hidden lg:block" />
                <div className="flex items-center space-x-2 bg-white/10 px-3 sm:px-4 py-2 rounded-full">
                  <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 text-pink-300" />
                  <span className="text-blue-100">Clinical Consultation</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Features Section */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        className="relative z-10 py-24"
      >
        <div className="container mx-auto px-6">
          <motion.div
            variants={itemVariants}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Clinical AI Capabilities
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Evidence-based diagnostic algorithms with transparent clinical decision support and validated performance metrics
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -10 }}
                className={`relative p-8 rounded-3xl bg-gradient-to-br ${currentFeature === index ? feature.color : 'from-white/10 to-white/5'
                  } backdrop-blur-sm border border-white/20 transition-all duration-500`}
              >
                <motion.div
                  animate={currentFeature === index ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6"
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </motion.div>

                <h3 className="text-2xl font-bold text-white mb-4">
                  {feature.title}
                </h3>

                <p className="text-blue-100 leading-relaxed">
                  {feature.description}
                </p>

                {currentFeature === index && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center"
                  >
                    <Star className="w-3 h-3 text-yellow-900" />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Technical Stack Section */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        className="relative z-10 py-24 bg-white/5 backdrop-blur-sm"
      >
        <div className="container mx-auto px-6">
          <motion.div
            variants={itemVariants}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Medical Technology Platform
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Built on validated healthcare technologies with regulatory compliance and clinical integration standards
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "Deep Learning Models", desc: "FDA-Validated Algorithms", icon: Brain },
              { name: "Clinical Visualization", desc: "Diagnostic Heatmaps", icon: Eye },
              { name: "Medical Knowledge Base", desc: "Evidence-Based AI", icon: Database },
              { name: "Clinical APIs", desc: "HL7 FHIR Integration", icon: Network },
              { name: "Medical Interface", desc: "Clinical Workflow UI", icon: Cpu },
              { name: "Healthcare Backend", desc: "DICOM Processing", icon: Zap },
              { name: "HIPAA & SOC2", desc: "Healthcare Security", icon: Shield },
              { name: "Cloud Healthcare", desc: "Enterprise Medical Platform", icon: Activity }
            ].map((tech, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -5 }}
                className="p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 text-center"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <tech.icon className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-white font-semibold mb-2">{tech.name}</h4>
                <p className="text-blue-200 text-sm">{tech.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        className="relative z-10 py-24"
      >
        <div className="container mx-auto px-6 text-center">
          <motion.div
            variants={itemVariants}
            className="max-w-3xl mx-auto"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-8"
            >
              <Award className="w-10 h-10 text-white" />
            </motion.div>

            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Enhance Clinical Practice?
            </h2>

            <p className="text-xl text-blue-100 mb-12">
              Experience comprehensive radiological assessment with clinical decision support. From DICOM imaging to
              evidence-based consultation - powered by validated AI and trusted by healthcare professionals worldwide.
            </p>

            <motion.button
              onClick={onEnterApp}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 25px 50px rgba(59, 130, 246, 0.4)",
                background: "linear-gradient(45deg, #3B82F6, #8B5CF6, #10B981)"
              }}
              whileTap={{ scale: 0.95 }}
              className="px-12 py-5 bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 text-white rounded-2xl font-bold text-xl shadow-2xl transition-all duration-300 flex items-center space-x-4 mx-auto"
            >
              <span>Access Clinical Platform</span>
              <motion.div
                animate={{ x: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <ArrowRight className="w-6 h-6" />
              </motion.div>
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="relative z-10 py-8 border-t border-white/10"
      >
        <div className="container mx-auto px-6 text-center">
          <p className="text-blue-200">
            © 2025 RadiologyAI. Clinical Decision Support System. All rights reserved.
          </p>
          <p className="text-blue-300 text-sm mt-2">
            FDA-Cleared Algorithms • HIPAA Compliant • HL7 FHIR • Clinical Evidence Base • Medical Knowledge Integration
          </p>
        </div>
      </motion.footer>
    </div>
  );
};

export default Homepage;
