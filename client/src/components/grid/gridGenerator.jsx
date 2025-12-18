import React, { useState, useEffect, useRef } from 'react';

const GridGenerator = () => {
  const [rows, setRows] = useState(5);
  const [cols, setCols] = useState(5);
  const [rowGap, setRowGap] = useState(10);
  const [colGap, setColGap] = useState(10);
  const [items, setItems] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [showCopied, setShowCopied] = useState(null);
  const glowRef = useRef(null);
  const containerRef = useRef(null);

  const totalCells = rows * cols;
  const selectedItem = items.find(i => i.id === selectedItemId);

  useEffect(() => {
    let mouseX = 0, mouseY = 0;
    let currentX = 0, currentY = 0;
    
    const moveGlow = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    
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

  const handleCellClick = (index) => {
    const existingItem = items.find(i => i.id === index);

    if (existingItem) {
      setSelectedItemId(index);
    } else {
      const newItem = {
        id: index,
        colStart: 'auto',
        colEnd: 'span 1',
        rowStart: 'auto',
        rowEnd: 'span 1'
      };
      setItems([...items, newItem]);
      setSelectedItemId(index);
    }
  };

  const removeSelectedItem = () => {
    if (selectedItemId !== null) {
      setItems(items.filter(i => i.id !== selectedItemId));
      setSelectedItemId(null);
    }
  };

  const updateSelectedItem = (field, value) => {
    setItems(items.map(item => 
      item.id === selectedItemId ? { ...item, [field]: value } : item
    ));
  };

  const generateCode = () => {
    const html = `<div class="parent">\n${items.map((item, i) => `  <div class="div${i + 1}">${i + 1}</div>`).join('\n')}\n</div>`;

    let css = `.parent {
  display: grid;
  grid-template-columns: repeat(${cols}, 1fr);
  grid-template-rows: repeat(${rows}, 1fr);
  grid-column-gap: ${colGap}px;
  grid-row-gap: ${rowGap}px;
}\n\n`;

    items.forEach((item, i) => {
      css += `.div${i + 1} {
  grid-column: ${item.colStart} / ${item.colEnd};
  grid-row: ${item.rowStart} / ${item.rowEnd};
}\n`;
    });

    return { html, css };
  };

  const { html, css } = generateCode();

  const reset = () => {
    setItems([]);
    setSelectedItemId(null);
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setShowCopied(type);
    setTimeout(() => setShowCopied(null), 2000);
  };

  const magnetic = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    e.currentTarget.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px) scale(1.02)`;
  };

  const resetMagnetic = (e) => {
    e.currentTarget.style.transform = 'translate(0, 0) scale(1)';
  };

  return (
    <div ref={containerRef} style={{ background: '#0a0a0a', minHeight: '100vh', color: 'white', position: 'relative', overflow: 'hidden' }}>
      
      {/* Cursor Glow */}
      <div
        ref={glowRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '500px',
          height: '500px',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(80px)',
          pointerEvents: 'none',
          zIndex: 50,
          mixBlendMode: 'screen'
        }}
      />

      {/* Background Effects */}
      <div style={{
        position: 'fixed',
        top: '20%',
        left: '10%',
        width: '800px',
        height: '800px',
        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(100px)',
        animation: 'pulse 8s ease-in-out infinite',
        zIndex: 0
      }} />

      <div style={{
        position: 'fixed',
        top: '60%',
        right: '10%',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(100px)',
        animation: 'pulse 10s ease-in-out infinite reverse',
        zIndex: 0
      }} />

      <div style={{ display: 'flex', minHeight: '100vh', position: 'relative', zIndex: 1 }}>
        
        {/* Main Preview Area */}
        <div style={{ flex: 1, padding: '3rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          
          {/* Header */}
          <div style={{ marginBottom: '3rem', textAlign: 'center', width: '100%', maxWidth: '800px' }}>
            <h1 style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 'bold',
              letterSpacing: '-0.03em',
              marginBottom: '1rem',
              background: 'linear-gradient(135deg, #ffffff 0%, #9ca3af 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              CSS Grid Generator
            </h1>
            <p style={{ color: '#9ca3af', fontSize: '1.125rem' }}>
              Click cells to create boxes, adjust grid settings in the sidebar
            </p>
          </div>
          
          {/* The Grid */}
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${cols}, 1fr)`,
              gridTemplateRows: `repeat(${rows}, 1fr)`,
              columnGap: `${colGap}px`,
              rowGap: `${rowGap}px`,
              width: '100%',
              maxWidth: '700px',
              aspectRatio: '1/1',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              borderRadius: '1.5rem',
              padding: '1.5rem',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), inset 0 0 60px rgba(99, 102, 241, 0.05)',
              position: 'relative'
            }}
          >
            {Array.from({ length: totalCells }).map((_, index) => {
              const item = items.find(i => i.id === index);
              const isSelected = selectedItemId === index;

              return (
                <div
                  key={index}
                  onClick={() => handleCellClick(index)}
                  style={{
                    position: 'relative',
                    borderRadius: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    ...(item ? {
                      background: isSelected 
                        ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
                        : 'linear-gradient(135deg, rgba(99, 102, 241, 0.4) 0%, rgba(139, 92, 246, 0.4) 100%)',
                      border: isSelected 
                        ? '2px solid #6366f1'
                        : '1px solid rgba(99, 102, 241, 0.3)',
                      color: 'white',
                      boxShadow: isSelected 
                        ? '0 0 30px rgba(99, 102, 241, 0.6), 0 10px 30px rgba(0, 0, 0, 0.4)'
                        : '0 5px 20px rgba(0, 0, 0, 0.3)',
                      gridColumn: `${item.colStart} / ${item.colEnd}`,
                      gridRow: `${item.rowStart} / ${item.rowEnd}`,
                    } : {
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px dashed rgba(255, 255, 255, 0.15)',
                      color: '#6b7280'
                    })
                  }}
                  onMouseEnter={(e) => {
                    if (!item) {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                      e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.4)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!item) {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                    }
                  }}
                >
                  {item ? items.indexOf(item) + 1 : '+'}
                </div>
              );
            })}
          </div>

          {/* Code Preview */}
          <div style={{ width: '100%', maxWidth: '1200px', marginTop: '4rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            
            {/* HTML */}
            <div style={{
              background: 'rgba(0, 0, 0, 0.5)',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              borderRadius: '1rem',
              padding: '1.5rem',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(99, 102, 241, 0.2)' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.1em' }}>HTML</span>
                <button 
                  onClick={() => copyToClipboard(html, 'html')}
                  onMouseMove={magnetic}
                  onMouseLeave={resetMagnetic}
                  style={{
                    fontSize: '0.75rem',
                    background: 'rgba(99, 102, 241, 0.1)',
                    border: '1px solid rgba(99, 102, 241, 0.3)',
                    color: '#6366f1',
                    padding: '0.375rem 0.75rem',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    fontWeight: '600'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(99, 102, 241, 0.2)';
                    e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.5)';
                  }}
                >
                  {showCopied === 'html' ? '✓ Copied!' : 'Copy'}
                </button>
              </div>
              <pre style={{ 
                fontSize: '0.8125rem', 
                fontFamily: 'monospace', 
                overflow: 'auto', 
                maxHeight: '200px',
                color: '#d1d5db',
                lineHeight: '1.6'
              }}>{html}</pre>
            </div>

            {/* CSS */}
            <div style={{
              background: 'rgba(0, 0, 0, 0.5)',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              borderRadius: '1rem',
              padding: '1.5rem',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(139, 92, 246, 0.2)' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#8b5cf6', textTransform: 'uppercase', letterSpacing: '0.1em' }}>CSS</span>
                <button 
                  onClick={() => copyToClipboard(css, 'css')}
                  onMouseMove={magnetic}
                  onMouseLeave={resetMagnetic}
                  style={{
                    fontSize: '0.75rem',
                    background: 'rgba(139, 92, 246, 0.1)',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    color: '#8b5cf6',
                    padding: '0.375rem 0.75rem',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    fontWeight: '600'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(139, 92, 246, 0.2)';
                    e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.5)';
                  }}
                >
                  {showCopied === 'css' ? '✓ Copied!' : 'Copy'}
                </button>
              </div>
              <pre style={{ 
                fontSize: '0.8125rem', 
                fontFamily: 'monospace', 
                overflow: 'auto', 
                maxHeight: '200px',
                color: '#d1d5db',
                lineHeight: '1.6'
              }}>{css}</pre>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{
          width: '380px',
          background: 'rgba(0, 0, 0, 0.6)',
          borderLeft: '1px solid rgba(99, 102, 241, 0.2)',
          backdropFilter: 'blur(20px)',
          overflowY: 'auto',
          padding: '2.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '2.5rem',
          boxShadow: '-20px 0 60px rgba(0, 0, 0, 0.5)'
        }}>
          
          {/* Global Settings */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white' }}>Grid Container</h2>
              <button 
                onClick={reset}
                onMouseMove={magnetic}
                onMouseLeave={resetMagnetic}
                style={{
                  fontSize: '0.75rem',
                  color: '#ef4444',
                  fontWeight: '600',
                  cursor: 'pointer',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  padding: '0.375rem 0.75rem',
                  borderRadius: '0.5rem',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                  e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.5)';
                }}
              >
                Reset All
              </button>
            </div>
            
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.5rem' }}>
                Rows ({rows})
              </label>
              <input 
                type="range" 
                min="1" 
                max="12" 
                value={rows} 
                onChange={(e) => setRows(Number(e.target.value))} 
                style={{
                  width: '100%',
                  accentColor: '#6366f1',
                  height: '6px',
                  borderRadius: '9999px'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.5rem' }}>
                Columns ({cols})
              </label>
              <input 
                type="range" 
                min="1" 
                max="12" 
                value={cols} 
                onChange={(e) => setCols(Number(e.target.value))} 
                style={{
                  width: '100%',
                  accentColor: '#6366f1',
                  height: '6px',
                  borderRadius: '9999px'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.5rem' }}>
                Row Gap ({rowGap}px)
              </label>
              <input 
                type="range" 
                min="0" 
                max="50" 
                value={rowGap} 
                onChange={(e) => setRowGap(Number(e.target.value))} 
                style={{
                  width: '100%',
                  accentColor: '#8b5cf6',
                  height: '6px',
                  borderRadius: '9999px'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.5rem' }}>
                Column Gap ({colGap}px)
              </label>
              <input 
                type="range" 
                min="0" 
                max="50" 
                value={colGap} 
                onChange={(e) => setColGap(Number(e.target.value))} 
                style={{
                  width: '100%',
                  accentColor: '#8b5cf6',
                  height: '6px',
                  borderRadius: '9999px'
                }}
              />
            </div>
          </div>

          <div style={{ height: '1px', background: 'rgba(99, 102, 241, 0.2)' }} />

          {/* Item Settings */}
          <div style={{
            transition: 'opacity 0.3s ease',
            opacity: selectedItem ? 1 : 0.5,
            pointerEvents: selectedItem ? 'auto' : 'none'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white' }}>
                {selectedItem ? `Box #${items.indexOf(selectedItem) + 1} Settings` : 'Select a Box'}
              </h2>
              {selectedItem && (
                <button 
                  onClick={removeSelectedItem}
                  onMouseMove={magnetic}
                  onMouseLeave={resetMagnetic}
                  style={{
                    fontSize: '0.75rem',
                    background: 'rgba(239, 68, 68, 0.1)',
                    color: '#ef4444',
                    padding: '0.375rem 0.75rem',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    fontWeight: '600',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                    e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.5)';
                  }}
                >
                  Delete
                </button>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Column Controls */}
              <div>
                <p style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#6366f1', textTransform: 'uppercase', marginBottom: '1rem', letterSpacing: '0.05em' }}>
                  Grid Column
                </p>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.5rem' }}>Start</label>
                  <input 
                    type="text" 
                    value={selectedItem?.colStart || ''} 
                    onChange={(e) => updateSelectedItem('colStart', e.target.value)}
                    placeholder="e.g. 1 or auto"
                    style={{
                      width: '100%',
                      border: '1px solid rgba(99, 102, 241, 0.3)',
                      borderRadius: '0.5rem',
                      padding: '0.625rem',
                      fontSize: '0.875rem',
                      background: 'rgba(0, 0, 0, 0.5)',
                      color: 'white',
                      outline: 'none',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#6366f1';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.3)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.5rem' }}>End / Span</label>
                  <input 
                    type="text" 
                    value={selectedItem?.colEnd || ''} 
                    onChange={(e) => updateSelectedItem('colEnd', e.target.value)}
                    placeholder="e.g. span 2"
                    style={{
                      width: '100%',
                      border: '1px solid rgba(99, 102, 241, 0.3)',
                      borderRadius: '0.5rem',
                      padding: '0.625rem',
                      fontSize: '0.875rem',
                      background: 'rgba(0, 0, 0, 0.5)',
                      color: 'white',
                      outline: 'none',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#6366f1';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.3)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </div>

              {/* Row Controls */}
              <div>
                <p style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#8b5cf6', textTransform: 'uppercase', marginBottom: '1rem', letterSpacing: '0.05em' }}>
                  Grid Row
                </p>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.5rem' }}>Start</label>
                  <input 
                    type="text" 
                    value={selectedItem?.rowStart || ''} 
                    onChange={(e) => updateSelectedItem('rowStart', e.target.value)}
                    placeholder="e.g. 1 or auto"
                    style={{
                      width: '100%',
                      border: '1px solid rgba(139, 92, 246, 0.3)',
                      borderRadius: '0.5rem',
                      padding: '0.625rem',
                      fontSize: '0.875rem',
                      background: 'rgba(0, 0, 0, 0.5)',
                      color: 'white',
                      outline: 'none',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#8b5cf6';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.3)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.5rem' }}>End / Span</label>
                  <input 
                    type="text" 
                    value={selectedItem?.rowEnd || ''} 
                    onChange={(e) => updateSelectedItem('rowEnd', e.target.value)}
                    placeholder="e.g. span 2"
                    style={{
                      width: '100%',
                      border: '1px solid rgba(139, 92, 246, 0.3)',
                      borderRadius: '0.5rem',
                      padding: '0.625rem',
                      fontSize: '0.875rem',
                      background: 'rgba(0, 0, 0, 0.5)',
                      color: 'white',
                      outline: 'none',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#8b5cf6';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.3)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </div>
            </div>
            
            <div style={{
              marginTop: '1.5rem',
              background: 'rgba(99, 102, 241, 0.1)',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              padding: '1rem',
              borderRadius: '0.75rem',
              fontSize: '0.8125rem',
              color: '#a5b4fc',
              lineHeight: '1.6'
            }}>
              <p><strong style={{ color: '#6366f1' }}>Tip:</strong> Use "span 2" to make a box take upcomplete this codeHere is the completion of the code, continuing exactly where it left off in the "Tip" section and closing all the necessary divs and the component itself.```jsx
              2 slots, or numbers (e.g., "1 / 3") to define start/end lines.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default GridGenerator;