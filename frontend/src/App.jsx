import React, { useState, useRef } from "react";
import "./App.css";

function App() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [showHeatmap, setShowHeatmap] = useState(true);

  const fileInputRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
      setError(null);
    }
  };

  const analyzeImage = async () => {
    if (!image) {
      setError("Please select an image first.");
     
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", image);

    try {
      const response = await fetch("https://8w7xk629-8080.inc1.devtunnels.ms/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server status error: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
      setShowHeatmap(true);
    } catch (err) {
      console.error(err);
      setError("Unable to connect to FastAPI backend. Ensure uvicorn is running on port 8080.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="frontend" style={{ minHeight: "100vh", backgroundColor: "#030712", color: "#fff", paddingBottom: "40px" }}>
      {/* Navigation */}
      <nav style={{ display: "flex", gap: "20px", justifyContent: "center", padding: "15px 10px", backgroundColor: "#0b0f19", borderBottom: "1px solid #1f2937" }}>
        <a href="#dashboard" style={{ color: "#00d2ff", textDecoration: "none", fontWeight: "bold", fontSize: "15px" }}>Dashboard</a>
        <a href="#about" style={{ color: "#9ca3af", textDecoration: "none", fontSize: "15px" }}>About</a>
      </nav>

      {/* Main Content Area */}
      <div style={{ width: "100%", maxWidth: "900px", margin: "0 auto", padding: "20px 15px", boxSizing: "border-box" }}>
        
        {/* Header Section */}
        <header style={{ textAlign: "center", marginBottom: "30px" }}>
          <p style={{ color: "#00d2ff", letterSpacing: "1.5px", fontSize: "12px", fontWeight: "bold", margin: "0 0 5px 0" }}>AI-POWERED IMAGE ANALYSIS</p>
          <h1 style={{ fontSize: "clamp(24px, 5vw, 38px)", margin: "5px 0 10px 0", lineHeight: "1.2", color: "#fff", fontWeight: "800" }}>
            Detect Image Forgery <span style={{ color: "#00d2ff" }}>with AI</span>
          </h1>
          <p style={{ color: "#9ca3af", fontSize: "clamp(13px, 3.5vw, 15px)", margin: "0 auto", maxWidth: "600px", lineHeight: "1.5" }}>
            Analyze images for deepfakes, copy-move forgery, splicing, and digital alterations.
          </p>
        </header>

        {/* Workstation Card Box */}
        <section style={{ backgroundColor: "#111827", border: "1px solid #1f2937", borderRadius: "12px", padding: "clamp(15px, 4vw, 30px)", marginBottom: "20px", boxSizing: "border-box" }}>
          <h2 style={{ fontSize: "clamp(16px, 4.5vw, 20px)", color: "#fff", textAlign: "center", margin: "0 0 20px 0" }}>Forensic Inspection Workstation</h2>
          
          {/* Responsive Flexible Workspace Grid */}
          <div style={{ display: "flex", gap: "20px", justifyContent: "center", flexDirection: "row", flexWrap: "wrap" }}>
            
            {/* Original Image Sub-Box */}
            <div style={{ flex: "1 1 280px", maxWidth: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <p style={{ color: "#9ca3af", fontSize: "13px", margin: "0 0 8px 0", fontWeight: "500" }}>Original Image</p>
              <div 
                style={{ width: "100%", aspectRatio: "4/3", maxHeight: "260px", backgroundColor: "#0b0f19", border: "2px dashed #374151", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", cursor: "pointer" }} 
                onClick={() => fileInputRef.current.click()}
              >
                {preview ? (
                  <img src={preview} alt="Original input asset" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                ) : (
                  <div style={{ textAlign: "center", padding: "20px", color: "#4b5563", fontSize: "13px" }}>
                    Tap here to upload image
                  </div>
                )}
              </div>
            </div>

            {/* Heatmap Sub-Box */}
            {result?.heatmap && showHeatmap && (
              <div style={{ flex: "1 1 280px", maxWidth: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <p style={{ color: "#9ca3af", fontSize: "13px", margin: "0 0 8px 0", fontWeight: "500" }}>Suspicious Region Heatmap (ELA)</p>
                <div style={{ width: "100%", aspectRatio: "4/3", maxHeight: "260px", backgroundColor: "#0b0f19", border: "1px solid #1f2937", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                  <img src={result.heatmap} alt="Computed Heatmap representation" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                </div>
              </div>
            )}
          </div>

          <p style={{ color: "#6b7280", fontSize: "12px", textAlign: "center", margin: "15px 0 20px 0", wordBreak: "break-all" }}>
            {image ? image.name : "No file chosen"}
          </p>

          <input type="file" ref={fileInputRef} onChange={handleImageUpload} style={{ display: "none" }} accept="image/*" />

          {/* Interactive Responsive Control Buttons */}
          <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
            <button 
              onClick={analyzeImage} 
              disabled={loading} 
              style={{ backgroundColor: "#00d2ff", color: "#000", border: "none", padding: "12px 24px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", fontSize: "14px", flex: "1 1 auto", minWidth: "140px" }}
            >
              {loading ? "Analyzing Matrix..." : "Analyze Image"}
            </button>
            <button 
              onClick={() => fileInputRef.current.click()} 
              style={{ backgroundColor: "transparent", color: "#fff", border: "1px solid #4b5563", padding: "12px 24px", borderRadius: "6px", cursor: "pointer", fontSize: "14px", flex: "1 1 auto", minWidth: "140px" }}
            >
              Choose Another
            </button>
          </div>

          {error && <p style={{ color: "#ef4444", marginTop: "15px", fontSize: "13px", textAlign: "center" }}>{error}</p>}
        </section>

        {/* Responsive Results Panel */}
        {result && (
          <section style={{ backgroundColor: "#111827", border: "1px solid #1f2937", borderRadius: "12px", padding: "20px", boxSizing: "border-box" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #1f2937", paddingBottom: "12px", marginBottom: "15px" }}>
              <h3 style={{ color: "#fff", margin: "0", fontSize: "16px", fontWeight: "600" }}>Analysis Metrics</h3>
              <span style={{ backgroundColor: result.prediction === "AUTHENTIC" ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)", color: result.prediction === "AUTHENTIC" ? "#10b981" : "#ef4444", padding: "4px 12px", borderRadius: "20px", fontWeight: "bold", fontSize: "12px" }}>
                {result.prediction}
              </span>
            </div>

            {/* Metric Items Grid Layout */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "15px" }}>
              <div>
                <p style={{ color: "#6b7280", margin: "0 0 3px 0", fontSize: "12px" }}>Detected Type</p>
                <p style={{ color: "#fff", margin: "0", fontWeight: "bold", fontSize: "14px" }}>{result.forgery_type}</p>
              </div>
              <div>
                <p style={{ color: "#6b7280", margin: "0 0 3px 0", fontSize: "12px" }}>Confidence Score</p>
                <p style={{ color: "#fff", margin: "0", fontWeight: "bold", fontSize: "14px" }}>{result.confidence}%</p>
              </div>
              <div>
                <p style={{ color: "#6b7280", margin: "0 0 3px 0", fontSize: "12px" }}>Risk Level</p>
                <p style={{ color: result.risk_level === "LOW" ? "#10b981" : "#f59e0b", margin: "0", fontWeight: "bold", fontSize: "14px" }}>{result.risk_level}</p>
              </div>
              <div>
                <p style={{ color: "#6b7280", margin: "0 0 3px 0", fontSize: "12px" }}>Resolution</p>
                <p style={{ color: "#fff", margin: "0", fontWeight: "bold", fontSize: "14px" }}>{result.width} × {result.height} px</p>
              </div>
            </div>

            {result.heatmap && (
              <div style={{ marginTop: "20px", textAlign: "center" }}>
                <button 
                  onClick={() => setShowHeatmap(!showHeatmap)} 
                  style={{ backgroundColor: "#1d4ed8", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "6px", cursor: "pointer", fontSize: "13px", fontWeight: "500", width: "100%", maxWidth: "240px" }}
                >
                  {showHeatmap ? "Hide Heatmap Evidence" : "🔍 View Forensic Heatmap"}
                </button>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}

export default App;
