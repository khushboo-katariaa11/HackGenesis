import React, { useState } from 'react';
import { MessageCircle, Stethoscope, Bot, User, Send, X, Loader2, Settings, ChevronDown } from 'lucide-react';
import { PatientData, AnalysisResult } from '../types';
import { getMedicalChatResponse, checkChatAvailability } from '../utils/medicalChatService';
import ChatMarkdownRenderer from './ChatMarkdownRenderer';

interface MedicalChatProps {
  patientData: PatientData;
  analysisResult: AnalysisResult;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  model?: 'gemini' | 'oss' | 'hf-20b' | 'hf-120b';
}

const MedicalChat: React.FC<MedicalChatProps> = ({ patientData, analysisResult }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<'gemini' | 'oss' | 'hf-20b' | 'hf-120b'>('hf-20b');
  const [availableModels, setAvailableModels] = useState<{ oss: boolean; gemini: boolean; huggingface: boolean }>({ oss: false, gemini: false, huggingface: false });
  const [showModelSelector, setShowModelSelector] = useState(false);

  // Check available models on component mount and set primary model preference
  React.useEffect(() => {
    checkChatAvailability().then((models) => {
      setAvailableModels(models);
      // Set Hugging Face 20B as primary preference: HF 20B > HF 120B > OpenRouter OSS > Gemini
      if (models.huggingface) {
        setSelectedModel('hf-20b'); // Hugging Face 20B is now the primary choice
      } else if (models.oss) {
        setSelectedModel('oss');
      } else if (models.gemini) {
        setSelectedModel('gemini');
      }
    });
  }, []);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await getMedicalChatResponse(
        patientData,
        analysisResult,
        userMessage.content,
        selectedModel
      );

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        model: selectedModel
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I apologize, but I encountered an error while processing your question: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again or contact support if the issue persists.`,
        timestamp: new Date(),
        model: selectedModel
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  const getModelDisplayName = (model: 'gemini' | 'oss' | 'hf-20b' | 'hf-120b') => {
    switch (model) {
      case 'gemini':
        return 'Google Gemini';
      case 'oss':
        return 'GPT-OSS';
      case 'hf-20b':
        return 'HF GPT-OSS 20B';
      case 'hf-120b':
        return 'HF GPT-OSS 120B';
      default:
        return 'GPT-OSS';
    }
  };

  const getModelIcon = (model: 'gemini' | 'oss' | 'hf-20b' | 'hf-120b') => {
    switch (model) {
      case 'gemini':
        return <Bot className="h-4 w-4" />;
      case 'oss':
        return <MessageCircle className="h-4 w-4" />;
      case 'hf-20b':
      case 'hf-120b':
        return <MessageCircle className="h-4 w-4" />;
      default:
        return <MessageCircle className="h-4 w-4" />;
    }
  };

  return (
    <>
      {/* Chat Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="bg-purple-500 p-2 sm:p-3 rounded-xl flex-shrink-0">
              <MessageCircle className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-1">Talk to Our Advanced Medical AI</h3>
              <p className="text-purple-100 text-xs sm:text-sm">Get detailed explanations about this case from our specialized medical chatbot</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(true)}
            className="w-full sm:w-auto bg-white text-purple-600 px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:bg-purple-50 transition-colors duration-200 shadow-lg text-sm sm:text-base"
          >
            <Stethoscope className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>Start Consultation</span>
          </button>
        </div>
      </div>

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] sm:h-[80vh] flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 sm:p-6 rounded-t-xl sm:rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                  <div className="bg-purple-500 p-2 rounded-lg flex-shrink-0">
                    <Stethoscope className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-lg sm:text-xl font-bold truncate">Medical AI Consultation</h2>
                    <p className="text-purple-100 text-xs sm:text-sm truncate">Patient: {patientData.name} • ID: {patientData.patientId}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
                  {/* Model Selector */}
                  <div className="relative hidden sm:block">
                    <button
                      onClick={() => setShowModelSelector(!showModelSelector)}
                      className="bg-white/20 hover:bg-white/30 px-3 sm:px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
                    >
                      {getModelIcon(selectedModel)}
                      <span className="text-xs sm:text-sm font-medium hidden md:inline">{getModelDisplayName(selectedModel)}</span>
                      <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
                    </button>
                    
                    {showModelSelector && (
                      <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10 min-w-[200px]">
                        {availableModels.gemini && (
                          <button
                            onClick={() => {
                              setSelectedModel('gemini');
                              setShowModelSelector(false);
                            }}
                            className={`w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2 ${
                              selectedModel === 'gemini' ? 'bg-purple-50 text-purple-600' : 'text-gray-700'
                            }`}
                          >
                            <Bot className="h-4 w-4" />
                            <span className="text-sm">Google Gemini</span>
                          </button>
                        )}
                        {availableModels.oss && (
                          <button
                            onClick={() => {
                              setSelectedModel('oss');
                              setShowModelSelector(false);
                            }}
                            className={`w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2 ${
                              selectedModel === 'oss' ? 'bg-purple-50 text-purple-600' : 'text-gray-700'
                            }`}
                          >
                            <MessageCircle className="h-4 w-4" />
                            <span className="text-sm">OpenRouter GPT-OSS</span>
                          </button>
                        )}
                        {availableModels.huggingface && (
                          <>
                            <div className="px-4 py-1 text-xs font-medium text-gray-500 border-t border-gray-100 mt-1 pt-2">
                              Hugging Face Models
                            </div>
                            <button
                              onClick={() => {
                                setSelectedModel('hf-20b');
                                setShowModelSelector(false);
                              }}
                              className={`w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2 ${
                                selectedModel === 'hf-20b' ? 'bg-purple-50 text-purple-600' : 'text-gray-700'
                              }`}
                            >
                              <MessageCircle className="h-4 w-4" />
                              <div className="flex flex-col">
                                <span className="text-sm">GPT-OSS 20B</span>
                                <span className="text-xs text-gray-500">Fast & Efficient</span>
                              </div>
                            </button>
                            <button
                              onClick={() => {
                                setSelectedModel('hf-120b');
                                setShowModelSelector(false);
                              }}
                              className={`w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2 ${
                                selectedModel === 'hf-120b' ? 'bg-purple-50 text-purple-600' : 'text-gray-700'
                              }`}
                            >
                              <MessageCircle className="h-4 w-4" />
                              <div className="flex flex-col">
                                <span className="text-sm">GPT-OSS 120B</span>
                                <span className="text-xs text-gray-500">More Advanced</span>
                              </div>
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={clearChat}
                    className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors duration-200 hidden sm:block"
                    title="Clear Chat"
                  >
                    <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                  
                  <button
                    onClick={() => setIsOpen(false)}
                    className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors duration-200"
                  >
                    <X className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6 space-y-3 sm:space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 py-6 sm:py-8">
                  <Stethoscope className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 text-gray-300" />
                  <h3 className="text-base sm:text-lg font-semibold mb-2">Start Your Medical Consultation</h3>
                  <p className="text-xs sm:text-sm px-4">Ask questions about your diagnosis, treatment options, or any concerns you may have.</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-[80%] rounded-xl sm:rounded-2xl p-3 sm:p-4 ${
                        message.role === 'user'
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        {message.role === 'assistant' && (
                          <div className="bg-purple-500 p-1 rounded-full mt-1 flex-shrink-0">
                            {getModelIcon(message.model || 'gemini')}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            {message.role === 'user' ? (
                              <User className="h-3 w-3 sm:h-4 sm:w-4" />
                            ) : (
                              <Bot className="h-3 w-3 sm:h-4 sm:w-4" />
                            )}
                            <span className="text-xs font-medium">
                              {message.role === 'user' ? 'You' : getModelDisplayName(message.model || 'gemini')}
                            </span>
                            <span className="text-xs opacity-70">
                              {message.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                          {message.role === 'assistant' ? (
                            <ChatMarkdownRenderer content={message.content} />
                          ) : (
                            <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-xl sm:rounded-2xl p-3 sm:p-4 max-w-[85%] sm:max-w-[80%]">
                    <div className="flex items-center space-x-2">
                      <div className="bg-purple-500 p-1 rounded-full">
                        {getModelIcon(selectedModel)}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin text-purple-600" />
                        <span className="text-xs sm:text-sm text-gray-600">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="border-t border-gray-200 p-3 sm:p-4 lg:p-6">
              <div className="flex space-x-2 sm:space-x-3">
                <div className="flex-1">
                  <textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about your diagnosis, treatment options, or any medical concerns..."
                    className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg sm:rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                    rows={2}
                    disabled={isLoading}
                  />
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white p-2 sm:p-3 rounded-lg sm:rounded-xl transition-colors duration-200 flex items-center justify-center flex-shrink-0"
                >
                  <Send className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Using {getModelDisplayName(selectedModel)} • Press Enter to send, Shift+Enter for new line
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MedicalChat;
