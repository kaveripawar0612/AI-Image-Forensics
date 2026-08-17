import React from 'react';

export default function Footer() {
  return (
    <footer style={{ 
      padding: '30px 40px', 
      textAlign: 'center', 
      backgroundColor: '#050811', 
      borderTop: '1px solid rgba(255, 255, 255, 0.05)',
      marginTop: 'auto'
    }}>
      <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>
        © {new Date().getFullYear()} Image Forensic AI. Powered by a Hybrid Multi-Stream Architecture.
      </p>
    </footer>
  );
}
