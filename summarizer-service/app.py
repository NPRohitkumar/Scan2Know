from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import pipeline

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize summarizer
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

class TextInput(BaseModel):
    text: str

@app.post("/summarize")
async def summarize_text(input: TextInput):
    try:
        # Limit input length for the model
        max_input_length = 1024
        text = input.text[:max_input_length]
        
        # Generate summary
        summary = summarizer(text, max_length=400, min_length=50, do_sample=False)
        
        return {"summary": summary[0]['summary_text'], "success": True}
    
    except Exception as e:
        return {"error": str(e), "success": False}

@app.get("/")
def read_root():
    return {"message": "Summarizer Service is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)



# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel
# from transformers import pipeline

# app = FastAPI()

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Initialize summarizer
# summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

# class TextInput(BaseModel):
#     text: str

# @app.post("/summarize")
# async def summarize_text(input: TextInput):
#     try:
#         text = input.text
        
#         # BART model has max input of 1024 tokens
#         # If text is too long, split into chunks and summarize each
#         max_chunk_length = 1000
        
#         if len(text) <= max_chunk_length:
#             # Single chunk summarization
#             summary = summarizer(
#                 text, 
#                 max_length=300,  # Increased from 150
#                 min_length=100,   # Increased from 50
#                 do_sample=False
#             )
#             return {"summary": summary[0]['summary_text'], "success": True}
#         else:
#             # Split into chunks by sentences
#             sentences = text.split('. ')
#             chunks = []
#             current_chunk = ""
            
#             for sentence in sentences:
#                 if len(current_chunk) + len(sentence) < max_chunk_length:
#                     current_chunk += sentence + ". "
#                 else:
#                     if current_chunk:
#                         chunks.append(current_chunk)
#                     current_chunk = sentence + ". "
            
#             if current_chunk:
#                 chunks.append(current_chunk)
            
#             # Summarize each chunk
#             summaries = []
#             for chunk in chunks:
#                 if len(chunk.strip()) > 50:  # Skip very short chunks
#                     summary = summarizer(
#                         chunk, 
#                         max_length=200, 
#                         min_length=50, 
#                         do_sample=False
#                     )
#                     summaries.append(summary[0]['summary_text'])
            
#             # Combine summaries
#             final_summary = " ".join(summaries)
#             return {"summary": final_summary, "success": True}
    
#     except Exception as e:
#         print(f"Summarization error: {str(e)}")
#         return {"error": str(e), "success": False}

# @app.get("/")
# def read_root():
#     return {"message": "Summarizer Service is running"}

# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="0.0.0.0", port=8001)