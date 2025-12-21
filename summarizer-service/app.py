from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import pipeline
import os;

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
    # uvicorn.run(app, host="0.0.0.0", port=8001)
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", 8001)))



