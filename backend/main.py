from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from detector import analyze_image_forensics
from PIL import Image
import io

app = FastAPI(title="AI Image Forensics API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "Online"}

@app.post("/analyze")
async def analyze_image(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        
        img = Image.open(io.BytesIO(contents))
        width, height = img.size
        img_format = img.format

        # Run forensic analysis pipeline from detector.py
        forensic_results = analyze_image_forensics(contents)
        
        return {
            "filename": file.filename,
            "format": img_format,
            "width": width,
            "height": height,
            **forensic_results
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Analysis failed: {str(e)}")