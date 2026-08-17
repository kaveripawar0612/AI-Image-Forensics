# Image Forensic AI: Advanced Forgery Detection 🔍

[![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel)](https://ai-image-forensics-kaveri.vercel.app/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)]()
[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)]()
[![PyTorch](https://img.shields.io/badge/PyTorch-EE4C2C?style=for-the-badge&logo=pytorch&logoColor=white)]()

A state-of-the-art, multi-stream deep learning application designed to detect, pinpoint, and analyze digital image manipulation. Rather than relying on a single detection filter, this system utilizes a **Hybrid 4-Stream Architecture** to cross-verify anomalies across multiple forensic domains.

---

## 🌟 Key Features

*   **Spatial Stream (CNN):** Uses a PyTorch ResNet-50 network to detect high-level semantic anomalies and organic blending boundaries (Image Splicing).
*   **Chrominance Stream (DCT):** Analyzes the YCbCr color space to pinpoint isolated compression discrepancies (Copy-Move/Splicing).
*   **Micro-Texture Stream (LBP):** Inspects pixel-level blending, boundary smoothing, and unnatural feathering (Deepfakes).
*   **Frequency Stream (FFT):** Identifies hidden periodic grid-like artifacts left behind by upsampling layers (Generative AI / Midjourney / DALL-E).
*   **Dynamic Heatmap Blending:** Fuses all 4 streams mathematically into a single, interactive Base64 matrix.
*   **Direct Inference Pipeline:** Process real-time, in-memory uploads directly from a mobile or desktop browser.

---

## 🛠️ Technology Stack

**Frontend:**
*   **React + Vite**: For high-performance, single-page application routing.
*   **Framer Motion**: Smooth, commercial-grade UI animations and page transitions.
*   **Lucide React**: Modern iconography.

**Backend:**
*   **FastAPI**: Asynchronous Python API for streaming binary files directly into RAM.
*   **PyTorch**: Core deep-learning inference engine.
*   **OpenCV & Scikit-Image**: Image manipulation, matrix decoding, and signal processing.

---

## 🚀 How to Run Locally

If you want to run this forensic workstation on your own machine, you will need to start both the Python backend and the React frontend.

### 1. Start the Backend (The AI Engine)
Open a terminal and navigate to the project directory:
```bash
cd AI-Image-Forensics/backend
```
Activate the virtual environment:
```bash
source venv/bin/activate  # On Mac/Linux
# .\venv\Scripts\activate # On Windows
```
Install dependencies (if running for the first time):
```bash
pip install -r requirements.txt
```
Start the FastAPI server:
```bash
uvicorn main:app --reload --port 8000
```
*The backend is now listening on `http://127.0.0.1:8000`*

### 2. Start the Frontend (The UI)
Open a **new** terminal window and navigate to the frontend directory:
```bash
cd AI-Image-Forensics/frontend
```
Install the Node dependencies (if running for the first time):
```bash
npm install
```
Start the React development server:
```bash
npm run dev
```
*Your frontend is now live at `http://localhost:5173`*

---

## 🌐 Connecting to the Internet (Optional)
If you want to host the frontend on a service like Vercel but keep the heavy AI models running locally on your laptop, you can securely tunnel your backend using Pinggy:
```bash
ssh -p 443 -R0:localhost:8000 a.pinggy.io
```
Copy the secure URL Pinggy gives you, place it in your `frontend/.env` file as `VITE_API_URL`, and deploy your frontend!

---

*Built with ❤️ for advanced computer vision research.*
