from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import os
import random

# Set Hugging Face token to avoid download issues
from config import HUGGINGFACE_API_TOKEN
os.environ["HUGGINGFACEHUB_API_TOKEN"] = HUGGINGFACE_API_TOKEN
os.environ["HF_TOKEN"] = HUGGINGFACE_API_TOKEN

# RAG / LangChain imports - Updated for compatibility
from typing import List
from config import COI_PDF_PATH, HUGGINGFACE_MODEL_REPO, HUGGINGFACE_EMBEDDINGS_MODEL, RAG_PERSIST_DIR, LOCAL_LLM_ID
from config import PINECONE_API_KEY, PINECONE_ENVIRONMENT, PINECONE_INDEX_NAME
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma, Pinecone
try:
    from langchain_huggingface import HuggingFaceEmbeddings  # type: ignore[reportMissingImports]
except Exception:
    from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_core.documents import Document
from langchain.chains import RetrievalQA
from langchain_community.llms import HuggingFacePipeline
from langchain.prompts import PromptTemplate
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, pipeline

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    """Landing page"""
    return render_template('landing_page.html')

@app.route('/app')
def app_main():
    """Main application page"""
    return render_template('integrated_frontend.html')

@app.route('/api/ask', methods=['POST'])
def ask():
    """Main API endpoint for legal questions – RAG-only, simple-English output."""
    try:
        data = request.get_json(force=True, silent=True) or {}
        user_question = (data.get('question') or '').strip()
        country = (data.get('country') or '').strip() or None

        if not user_question:
            return jsonify({"error": "No question provided"}), 400

        print(f"🤔 User asked: {user_question}")

        # Try RAG pipeline (PDF-grounded) – required path
        try:
            print("🔄 Attempting RAG query...")
            if _ensure_rag_pipeline_ready():
                print("✅ RAG pipeline ready, executing query...")
                
                # Use LLM-based retrieval approach
                if _rag_chain["type"] == "llm_retrieval":
                    retriever = _rag_chain["retriever"]
                    llm = _rag_chain["llm"]
                    prompt_template = _rag_chain["prompt_template"]
                    
                    docs = retriever.get_relevant_documents(user_question)
                    
                    if docs:
                        # Combine relevant documents
                        context = "\n\n".join([doc.page_content for doc in docs[:4]])
                        
                        # Generate answer using LLM
                        try:
                            prompt = prompt_template.format(context=context, question=user_question)
                            response = llm.invoke(prompt)
                            legal_advice = response.strip()
                            
                            # Check if response looks like a template (contains template text)
                            if "1. Immediate Actions Required" in legal_advice or "Answer:" in legal_advice:
                                print("⚠️ LLM returned template text, using rule-based system")
                                legal_advice = get_legal_advice(user_question, "", country)
                                return jsonify({
                                    'success': True,
                                    'answer': legal_advice,
                                    'source': 'Rule-based system',
                                    'model': 'rule-based',
                                    'message': "⚖️ Legal guidance provided"
                                })
                            
                            # Add source attribution
                            rag_sources = []
                            for doc in docs[:4]:
                                meta = doc.metadata or {}
                                rag_sources.append({
                                    "source": meta.get('source', 'Constitution PDF'),
                                    "page": meta.get('page', 'Unknown')
                                })
                            
                            # Add sources and disclaimer
                            pages_str = ", ".join([str(s.get('page','?')) for s in rag_sources if s.get('page') is not None])
                            legal_advice += f"\n\n📚 Sources: Constitution of India (pages: {pages_str})"
                            legal_advice += "\n\n⚖️ Legal Disclaimer: This information is based on constitutional provisions. For specific legal advice, consult a qualified lawyer."
                            
                            print(f"✅ LLM-based answer generated from {len(docs)} documents")
                            return jsonify({
                                'success': True,
                                'answer': legal_advice,
                                'sources': rag_sources,
                                'source': 'RAG: Constitution PDF',
                                'model': 'LLM + RAG',
                                'message': "🤖 AI-powered answer from your knowledge base"
                            })
                            
                        except Exception as llm_error:
                            print(f"❌ LLM generation failed: {llm_error}")
                            # Fallback to rule-based system
                            legal_advice = get_legal_advice(user_question, "", country)
                            return jsonify({
                                'success': True,
                                'answer': legal_advice,
                                'source': 'Rule-based system',
                                'model': 'rule-based',
                                'message': "⚖️ Legal guidance provided"
                            })
                    else:
                        print("⚠️ No relevant documents found - using rule-based system")
                        legal_advice = get_legal_advice(user_question, "", country)
                        return jsonify({
                            'success': True,
                            'answer': legal_advice,
                            'source': 'Rule-based system',
                            'model': 'rule-based',
                            'message': "⚖️ Legal guidance provided"
                        })
                        
                elif _rag_chain["type"] == "simple_retrieval":
                    # Fallback to simple retrieval
                    retriever = _rag_chain["retriever"]
                    docs = retriever.get_relevant_documents(user_question)
                    
                    if docs:
                        legal_advice = _generate_answer_from_docs(user_question, docs)
                        rag_sources = []
                        for doc in docs[:4]:
                            meta = doc.metadata or {}
                            rag_sources.append({
                                "source": meta.get('source', 'Constitution PDF'),
                                "page": meta.get('page', 'Unknown')
                            })
                        
                        print(f"✅ Simple retrieval answer generated from {len(docs)} documents")
                        return jsonify({
                            'success': True,
                            'answer': legal_advice + ("\n\n📚 Sources: Constitution of India (pages: " + ", ".join([str(s.get('page','?')) for s in rag_sources if s.get('page') is not None]) + ")" if rag_sources else ""),
                            'sources': rag_sources,
                            'source': 'RAG: Constitution PDF',
                            'model': 'retrieval',
                            'message': "📚 Answered from your knowledge base"
                        })
                    else:
                        print("⚠️ No relevant documents found - using rule-based system")
                        legal_advice = get_legal_advice(user_question, "", country)
                        return jsonify({
                            'success': True,
                            'answer': legal_advice,
                            'source': 'Rule-based system',
                            'model': 'rule-based',
                            'message': "⚖️ Legal guidance provided"
                        })
                else:
                    print("⚠️ Unknown RAG chain type")
            else:
                print("❌ RAG pipeline failed to initialize")
        except Exception as rag_err:
            print(f"❌ RAG query error, falling back to rule-based: {rag_err}")
            import traceback
            traceback.print_exc()

        # If we reach here, we couldn't answer from PDF - use rule-based system
        print("🔄 No RAG results, using rule-based system...")
        legal_advice = get_legal_advice(user_question, "", country)
        return jsonify({
            'success': True,
            'answer': legal_advice,
            'source': 'Rule-based system',
            'model': 'rule-based',
            'message': "⚖️ Legal guidance provided"
        })

    except Exception as e:
        print(f"❌ Main API error: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/deepseek_legal', methods=['POST'])
def deepseek_legal():
    """Deprecated mirror of /api/ask kept for compatibility – uses RAG only."""
    try:
        data = request.get_json(force=True, silent=True) or {}
        user_question = (data.get('question') or '').strip()
        country = None

        if not user_question:
            return jsonify({"error": "No question provided"}), 400

        print(f"🤖 DeepSeek Legal: {user_question}")

        try:
            if _ensure_rag_pipeline_ready():
                if _rag_chain["type"] == "llm_retrieval":
                    retriever = _rag_chain["retriever"]
                    llm = _rag_chain["llm"]
                    prompt_template = _rag_chain["prompt_template"]
                    
                    docs = retriever.get_relevant_documents(user_question)
                    
                    if docs:
                        context = "\n\n".join([doc.page_content for doc in docs[:4]])
                        
                        try:
                            prompt = prompt_template.format(context=context, question=user_question)
                            response = llm.invoke(prompt)
                            legal_advice = response.strip()
                            
                            # Check if response looks like a template
                            if "1. Immediate Actions Required" in legal_advice or "Answer:" in legal_advice:
                                print("⚠️ LLM returned template text, using rule-based system")
                                legal_advice = get_legal_advice(user_question, "", None)
                                return jsonify({
                                    'success': True,
                                    'answer': legal_advice,
                                    'source': 'Rule-based system',
                                    'model': 'rule-based',
                                    'message': "⚖️ Legal guidance provided"
                                })
                            
                            rag_sources = []
                            for doc in docs[:4]:
                                meta = doc.metadata or {}
                                rag_sources.append({
                                    "source": meta.get('source', 'Constitution PDF'),
                                    "page": meta.get('page', 'Unknown')
                                })
                            
                            pages_str = ", ".join([str(s.get('page','?')) for s in rag_sources if s.get('page') is not None])
                            legal_advice += f"\n\n📚 Sources: Constitution of India (pages: {pages_str})"
                            legal_advice += "\n\n⚖️ Legal Disclaimer: This information is based on constitutional provisions. For specific legal advice, consult a qualified lawyer."
                            
                            return jsonify({
                                'success': True,
                                'answer': legal_advice,
                                'sources': rag_sources,
                                'source': 'RAG: Constitution PDF',
                                'model': 'LLM + RAG',
                                'message': "🤖 AI-powered answer from your knowledge base"
                            })
                        except Exception as llm_error:
                            print(f"❌ LLM generation failed: {llm_error}")
                            # Fallback to rule-based system
                            legal_advice = get_legal_advice(user_question, "", None)
                            return jsonify({
                                'success': True,
                                'answer': legal_advice,
                                'source': 'Rule-based system',
                                'model': 'rule-based',
                                'message': "⚖️ Legal guidance provided"
                            })
                            
                elif _rag_chain["type"] == "simple_retrieval":
                    retriever = _rag_chain["retriever"]
                    docs = retriever.get_relevant_documents(user_question)
                    
                    if docs:
                        legal_advice = _generate_answer_from_docs(user_question, docs)
                        rag_sources = []
                        for doc in docs[:4]:
                            meta = doc.metadata or {}
                            rag_sources.append({
                                "source": meta.get('source', 'Constitution PDF'),
                                "page": meta.get('page', 'Unknown')
                            })
                        
                        return jsonify({
                            'success': True,
                            'answer': legal_advice + ("\n\n📚 Sources: Constitution of India (pages: " + ", ".join([str(s.get('page','?')) for s in rag_sources if s.get('page') is not None]) + ")" if rag_sources else ""),
                            'sources': rag_sources,
                            'source': 'RAG: Constitution PDF',
                            'model': 'retrieval',
                            'message': "🤖 AI-powered answer from your knowledge base"
                        })
        except Exception as rag_err:
            print(f"RAG query error, falling back to rule-based: {rag_err}")

        return jsonify({
            'success': True,
            'answer': "Sorry, I couldn’t find a precise answer in the Constitution right now. Please rephrase your question or add a bit more detail 🙂.",
            'source': 'RAG: no-match'
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/legal_qa', methods=['POST'])
def legal_qa():
    """Enhanced legal Q&A endpoint – RAG first with country detection."""
    try:
        data = request.get_json(force=True, silent=True) or {}
        user_question = (data.get('question') or '').strip()

        if not user_question:
            return jsonify({"error": "No question provided"}), 400

        print(f"⚖️ Legal Q&A: {user_question}")

        # Detect country from question
        countries = {
            "india": "India", "pakistan": "Pakistan", "usa": "USA", "australia": "Australia",
            "canada": "Canada", "uk": "UK", "bhutan": "Bhutan", "nepal": "Nepal",
            "new zealand": "New Zealand", "singapore": "Singapore"
        }
        country = None
        question_lower = user_question.lower()
        for country_key, country_name in countries.items():
            if country_key in question_lower:
                country = country_name
                break

        # Try RAG
        try:
            if _ensure_rag_pipeline_ready():
                if _rag_chain["type"] == "llm_retrieval":
                    retriever = _rag_chain["retriever"]
                    llm = _rag_chain["llm"]
                    prompt_template = _rag_chain["prompt_template"]
                    
                    docs = retriever.get_relevant_documents(user_question)
                    
                    if docs:
                        context = "\n\n".join([doc.page_content for doc in docs[:4]])
                        
                        try:
                            prompt = prompt_template.format(context=context, question=user_question)
                            response = llm.invoke(prompt)
                            rag_answer = response.strip()
                            
                            # Check if response looks like a template
                            if "1. Immediate Actions Required" in rag_answer or "Answer:" in rag_answer:
                                print("⚠️ LLM returned template text, using rule-based system")
                                legal_advice = get_legal_advice(user_question, "", country)
                                return jsonify({
                                    'success': True,
                                    'question': user_question,
                                    'country': country,
                                    'answer': legal_advice,
                                    'source': 'Rule-based system',
                                    'supported_countries': list(countries.values()),
                                    'model': 'rule-based',
                                    'message': "⚖️ Legal guidance provided"
                                })
                            
                            rag_sources = []
                            for doc in docs[:4]:
                                meta = doc.metadata or {}
                                rag_sources.append({
                                    "source": meta.get('source', 'Constitution PDF'),
                                    "page": meta.get('page', 'Unknown')
                                })
                            
                            pages_str = ", ".join([str(s.get('page','?')) for s in rag_sources if s.get('page') is not None])
                            rag_answer += f"\n\n📚 Sources: Constitution of India (pages: {pages_str})"
                            rag_answer += "\n\n⚖️ Legal Disclaimer: This information is based on constitutional provisions. For specific legal advice, consult a qualified lawyer."
                            
                            return jsonify({
                                'success': True,
                                'question': user_question,
                                'country': country,
                                'answer': rag_answer,
                                'sources': rag_sources,
                                'source': 'RAG: Constitution PDF',
                                'supported_countries': list(countries.values()),
                                'model': 'LLM + RAG',
                                'message': "🤖 AI-powered answer from your knowledge base"
                            })
                        except Exception as llm_error:
                            print(f"❌ LLM generation failed: {llm_error}")
                            # Fallback to rule-based system
                            legal_advice = get_legal_advice(user_question, "", country)
                            return jsonify({
                                'success': True,
                                'question': user_question,
                                'country': country,
                                'answer': legal_advice,
                                'source': 'Rule-based system',
                                'supported_countries': list(countries.values()),
                                'model': 'rule-based',
                                'message': "⚖️ Legal guidance provided"
                            })
                            
                elif _rag_chain["type"] == "simple_retrieval":
                    retriever = _rag_chain["retriever"]
                    docs = retriever.get_relevant_documents(user_question)
                    
                    if docs:
                        legal_advice = _generate_answer_from_docs(user_question, docs)
                        rag_sources = []
                        for doc in docs[:4]:
                            meta = doc.metadata or {}
                            rag_sources.append({
                                "source": meta.get('source', 'Constitution PDF'),
                                "page": meta.get('page', 'Unknown')
                            })
                        
                        return jsonify({
                            'success': True,
                            'question': user_question,
                            'country': country,
                            'answer': legal_advice + ("\n\n📚 Sources: Constitution of India (pages: " + ", ".join([str(s.get('page','?')) for s in rag_sources if s.get('page') is not None]) + ")" if rag_sources else ""),
                            'sources': rag_sources,
                            'source': 'RAG: Constitution PDF',
                            'supported_countries': list(countries.values()),
                            'model': 'retrieval',
                            'message': "📚 Answered from your knowledge base"
                        })
        except Exception as rag_err:
            print(f"RAG query error, falling back to rule-based: {rag_err}")

        # Fallback
        legal_advice = get_legal_advice(user_question, "", country)
        return jsonify({
            'success': True,
            'question': user_question,
            'country': country,
            'answer': legal_advice,
            'source': 'Rule-based helper',
            'supported_countries': list(countries.values()),
            'message': "⚖️ Legal wisdom delivered (fallback)"
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

def get_legal_advice(question, context="", country=None):
    """
    Get creative and engaging legal advice using rule-based system
    """
    # Use provided country or detect from question
    if not country:
        countries = {
            "india": "India", "pakistan": "Pakistan", "usa": "USA", "australia": "Australia",
            "canada": "Canada", "uk": "UK", "bhutan": "Bhutan", "nepal": "Nepal",
            "new zealand": "New Zealand", "singapore": "Singapore"
        }
        question_lower = question.lower()
        for country_key, country_name in countries.items():
            if country_key in question_lower:
                country = country_name
                break
    
    # Analyze the question to provide more relevant responses
    question_lower = question.lower()
    
    # Determine the type of legal issue
    # Check for sexual assault/rape first (highest priority and sensitivity)
    if any(word in question_lower for word in ['rape', 'sexual assault', 'molestation', 'abuse', 'harassment']):
        issue_type = "sexual_assault"
        greeting = "🚨 Sexual Assault Emergency! You are not alone, and help is available!"
        specific_advice = """🚨 IMMEDIATE CRISIS RESPONSE:

Step 1: 🆘 Get to Safety Immediately
• Move to a safe location
• Call emergency services if in immediate danger
• Contact a trusted friend or family member

Step 2: 🏥 Medical Attention (Within 72 hours)
• Go to the nearest hospital for medical examination
• Request a rape kit examination
• Get tested for STIs and pregnancy
• Document all injuries with photos

Step 3: 👮‍♀️ Legal Action (Within 24 hours)
• File FIR at the nearest police station
• Insist on getting a copy of the FIR
• Provide detailed statement to police
• Request protection if needed

Step 4: 📞 Support Services
• Contact National Commission for Women: 7827170170
• Call Women Helpline: 1091
• Reach out to local women's organizations
• Consider counseling support

Step 5: 📋 Documentation
• Keep all medical reports
• Preserve evidence (clothes, etc.)
• Document everything with dates
• Take photos of injuries

💡 CRITICAL REMINDERS:
• You are NOT to blame
• Your safety comes first
• Medical evidence is crucial
• Legal help is available
• Support groups can help

🆘 EMERGENCY NUMBERS:
• Police: 100
• Women Helpline: 1091
• National Commission for Women: 7827170170"""
    
    # Check for lost/missing documents next
    elif any(word in question_lower for word in ['lost', 'missing', 'stolen', 'misplaced']):
        issue_type = "document_loss"
        greeting = "🛡️ Document Emergency! Don't panic, I've got your back!"
        specific_advice = "📋 Document Recovery Action Plan:\n\n📋 Step 1: Report immediately to local police (get FIR copy)\n\n📋 Step 2: Contact passport office/embassy\n\n📋 Step 3: Gather supporting documents (ID proofs, photos)\n\n📋 Step 4: Apply for replacement with urgency\n\n📋 Step 5: Keep copies of all applications\n\n💡 Pro Tips:\n\n• File police complaint within 24 hours\n\n• Keep FIR copy safe - you'll need it\n\n• Contact embassy if abroad\n\n• Apply for emergency travel document if needed\n\n• Use passport tracking services"
    # Check for passport renewal/application
    elif any(word in question_lower for word in ['passport', 'renew', 'renewal', 'apply', 'application']) and not any(word in question_lower for word in ['lost', 'missing', 'stolen']):
        issue_type = "passport_renewal"
        greeting = "📋 Passport Services! Let's get your travel documents sorted!"
        specific_advice = "🛂 Passport Renewal/Application Guide:\n\n📋 Step 1: Check eligibility and requirements\n\n📋 Step 2: Gather required documents (ID proofs, photos, address proof)\n\n📋 Step 3: Fill application form online or offline\n\n📋 Step 4: Pay applicable fees\n\n📋 Step 5: Submit application with all documents\n\n📋 Step 6: Track application status\n\n💡 Pro Tips:\n\n• Apply well before travel dates (3-6 months)\n\n• Keep all original documents ready\n\n• Use official government portals\n\n• Check processing times for your region\n\n• Keep application number safe for tracking"
    elif any(word in question_lower for word in ['arrest', 'police', 'criminal', 'jail']):
        issue_type = "criminal"
        greeting = "🚨 Criminal Case Alert! Stay calm, know your rights!"
        specific_advice = "⚖️ Criminal Defense Action Plan:\n\n📋 Step 1: Know your rights (right to remain silent)\n\n📋 Step 2: Contact lawyer immediately\n\n📋 Step 3: Don't sign anything without legal advice\n\n📋 Step 4: Document everything (witnesses, evidence)\n\n📋 Step 5: Apply for bail if arrested\n\n💡 Pro Tips:\n\n• Remember: 'You have the right to remain silent'\n\n• Get lawyer contact before trouble\n\n• Keep evidence of innocence\n\n• Don't talk to police without lawyer\n\n• File complaints if rights violated"
    elif any(word in question_lower for word in ['divorce', 'marriage', 'family', 'custody']):
        issue_type = "family"
        greeting = "💔 Family Law Matter! Let's handle this with care and wisdom!"
        specific_advice = "👨‍👩‍👧‍👦 Family Law Action Plan:\n\n📋 Step 1: Document all incidents and communications\n\n📋 Step 2: Consult family law specialist\n\n📋 Step 3: Consider mediation first\n\n📋 Step 4: Gather financial documents\n\n📋 Step 5: Focus on children's best interests\n\n💡 Pro Tips:\n\n• Keep emotions separate from legal strategy\n\n• Document everything with dates\n\n• Consider counseling before legal action\n\n• Protect children from conflict\n\n• Maintain financial records"
    elif any(word in question_lower for word in ['property', 'land', 'house', 'rent', 'lease']):
        issue_type = "property"
        greeting = "🏠 Property Law Issue! Let's protect your rights!"
        specific_advice = "🏘️ Property Law Action Plan:\n\n📋 Step 1: Gather all property documents\n\n📋 Step 2: Verify ownership and boundaries\n\n📋 Step 3: Consult property law expert\n\n📋 Step 4: Document all communications\n\n📋 Step 5: Consider legal notice if needed\n\n💡 Pro Tips:\n\n• Keep all property documents safe\n\n• Take photos of property condition\n\n• Maintain payment records\n\n• Get everything in writing\n\n• Know your tenant/owner rights"
    elif any(word in question_lower for word in ['work', 'job', 'employment', 'salary', 'termination']):
        issue_type = "employment"
        greeting = "💼 Employment Law Issue! Let's fight for your workplace rights!"
        specific_advice = "💼 Employment Law Action Plan:\n\n📋 Step 1: Document all workplace incidents\n\n📋 Step 2: Know your employment contract\n\n📋 Step 3: Contact labor department if needed\n\n📋 Step 4: Keep salary and work records\n\n📋 Step 5: Consider legal action if rights violated\n\n💡 Pro Tips:\n\n• Keep copies of all employment documents\n\n• Document harassment or discrimination\n\n• Know your working hours and overtime rights\n\n• File complaints with labor department\n\n• Don't sign anything under pressure"
    else:
        issue_type = "general"
        greeting = "⚖️ Legal Guidance! Here's your action plan!"
        specific_advice = "🎯 General Legal Guidance - Your Action Plan:\n\n📋 Step 1: Document everything (your evidence collection)\n\n📋 Step 2: Research your specific legal rights (your knowledge power)\n\n📋 Step 3: Contact relevant authorities (your legal guardians)\n\n📋 Step 4: Consider consulting a lawyer (your legal expert)\n\n📋 Step 5: Follow proper legal procedures (your legal roadmap)\n\n💡 Pro Tips:\n\n• Keep all documents and evidence organized\n\n• Take photos and screenshots when relevant\n\n• Stay calm and professional in all interactions\n\n• Know your rights but also your responsibilities\n\n• Consider mediation before going to court"
    
    # Consistent ending based on issue type
    if issue_type == "sexual_assault":
        ending = "\n\n💙 You are not alone. Help is available 24/7. Your safety and healing matter most."
    elif issue_type == "document_loss":
        ending = "\n\n🛡️ Stay calm and act fast! Document recovery is possible with proper steps!"
    elif issue_type == "passport_renewal":
        ending = "\n\n🛂 Plan ahead for smooth travel! Proper preparation ensures hassle-free passport services!"
    elif issue_type == "criminal":
        ending = "\n\n⚖️ Remember your rights! Stay strong and get proper legal representation!"
    elif issue_type == "family":
        ending = "\n\n💝 Family matters need care! Focus on solutions that work for everyone!"
    elif issue_type == "property":
        ending = "\n\n🏠 Property rights are fundamental! Protect what's yours with proper legal steps!"
    elif issue_type == "employment":
        ending = "\n\n💼 Workplace rights matter! Stand up for fair treatment and proper compensation!"
    else:
        ending = "\n\n💪 You've got this! Knowledge is power - use these steps wisely!"
    
    # Add country-specific advice if detected
    if country:
        country_advice = f"\n\n🌍 Country-Specific Note: This advice is general. For {country}-specific laws, consult a local legal expert."
    else:
        country_advice = ""
    
    return f"{greeting}\n\n{specific_advice}{country_advice}{ending}"

# -------------------------------
# Answer generation from RAG docs
# -------------------------------
def _generate_answer_from_docs(question, docs):
    """Create a step-based, structured answer using retrieved PDF chunks and LLM.
    
    This function:
    1. Filters and processes retrieved documents
    2. Uses LLM to generate structured, step-based responses
    3. Ensures accuracy by grounding in retrieved text
    4. Provides actionable legal guidance
    """
    def is_english_line(line: str) -> bool:
        for ch in line:
            if '\u0900' <= ch <= '\u097F':  # Devanagari range
                return False
        return True

    # Combine and filter retrieved documents
    raw = "\n\n".join([getattr(d, 'page_content', '') for d in docs[:3]])
    lines = [ln.strip() for ln in raw.splitlines() if ln.strip()]
    eng_lines = [ln for ln in lines if is_english_line(ln)]

    # Score lines by relevance to question
    q_words = [w for w in question.lower().split() if len(w) > 3]
    scored = []
    for ln in eng_lines:
        ln_lower = ln.lower()
        score = sum(1 for w in q_words if w in ln_lower)
        if score > 0:
            scored.append((score, ln))
    
    # Get most relevant content
    top_lines = [ln for _, ln in sorted(scored, key=lambda x: -x[0])[:8]] or eng_lines[:8]
    context = "\n".join(top_lines)
    
    # Initialize LLM if not already done
    llm = _initialize_llm()
    
    if llm is None:
        # Fallback to simple format if LLM fails
        bullet_points = "\n".join([f"• {ln}" for ln in top_lines[:6]])
        return f"Here's what the Constitution of India says about your question:\n\n{bullet_points}\n\n📋 Next Steps:\n• Review the relevant constitutional provisions\n• Consult with a legal expert for specific advice\n• Gather necessary documentation\n• Follow proper legal procedures\n\n⚖️ Remember: This is general information. For specific legal advice, consult a qualified lawyer."
    
    # Create step-based prompt template
    step_prompt_template = PromptTemplate(
        input_variables=["question", "context"],
        template="""You are a helpful legal assistant. Based on the provided constitutional context, answer the user's question with clear, actionable steps.

Question: {question}

Constitutional Context:
{context}

Please provide a structured, step-based answer that includes:

1. A brief summary of the relevant constitutional provisions
2. Clear, actionable steps the person should take
3. Important considerations and warnings
4. When to seek professional legal help

Format your response with:
- Clear step numbers (Step 1, Step 2, etc.)
- Emojis for visual appeal
- Practical advice
- Professional tone

Answer:"""
    )
    
    try:
        # Generate structured response using LLM
        prompt = step_prompt_template.format(question=question, context=context)
        response = llm.invoke(prompt)
        
        # Clean and format the response
        answer = response.strip()
        
        # Add source attribution
        answer += "\n\n📚 Sources: Constitution of India"
        
        # Add disclaimer
        answer += "\n\n⚖️ Legal Disclaimer: This information is based on constitutional provisions. For specific legal advice, consult a qualified lawyer."
        
        return answer
        
    except Exception as e:
        print(f"❌ LLM generation failed: {e}")
        # Fallback response
        bullet_points = "\n".join([f"• {ln}" for ln in top_lines[:6]])
        return f"Based on the Constitution of India:\n\n{bullet_points}\n\n📋 Recommended Steps:\n1. Review the constitutional provisions mentioned above\n2. Gather relevant documentation\n3. Consult with a legal expert\n4. Follow proper legal procedures\n5. Keep records of all actions taken\n\n⚖️ For specific legal advice, please consult a qualified lawyer."

@app.route('/api/preload_rag', methods=['POST'])
def manual_preload_rag():
    """Manually trigger RAG pipeline preloading"""
    try:
        print("🔄 Manual RAG preload requested...")
        success = preload_rag_pipeline()
        if success:
            return jsonify({
                "success": True,
                "message": "RAG pipeline preloaded successfully! 🚀"
            })
        else:
            return jsonify({
                "success": False,
                "error": "RAG pipeline preloading failed"
            }), 500
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/status', methods=['GET'])
def status():
    """Check API status"""
    rag_status = "ready" if _rag_chain is not None else "not ready"
    
    # Determine which vector store is being used
    vector_store_info = "Chroma (local)"
    if _rag_vs is not None:
        if hasattr(_rag_vs, 'index_name'):
            vector_store_info = f"Pinecone ({_rag_vs.index_name})"
        else:
            vector_store_info = "Chroma (local)"
    
    return jsonify({
        "status": "online",
        "message": "LawHub API is running! 🚀",
        "rag_pipeline": rag_status,
        "vector_store": vector_store_info,
        "features": [
            "Legal Q&A with AI",
            "Document search",
            "Multi-country support",
            "Real-time legal updates",
            "Integrated Team Workflow",
            "Pinecone vector search (if configured)"
        ]
    })

# -----------------------
# RAG: Constitution Chat
# -----------------------

_rag_vs = None
_rag_retriever = None
_rag_chain = None
_llm = None

def _initialize_llm():
    """Initialize the local LLM for generating step-based responses"""
    global _llm
    if _llm is not None:
        return _llm
    
    try:
        print(f"🤖 Initializing LLM: {LOCAL_LLM_ID}")
        
        # Use different model types based on the model ID
        if "gpt-neox" in LOCAL_LLM_ID.lower():
            # GPT-NeoX is a text generation model, not text2text
            from transformers import AutoModelForCausalLM
            tokenizer = AutoTokenizer.from_pretrained(LOCAL_LLM_ID)
            model = AutoModelForCausalLM.from_pretrained(LOCAL_LLM_ID)
            
            pipe = pipeline(
                "text-generation",
                model=model,
                tokenizer=tokenizer,
                max_length=512,
                temperature=0.7,
                do_sample=True,
                device="cpu",
                pad_token_id=tokenizer.eos_token_id
            )
        else:
            # Default to text2text for other models
            tokenizer = AutoTokenizer.from_pretrained(LOCAL_LLM_ID)
            model = AutoModelForSeq2SeqLM.from_pretrained(LOCAL_LLM_ID)
            
            pipe = pipeline(
                "text2text-generation",
                model=model,
                tokenizer=tokenizer,
                max_length=512,
                temperature=0.7,
                do_sample=True,
                device="cpu"
            )
        
        _llm = HuggingFacePipeline(pipeline=pipe)
        print("✅ LLM initialized successfully")
        return _llm
    except Exception as e:
        print(f"❌ LLM initialization failed: {e}")
        return None

def preload_rag_pipeline():
    """Preload the RAG pipeline when server starts"""
    print("🚀 Preloading RAG pipeline...")
    try:
        success = _ensure_rag_pipeline_ready()
        if success:
            print("✅ RAG pipeline preloaded successfully!")
        else:
            print("❌ RAG pipeline preloading failed")
        return success
    except Exception as e:
        print(f"❌ RAG preload error: {e}")
        return False

def _ensure_rag_pipeline_ready():
    global _rag_vs, _rag_retriever, _rag_chain
    if _rag_chain is not None:
        print("✅ RAG pipeline already ready")
        return True
    try:
        print("🔄 Initializing RAG pipeline...")
        # Validate prerequisites
        if not os.path.exists(COI_PDF_PATH):
            raise FileNotFoundError(f"PDF not found at path: {COI_PDF_PATH}")

        print(f"📄 PDF found at: {COI_PDF_PATH}")
        
        # Build or load vector store
        print("🔧 Loading embeddings model...")
        try:
            embeddings = HuggingFaceEmbeddings(
                model_name=HUGGINGFACE_EMBEDDINGS_MODEL,
                model_kwargs={'device': 'cpu'},
                encode_kwargs={'normalize_embeddings': True}
            )
            print("✅ Embeddings model loaded")
        except Exception as emb_error:
            print(f"❌ Embeddings model error: {emb_error}")
            # Try alternative approach
            try:
                from sentence_transformers import SentenceTransformer
                model = SentenceTransformer(HUGGINGFACE_EMBEDDINGS_MODEL)
                embeddings = HuggingFaceEmbeddings(
                    model_name=HUGGINGFACE_EMBEDDINGS_MODEL,
                    model_kwargs={'device': 'cpu'},
                    encode_kwargs={'normalize_embeddings': True}
                )
                print("✅ Embeddings model loaded via alternative method")
            except Exception as alt_error:
                print(f"❌ Alternative embeddings method failed: {alt_error}")
                raise emb_error

        # Check if Pinecone is configured and use it if available
        use_pinecone = PINECONE_API_KEY and PINECONE_ENVIRONMENT and PINECONE_INDEX_NAME
        
        if use_pinecone:
            print("🌲 Using Pinecone vector store...")
            try:
                import pinecone
                pinecone.init(api_key=PINECONE_API_KEY, environment=PINECONE_ENVIRONMENT)
                
                # Check if index exists, create if not
                if PINECONE_INDEX_NAME not in pinecone.list_indexes():
                    print(f"🔨 Creating Pinecone index: {PINECONE_INDEX_NAME}")
                    pinecone.create_index(
                        name=PINECONE_INDEX_NAME,
                        dimension=384,  # Dimension for all-MiniLM-L6-v2
                        metric="cosine"
                    )
                
                # Load existing index or create new one
                _rag_vs = Pinecone.from_existing_index(
                    index_name=PINECONE_INDEX_NAME,
                    embedding=embeddings
                )
                print("✅ Pinecone vector store loaded")
                
                # Check if index is empty and upload data if needed
                index_stats = pinecone.describe_index(PINECONE_INDEX_NAME)
                if index_stats.total_vector_count == 0:
                    print("📤 Uploading PDF data to Pinecone...")
                    loader = PyPDFLoader(COI_PDF_PATH)
                    pages = loader.load()
                    print(f"📄 Loaded {len(pages)} pages from PDF")

                    splitter = RecursiveCharacterTextSplitter(chunk_size=1200, chunk_overlap=200)
                    chunks: List[Document] = splitter.split_documents(pages)
                    print(f"✂️ Split into {len(chunks)} chunks")

                    _rag_vs = Pinecone.from_documents(chunks, embeddings, index_name=PINECONE_INDEX_NAME)
                    print("✅ PDF data uploaded to Pinecone")
                else:
                    print(f"✅ Pinecone index contains {index_stats.total_vector_count} vectors")
                
            except Exception as pinecone_error:
                print(f"❌ Pinecone error: {pinecone_error}")
                print("🔄 Falling back to Chroma...")
                use_pinecone = False
        
        if not use_pinecone:
            # Use Chroma as fallback
            print("📚 Using Chroma vector store...")
            os.makedirs(RAG_PERSIST_DIR, exist_ok=True)
            print(f"📁 RAG persist directory: {RAG_PERSIST_DIR}")
            
            if os.listdir(RAG_PERSIST_DIR):
                print("📚 Loading existing Chroma vector store...")
                _rag_vs = Chroma(persist_directory=RAG_PERSIST_DIR, embedding_function=embeddings)
                print("✅ Existing Chroma vector store loaded")
            else:
                print("📚 Building new Chroma vector store from PDF...")
                loader = PyPDFLoader(COI_PDF_PATH)
                pages = loader.load()
                print(f"📄 Loaded {len(pages)} pages from PDF")

                splitter = RecursiveCharacterTextSplitter(chunk_size=1200, chunk_overlap=200)
                chunks: List[Document] = splitter.split_documents(pages)
                print(f"✂️ Split into {len(chunks)} chunks")

                _rag_vs = Chroma.from_documents(chunks, embeddings, persist_directory=RAG_PERSIST_DIR)
                _rag_vs.persist()
                print("✅ New Chroma vector store built and persisted")

        _rag_retriever = _rag_vs.as_retriever(search_kwargs={"k": 6})  # Increased k for better retrieval
        print("🔍 Retriever configured")

        # Create a proper LLM-based retrieval system
        print("🤖 Setting up LLM-based retrieval system...")
        
        # Initialize LLM for answer generation
        llm = _initialize_llm()
        
        if llm is not None:
            # Create a proper RAG chain with LLM
            prompt_template = PromptTemplate(
                input_variables=["context", "question"],
                template="""You are a professional legal assistant. Based on the provided constitutional context, provide a clear, step-by-step answer to the user's legal question.

Context from Constitution of India:
{context}

User Question: {question}

Provide a structured response with:

1. Immediate Actions Required (if any)
2. Step-by-Step Legal Process
3. Important Legal Rights
4. When to Seek Professional Help
5. Key Considerations

Format with clear step numbers, emojis, and practical advice. Be specific and actionable based on the constitutional context.

Answer:"""
            )
            
            _rag_chain = {
                "retriever": _rag_retriever,
                "llm": llm,
                "prompt_template": prompt_template,
                "type": "llm_retrieval"
            }
            print("✅ LLM-based RAG chain created successfully!")
        else:
            # Fallback to simple retrieval if LLM fails
            _rag_chain = {
                "retriever": _rag_retriever,
                "type": "simple_retrieval"
            }
            print("⚠️ Using simple retrieval (LLM not available)")
        print("✅ RAG chain created successfully!")
        return True
    except Exception as e:
        print(f"❌ RAG init error: {e}")
        import traceback
        traceback.print_exc()
        return False

@app.route('/api/chat_rag', methods=['POST'])
def chat_rag():
    """Answer questions grounded in the Indian Constitution PDF via RAG."""
    try:
        data = request.get_json(force=True, silent=True) or {}
        user_question = (data.get('question') or '').strip()
        if not user_question:
            return jsonify({"success": False, "error": "No question provided"}), 400

        ok = _ensure_rag_pipeline_ready()
        if not ok:
            return jsonify({"success": False, "error": "RAG pipeline failed to initialize. Check logs and config."}), 500

        result = _rag_chain({"query": user_question})
        answer = result.get('result', '')
        sources = []
        for doc in (result.get('source_documents') or [])[:4]:
            meta = doc.metadata or {}
            sources.append({
                "source": meta.get('source'),
                "page": meta.get('page')
            })

        return jsonify({
            "success": True,
            "answer": answer,
            "sources": sources,
            "model": "local"
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/test_rag', methods=['GET'])
def test_rag():
    """Test endpoint to verify RAG pipeline"""
    try:
        print("🧪 Testing RAG pipeline...")
        if _ensure_rag_pipeline_ready() and _rag_chain["type"] == "simple_retrieval":
            retriever = _rag_chain["retriever"]
            docs = retriever.get_relevant_documents("What is the Constitution of India?")
            
            if docs:
                combined_text = "\n\n".join([doc.page_content for doc in docs[:2]])
                answer = f"Constitution of India - Test Results:\n\n{combined_text[:500]}..."
                
                sources = []
                for doc in docs[:2]:
                    meta = doc.metadata or {}
                    sources.append({
                        "source": meta.get('source', 'Constitution PDF'),
                        "page": meta.get('page', 'Unknown')
                    })
            else:
                answer = "No relevant documents found"
                sources = []
            
            return jsonify({
                "success": True,
                "test_question": "What is the Constitution of India?",
                "answer": answer,
                "sources": sources,
                "message": "RAG pipeline test successful!"
            })
        else:
            return jsonify({
                "success": False,
                "error": "RAG pipeline failed to initialize"
            }), 500
    except Exception as e:
        print(f"❌ RAG test error: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/add_training_data', methods=['POST'])
def add_training_data():
    """Add new training data to the system"""
    try:
        data = request.get_json()
        question = data.get('question', '').strip()
        answer = data.get('answer', '').strip()
        country = data.get('country', 'General').strip()
        category = data.get('category', 'General').strip()
        
        if not question or not answer:
            return jsonify({"error": "Question and answer are required"}), 400
        
        # Here you would typically save to a database
        # For now, we'll just return success
        print(f"📝 Added training data: {question[:50]}...")
        
        return jsonify({
            "success": True,
            "message": "Training data added successfully! 🎉",
            "data": {
                "question": question,
                "answer": answer,
                "country": country,
                "category": category
            }
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/training_stats', methods=['GET'])
def get_training_stats():
    """Get training data statistics"""
    try:
        # Here you would typically get stats from a database
        # For now, we'll return sample stats
        stats = {
            "total_examples": 100,
            "country_specific": 75,
            "categories": ["General", "Criminal", "Family", "Property", "Employment"],
            "countries": ["India", "Pakistan", "USA", "Australia", "General"]
        }
        
        return jsonify({
            "success": True,
            "stats": stats
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

if __name__ == '__main__':
    print("🚀 Starting LawHub server...")
    
    # Preload RAG pipeline immediately
    print("🔄 Preloading RAG pipeline on startup...")
    preload_rag_pipeline()
    
    print("🌐 Starting Flask server...")
    app.run(debug=True, host='0.0.0.0', port=5000) 