import { useState, useRef } from "react";
import "./App.css";

function App() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [showHeatmap, setShowHeatmap] = useState(false);

  // File Input References
  const fileInputRef = useRef(null);
  const changeInputRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
      setError("");
      setShowHeatmap(false);
    }
  };

  const analyzeImage = async () => {
    if (!image) {
      setError("Please select an image first.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    const formData = new FormData();
    formData.append("file", image);

    try {
      const response = await fetch("http://127.0.0.1:8000/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Forensic Model Analysis:", data);
      setResult(data);
    } catch (err) {
      console.error("Analysis error:", err);
      setError("Unable to connect to FastAPI backend. Ensure uvicorn is running on port 8000.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <nav className="navbar">
        <div className="logo">🛡️ AI Image Forensics</div>
        <div className="nav-links">
          <a href="#dashboard">Dashboard</a>
          <a href="#about">About</a>
        </div>
      </nav>

      <main className="dashboard" id="dashboard">
        <section className="hero">
          <div className="badge">AI-POWERED IMAGE ANALYSIS</div>
          <h1>Detect Image Forgery <span>with AI</span></h1>
          <p>Analyze images for deepfakes, copy-move forgery, splicing, and digital alterations.</p>
        </section>

        <section className="upload-section">
          {!preview ? (
            <div className="upload-box">
              <div className="upload-icon">↑</div>
              <h2>Upload an Image</h2>
              <p>Drag & drop your image here or browse from your computer</p>
              
              <button 
                type="button" 
                className="browse-button" 
                onClick={() => fileInputRef.current.click()}
              >
                Browse Image
              </button>

              <input 
                type="file" 
                ref={fileInputRef} 
                accept="image/png,image/jpeg,image/webp" 
                onChange={handleImageUpload} 
                style={{ display: "none" }} 
              />
            </div>
          ) : (
            <div className="preview-box">
              <h2>Forensic Inspection Workstation</h2>
              
              <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', margin: '20px 0', flexWrap: 'wrap' }}>
                <div>
                  <p className="image-label">Original Image</p>
                  <img src={preview} alt="Uploaded image" className="preview-image" style={{ maxHeight: '250px', borderRadius: '8px' }} />
                </div>
                {result && showHeatmap && result.heatmap && (
                  <div>
                    <p className="image-label">Suspicious Region Heatmap (ELA)</p>
                    <img src={result.heatmap} alt="Forensic Heatmap" className="preview-image" style={{ maxHeight: '250px', borderRadius: '8px', border: '2px solid #00f2fe' }} />
                  </div>
                )}
              </div>

              <p className="file-name">{image.name}</p>

              <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', alignItems: 'center', marginBottom: '20px' }}>
                <button className="analyze-button" onClick={analyzeImage} disabled={loading}>
                  {loading ? "Analyzing..." : "Analyze Image"}
                </button>
                
                <button 
                  type="button" 
                  className="change-button" 
                  onClick={() => changeInputRef.current.click()}
                >
                  Choose Another Image
                </button>

                <input 
                  type="file" 
                  ref={changeInputRef} 
                  accept="image/png,image/jpeg,image/webp" 
                  onChange={handleImageUpload} 
                  style={{ display: "none" }} 
                />
              </div>

              {error && <div className="error-message">{error}</div>}

              {result && (
                <div className="result-card">
                  <div className="result-header">
                    <h3>Analysis Results</h3>
                    <span className={result.is_forged ? "badge-forged" : "badge-authentic"}>
                      {result.prediction}
                    </span>
                  </div>

                  <div className="result-grid">
                    <p><strong>Detected Type:</strong> {result.forgery_type}</p>
                    <p><strong>Confidence Score:</strong> {result.confidence}%</p>
                    <p><strong>Risk Level:</strong> <span className={`risk-${result.risk_level?.toLowerCase()}`}>{result.risk_level}</span></p>
                    <p><strong>Resolution:</strong> {result.width} × {result.height} px</p>
                  </div>

                  {result.heatmap && (
                    <button className="heatmap-button" onClick={() => setShowHeatmap(!showHeatmap)}>
                      {showHeatmap ? "Hide Heatmap Evidence" : "🔍 View Forensic Heatmap"}
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;