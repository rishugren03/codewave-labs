"use client";

import React from 'react';
import ProjectCard from '@/components/ProjectCard';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';

const PROJECTS = [
  {
    title: 'MergeWell',
    description: 'AI PR Reviewer for Next.js applications.',
    tags: ['Recent Release', 'Next.js', 'AI', 'PR Reviewer'],
    liveLink: 'https://codewavelabs.org/mergewell',
    delay: 100
  }
];

const COMING_SOON_PROJECTS = [
  {
    title: 'inseller.in',
    description: 'A revolutionary new platform currently under development.',
    tags: ['Coming Soon'],
    liveLink: 'https://inseller.in',
    delay: 100
  }
];

export default function Home() {
  return (
    <>
      <div className="bg-mesh" />
      <main className="container" style={{ padding: '120px 2rem 60px', minHeight: '100vh', position: 'relative' }}>
        
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-glow" />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{
              display: 'inline-block',
              padding: '8px 20px',
              borderRadius: '30px',
              background: 'rgba(34, 211, 238, 0.05)',
              border: '1px solid rgba(34, 211, 238, 0.2)',
              color: 'var(--accent-primary)',
              fontSize: '0.85rem',
              fontWeight: 700,
              marginBottom: '32px',
              letterSpacing: '0.15em',
              textTransform: 'uppercase'
            }}
          >
            Digital Laboratory v2.0
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{ 
              fontSize: 'clamp(3.5rem, 10vw, 6.5rem)', 
              fontWeight: 800, 
              lineHeight: 0.95,
              letterSpacing: '-0.04em',
              marginBottom: '32px'
            }}
          >
            Welcome to <br/>
            <span className="text-gradient-accent">Codewave</span>
            <span style={{ color: '#fff' }}> Labs</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
              color: 'var(--text-secondary)',
              fontWeight: 400,
              maxWidth: '650px',
              marginBottom: '56px',
              lineHeight: 1.6,
              letterSpacing: '-0.01em'
            }}
          >
            I'm Rishu. A visionary space dedicated to experimenting 
            with cutting-edge tech and crafting immersive digital art.
          </motion.p>

          <motion.a 
            href="#projects" 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(34, 211, 238, 0.3)' }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: '20px 48px',
              background: '#fff',
              color: '#020617',
              borderRadius: '40px',
              fontWeight: 700,
              fontSize: '1.1rem',
              boxShadow: '0 10px 25px -5px rgba(255, 255, 255, 0.2)',
              cursor: 'pointer'
            }}
          >
            Recent Releases
          </motion.a>
        </section>

        {/* Projects Section */}
        <section id="projects" style={{ paddingTop: '80px' }}>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="section-header"
          >
            <h2 className="section-title">
              Recent Releases
            </h2>
            <div style={{
              height: '1px',
              flex: 1,
              background: 'linear-gradient(90deg, var(--surface-border) 0%, transparent 100%)'
            }} />
          </motion.div>

          <div className="projects-grid">
            {PROJECTS.map((project, index) => (
              <ProjectCard 
                key={project.title}
                {...project}
                delay={index * 150}
              />
            ))}
          </div>
        </section>

        {/* Coming Soon Section */}
        <section style={{ paddingTop: '80px' }}>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="section-header"
          >
            <h2 className="section-title">
              Coming Soon
            </h2>
            <div style={{
              height: '1px',
              flex: 1,
              background: 'linear-gradient(90deg, var(--surface-border) 0%, transparent 100%)'
            }} />
          </motion.div>

          <div className="projects-grid">
            {COMING_SOON_PROJECTS.map((project, index) => (
              <ProjectCard 
                key={project.title}
                {...project}
                delay={index * 150}
              />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
