"use client";

import React from 'react';
import ProjectCard from '@/components/ProjectCard';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';

const PROJECTS = [];

const UPCOMING_PROJECTS = [
  {
    title: 'MergeWell',
    description: 'AI PR Reviewer for Next.js applications. Understands App Router, Server Components, and more.',
    tags: ['Upcoming', 'Next.js', 'AI', 'PR Reviewer'],
    liveLink: '/mergewell',
    delay: 100
  },
  {
    title: 'inseller.in',
    description: 'A revolutionary new platform currently under development.',
    tags: ['Coming Soon'],
    liveLink: 'https://inseller.in',
    delay: 100
  }
];

const EXPERIMENTING_PROJECTS = [
  {
    title: 'Computer Agent',
    description: 'Experimental AI agent capable of controlling computer interfaces.',
    tags: ['Experimenting', 'AI', 'Automation'],
    githubLink: 'https://github.com/rishugren03/computer-agent',
    delay: 100
  }
];

const PAST_VENTURES = [
  {
    title: 'Acadsphere',
    description: 'A successful ed-tech startup that operated for over a year before its strategic closure.',
    tags: ['Successful / Closed', 'EdTech', 'Startup'],
    liveLink: 'https://www.linkedin.com/company/acadsphere/?viewAsMember=true',
    delay: 100
  }
];

const PREVIOUS_PROJECTS = [
  {
    title: 'web2docx',
    description: 'A powerful HTML-to-Word converter SDK.',
    tags: ['Distribution Problem', 'SDK', 'Library'],
    githubLink: 'https://github.com/rishugren03/html-converter-sdk',
    delay: 100
  },
  {
    title: 'droonai.com',
    description: 'AI-powered drone solutions for modern enterprises.',
    tags: ['Distribution Problem', 'AI', 'Drone Tech'],
    liveLink: 'https://droonai.com',
    delay: 200
  },
  {
    title: 'trycharla.com',
    description: 'Conversational AI platform for seamless user interactions.',
    tags: ['Distribution Problem', 'AI', 'Conversational'],
    liveLink: 'https://trycharla.com',
    delay: 300
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
            href="#upcoming" 
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
            Explore Projects
          </motion.a>
        </section>

        {/* Upcoming Section */}
        <section id="upcoming" style={{ paddingTop: '100px' }}>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="section-header"
          >
            <h2 className="section-title">
              Upcoming
            </h2>
            <div style={{
              height: '1px',
              flex: 1,
              background: 'linear-gradient(90deg, var(--surface-border) 0%, transparent 100%)'
            }} />
          </motion.div>

          <div className="projects-grid">
            {UPCOMING_PROJECTS.map((project, index) => (
              <ProjectCard 
                key={project.title}
                {...project}
                delay={index * 150}
              />
            ))}
          </div>
        </section>

        {/* Experimenting Section */}
        <section style={{ paddingTop: '80px' }}>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="section-header"
          >
            <h2 className="section-title">
              Experimenting
            </h2>
            <div style={{
              height: '1px',
              flex: 1,
              background: 'linear-gradient(90deg, var(--surface-border) 0%, transparent 100%)'
            }} />
          </motion.div>

          <div className="projects-grid">
            {EXPERIMENTING_PROJECTS.map((project, index) => (
              <ProjectCard 
                key={project.title}
                {...project}
                githubLink={project.githubLink}
                delay={index * 150}
              />
            ))}
          </div>
        </section>

        {/* Past Ventures Section */}
        <section style={{ paddingTop: '80px' }}>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="section-header"
          >
            <h2 className="section-title">
              Past Ventures
            </h2>
            <div style={{
              height: '1px',
              flex: 1,
              background: 'linear-gradient(90deg, var(--surface-border) 0%, transparent 100%)'
            }} />
          </motion.div>

          <div className="projects-grid">
            {PAST_VENTURES.map((project, index) => (
              <ProjectCard 
                key={project.title}
                {...project}
                delay={index * 150}
              />
            ))}
          </div>
        </section>

        {/* Failed Projects Section */}
        <section style={{ paddingTop: '80px', paddingBottom: '80px' }}>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="section-header"
          >
            <h2 className="section-title">
              Failed Projects
            </h2>
            <div style={{
              height: '1px',
              flex: 1,
              background: 'linear-gradient(90deg, var(--surface-border) 0%, transparent 100%)'
            }} />
          </motion.div>

          <div className="projects-grid">
            {PREVIOUS_PROJECTS.map((project, index) => (
              <ProjectCard 
                key={project.title}
                {...project}
                delay={index * 150}
              />
            ))}
          </div>
        </section>

        {/* Join the Lab Section */}
        <section id="join" style={{ paddingBottom: '160px', paddingTop: '40px' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '80px',
            alignItems: 'center'
          }}>
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <h2 className="section-title" style={{ marginBottom: '24px', fontSize: '3.5rem' }}>
                Stay in the Loop
              </h2>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '480px', fontSize: '1.25rem', lineHeight: 1.6, marginBottom: '32px' }}>
                Codewave Labs is a living entity. Be the first to witness new experiments, alpha launches, and technical deep-dives.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--accent-primary)', fontWeight: 600 }}>
                <span style={{ width: '8px', height: '8px', background: 'var(--accent-primary)', borderRadius: '50%', boxShadow: '0 0 10px var(--accent-primary)' }}></span>
                New experiments dropping monthly
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              style={{ 
                position: 'relative'
              }}
            >
              <div style={{
                position: 'absolute',
                top: '-20px', left: '-20px', right: '-20px', bottom: '-20px',
                background: 'radial-gradient(circle at center, rgba(34, 211, 238, 0.05) 0%, transparent 70%)',
                zIndex: -1
              }} />
              <div style={{ 
                background: 'rgba(255, 255, 255, 0.01)',
                border: '1px solid var(--surface-border)',
                borderRadius: '32px',
                overflow: 'hidden',
                minHeight: '480px',
                boxShadow: '0 40px 100px -20px rgba(0,0,0,0.5)',
                backdropFilter: 'blur(20px)'
              }}>
                <iframe 
                  src="https://tally.so/embed/dWQxzA?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1" 
                  loading="lazy" 
                  width="100%" 
                  height="480" 
                  frameBorder={0} 
                  marginHeight={0} 
                  marginWidth={0} 
                  title="Codewave Labs Waitlist"
                ></iframe>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
