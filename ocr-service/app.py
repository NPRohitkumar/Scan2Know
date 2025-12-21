from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import easyocr
from PIL import Image
import io
import numpy as np
import cv2
import re
from typing import List, Tuple, Dict
import warnings
warnings.filterwarnings('ignore')
import os;

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize EasyOCR reader once
reader = easyocr.Reader(['en'], gpu=False)


class SpatialOCR:
    """OCR that preserves spatial layout and reading order"""
    
    def __init__(self, debug_mode=False):
        self.debug_mode = debug_mode
        
    def preprocess_image(self, image: np.ndarray) -> np.ndarray:
        """Optimized preprocessing for ingredient labels"""
        # Convert to grayscale
        if len(image.shape) == 3:
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        else:
            gray = image.copy()
        
        # Upscale significantly for better OCR
        scale = 3
        upscaled = cv2.resize(gray, None, fx=scale, fy=scale, 
                            interpolation=cv2.INTER_CUBIC)
        
        # Denoise
        denoised = cv2.fastNlMeansDenoising(upscaled, None, h=10)
        
        # Enhance contrast with CLAHE
        clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8, 8))
        enhanced = clahe.apply(denoised)
        
        # Sharpen
        kernel = np.array([[-1,-1,-1],
                          [-1, 9,-1],
                          [-1,-1,-1]])
        sharpened = cv2.filter2D(enhanced, -1, kernel)
        
        return sharpened
    
    def detect_and_correct_skew(self, image: np.ndarray) -> Tuple[np.ndarray, float]:
        """Accurate skew detection with barcode filtering"""
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY) if len(image.shape) == 3 else image
        
        # Remove barcode regions first (only from edges)
        cleaned_gray = self._remove_barcodes(gray)
        
        # Method 1: Projection profile on cleaned image
        angle1 = self._projection_skew(cleaned_gray)
        
        # Method 2: Hough lines on text edges only
        angle2 = self._text_based_hough_skew(gray)
        
        # Method 3: Morphological text line detection
        angle3 = self._morphological_skew(gray)
        
        print(f"Skew angles: Projection={angle1:.2f}°, Hough={angle2:.2f}°, Morphological={angle3:.2f}°")
        
        # Combine angles with validation
        angles = [angle1, angle2, angle3]
        valid_angles = [a for a in angles if abs(a) < 20]
        
        if not valid_angles:
            print("No skew detected")
            return image, 0.0
        
        # Use median for robustness
        final_angle = np.median(valid_angles)
        angle_std = np.std(valid_angles) if len(valid_angles) > 1 else 0
        
        # More lenient threshold: rotate if angle > 2° OR methods strongly agree
        should_rotate = (abs(final_angle) > 2.0) or (abs(final_angle) > 1.0 and angle_std < 3.0)
        
        if should_rotate:
            corrected = self._rotate_bound(image, final_angle)
            print(f"Corrected skew: {final_angle:.2f}° (std=±{angle_std:.2f}°)")
            return corrected, final_angle
        else:
            print(f"Skew ignored: {final_angle:.2f}° (too small)")
            return image, 0.0
    
    def _remove_barcodes(self, gray: np.ndarray) -> np.ndarray:
        """Detect and remove barcode regions (only on edges)"""
        h, w = gray.shape
        
        # Only check left 20% and right 20% of image for barcodes
        left_region = gray[:, :int(w*0.2)]
        right_region = gray[:, int(w*0.8):]
        
        # Detect vertical lines (common in barcodes)
        kernel_vertical = cv2.getStructuringElement(cv2.MORPH_RECT, (1, 30))
        
        # Check left side
        left_lines = cv2.morphologyEx(left_region, cv2.MORPH_OPEN, kernel_vertical)
        _, left_thresh = cv2.threshold(left_lines, 50, 255, cv2.THRESH_BINARY)
        left_density = np.sum(left_thresh) / (left_region.shape[0] * left_region.shape[1])
        
        # Check right side
        right_lines = cv2.morphologyEx(right_region, cv2.MORPH_OPEN, kernel_vertical)
        _, right_thresh = cv2.threshold(right_lines, 50, 255, cv2.THRESH_BINARY)
        right_density = np.sum(right_thresh) / (right_region.shape[0] * right_region.shape[1])
        
        # Only mask if SIGNIFICANT barcode detected on edges (>3% density)
        if left_density > 0.03 or right_density > 0.03:
            cleaned = gray.copy()
            
            if left_density > 0.03:
                mask_left = cv2.bitwise_not(left_thresh)
                cleaned[:, :int(w*0.2)] = cv2.bitwise_and(left_region, mask_left)
            
            if right_density > 0.03:
                mask_right = cv2.bitwise_not(right_thresh)
                cleaned[:, int(w*0.8):] = cv2.bitwise_and(right_region, mask_right)
            
            return cleaned
        
        return gray
    
    def _projection_skew(self, gray: np.ndarray) -> float:
        """Projection profile method for skew detection"""
        _, binary = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
        
        best_angle = 0
        max_variance = 0
        
        for angle in np.arange(-15, 15, 0.5):
            rotated = self._rotate_bound(binary, angle)
            h_projection = np.sum(rotated, axis=1)
            variance = np.var(h_projection)
            
            if variance > max_variance:
                max_variance = variance
                best_angle = angle
        
        return best_angle
    
    def _text_based_hough_skew(self, gray: np.ndarray) -> float:
        """Hough transform focusing on text edges"""
        kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (20, 2))
        _, binary = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
        text_regions = cv2.morphologyEx(binary, cv2.MORPH_CLOSE, kernel)
        
        edges = cv2.Canny(text_regions, 50, 150, apertureSize=3)
        lines = cv2.HoughLinesP(edges, 1, np.pi/180, 100, 
                               minLineLength=50, maxLineGap=10)
        
        if lines is None or len(lines) < 5:
            return 0.0
        
        angles = []
        for line in lines:
            x1, y1, x2, y2 = line[0]
            angle = np.degrees(np.arctan2(y2 - y1, x2 - x1))
            
            if abs(angle) < 30:
                angles.append(angle)
        
        return np.median(angles) if angles else 0.0
    
    def _morphological_skew(self, gray: np.ndarray) -> float:
        """Detect skew using morphological text line extraction"""
        _, binary = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
        
        kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (30, 3))
        connected = cv2.morphologyEx(binary, cv2.MORPH_CLOSE, kernel)
        
        contours, _ = cv2.findContours(connected, cv2.RETR_EXTERNAL, 
                                      cv2.CHAIN_APPROX_SIMPLE)
        
        if len(contours) < 2:
            return 0.0
        
        angles = []
        for contour in sorted(contours, key=cv2.contourArea, reverse=True)[:5]:
            if cv2.contourArea(contour) > 1000:
                rect = cv2.minAreaRect(contour)
                angle = rect[-1]
                
                if angle < -45:
                    angle = 90 + angle
                elif angle > 45:
                    angle = angle - 90
                
                angles.append(angle)
        
        return np.median(angles) if angles else 0.0
    
    def _rotate_bound(self, image: np.ndarray, angle: float) -> np.ndarray:
        """Rotate image without cropping"""
        h, w = image.shape[:2]
        center = (w // 2, h // 2)
        
        M = cv2.getRotationMatrix2D(center, angle, 1.0)
        
        cos = abs(M[0, 0])
        sin = abs(M[0, 1])
        new_w = int((h * sin) + (w * cos))
        new_h = int((h * cos) + (w * sin))
        
        M[0, 2] += (new_w / 2) - center[0]
        M[1, 2] += (new_h / 2) - center[1]
        
        rotated = cv2.warpAffine(image, M, (new_w, new_h),
                                flags=cv2.INTER_CUBIC,
                                borderMode=cv2.BORDER_REPLICATE)
        return rotated
    
    def extract_text_from_image(self, image: np.ndarray) -> str:
        """Extract text preserving spatial layout"""
        print("Detecting skew...")
        deskewed, angle = self.detect_and_correct_skew(image)
        
        print("Preprocessing...")
        processed = self.preprocess_image(deskewed)
        
        print("Running OCR...")
        results = reader.readtext(processed, 
                                 detail=1,
                                 paragraph=False,
                                 width_ths=0.7,
                                 height_ths=0.7)
        
        print("Sorting spatially...")
        sorted_text = self._sort_spatially(results)
        
        print(f"Extracted {len(results)} text regions")
        
        return sorted_text
    
    def _sort_spatially(self, results: List) -> str:
        """Sort text regions by reading order"""
        if not results:
            return ""
        
        boxes_with_text = []
        for detection in results:
            bbox, text, conf = detection
            
            x_coords = [point[0] for point in bbox]
            y_coords = [point[1] for point in bbox]
            
            x_min, x_max = min(x_coords), max(x_coords)
            y_min, y_max = min(y_coords), max(y_coords)
            
            x_center = (x_min + x_max) / 2
            y_center = (y_min + y_max) / 2
            
            boxes_with_text.append({
                'text': text,
                'x_center': x_center,
                'y_center': y_center,
                'height': y_max - y_min
            })
        
        lines = self._group_into_lines(boxes_with_text)
        
        full_text = []
        for line in lines:
            line_text = ' '.join([item['text'] for item in line])
            full_text.append(line_text)
        
        return '\n'.join(full_text)
    
    def _group_into_lines(self, boxes: List[Dict]) -> List[List[Dict]]:
        """Group text boxes into lines"""
        if not boxes:
            return []
        
        boxes.sort(key=lambda x: x['y_center'])
        
        all_heights = [b['height'] for b in boxes]
        median_height = np.median(all_heights)
        
        lines = []
        current_line = [boxes[0]]
        
        for box in boxes[1:]:
            y_threshold = median_height * 0.7
            
            in_same_line = False
            for line_box in current_line:
                y_diff = abs(box['y_center'] - line_box['y_center'])
                if y_diff < y_threshold:
                    in_same_line = True
                    break
            
            if in_same_line:
                current_line.append(box)
            else:
                min_y_in_line = min(b['y_center'] for b in current_line)
                max_y_in_line = max(b['y_center'] for b in current_line)
                line_height = max_y_in_line - min_y_in_line + median_height
                
                gap = box['y_center'] - max_y_in_line
                
                if gap < line_height * 0.5:
                    current_line.append(box)
                else:
                    current_line.sort(key=lambda x: x['x_center'])
                    lines.append(current_line)
                    current_line = [box]
        
        if current_line:
            current_line.sort(key=lambda x: x['x_center'])
            lines.append(current_line)
        
        return lines


def clean_ingredient_text(text):
    """Clean extracted text for ingredients"""
    # Remove percentage values and decimal numbers
    text = re.sub(r'\d+\.?\d*\s*%', '', text)
    text = re.sub(r'(?<!\w)\d+\.\d+(?!\w)', '', text)
    
    # Remove the word "ingredients" or "ingredient"
    text = re.sub(r'\bingredients?\b', '', text, flags=re.IGNORECASE)
    
    # Remove brackets, colons, forward slashes, and dots
    text = text.replace('(', '').replace(')', '')
    text = text.replace('[', '').replace(']', '')
    text = text.replace(':', '').replace('/', ' ').replace('.', ' ')
    
    # Convert to lowercase
    text = text.lower()
    
    # Clean up extra spaces
    text = ' '.join(text.split())
    
    return text.strip()


def extract_ingredients(text):
    """Extract and clean ingredients from OCR text"""
    # Split by both commas and semicolons
    text = text.replace(';', ',')
    ingredients = text.split(',')
    
    # Clean each ingredient
    cleaned_ingredients = []
    for ingredient in ingredients:
        cleaned = clean_ingredient_text(ingredient)
        
        # Skip empty strings and very short text
        if cleaned and len(cleaned) > 1:
            cleaned_ingredients.append(cleaned)
    
    return cleaned_ingredients


# Initialize OCR processor
ocr_processor = SpatialOCR(debug_mode=False)


@app.post("/extract")
async def extract_text(image: UploadFile = File(...)):
    try:
        # Read image
        contents = await image.read()
        img = Image.open(io.BytesIO(contents))
        img_array = np.array(img)
        
        # Convert PIL RGB to OpenCV BGR
        if len(img_array.shape) == 3:
            img_array = cv2.cvtColor(img_array, cv2.COLOR_RGB2BGR)
        
        print("Processing image with advanced OCR...")
        
        # Extract text using advanced OCR
        raw_text = ocr_processor.extract_text_from_image(img_array)
        
        print("Raw OCR text:", raw_text)
        
        # Process and clean ingredients
        cleaned_ingredients = extract_ingredients(raw_text)
        
        print("Cleaned ingredients:", cleaned_ingredients)
        
        return {
            "texts": cleaned_ingredients,
            "raw_texts": raw_text.split('\n'),
            "success": True
        }
    
    except Exception as e:
        print(f"Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return {"error": str(e), "success": False}


@app.get("/")
def read_root():
    return {"message": "Advanced OCR Service is running with skew correction and spatial layout preservation"}


@app.get("/test")
def test_cleaning():
    """Test endpoint to verify text cleaning"""
    test_cases = [
        "INGREDIENTS: Sugar (52%), Salt, Water",
        "Ingredients: Monosodium Glutamate [E621]; Citric Acid (INS330)",
        "Milk powder 25.5%, Cocoa 15%, Sugar",
        "Salt (4.2%), Preservative (INS 211)",
        "SUGAR, SALT/MSG, Water.",
        "Ingredient: Sugar; Salt; MSG"
    ]
    
    results = {}
    for test in test_cases:
        cleaned = extract_ingredients(test)
        results[test] = cleaned
    
    return {"test_results": results}


if __name__ == "__main__":
    import uvicorn
    # uvicorn.run(app, host="0.0.0.0", port=8000)
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", 8000)))