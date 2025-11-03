from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import easyocr
from PIL import Image
import io
import numpy as np
import re

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize EasyOCR reader
reader = easyocr.Reader(['en'])

def clean_ingredient_text(text):
    """
    Clean and process ingredient text according to requirements:
    - Remove percentages (52%, 32%, etc.)
    - Remove brackets: ( ) [ ]
    - Keep numbers with letters (INS221, E621)
    - Split only by commas
    - Convert to lowercase
    - Remove dots and extra spaces
    """
    # Remove percentage values: "salt 4%" -> "salt", "52%" -> ""
    text = re.sub(r'\s*\d+\.?\d*\s*%', '', text)
    
    # Remove standalone percentages
    text = re.sub(r'^\d+\.?\d*%$', '', text)
    
    # Remove brackets but keep content inside
    text = text.replace('(', '').replace(')', '')
    text = text.replace('[', '').replace(']', '')
    text = text.replace(':', '').replace('/', '')
    
    # Remove decimal numbers (e.g., "2.5" or ".5")
    text = re.sub(r'\d*\.\d+', '', text)  
    
    # Convert to lowercase
    text = text.lower()

    # Remove standalone dots (periods not part of decimals)
    text = text.replace('.', '')  
    
    # Clean up extra spaces
    text = ' '.join(text.split())
    
    return text.strip()

def extract_ingredients(texts):
    """
    Extract and clean ingredients from OCR text
    Split only by commas, not by newlines
    """
    # Join all texts with space (don't split by newlines)
    full_text = ' '.join(texts)
    
    # # Split by commas only
    # ingredients = full_text.split(',')
    ingredients = full_text.replace(';', ',').split(',')
    
    # Clean each ingredient
    cleaned_ingredients = []
    for ingredient in ingredients:
        cleaned = clean_ingredient_text(ingredient)
        
        # Skip empty strings and very short text (likely noise)
        if cleaned and len(cleaned) > 1:
            cleaned_ingredients.append(cleaned)
    
    return cleaned_ingredients

@app.post("/extract")
async def extract_text(image: UploadFile = File(...)):
    try:
        # Read image
        contents = await image.read()
        img = Image.open(io.BytesIO(contents))
        img_array = np.array(img)
        
        # Extract text using EasyOCR
        results = reader.readtext(img_array)
        
        # Extract only text (ignore bounding boxes and confidence)
        texts = [result[1] for result in results]
        
        print("Raw OCR texts:", texts)  # Debug log
        
        # Process and clean ingredients
        cleaned_ingredients = extract_ingredients(texts)
        
        print("Cleaned ingredients:", cleaned_ingredients)  # Debug log
        
        return {
            "texts": cleaned_ingredients,
            "raw_texts": texts,  # Also return raw for debugging
            "success": True
        }
    
    except Exception as e:
        print(f"Error: {str(e)}")  # Debug log
        return {"error": str(e), "success": False}

@app.get("/")
def read_root():
    return {"message": "OCR Service is running"}

@app.get("/test")
def test_cleaning():
    """Test endpoint to verify text cleaning"""
    test_cases = [
        "Sugar (52%), Salt, Water",
        "Monosodium Glutamate [E621], Citric Acid (INS330)",
        "Milk powder 25%, Cocoa 15%, Sugar",
        "Salt (4%), Preservative (INS 211)",
        "SUGAR, SALT, MSG"
    ]
    
    results = {}
    for test in test_cases:
        cleaned = extract_ingredients([test])
        results[test] = cleaned
    
    return {"test_results": results}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)