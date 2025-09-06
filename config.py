# LawHub Configuration File

# Google Gemini API Configuration
# Get your API key from: https://makersuite.google.com/app/apikey
GEMINI_API_KEY = ""  # Add your Gemini API key here

# Hugging Face API Token
HUGGINGFACE_API_TOKEN = ""  # Add your Hugging Face API token here

# Alternative: Set as environment variable
# GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', '')
# HUGGINGFACE_API_TOKEN = os.getenv('HUGGINGFACE_API_TOKEN', '')

# Other configurations
DEBUG = True
HOST = '0.0.0.0'
PORT = 5000

# RAG / LangChain settings
# Path to the Indian Constitution PDF provided by user
COI_PDF_PATH = r"D:\Law_Hub_\COI_2024.pdf"

# Hugging Face settings - Using smaller models to save disk space
# Create token at: https://huggingface.co/settings/tokens and set HUGGINGFACEHUB_API_TOKEN env var
HUGGINGFACE_MODEL_REPO = "microsoft/DialoGPT-small"  # Smaller model (117M parameters)
HUGGINGFACE_EMBEDDINGS_MODEL = "sentence-transformers/all-MiniLM-L6-v2"

# Vector store persistence directory
RAG_PERSIST_DIR = "rag_store"

# Cache directory for models (using D: drive to avoid C: drive space issues)
CACHE_DIR = r"D:\Law_Hub_\model_cache"

# Pinecone Configuration (Optional - for better vector search)
# Get your API key from: https://app.pinecone.io/
PINECONE_API_KEY = ""  # Add your Pinecone API key here
PINECONE_ENVIRONMENT = "gcp-starter"  # Your Pinecone environment
PINECONE_INDEX_NAME = "lawhub-constitution"  # Your index name

# Local LLM model for on-device inference (using smaller model to save space)
LOCAL_LLM_ID = "microsoft/DialoGPT-small"  # Small model (117M parameters) - much smaller than 20B
# Alternative smaller models to try:
# LOCAL_LLM_ID = "distilbert-base-uncased"  # Very small model (66M parameters)
# LOCAL_LLM_ID = "google/flan-t5-small"  # Small T5 model (60M parameters)
# LOCAL_LLM_ID = "facebook/opt-125m"  # Small OPT model (125M parameters)
