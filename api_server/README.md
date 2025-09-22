# PyTorch Model API Server

This directory contains the Flask API server for your PyTorch DenseNet121 fracture detection model.

## Setup Instructions

### 1. Place Your Model File
Copy your trained model file here:
```
api_server/
├── app.py
├── requirements.txt
├── best_densenet121.pth  ← Your model file goes here
└── README.md
```

### 2. Install Dependencies
```bash
cd api_server
pip install -r requirements.txt
```

### 3. Configure Model (if needed)
Edit `app.py` and adjust the `MODEL_CONFIG` and `FractureNet` class to match your exact model:

```python
MODEL_CONFIG = {
    'num_classes': 2,
    'class_names': ['normal', 'fracture'],  # Adjust order based on your training
    'input_size': 224,
    'model_path': 'best_densenet121.pth'
}
```

### 4. Run the Server
```bash
python app.py
```

The server will start on `http://localhost:8000`

## API Endpoints

- **POST /analyze** - Analyze X-ray image
- **GET /health** - Health check
- **GET /model-info** - Model information

## Model Architecture Notes

The default `FractureNet` class assumes:
- DenseNet121 backbone
- Binary classification (2 classes)
- Standard ImageNet preprocessing

If your model has a different architecture, modify the `FractureNet` class accordingly.

## Troubleshooting

1. **Model loading errors**: Check that your model file path is correct and the architecture matches
2. **CUDA errors**: The server will automatically fall back to CPU if CUDA is not available
3. **Import errors**: Make sure all dependencies are installed with `pip install -r requirements.txt`

## Frontend Integration

The frontend is already configured to use this API. Make sure:
1. The API server is running on port 8000
2. Update the `API_CONFIG.baseUrl` in `src/utils/aiModel.ts` if using a different port