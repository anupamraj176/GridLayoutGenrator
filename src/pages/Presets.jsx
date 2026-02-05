import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';

const PRESETS = [
  {
    id: 1,
    name: "Holy Grail",
    description: "Classic header, footer, sidebar layout",
    cols: 3,
    rows: 3,
    gap: 8,
    items: [
      { id: 1, rowStart: 1, colStart: 1, rowSpan: 1, colSpan: 3 }, // Header
      { id: 2, rowStart: 2, colStart: 1, rowSpan: 1, colSpan: 1 }, // Left sidebar
      { id: 3, rowStart: 2, colStart: 2, rowSpan: 1, colSpan: 1 }, // Main
      { id: 4, rowStart: 2, colStart: 3, rowSpan: 1, colSpan: 1 }, // Right sidebar
      { id: 5, rowStart: 3, colStart: 1, rowSpan: 1, colSpan: 3 }, // Footer
    ],
    color: "#6366f1"
  },
  {
    id: 2,
    name: "Dashboard",
    description: "Admin dashboard with cards",
    cols: 4,
    rows: 3,
    gap: 10,
    items: [
      { id: 1, rowStart: 1, colStart: 1, rowSpan: 1, colSpan: 1 },
      { id: 2, rowStart: 1, colStart: 2, rowSpan: 1, colSpan: 1 },
      { id: 3, rowStart: 1, colStart: 3, rowSpan: 1, colSpan: 1 },
      { id: 4, rowStart: 1, colStart: 4, rowSpan: 1, colSpan: 1 },
      { id: 5, rowStart: 2, colStart: 1, rowSpan: 2, colSpan: 2 },
      { id: 6, rowStart: 2, colStart: 3, rowSpan: 1, colSpan: 2 },
      { id: 7, rowStart: 3, colStart: 3, rowSpan: 1, colSpan: 2 },
    ],
    color: "#a855f7"
  },
  {
    id: 3,
    name: "Magazine",
    description: "Editorial style layout",
    cols: 4,
    rows: 4,
    gap: 6,
    items: [
      { id: 1, rowStart: 1, colStart: 1, rowSpan: 2, colSpan: 2 },
      { id: 2, rowStart: 1, colStart: 3, rowSpan: 1, colSpan: 2 },
      { id: 3, rowStart: 2, colStart: 3, rowSpan: 1, colSpan: 1 },
      { id: 4, rowStart: 2, colStart: 4, rowSpan: 1, colSpan: 1 },
      { id: 5, rowStart: 3, colStart: 1, rowSpan: 2, colSpan: 1 },
      { id: 6, rowStart: 3, colStart: 2, rowSpan: 1, colSpan: 2 },
      { id: 7, rowStart: 3, colStart: 4, rowSpan: 2, colSpan: 1 },
      { id: 8, rowStart: 4, colStart: 2, rowSpan: 1, colSpan: 2 },
    ],
    color: "#3b82f6"
  },
  {
    id: 4,
    name: "Gallery",
    description: "Photo gallery masonry style",
    cols: 3,
    rows: 4,
    gap: 8,
    items: [
      { id: 1, rowStart: 1, colStart: 1, rowSpan: 2, colSpan: 1 },
      { id: 2, rowStart: 1, colStart: 2, rowSpan: 1, colSpan: 2 },
      { id: 3, rowStart: 2, colStart: 2, rowSpan: 2, colSpan: 1 },
      { id: 4, rowStart: 2, colStart: 3, rowSpan: 1, colSpan: 1 },
      { id: 5, rowStart: 3, colStart: 1, rowSpan: 2, colSpan: 1 },
      { id: 6, rowStart: 3, colStart: 3, rowSpan: 2, colSpan: 1 },
      { id: 7, rowStart: 4, colStart: 2, rowSpan: 1, colSpan: 1 },
    ],
    color: "#10b981"
  },
  {
    id: 5,
    name: "Portfolio",
    description: "Creative portfolio showcase",
    cols: 3,
    rows: 3,
    gap: 12,
    items: [
      { id: 1, rowStart: 1, colStart: 1, rowSpan: 1, colSpan: 2 },
      { id: 2, rowStart: 1, colStart: 3, rowSpan: 2, colSpan: 1 },
      { id: 3, rowStart: 2, colStart: 1, rowSpan: 2, colSpan: 1 },
      { id: 4, rowStart: 2, colStart: 2, rowSpan: 1, colSpan: 1 },
      { id: 5, rowStart: 3, colStart: 2, rowSpan: 1, colSpan: 2 },
    ],
    color: "#f59e0b"
  },
  {
    id: 6,
    name: "Landing Page",
    description: "Modern landing page sections",
    cols: 2,
    rows: 4,
    gap: 10,
    items: [
      { id: 1, rowStart: 1, colStart: 1, rowSpan: 1, colSpan: 2 },
      { id: 2, rowStart: 2, colStart: 1, rowSpan: 1, colSpan: 1 },
      { id: 3, rowStart: 2, colStart: 2, rowSpan: 1, colSpan: 1 },
      { id: 4, rowStart: 3, colStart: 1, rowSpan: 1, colSpan: 2 },
      { id: 5, rowStart: 4, colStart: 1, rowSpan: 1, colSpan: 2 },
    ],
    color: "#ec4899"
  },
];

