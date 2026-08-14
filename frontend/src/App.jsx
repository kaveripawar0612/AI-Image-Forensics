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
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", image);

    try {
      const response = await fetch("https://devtunnels.ms", {
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
    <div className="frontend">
      <nav style={{ display: "flex", gap: "15px", justifyContent: "center", padding: "10px" }}>
        <a href="#dashboard" style={{ color: "#fff", textDecoration: "none", fontWeight: "bold" }}>Dashboard</a>
        <a href="#about" style={{ color: "#888", textDecoration: "none" }}>About</a>
      </nav>

      <div style={{ textAlign: "center", padding: "40px 20px" }}>
        <p style={{ color: "#00d2ff", letterSpacing: "2px", fontSize: "14px", fontWeight: "bold", margin: "0" }}>AI-POWERED IMAGE ANALYSIS</p>
        <h1 style={{ fontSize: "42px", margin: "10px 0", color: "#fff" }}>Detect Image Forgery <span style={{ color: "#00d2ff" }}>with AI</span></h1>
        <p style={{ color: "#aaa", maxWidth: "600px", margin: "0 auto 30px" }}>
          Analyze images for deepfakes, copy-move forgery, splicing, and digital alterations.
        </p>

        {/* Main Workstation Box Container */}
        <div style={{ backgroundColor: "#111827", border: "1px solid #1f2937", borderRadius: "12px", padding: "30px", maxWidth: "800px", margin: "0 auto", boxSerif: "0 4px 6px rgba(0,0,0,0.3)" }}>
          <h2 style={{ fontSize: "20px", color: "#fff", marginBottom: "20px" }}>Forensic Inspection Workstation</h2>
          
          {/* Side-by-Side Flex Grid */}
          <div style={{ display: "flex", gap: "20px", justifyContent: "center", flexWrap: "wrap", marginBottom: "20px" }}>
            <div>
              <p style={{ color: "#aaa", fontSize: "14px", marginBottom: "10px" }}>Original Image</p>
              <div style={{ width: "320px", height: "240px", backgroundColor: "#0b0f19", border: "2px dashed #1f2937", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", cursor: "pointer" }} onClick={() => fileInputRef.current.click()}>
                {preview ? (
                  <img src={preview} alt="Original Workspace" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                ) : (
                  <span style={{ color: "#555", fontSize: "14px" }}>Drag & Drop or Click to Upload Image</span>
                )}
              </div>
            </div>

            {result?.heatmap && showHeatmap && (
              <div>
                <p style={{ color: "#aaa", fontSize: "14px", marginBottom: "10px" }}>Suspicious Region Heatmap (ELA)</p>
                <div style={{ width: "320px", height: "240px", backgroundColor: "#0b0f19", border: "1px solid #1f2937", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                  <img src={result.heatmap} alt="Forensic Heatmap" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                </div>
              </div>
            )}
          </div>

          <p style={{ color: "#888", fontSize: "13px", marginBottom: "20px" }}>{image ? image.name : "No file chosen"}</p>

          <input type="file" ref={fileInputRef} onChange={handleImageUpload} style={{ display: "none" }} accept="image/*" />

          <div style={{ display: "flex", gap: "15px", justifyContent: "center" }}>
            <button onClick={analyzeImage} disabled={loading} style={{ backgroundColor: "#00d2ff", color: "#000", border: "none", padding: "10px 24px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}>
              {loading ? "Analyzing Matrix..." : "Analyze Image"}
            </button>
            <button onClick={() => fileInputRef.current.click()} style={{ backgroundColor: "transparent", color: "#fff", border: "1px solid #374151", padding: "10px 24px", borderRadius: "6px", cursor: "pointer" }}>
              Choose Another Image
            </button>
          </div>

          {error && <p style={{ color: "#ef4444", marginTop: "15px", fontSize: "14px" }}>{error}</p>}
        </div>

        {/* Results Panel */}
        {result && (
          <div style={{ backgroundColor: "#111827", border: "1px solid #1f2937", borderRadius: "12px", padding: "25px", maxWidth: "800px", margin: "20px auto 0", textAlign: "left" }}>
            <div style={{ display: "flex", justifyContent: "between", alignItems: "center", borderBottom: "1px solid #1f2937", paddingBottom: "15px", marginBottom: "15px" }}>
              <h3 style={{ color: "#fff", margin: "0", fontSize: "18px" }}>Analysis Results</h3>
              <span style={{ backgroundColor: result.prediction === "AUTHENTIC" ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)", color: result.prediction === "AUTHENTIC" ? "#10b981" : "#ef4444", padding: "4px 12px", borderRadius: "20px", fontWeight: "bold", fontSize: "14px" }}>
                {result.prediction}
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px" }}>
              <div>
                <p style={{ color: "#888", margin: "0 0 5px", fontSize: "13px" }}>Detected Type</p>
                <p style={{ color: "#fff", margin: "0", fontWeight: "bold" }}>{result.forgery_type}</p>
              </div>
              <div>
                <p style={{ color: "#888", margin: "0 0 5px", fontSize: "13px" }}>Confidence Score</p>
                <p style={{ color: "#fff", margin: "0", fontWeight: "bold" }}>{result.confidence}%</p>
              </div>
              <div>
                <p style={{ color: "#888", margin: "0 0 5px", fontSize: "13px" }}>Risk Level</p>
                <p style={{ color: result.risk_level === "LOW" ? "#10b981" : "#f59e0b", margin: "0", fontWeight: "bold" }}>{result.risk_level}</p>
              </div>
              <div>
                <p style={{ color: "#888", margin: "0 0 5px", fontSize: "13px" }}>Resolution</p>
                <p style={{ color: "#fff", margin: "0", fontWeight: "bold" }}>{result.width} × {result.height} px</p>
              </div>
            </div>

            {result.heatmap && (
              <div style={{ marginTop: "20px", textAlign: "center" }}>
                <button onClick={() => setShowHeatmap(!showHeatmap)} style={{ backgroundColor: "#2563eb", color: "#fff", border: "none", padding: "8px 20px", borderRadius: "6px", cursor: "pointer", fontSize: "14px" }}>
                  {showHeatmap ? "Hide Heatmap Evidence" : "🔍 View Forensic Heatmap"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
