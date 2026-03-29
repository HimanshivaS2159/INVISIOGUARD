# 🔐 INVISIGUARD Fraud Detection System

A comprehensive, AI-powered fraud detection system built with modern full-stack architecture. INVISIGUARD combines machine learning models with behavioral analysis to provide real-time fraud detection capabilities.

## 📋 Table of Contents

- [Features](#-features)
- [Architecture](#-architecture)
- [Installation](#-installation)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Frontend Components](#-frontend-components)
- [Configuration](#-configuration)
- [Development](#-development)
- [Testing](#-testing)
- [Deployment](#-deployment)

## ✨ Features

### 🔍 Core Fraud Detection
- **Machine Learning Model**: Random Forest classifier with feature importance analysis
- **Behavioral Analysis**: Rule-based risk scoring for transaction patterns
- **Location Intelligence**: IP-based geolocation risk assessment
- **Real-time Processing**: Sub-second fraud analysis with confidence scores

### 🎯 Smart Features
- **Multi-factor Analysis**: Amount, timing, location, and device risk factors
- **Adaptive Learning**: User behavior profiling and pattern recognition
- **Risk Scoring**: 0-100 risk score with detailed explanations
- **Transaction History**: Complete audit trail with search capabilities

### 📊 Analytics Dashboard
- **Real-time Monitoring**: Live system health and risk metrics
- **Statistical Analysis**: Transaction trends and fraud patterns
- **Visual Charts**: Interactive risk distribution charts
- **Performance Metrics**: Success rates and detection accuracy

### 🎨 Modern UI/UX
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Dark Theme**: Professional fintech-inspired interface
- **Smooth Animations**: Micro-interactions and loading states
- **Accessibility**: WCAG compliant with keyboard navigation

## 🏗️ Architecture

```
INVISIGUARD/
├── backend/                    # Flask API Server
│   ├── app.py                 # Main application entry point
│   ├── config/
│   │   └── settings.py        # Configuration management
│   ├── models/
│   │   └── model.py          # ML model implementation
│   ├── routes/
│   │   └── predict.py         # API endpoints
│   ├── services/
│   │   └── behavior.py        # Behavioral analysis
│   ├── utils/
│   │   └── location.py        # Location risk analysis
│   ├── data/                  # Data storage
│   └── requirements.txt       # Python dependencies
├── frontend/                  # Modern Web UI
│   ├── index.html             # Main HTML structure
│   ├── css/
│   │   └── styles.css        # Complete styling
│   ├── js/
│   │   └── app.js           # Main application logic
│   ├── components/
│   │   ├── loader.js        # Loading component
│   │   └── toast.js         # Notification component
│   └── assets/
│       └── icons/           # Application icons
├── .gitignore                 # Git ignore file
└── README.md                 # This file
```

## 🛠️ Installation

### Prerequisites
- **Python 3.8+** for backend
- **Node.js 16+** (optional for development tools)
- **Modern web browser** with JavaScript ES6+ support

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/invisiguard.git
   cd invisiguard
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   
   # Windows
   venv\Scripts\activate
   
   # macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

4. **Start the backend server**
   ```bash
   python app.py
   ```

### Frontend Setup

1. **Serve the frontend**
   ```bash
   cd frontend
   
   # Option 1: Python server
   python -m http.server 8080
   
   # Option 2: Node.js server
   npx serve -p 8080
   
   # Option 3: Live Server
   npx live-server --port=8080
   ```

2. **Open in browser**
   Navigate to `http://localhost:8080`

## 🚀 Usage

### Quick Start

1. **Start both servers**
   - Backend: `python backend/app.py` (runs on port 5000)
   - Frontend: Any web server serving `frontend/` (runs on port 8080)

2. **Open the application**
   Visit `http://localhost:8080`

3. **Analyze a transaction**
   - Enter transaction amount
   - Select applicable risk factors
   - Click "Analyze Transaction"
   - View real-time fraud detection results

### Example Transaction Analysis

```json
{
  "amount": 1500.00,
  "is_night": 1,
  "new_location": 0,
  "new_device": 1
}
```

**Response:**
```json
{
  "result": "SAFE",
  "risk_score": 25.5,
  "confidence": 0.74,
  "reasons": [
    "Night transaction",
    "New device detected"
  ],
  "analysis": {
    "ml_model": {
      "probability": 0.245,
      "prediction": "SAFE",
      "score": 24.5
    },
    "behavioral": {
      "score": 35,
      "reasons": ["Night transaction", "New device detected"]
    },
    "location": {
      "score": 5,
      "reason": "Normal location: US, New York"
    }
  }
}
```

## 📚 API Documentation

### Endpoints

#### POST `/api/v1/predict`
Main fraud prediction endpoint

**Request Body:**
```json
{
  "amount": 1000.00,
  "is_night": 0,
  "new_location": 1,
  "new_device": 0,
  "user_id": "optional_user_id",
  "ip_address": "optional_ip_address"
}
```

**Response:**
```json
{
  "result": "FRAUD" | "SAFE",
  "risk_score": 75.5,
  "confidence": 0.85,
  "reasons": ["High amount", "New location detected"],
  "analysis": { ... },
  "metadata": { ... }
}
```

#### GET `/api/v1/health`
System health check

#### GET `/api/v1/model/info`
ML model information

#### GET `/api/v1/analytics/summary`
System analytics and statistics

### Error Responses

```json
{
  "error": "Validation error",
  "message": "Detailed error description",
  "timestamp": "2024-03-29T20:00:00Z"
}
```

## 🎨 Frontend Components

### Core Components

#### Loader (`components/loader.js`)
- Loading overlay with spinner
- Progress bar support
- Custom messages and timeouts
- Error and success states

#### Toast (`components/toast.js`)
- Notification system
- Multiple types (success, error, warning, info)
- Auto-dismiss with manual close
- Confirmation dialogs

#### Main App (`js/app.js`)
- Form validation and submission
- API communication
- Tab navigation
- Real-time updates
- Transaction history management

### UI Features

#### Tab Navigation
- **Analysis**: Main fraud detection interface
- **Dashboard**: Real-time monitoring and analytics
- **History**: Transaction audit trail

#### Interactive Elements
- Animated progress bars with color coding
- Hover effects and micro-interactions
- Keyboard shortcuts (1-3 for tabs, Ctrl+Enter to submit)
- Responsive design for all screen sizes

## ⚙️ Configuration

### Environment Variables

```bash
# Flask Configuration
FLASK_ENV=development  # development, production, default
SECRET_KEY=your-secret-key
DEBUG=True

# API Configuration
API_VERSION=v1
CORS_ORIGINS=http://localhost:8080,http://127.0.0.1:8080

# Model Configuration
MODEL_THRESHOLD=0.5
RATE_LIMIT_PER_MINUTE=60

# Logging
LOG_LEVEL=INFO
LOG_FILE=invisiguard.log
```

### Backend Settings (`config/settings.py`)

- **Development**: Debug mode, verbose logging
- **Production**: Optimized settings, error logging
- **Default**: Balanced configuration

## 🧪 Development

### Running Tests

```bash
# Backend tests
cd backend
python -m pytest tests/

# Frontend tests (if implemented)
cd frontend
npm test
```

### Code Quality

```bash
# Python linting
flake8 backend/
black backend/

# JavaScript linting
cd frontend
eslint js/
```

### Debug Mode

Enable debug mode for detailed logging:
```bash
export FLASK_ENV=development
python backend/app.py
```

## 🚀 Deployment

### Production Deployment

#### Backend (Flask)

1. **Install production server**
   ```bash
   pip install gunicorn
   ```

2. **Start with Gunicorn**
   ```bash
   cd backend
   gunicorn -w 4 -b 0.0.0.0:5000 app:app
   ```

#### Frontend

1. **Build for production**
   ```bash
   cd frontend
   # Minify CSS/JS if needed
   ```

2. **Serve with nginx/Apache**
   - Configure web server to serve static files
   - Set up reverse proxy to backend API

#### Docker Deployment

```dockerfile
# Dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY backend/requirements.txt .
RUN pip install -r requirements.txt

COPY backend/ .
COPY frontend/ ./static

EXPOSE 5000

CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "app:app"]
```

```bash
# Build and run
docker build -t invisiguard .
docker run -p 5000:5000 invisiguard
```

## 🔒 Security Features

### Input Validation
- Server-side validation for all inputs
- SQL injection prevention
- XSS protection with content security policy

### Rate Limiting
- API endpoint rate limiting
- DDoS protection
- Request throttling

### Data Protection
- No sensitive data in logs
- Encrypted communication (HTTPS in production)
- Secure session management

## 📈 Performance

### Optimization
- **Backend**: Response caching, database indexing
- **Frontend**: Lazy loading, code splitting
- **Network**: CDN integration, compression

### Monitoring
- Application performance metrics
- Error tracking and logging
- Resource usage monitoring

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Create Pull Request**

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [https://docs.invisiguard.com](https://docs.invisiguard.com)
- **Issues**: [GitHub Issues](https://github.com/your-username/invisiguard/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/invisiguard/discussions)

## 🙏 Acknowledgments

- **Flask** - Web framework
- **Scikit-learn** - Machine learning library
- **IPinfo.io** - Geolocation services
- **Modern CSS** - Gradient and animation techniques

---

<div align="center">
  <p>🔐 <strong>INVISIGUARD</strong> - Invisible Fraud Detector</p>
  <p>Detecting fraud through behavior, not just transactions</p>
</div>
