# 🦴 FractureAI: Advanced Medical AI Platform

**Professional-grade fracture detection system with explainable AI, multi-model chat consultations, and comprehensive medical reporting.**

![FractureAI](https://img.shields.io/badge/AI-Medical%20Diagnosis-blue)
![React](https://img.shields.io/badge/React-18-blue)
![Python](https://img.shields.io/badge/Python-Flask-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## 🎯 **What is FractureAI?**

FractureAI is an intelligent medical diagnosis platform that uses deep learning to detect fractures in X-ray images. It combines cutting-edge AI with explainability features to provide doctors and medical professionals with reliable, interpretable diagnostic assistance.

### 🏆 **Key Features**

- **🔬 AI-Powered Diagnosis** - DenseNet121-based fracture detection
- **📊 Explainable AI** - Grad-CAM, SHAP, and counterfactual explanations  
- **🤖 Multi-Model Chat** - 3 AI providers for medical consultations
- **📋 Clinical Reports** - Professional PDF report generation
- **💾 Data Management** - Patient data storage and analysis history
- **🎨 Modern Interface** - Responsive React/TypeScript frontend

---

## 🚀 **Quick Start Guide**

### 📋 **Prerequisites**

- **Node.js** 18+ and npm
- **Python** 3.8+ with pip
- **API Keys** (at least one):
  - OpenRouter API key (Primary)
  - Hugging Face token (Alternative) 
  - Google Gemini API key (Fallback)

### ⚡ **Installation**

1. **Clone the repository**
```bash
git clone https://github.com/khushboo-katariaa11/FractureAI.git
cd FractureAI
```

2. **Setup Frontend**
```bash
# Install React dependencies
npm install

# Start development server
npm run dev
```

3. **Setup Backend** 
```bash
# Navigate to API server
cd api_server

# Install Python dependencies
pip install -r requirements.txt

# Start Flask server
python app.py
```

4. **Configure API Keys**
Create `.env` file in the root directory:
```bash
# Primary: Hugging Face (20B/120B Models) - RECOMMENDED
VITE_HUGGINGFACE_API_KEY="hf_your-token-here"

# Alternative: OpenRouter (OSS Models)
VITE_OPENROUTER_API_KEY="sk-or-v1-your-key-here"

# Fallback: Google Gemini
VITE_GEMINI_API_KEY="AIza-your-key-here"
```

5. **Access the Application**
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000

---

## 🎮 **How to Use FractureAI**

### 1️⃣ **Upload & Analyze X-rays**

1. **Navigate to the homepage**
2. **Fill patient information**:
   - Name, ID, Age, Gender
   - Medical history and symptoms
   - Clinical notes
3. **Upload X-ray image** (JPEG, PNG)
4. **Click "Analyze X-ray"**
5. **View results** with confidence scores

### 2️⃣ **Understanding AI Explanations**

#### 🔥 **Grad-CAM Heatmaps**
- **Red areas**: High attention regions (potential fractures)
- **Blue areas**: Normal bone structures
- **Overlay**: Shows AI focus areas on original X-ray

#### 📊 **SHAP Analysis**
- **Feature importance**: Which image regions influenced the decision
- **Quantitative scores**: Numerical importance values
- **Visual explanations**: Color-coded contribution maps

#### 🔄 **Counterfactual Explanations**
- **"What if" scenarios**: What changes would flip the diagnosis
- **3 Methods**:
  - Adversarial Perturbation
  - Gradient Optimization  
  - Mask-based Analysis

### 3️⃣ **AI Medical Consultations**

1. **Click "Start Consultation"** button
2. **Choose AI model** from dropdown:
   - **HF GPT-OSS 20B** (Fast & Efficient, Primary)
   - **HF GPT-OSS 120B** (More Advanced)
   - **OpenRouter GPT-OSS** (Fast & Reliable)
   - **Google Gemini** (Fallback)
3. **Ask questions** about the diagnosis
4. **Get professional medical insights**

### 4️⃣ **Generate Clinical Reports**

1. **Complete the analysis**
2. **Click "Generate Clinical Report"**  
3. **Review comprehensive PDF** including:
   - Patient information
   - AI diagnosis results
   - Explainability analysis
   - Medical recommendations
4. **Download or print** the report

### 5️⃣ **Data Management**

#### 📚 **Analysis History**
- **View past analyses** in the dashboard
- **Filter by date**, diagnosis, or confidence
- **Delete old records** or **export data**

#### 🗄️ **Database Operations**
- **Clear all data** using the "Clear DB" button
- **Export analysis history** as JSON
- **View statistics** and trends

---

## 🏗️ **Technical Architecture**

### 🎨 **Frontend (React + TypeScript)**
```
src/
├── components/          # React components
│   ├── AnalysisDashboard.tsx    # Main analysis interface
│   ├── MedicalChat.tsx          # AI chat system
│   ├── AnalysisResults.tsx      # Results display
│   └── [14 more components...]
├── utils/               # Service layer
│   ├── aiModel.ts              # AI model integration
│   ├── medicalChatService.ts   # Multi-model chat
│   ├── databaseService.ts      # IndexedDB operations
│   └── [5 more services...]
├── types/               # TypeScript definitions
└── contexts/            # React contexts
```

### 🐍 **Backend (Python + Flask)**
```
api_server/
├── app.py                      # Main Flask API
├── counterfactual_explainer.py # Explainability engine
├── best.pth                    # DenseNet121 model weights
└── requirements.txt            # Python dependencies
```

### 🔌 **API Endpoints**

| Endpoint | Method | Purpose |
|----------|---------|---------|
| `/analyze` | POST | X-ray fracture analysis |
| `/shap` | POST | SHAP explainability |
| `/counterfactual` | POST | Counterfactual explanations |
| `/health` | GET | Server health check |

---

## 🤖 **AI Models & Providers**

### 🧠 **Fracture Detection Model**
- **Architecture**: DenseNet121
- **Training**: Medical X-ray dataset
- **Output**: Fracture/Normal classification
- **Confidence**: Probability scores

### 💬 **Chat AI Models**

| Provider | Model | Use Case | Speed | Quality | Priority |
|----------|--------|----------|--------|---------|----------|
| **Hugging Face** | GPT-OSS 20B | Primary consultations | ⚡ Fast | ⭐⭐⭐ | 🥇 **#1** |
| **Hugging Face** | GPT-OSS 120B | Complex analysis | 🐌 Medium | ⭐⭐⭐⭐⭐ | 🥈 **#2** |
| **OpenRouter** | GPT-OSS 20B | Alternative option | ⚡ Fast | ⭐⭐⭐ | 🥉 **#3** |
| **Google** | Gemini 1.5 Flash | Reliable fallback | ⚡ Fast | ⭐⭐⭐⭐ | **#4** |

---

## 📊 **Features Deep Dive**

### 🔬 **Explainable AI**

#### **Why Explainability Matters**
- **Trust**: Understand AI decision-making
- **Validation**: Verify AI reasoning with medical knowledge  
- **Learning**: Educational tool for medical students
- **Compliance**: Meet medical AI transparency requirements

#### **Our 3-Layer Approach**
1. **Visual**: Grad-CAM heatmaps
2. **Quantitative**: SHAP feature importance
3. **Counterfactual**: "What if" scenarios

### 💾 **Data Management**

#### **Storage System**
- **Frontend**: IndexedDB for client-side storage
- **Privacy**: No server-side patient data storage
- **Offline**: Works without internet after initial load

#### **Features**
- Patient information and X-ray images
- Analysis results and timestamps  
- Explainability data and visualizations
- Export capabilities and statistics

---

## 🛠️ **Development Setup**

### 🔄 **Development Workflow**

1. **Frontend Development**
```bash
npm run dev          # Start React dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

2. **Backend Development**  
```bash
python app.py        # Start Flask server
pip install -r requirements.txt  # Install dependencies
```

3. **Environment Variables**
```bash
# Required for AI chat functionality
VITE_OPENROUTER_API_KEY="sk-or-v1-..."
VITE_HUGGINGFACE_API_KEY="hf_..."  
VITE_GEMINI_API_KEY="AIza..."
```

### 🧪 **Testing**

1. **Upload test X-ray images**
2. **Verify all AI explanations work**
3. **Test chat with different models**
4. **Generate and review PDF reports**
5. **Check database operations**

---

## 🔧 **Configuration Guide**

### 🔑 **Getting API Keys**

#### **Hugging Face (Primary - RECOMMENDED)**
1. Visit [Hugging Face](https://huggingface.co/settings/tokens)  
2. Create new token with "Read" permissions
3. Add to `.env` as `VITE_HUGGINGFACE_API_KEY`

#### **OpenRouter (Alternative)**
1. Visit [OpenRouter.ai](https://openrouter.ai)
2. Sign up and go to API Keys
3. Create new key
4. Add to `.env` as `VITE_OPENROUTER_API_KEY`

#### **Google Gemini (Fallback)**
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create new API key
3. Add to `.env` as `VITE_GEMINI_API_KEY`

---

## 🚨 **Troubleshooting**

### ❌ **Common Issues**

#### **"Model not available" Error**
- ✅ Check API key is correctly set in `.env`
- ✅ Restart development server after adding keys
- ✅ Verify API key has proper permissions

#### **Python Import Errors**
- ✅ Install requirements: `pip install -r requirements.txt`
- ✅ Use Python 3.8+ 
- ✅ Check virtual environment activation

#### **React Build Errors**
- ✅ Delete `node_modules` and reinstall: `npm install`
- ✅ Clear npm cache: `npm cache clean --force`
- ✅ Update Node.js to version 18+

#### **AI Model Loading Issues**
- ✅ Ensure `best.pth` is in `api_server/` directory
- ✅ Check available disk space (model is ~100MB)
- ✅ Verify PyTorch installation

---

## 📈 **Performance & Scalability**

### ⚡ **Optimization Features**
- **Lazy loading**: Components load on demand
- **Image compression**: Automatic X-ray optimization  
- **Caching**: Smart API response caching
- **Responsive design**: Mobile-optimized interface

### 🔒 **Security & Privacy**
- **Client-side storage**: No server-side patient data
- **API key protection**: Environment variable isolation
- **HTTPS ready**: Production security compliance
- **Data encryption**: IndexedDB encryption support

---

## 🤝 **Contributing**

### 🔄 **Development Process**
1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -m 'Add new feature'`  
4. Push to branch: `git push origin feature/new-feature`
5. Open Pull Request

### 📋 **Code Standards**
- **TypeScript**: Strict mode enabled
- **ESLint**: Automated code linting
- **Prettier**: Code formatting  
- **Component structure**: Modular React components

---

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 **Support & Contact**

- **GitHub Issues**: Report bugs and feature requests
- **Documentation**: This README and inline code comments
- **Community**: Contributions welcome!

---

## 🎯 **Roadmap**

### 🔮 **Planned Features**
- [ ] **Multi-language support** for international use
- [ ] **Mobile app** for iOS and Android  
- [ ] **Real-time collaboration** for medical teams
- [ ] **Advanced AI models** for other medical conditions
- [ ] **Cloud deployment** options
- [ ] **DICOM support** for medical imaging standards

---

**🩺 Ready to revolutionize medical AI diagnosis? Get started with FractureAI today!**