const Presets = () => {
  const [hoveredPreset, setHoveredPreset] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isSmallMobile, setIsSmallMobile] = useState(window.innerWidth < 480);
  const glowRef = useRef(null);
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const cardsRef = useRef([]);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsSmallMobile(window.innerWidth < 480);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // GSAP entrance animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(titleRef.current,
        { y: -30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.1 }
      );
      gsap.fromTo(cardsRef.current,
        { y: 40, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.1, ease: "back.out(1.2)", delay: 0.3 }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    let mouseX = 0, mouseY = 0, currentX = 0, currentY = 0;
    const moveGlow = (e) => { mouseX = e.clientX; mouseY = e.clientY; };
    const updateGlow = () => {
      currentX += (mouseX - currentX) * 0.1;
      currentY += (mouseY - currentY) * 0.1;
      if (glowRef.current) {
        glowRef.current.style.left = `${currentX}px`;
        glowRef.current.style.top = `${currentY}px`;
      }
      animationFrameRef.current = requestAnimationFrame(updateGlow);
    };
    window.addEventListener('mousemove', moveGlow);
    animationFrameRef.current = requestAnimationFrame(updateGlow);
    return () => {
      window.removeEventListener('mousemove', moveGlow);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const generateCSS = (preset) => {
    let css = `.parent {\n  display: grid;\n  grid-template-columns: repeat(${preset.cols}, 1fr);\n  grid-template-rows: repeat(${preset.rows}, 1fr);\n  gap: ${preset.gap}px;\n}\n`;
    preset.items.forEach((item, i) => {
      css += `\n.div${i + 1} { grid-area: ${item.rowStart} / ${item.colStart} / ${item.rowStart + item.rowSpan} / ${item.colStart + item.colSpan}; }`;
    });
    return css;
  };

  const copyToClipboard = (preset) => {
    const css = generateCSS(preset);
    navigator.clipboard.writeText(css);
    setCopiedId(preset.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div ref={containerRef} style={{ background: '#0a0a0a', minHeight: '100vh', color: 'white', paddingTop: isMobile ? '85px' : '100px' }}>
      <div ref={glowRef} style={{
        position: 'fixed', top: 0, left: 0, width: isMobile ? '300px' : '400px', height: isMobile ? '300px' : '400px',
        transform: 'translate(-50%, -50%)',
        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, transparent 70%)',
        borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0
      }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: isMobile ? '1rem' : '2rem', position: 'relative', zIndex: 1 }}>
        <div ref={titleRef} style={{ textAlign: 'center', marginBottom: isMobile ? '2rem' : '3rem' }}>
          <h1 style={{
            fontSize: isSmallMobile ? '1.75rem' : isMobile ? '2rem' : '2.5rem', 
            fontWeight: 'bold', 
            marginBottom: '1rem',
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)',
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.02em'
          }}>
            Grid Presets
          </h1>
          <p style={{ color: '#9ca3af', fontSize: isMobile ? '0.95rem' : '1.1rem', maxWidth: '500px', margin: '0 auto' }}>
            Start with a pre-made layout and customize it to your needs
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: isSmallMobile ? '1fr' : isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: isMobile ? '1rem' : '1.5rem'
        }}>
          {PRESETS.map((preset, index) => (
            <div
              key={preset.id}
              ref={(el) => (cardsRef.current[index] = el)}
              onMouseEnter={() => setHoveredPreset(preset.id)}
              onMouseLeave={() => setHoveredPreset(null)}
              style={{
                background: 'rgba(15, 15, 15, 0.8)',
                backdropFilter: 'blur(15px)',
                border: `1px solid ${hoveredPreset === preset.id ? preset.color : 'rgba(255, 255, 255, 0.08)'}`,
                borderRadius: isMobile ? '0.875rem' : '1rem',
                padding: isMobile ? '1rem' : '1.5rem',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: hoveredPreset === preset.id ? 'translateY(-6px) scale(1.01)' : 'none',
                boxShadow: hoveredPreset === preset.id 
                  ? `0 20px 50px ${preset.color}25, 0 0 0 1px ${preset.color}30` 
                  : '0 4px 20px rgba(0,0,0,0.2)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Gradient accent line at top */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '2px',
                background: `linear-gradient(90deg, transparent, ${preset.color}, transparent)`,
                opacity: hoveredPreset === preset.id ? 0.8 : 0.3,
                transition: 'opacity 0.3s ease'
              }} />
              {/* Mini Grid Preview */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${preset.cols}, 1fr)`,
                gridTemplateRows: `repeat(${preset.rows}, 1fr)`,
                gap: isSmallMobile ? '2px' : '4px',
                aspectRatio: '4/3',
                marginBottom: isMobile ? '0.75rem' : '1rem',
                padding: isSmallMobile ? '0.5rem' : '0.75rem',
                background: 'rgba(0, 0, 0, 0.4)',
                borderRadius: '0.5rem',
                border: '1px solid rgba(255,255,255,0.05)'
              }}>
                {preset.items.map((item, index) => (
                  <div
                    key={item.id}
                    style={{
                      gridColumn: `${item.colStart} / span ${item.colSpan}`,
                      gridRow: `${item.rowStart} / span ${item.rowSpan}`,
                      background: `linear-gradient(135deg, ${preset.color}45 0%, ${preset.color}25 100%)`,
                      border: `1px solid ${preset.color}70`,
                      borderRadius: isSmallMobile ? '3px' : '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: isSmallMobile ? '0.55rem' : '0.65rem',
                      color: preset.color,
                      fontWeight: '700',
                      boxShadow: `inset 0 1px 0 ${preset.color}20`,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {index + 1}
                  </div>
                ))}
              </div>

              <h3 style={{ 
                fontSize: isMobile ? '1rem' : '1.1rem', 
                fontWeight: '700', 
                marginBottom: '0.25rem', 
                color: preset.color,
                letterSpacing: '-0.01em'
              }}>
                {preset.name}
              </h3>
              <p style={{ 
                fontSize: isMobile ? '0.8rem' : '0.85rem', 
                color: '#9ca3af', 
                marginBottom: isMobile ? '0.75rem' : '1rem',
                lineHeight: '1.5'
              }}>
                {preset.description}
              </p>

              <div style={{ display: 'flex', gap: isSmallMobile ? '0.5rem' : '0.75rem' }}>
                <button
                  onClick={() => copyToClipboard(preset)}
                  style={{
                    flex: 1,
                    padding: isSmallMobile ? '0.4rem 0.75rem' : '0.5rem 1rem',
                    background: copiedId === preset.id ? 'rgba(16, 185, 129, 0.2)' : `${preset.color}20`,
                    border: `1px solid ${copiedId === preset.id ? '#10b981' : preset.color}60`,
                    borderRadius: '0.5rem',
                    color: copiedId === preset.id ? '#10b981' : preset.color,
                    cursor: 'pointer',
                    fontSize: isSmallMobile ? '0.7rem' : '0.8rem',
                    fontWeight: '700',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: copiedId === preset.id ? 'scale(1.02)' : 'scale(1)'
                  }}
                  onMouseEnter={(e) => {
                    if (copiedId !== preset.id) {
                      e.currentTarget.style.background = `${preset.color}35`;
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (copiedId !== preset.id) {
                      e.currentTarget.style.background = `${preset.color}20`;
                      e.currentTarget.style.transform = 'scale(1)';
                    }
                  }}
                >
                  {copiedId === preset.id ? '✓ Copied!' : 'Copy CSS'}
                </button>
                <Link
                  to="/grid"
                  state={{ preset }}
                  style={{
                    flex: 1,
                    padding: isSmallMobile ? '0.4rem 0.75rem' : '0.5rem 1rem',
                    background: `linear-gradient(135deg, ${preset.color} 0%, ${preset.color}cc 100%)`,
                    border: 'none',
                    borderRadius: '0.5rem',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: isSmallMobile ? '0.7rem' : '0.8rem',
                    fontWeight: '700',
                    textAlign: 'center',
                    textDecoration: 'none',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: `0 4px 15px ${preset.color}40`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = `0 8px 25px ${preset.color}50`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = `0 4px 15px ${preset.color}40`;
                  }}
                >
                  Use Template
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Presets;
