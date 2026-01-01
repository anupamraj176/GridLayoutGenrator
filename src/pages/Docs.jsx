import React, { useRef, useEffect, useState } from 'react';

const SHORTCUTS = [
  { key: 'R', description: 'Reset grid to empty state', category: 'Grid' },
  { key: '↑/↓', description: 'Increase/Decrease rows', category: 'Grid' },
  { key: '←/→', description: 'Increase/Decrease columns', category: 'Grid' },
  { key: 'C', description: 'Copy CSS code', category: 'Export' },
  { key: 'H', description: 'Copy HTML code', category: 'Export' },
  { key: '?', description: 'Show keyboard shortcuts', category: 'General' },
];

const FEATURES = [
  {
    icon: '🎨',
    title: 'Multiple Themes',
    description: 'Choose from 4 unique visual themes: Default, Cyber, Fluid, and Classic'
  },
  {
    icon: '📐',
    title: 'Drag to Resize',
    description: 'Click and drag the corner handle to resize grid items instantly'
  },
  {
    icon: '📋',
    title: 'One-Click Copy',
    description: 'Export clean, production-ready HTML and CSS with a single click'
  },
  {
    icon: '🎯',
    title: 'Grid Presets',
    description: 'Start with pre-made layouts like Holy Grail, Dashboard, or Gallery'
  },
  {
    icon: '⌨️',
    title: 'Keyboard Shortcuts',
    description: 'Speed up your workflow with intuitive keyboard shortcuts'
  },
  {
    icon: '📱',
    title: 'Responsive Preview',
    description: 'Preview how your grid will look on different screen sizes'
  },
];

const TIPS = [
  "Click any empty cell to add a new grid item",
  "Drag the bottom-right corner handle to resize items",
  "Use the × button to delete individual items",
  "Adjust columns, rows, and gap from the controls",
  "Try different themes for varied visual styles",
  "Copy code directly to use in your projects",
  "Use presets as starting points for common layouts",
];

const Docs = () => {
  const glowRef = useRef(null);
  const [activeTab, setActiveTab] = useState('features');
  const [tipIndex, setTipIndex] = useState(0);

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

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % TIPS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const tabs = [
    { id: 'features', label: 'Features', icon: '✨' },
    { id: 'shortcuts', label: 'Shortcuts', icon: '⌨️' },
    { id: 'guide', label: 'Quick Guide', icon: '📖' },
  ];

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', color: 'white', paddingTop: '100px' }}>
      <div ref={glowRef} style={{
        position: 'fixed', top: 0, left: 0, width: '400px', height: '400px',
        transform: 'translate(-50%, -50%)',
        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, transparent 70%)',
        borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0
      }} />

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{
            fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem',
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
          }}>
            Documentation
          </h1>
          <p style={{ color: '#9ca3af', fontSize: '1.1rem' }}>
            Learn how to use the Grid Layout Generator effectively
          </p>
        </div>

        {/* Rotating Tips */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          borderRadius: '1rem',
          padding: '1rem 1.5rem',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <span style={{ fontSize: '1.5rem' }}>💡</span>
          <p style={{ color: '#d1d5db', fontSize: '0.95rem', margin: 0 }}>
            <span style={{ color: '#6366f1', fontWeight: '600' }}>Tip: </span>
            {TIPS[tipIndex]}
          </p>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          marginBottom: '2rem',
          background: 'rgba(255, 255, 255, 0.03)',
          padding: '0.5rem',
          borderRadius: '0.75rem',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                background: activeTab === tab.id ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                border: activeTab === tab.id ? '1px solid rgba(99, 102, 241, 0.5)' : '1px solid transparent',
                borderRadius: '0.5rem',
                color: activeTab === tab.id ? '#6366f1' : '#9ca3af',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '600',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'features' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}>
            {FEATURES.map((feature, index) => (
              <div
                key={index}
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '1rem',
                  padding: '1.5rem',
                  transition: 'all 0.3s ease'
                }}
              >
                <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.75rem' }}>
                  {feature.icon}
                </span>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem', color: '#fff' }}>
                  {feature.title}
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#9ca3af', lineHeight: '1.5', margin: 0 }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'shortcuts' && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '1rem',
            overflow: 'hidden'
          }}>
            {Object.entries(
              SHORTCUTS.reduce((acc, shortcut) => {
                acc[shortcut.category] = acc[shortcut.category] || [];
                acc[shortcut.category].push(shortcut);
                return acc;
              }, {})
            ).map(([category, shortcuts], catIndex) => (
              <div key={category}>
                <div style={{
                  padding: '1rem 1.5rem',
                  background: 'rgba(99, 102, 241, 0.1)',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  color: '#6366f1',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  {category}
                </div>
                {shortcuts.map((shortcut, index) => (
                  <div
                    key={index}
                    style={{
                      padding: '1rem 1.5rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
                    }}
                  >
                    <span style={{ color: '#d1d5db' }}>{shortcut.description}</span>
                    <kbd style={{
                      background: 'rgba(99, 102, 241, 0.2)',
                      border: '1px solid rgba(99, 102, 241, 0.4)',
                      borderRadius: '0.375rem',
                      padding: '0.25rem 0.75rem',
                      fontSize: '0.85rem',
                      fontFamily: 'monospace',
                      color: '#6366f1',
                      fontWeight: '600'
                    }}>
                      {shortcut.key}
                    </kbd>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'guide' && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '1rem',
            padding: '2rem'
          }}>
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#6366f1' }}>
                Getting Started
              </h3>
              <ol style={{ color: '#d1d5db', lineHeight: '1.8', paddingLeft: '1.5rem', margin: 0 }}>
                <li style={{ marginBottom: '0.5rem' }}>Choose a grid generator theme from the navigation menu</li>
                <li style={{ marginBottom: '0.5rem' }}>Set your desired number of columns and rows using the controls</li>
                <li style={{ marginBottom: '0.5rem' }}>Click on any empty cell to create a new grid item</li>
                <li style={{ marginBottom: '0.5rem' }}>Drag the resize handle (bottom-right corner) to span multiple cells</li>
                <li>Copy the generated HTML and CSS code for use in your project</li>
              </ol>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#a855f7' }}>
                Using Presets
              </h3>
              <p style={{ color: '#d1d5db', lineHeight: '1.6' }}>
                Visit the Presets page to browse pre-made grid layouts. You can copy the CSS directly or 
                click "Use Template" to open the layout in the grid editor for further customization.
              </p>
            </div>

            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#10b981' }}>
                Best Practices
              </h3>
              <ul style={{ color: '#d1d5db', lineHeight: '1.8', paddingLeft: '1.5rem', margin: 0 }}>
                <li style={{ marginBottom: '0.5rem' }}>Start with fewer columns/rows and add more as needed</li>
                <li style={{ marginBottom: '0.5rem' }}>Use consistent gap values for cleaner layouts</li>
                <li style={{ marginBottom: '0.5rem' }}>Test your generated code in a browser before deployment</li>
                <li>Consider responsive breakpoints for mobile devices</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Docs;
