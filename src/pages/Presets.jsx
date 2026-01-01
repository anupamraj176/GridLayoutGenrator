import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

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
  const glowRef = useRef(null);

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
      requestAnimationFrame(updateGlow);
    };
    window.addEventListener('mousemove', moveGlow);
    updateGlow();
    return () => window.removeEventListener('mousemove', moveGlow);
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
  };

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', color: 'white', paddingTop: '100px' }}>
      <div ref={glowRef} style={{
        position: 'fixed', top: 0, left: 0, width: '400px', height: '400px',
        transform: 'translate(-50%, -50%)',
        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, transparent 70%)',
        borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0
      }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{
            fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem',
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
          }}>
            Grid Presets
          </h1>
          <p style={{ color: '#9ca3af', fontSize: '1.1rem' }}>
            Start with a pre-made layout and customize it to your needs
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.5rem'
        }}>
          {PRESETS.map((preset) => (
            <div
              key={preset.id}
              onMouseEnter={() => setHoveredPreset(preset.id)}
              onMouseLeave={() => setHoveredPreset(null)}
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: `1px solid ${hoveredPreset === preset.id ? preset.color : 'rgba(255, 255, 255, 0.1)'}`,
                borderRadius: '1rem',
                padding: '1.5rem',
                transition: 'all 0.3s ease',
                transform: hoveredPreset === preset.id ? 'translateY(-4px)' : 'none',
                boxShadow: hoveredPreset === preset.id ? `0 20px 40px ${preset.color}20` : 'none'
              }}
            >
              {/* Mini Grid Preview */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${preset.cols}, 1fr)`,
                gridTemplateRows: `repeat(${preset.rows}, 1fr)`,
                gap: '4px',
                aspectRatio: '4/3',
                marginBottom: '1rem',
                padding: '0.75rem',
                background: 'rgba(0, 0, 0, 0.3)',
                borderRadius: '0.5rem'
              }}>
                {preset.items.map((item, index) => (
                  <div
                    key={item.id}
                    style={{
                      gridColumn: `${item.colStart} / span ${item.colSpan}`,
                      gridRow: `${item.rowStart} / span ${item.rowSpan}`,
                      background: `linear-gradient(135deg, ${preset.color}40 0%, ${preset.color}20 100%)`,
                      border: `1px solid ${preset.color}60`,
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.65rem',
                      color: preset.color,
                      fontWeight: '600'
                    }}
                  >
                    {index + 1}
                  </div>
                ))}
              </div>

              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.25rem', color: preset.color }}>
                {preset.name}
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#9ca3af', marginBottom: '1rem' }}>
                {preset.description}
              </p>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  onClick={() => copyToClipboard(preset)}
                  style={{
                    flex: 1,
                    padding: '0.5rem 1rem',
                    background: `${preset.color}20`,
                    border: `1px solid ${preset.color}50`,
                    borderRadius: '0.5rem',
                    color: preset.color,
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Copy CSS
                </button>
                <Link
                  to="/grid"
                  state={{ preset }}
                  style={{
                    flex: 1,
                    padding: '0.5rem 1rem',
                    background: preset.color,
                    border: 'none',
                    borderRadius: '0.5rem',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    textAlign: 'center',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease'
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
