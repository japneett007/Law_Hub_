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
COI_PDF_PATH = r"C:\Users\Japneet Singh\Desktop\COI_2024.pdf"

# Hugging Face settings for OSS 20B model via Inference API
# Create token at: https://huggingface.co/settings/tokens and set HUGGINGFACEHUB_API_TOKEN env var
HUGGINGFACE_MODEL_REPO = "EleutherAI/gpt-neox-20b"
HUGGINGFACE_EMBEDDINGS_MODEL = "sentence-transformers/all-MiniLM-L6-v2"

# Vector store persistence directory
RAG_PERSIST_DIR = "rag_store"

# Pinecone Configuration (Optional - for better vector search)
# Get your API key from: https://app.pinecone.io/
PINECONE_API_KEY = ""  # Add your Pinecone API key here
PINECONE_ENVIRONMENT = "gcp-starter"  # Your Pinecone environment
PINECONE_INDEX_NAME = "lawhub-constitution"  # Your index name

# Local LLM model for on-device inference (better model)
LOCAL_LLM_ID = "EleutherAI/gpt-neox-20b"  # High-quality 20B parameter model
# Alternative models to try:
# LOCAL_LLM_ID = "microsoft/DialoGPT-large"  # Better for conversations
# LOCAL_LLM_ID = "google/flan-t5-xl"  # Even larger model
# LOCAL_LLM_ID = "facebook/opt-1.3b"  # Good balance of quality and speed
