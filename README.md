# 🏛️ LawHub - Legal AI Assistant

A comprehensive legal AI platform that provides instant legal advice, document analysis, and emergency contact information across multiple jurisdictions.

## 🚀 Tech Stack

### **Backend Technologies**
- **Python 3.8+** - Core programming language
- **Flask** - Web framework for API development
- **TF-IDF Vectorization** - Document similarity search algorithm
- **Cosine Similarity** - Mathematical method for finding relevant legal documents
- **Google Gemini AI** - Advanced AI for legal advice generation
- **Hugging Face Transformers** - Conversational AI (DialoGPT-medium)
- **Pickle** - Data serialization for caching

### **Frontend Technologies**
- **HTML5** - Semantic markup structure
- **CSS3 (Tailwind CSS)** - Utility-first CSS framework for responsive design
- **JavaScript (ES6+)** - Dynamic frontend interactions
- **Responsive Design** - Mobile-first approach

### **Data & Storage**
- **Legal Datasets** - Country-specific legal documents
- **TF-IDF Matrices** - Pre-computed search matrices
- **Vectorizer Cache** - Optimized text processing
- **Training Data** - Custom legal Q&A dataset
- **Pinecone Vector Database** - Cloud-based vector storage (optional)
- **Chroma Vector Store** - Local vector database (fallback)

### **AI & Machine Learning**
- **Natural Language Processing (NLP)** - Text understanding and processing
- **Semantic Search** - Intelligent document retrieval
- **Rule-based Systems** - Keyword matching for legal queries
- **Creative Response Generation** - Engaging AI interactions

## 🎯 Key Features

### **🤖 AI Legal Assistant**
- **Multi-Modal Responses** - Creative, engaging legal advice
- **Country-Specific Knowledge** - Jurisdiction-aware responses
- **Training Data Integration** - Custom Q&A database
- **Keyword Matching** - Intelligent query understanding

### **📚 Laws Explorer**
- **Legal Categories** - Criminal, Civil, Constitutional, Administrative, International Law
- **Country-Specific Systems** - 10 jurisdictions covered:
  - 🇮🇳 India
  - 🇵🇰 Pakistan  
  - 🇺🇸 United States
  - 🇦🇺 Australia
  - 🇨🇦 Canada
  - 🇬🇧 United Kingdom
  - 🇧🇹 Bhutan
  - 🇳🇵 Nepal
  - 🇳🇿 New Zealand
  - 🇸🇬 Singapore

### **🚨 Emergency Help**
- **Emergency Contacts** - Direct dialing capability
- **Country-Specific Numbers** - Accurate emergency numbers
- **Embassy Information** - Consular services contacts
- **Visual Organization** - Color-coded emergency types

### **📄 Document Analysis**
- **Legal Document Upload** - File processing capabilities
- **Risk Assessment** - Document analysis features
- **OCR Integration** - Text extraction from documents

## 🛠️ Installation & Setup

### **Prerequisites**
```bash
# Python 3.8 or higher
python --version

# pip package manager
pip --version
```

### **1. Clone the Repository**
```bash
git clone <repository-url>
cd LawHub-1
```

### **2. Install Dependencies**
```bash
pip install -r requirements.txt
```

### **3. Configure API Keys**
Create a `config.py` file:
```python
# Google Gemini AI API Key
GEMINI_API_KEY = "your_gemini_api_key_here"

# Optional: Pinecone for better vector search
PINECONE_API_KEY = "your_pinecone_api_key_here"
PINECONE_ENVIRONMENT = "gcp-starter"
PINECONE_INDEX_NAME = "lawhub-constitution"
```

#### **Optional: Pinecone Setup**
For enhanced vector search capabilities, you can use Pinecone:

1. **Get a free Pinecone account** at https://app.pinecone.io/
2. **Run the setup script**:
   ```bash
   python setup_pinecone.py
   ```
3. **Test the connection**:
   ```bash
   python setup_pinecone.py test
   ```

**Benefits of Pinecone:**
- 🚀 Faster vector search
- ☁️ Cloud-based storage
- 📈 Better scalability
- 🔍 More accurate document retrieval

### **4. Run the Application**
```bash
# Start the Flask server
python app.py

# Access the application
# Open http://localhost:5000 in your browser
```

## 📁 Project Structure

