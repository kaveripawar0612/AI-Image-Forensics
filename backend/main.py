from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fusion import analyze_image_hybrid
import time
import io
from PIL import Image

app = FastAPI(title="AI Image Forensics API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health_check():
    return {"status": "Online", "version": "2.0-hybrid"}

@app.post("/api/analyze")
async def analyze_image(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File provided is not an image.")
        
    try:
        contents = await file.read()
        start_time = time.time()
        
        # Check size, if too big, resize
        # Just an example, doing it in memory
        img = Image.open(io.BytesIO(contents))
        # if max dimension > 1024, resize to 1024
        max_dim = max(img.size)
        if max_dim > 1024:
            ratio = 1024.0 / max_dim
            new_size = (int(img.size[0] * ratio), int(img.size[1] * ratio))
            img = img.resize(new_size, Image.Resampling.LANCZOS)
            img_byte_arr = io.BytesIO()
            img.save(img_byte_arr, format=img.format or 'PNG')
            contents = img_byte_arr.getvalue()

        # Run forensic analysis pipeline from fusion.py
        forensic_results = analyze_image_hybrid(contents)
        
        processing_time = int((time.time() - start_time) * 1000)
        
        return {
            **forensic_results,
            "processing_time_ms": processing_time
        }

    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=400, detail=f"Analysis failed: {str(e)}")
