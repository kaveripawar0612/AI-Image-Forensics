import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Navbar() {
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'About & Export', path: '/about' },
  ];

  return (
    <nav style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '20px 40px', 
      backgroundColor: 'rgba(11, 15, 25, 0.7)', 
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
        <div style={{ padding: '8px', background: 'linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%)', borderRadius: '12px' }}>
          <ShieldCheck color="#fff" size={24} />
        </div>
        <span style={{ fontSize: '18px', fontWeight: '800', color: '#fff', letterSpacing: '0.5px' }}>
          Image Forensic <span style={{ color: '#00d2ff' }}>AI</span>
        </span>
      </Link>

      <div style={{ display: 'flex', gap: '30px' }}>
        {navLinks.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link key={link.name} to={link.path} style={{ position: 'relative', textDecoration: 'none', color: isActive ? '#fff' : '#9ca3af', fontWeight: '500', fontSize: '15px', transition: 'color 0.3s' }}>
              {link.name}
              {isActive && (
                <motion.div 
                  layoutId="nav-indicator"
                  style={{ position: 'absolute', bottom: '-22px', left: 0, right: 0, height: '3px', backgroundColor: '#00d2ff', borderRadius: '3px 3px 0 0' }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
