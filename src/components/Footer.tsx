"use client";

import React from 'react';
import { Github, Twitter, Linkedin } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--surface-border)',
      padding: '60px 0 40px',
      marginTop: '100px',
      background: 'rgba(2, 6, 23, 0.8)',
      backdropFilter: 'blur(10px)',
      position: 'relative',
      zIndex: 10
    }}>
      <div className="container" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '32px'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center' }}
        >
          <h2 style={{
            fontSize: '1.75rem',
            fontWeight: 700,
            background: 'linear-gradient(135deg, #fff 0%, var(--accent-secondary) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '12px',
            letterSpacing: '-0.02em'
          }}>
            Codewave Labs
          </h2>
          
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '1rem',
            maxWidth: '450px',
            textAlign: 'center',
            lineHeight: 1.6
          }}>
            Exploring the intersection of code and creativity. <br/>
            Building digital experiences that leave a lasting wave.
          </p>
        </motion.div>

        <div style={{
          display: 'flex',
          gap: '24px'
        }}>
          {[
            { icon: <Github size={20} />, href: 'https://github.com/rishugren03', label: 'GitHub', color: 'var(--text-primary)' },
            { icon: <Linkedin size={20} />, href: 'https://linkedin.com/in/rishugren03', label: 'LinkedIn', color: '#0077b5' },
            { icon: <Twitter size={20} />, href: 'https://x.com/i_amrishu', label: 'X', color: '#fff' }
          ].map((social, i) => (
            <motion.a
              key={i}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              whileHover={{ 
                y: -5, 
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderColor: 'var(--accent-primary)',
                boxShadow: '0 0 20px rgba(34, 211, 238, 0.1)'
              }}
              style={{
                color: 'var(--text-secondary)',
                padding: '12px',
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: '50%',
                border: '1px solid var(--glass-border)',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {social.icon}
            </motion.a>
          ))}
        </div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          style={{
            marginTop: '16px',
            fontSize: '0.85rem',
            color: 'var(--text-secondary)',
            opacity: 0.6,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <span>© {new Date().getFullYear()} Rishu • Handcrafted with passion</span>
        </motion.div>
      </div>
    </footer>
  );
}