```
LawHub-1/
├── app.py                          # Main Flask application
├── config.py                       # Configuration settings
├── requirements.txt                # Python dependencies
├── README.md                      # Project documentation
├── legal_training_data.py         # Custom training dataset
├── data/                          # Legal datasets
│   ├── australia/
│   ├── bangladesh/
│   ├── pakistan/
│   └── us_supreme_court/
├── templates/                     # HTML templates
│   ├── integrated_frontend.html   # Main dashboard
│   └── landing_page.html         # Landing page
└── Cache Files/                   # Performance optimization
    ├── legal_datasets_cache.pkl
    ├── search_matrix_cache.pkl
    └── vectorizer_cache.pkl
```

## 🔧 API Endpoints

### **Core Endpoints**
- `GET /` - Landing page
- `GET /app` - Main dashboard
- `POST /api/ask` - Legal advice query
- `POST /api/legal_qa` - Legal Q&A
- `POST /api/deepseek_legal` - DeepSeek AI integration

### **Training Data Endpoints**
- `POST /api/add_training_data` - Add new training examples
- `GET /api/training_stats` - View training statistics

## 🎨 UI/UX Features

### **Modern Design**
- **Dark Theme** - Professional legal interface
- **Responsive Layout** - Works on all devices
- **Smooth Animations** - Enhanced user experience
- **Intuitive Navigation** - Easy-to-use interface

### **Interactive Elements**
- **Clickable Emergency Numbers** - Direct phone dialing
- **Dynamic Content Loading** - Real-time updates
- **Back Navigation** - Seamless page transitions
- **Visual Feedback** - Hover effects and transitions

## 🔍 Search & AI Capabilities

### **Document Search**
- **TF-IDF Vectorization** - Efficient text processing
- **Cosine Similarity** - Accurate document matching
- **Cached Results** - Fast response times
- **Multi-Country Support** - Jurisdiction-aware search

### **AI Integration**
- **Google Gemini AI** - Advanced legal reasoning
- **Hugging Face Transformers** - Conversational AI
- **Rule-based Fallback** - Reliable response system
- **Creative Responses** - Engaging user interactions

## 🌍 Supported Jurisdictions

### **Legal Systems Covered**
1. **India** - Indian Penal Code, Civil Law, Constitutional Law
2. **Pakistan** - Islamic Law, Civil Law, Criminal Law
3. **United States** - Common Law, Federal & State Laws
4. **Australia** - Common Law, Federal System
5. **Canada** - Common Law, Civil Code (Quebec)
6. **United Kingdom** - Common Law, Parliamentary System
7. **Bhutan** - Constitutional Monarchy, Gross National Happiness
8. **Nepal** - Federal Democratic Republic
9. **New Zealand** - Common Law, Treaty of Waitangi
10. **Singapore** - Parliamentary Democracy, Common Law

## 🚀 Performance Features

### **Optimization**
- **Cached Datasets** - Fast startup times
- **Pre-computed Matrices** - Efficient search
- **Lazy Loading** - On-demand resource loading
- **Compressed Storage** - Optimized file sizes

### **Scalability**
- **Modular Architecture** - Easy to extend
- **API-First Design** - RESTful endpoints
- **Stateless Operations** - Session-independent
- **Horizontal Scaling** - Multi-instance support

## 🔒 Security Features

### **Data Protection**
- **API Key Management** - Secure configuration
- **Input Validation** - Sanitized user inputs
- **Error Handling** - Graceful failure management
- **Rate Limiting** - Protection against abuse

## 📊 Monitoring & Analytics

### **Performance Metrics**
- **Response Times** - API performance tracking
- **Search Accuracy** - Relevance scoring
- **User Interactions** - Usage analytics
- **Error Rates** - System health monitoring

## 🤝 Contributing

### **Development Setup**
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### **Code Standards**
- **Python PEP 8** - Code style guidelines
- **HTML5 Semantic** - Proper markup
- **CSS BEM Methodology** - Class naming
- **JavaScript ES6+** - Modern syntax

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Google Gemini AI** - Advanced AI capabilities
- **Hugging Face** - Transformers library
- **Flask Community** - Web framework
- **Tailwind CSS** - Utility-first CSS framework

## 📞 Support

For support and questions:
- **Issues** - GitHub Issues
- **Documentation** - Inline code comments
- **Community** - Developer forums

---

**Built with ❤️ for the legal community** 