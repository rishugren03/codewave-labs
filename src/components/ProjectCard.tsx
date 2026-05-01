"use client";

import React from 'react';
import { ExternalLink, Github } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface ProjectCardProps {
  title: string;
  description: string;
  tags: string[];
  liveLink?: string;
  githubLink?: string;
  delay?: number;
}

export default function ProjectCard({ 
  title, 
  description, 
  tags, 
  liveLink, 
  githubLink,
  delay = 0 
}: ProjectCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ 
        duration: 0.8, 
        delay: delay / 1000,
        ease: [0.16, 1, 0.3, 1] 
      }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="glass-panel"
      style={{
        height: '100%',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <motion.div 
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        style={{
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          background: 'radial-gradient(circle at center, rgba(34, 211, 238, 0.08) 0%, transparent 50%)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <h3 style={{
          fontSize: '1.5rem',
          fontWeight: 600,
          marginBottom: '12px',
          color: 'var(--text-primary)',
          letterSpacing: '-0.01em'
        }}>
          {title}
        </h3>
        
        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '1rem',
          lineHeight: 1.6,
          marginBottom: '24px',
          flex: 1
        }}>
          {description}
        </p>

        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          marginBottom: '32px'
        }}>
          {tags.map(tag => (
            <span key={tag} style={{
              fontSize: '0.75rem',
              fontWeight: 500,
              padding: '6px 12px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '20px',
              color: 'var(--text-secondary)',
              letterSpacing: '0.02em'
            }}>
              {tag}
            </span>
          ))}
        </div>

        <div style={{
          display: 'flex',
          gap: '20px',
          borderTop: '1px solid var(--surface-border)',
          paddingTop: '24px',
          marginTop: 'auto'
        }}>
          {liveLink && (
            liveLink.startsWith('/') ? (
              <Link href={liveLink} passHref legacyBehavior>
                <motion.a 
                  whileHover={{ x: 3, color: 'var(--accent-primary)' }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    cursor: 'pointer'
                  }}
                >
                  <ExternalLink size={18} /> View Product
                </motion.a>
              </Link>
            ) : (
              <motion.a 
                href={liveLink} 
                target="_blank" 
                rel="noopener noreferrer" 
                whileHover={{ x: 3, color: 'var(--accent-primary)' }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)'
                }}
              >
                <ExternalLink size={18} /> Live Demo
              </motion.a>
            )
          )}
          {githubLink && (
            <motion.a 
              href={githubLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              whileHover={{ x: 3, color: 'var(--accent-secondary)' }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.9rem',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                marginLeft: liveLink ? 'auto' : '0'
              }}
            >
              <Github size={18} /> Source Code
            </motion.a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
