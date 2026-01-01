import React, { useState, useEffect, useRef } from 'react';

const GridGenerator = () => {
  const [rows, setRows] = useState(5);
  const [cols, setCols] = useState(5);
  const [gap, setGap] = useState(8);
  const [items, setItems] = useState([]);
  const [nextId, setNextId] = useState(1);
  const [showCopied, setShowCopied] = useState(null);
  const [resizing, setResizing] = useState(null);
  const gridRef = useRef(null);
  const glowRef = useRef(null);

  // Dark theme matching the site
  const THEME = {
    bg: '#0a0a0a',
    accent: '#6366f1',
    accentGlow: 'rgba(99, 102, 241, 0.4)',
    cellBg: 'rgba(99, 102, 241, 0.1)',
    cellHover: 'rgba(99, 102, 241, 0.2)',
    itemBg: 'linear-gradient(135deg, rgba(99, 102, 241, 0.3) 0%, rgba(139, 92, 246, 0.3) 100%)',
    itemBorder: 'rgba(99, 102, 241, 0.5)',
    panelBg: 'rgba(255, 255, 255, 0.03)',
    text: '#ffffff',
    textMuted: '#9ca3af'
  };

  const getOccupiedCells = () => {
    const occupied = new Set();
    items.forEach(item => {
      for (let r = item.rowStart; r < item.rowStart + item.rowSpan; r++) {
        for (let c = item.colStart; c < item.colStart + item.colSpan; c++) {
          occupied.add(`${r}-${c}`);
        }
      }
    });
    return occupied;
  };

  const getCellFromPosition = (clientX, clientY) => {
    if (!gridRef.current) return null;
    const rect = gridRef.current.getBoundingClientRect();
    const cellWidth = rect.width / cols;
    const cellHeight = rect.height / rows;
    const col = Math.floor((clientX - rect.left) / cellWidth) + 1;
    const row = Math.floor((clientY - rect.top) / cellHeight) + 1;
    return { row: Math.max(1, Math.min(row, rows)), col: Math.max(1, Math.min(col, cols)) };
  };

  const handleCellClick = (row, col) => {
    const occupied = getOccupiedCells();
    if (occupied.has(`${row}-${col}`)) return;

    const newItem = {
      id: nextId,
      rowStart: row,
      colStart: col,
      rowSpan: 1,
      colSpan: 1
    };
    setItems([...items, newItem]);
    setNextId(nextId + 1);
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    setItems(items.filter(item => item.id !== id));
  };

  const handleResizeStart = (id, e) => {
    e.stopPropagation();
    e.preventDefault();
    const item = items.find(i => i.id === id);
    if (!item) return;
    setResizing({ id, item: { ...item } });
  };

  useEffect(() => {
    if (!resizing) return;

    const handleMouseMove = (e) => {
      const cell = getCellFromPosition(e.clientX, e.clientY);
      if (!cell) return;

      const item = resizing.item;
      const newColSpan = Math.max(1, cell.col - item.colStart + 1);
      const newRowSpan = Math.max(1, cell.row - item.rowStart + 1);

      const canResize = () => {
        for (let r = item.rowStart; r < item.rowStart + newRowSpan; r++) {
          for (let c = item.colStart; c < item.colStart + newColSpan; c++) {
            if (r > rows || c > cols) return false;
            const overlapping = items.find(i => 
              i.id !== resizing.id &&
              r >= i.rowStart && r < i.rowStart + i.rowSpan &&
              c >= i.colStart && c < i.colStart + i.colSpan
            );
            if (overlapping) return false;
          }
        }
        return true;
      };

      if (canResize()) {
        setItems(items.map(i => 
          i.id === resizing.id 
            ? { ...i, colSpan: newColSpan, rowSpan: newRowSpan }
            : i
        ));
      }
    };

    const handleMouseUp = () => setResizing(null);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [resizing, items, rows, cols]);

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

  const generateCode = () => {
    const html = `<div class="parent">\n${items.map((item, i) => `    <div class="div${i + 1}">${i + 1}</div>`).join('\n')}\n</div>`;
    let css = `.parent {\n  display: grid;\n  grid-template-columns: repeat(${cols}, 1fr);\n  grid-template-rows: repeat(${rows}, 1fr);\n  gap: ${gap}px;\n}\n`;
    items.forEach((item, i) => {
      css += `\n.div${i + 1} { grid-area: ${item.rowStart} / ${item.colStart} / ${item.rowStart + item.rowSpan} / ${item.colStart + item.colSpan}; }`;
    });
    return { html, css };
  };

  const { html, css } = generateCode();
  const occupied = getOccupiedCells();

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setShowCopied(type);
    setTimeout(() => setShowCopied(null), 2000);
  };

  return (
    <div style={{ 
      background: THEME.bg, 
      minHeight: '100vh', 
      color: THEME.text,
      paddingTop: '100px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Cursor Glow */}
      <div
        ref={glowRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '400px',
          height: '400px',
          transform: 'translate(-50%, -50%)',
          background: `radial-gradient(circle, ${THEME.accentGlow} 0%, transparent 70%)`,
          borderRadius: '50%',
          filter: 'blur(80px)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      {/* Background blobs */}
      <div style={{
        position: 'fixed',
        top: '20%',
        left: '10%',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(100px)',
        zIndex: 0
      }} />
      <div style={{
        position: 'fixed',
        bottom: '10%',
        right: '10%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(139, 92, 246, 0.06) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(100px)',
        zIndex: 0
      }} />

      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '2rem',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 'bold',
            marginBottom: '1rem',
            background: `linear-gradient(135deg, #ffffff 0%, ${THEME.textMuted} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            CSS Grid Generator
          </h1>
          <p style={{ color: THEME.textMuted, fontSize: '1.125rem' }}>
            Click cells to create boxes, drag the corner to resize
          </p>
        </div>

        {/* Controls */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '1rem', 
          marginBottom: '2rem',
          flexWrap: 'wrap'
        }}>
          {[
            ['Columns', cols, setCols],
            ['Rows', rows, setRows],
            ['Gap', gap, setGap]
          ].map(([label, value, setter]) => (
            <div key={label} style={{
              background: THEME.panelBg,
              border: `1px solid ${THEME.itemBorder}`,
              padding: '0.75rem 1.5rem',
              borderRadius: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              backdropFilter: 'blur(10px)'
            }}>
              <span style={{ color: THEME.textMuted, fontSize: '0.875rem' }}>{label}</span>
              <input
                type="number"
                value={value}
                onChange={(e) => setter(Math.max(1, Math.min(12, parseInt(e.target.value) || 1)))}
                style={{
                  width: '50px',
                  background: 'rgba(99, 102, 241, 0.1)',
                  border: `1px solid ${THEME.itemBorder}`,
                  borderRadius: '0.5rem',
                  color: THEME.accent,
                  fontSize: '1rem',
                  textAlign: 'center',
                  outline: 'none',
                  fontWeight: '600',
                  padding: '0.25rem'
                }}
              />
            </div>
          ))}
        </div>

        {/* Grid */}
        <div
          ref={gridRef}
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gridTemplateRows: `repeat(${rows}, 1fr)`,
            gap: `${gap}px`,
            aspectRatio: '1',
            maxWidth: '700px',
            margin: '0 auto',
            background: THEME.panelBg,
            border: `1px solid ${THEME.itemBorder}`,
            borderRadius: '1.5rem',
            padding: '1.5rem',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
            userSelect: resizing ? 'none' : 'auto'
          }}
        >
          {/* Empty cells */}
          {Array.from({ length: rows * cols }).map((_, index) => {
            const row = Math.floor(index / cols) + 1;
            const col = (index % cols) + 1;
            const isOccupied = occupied.has(`${row}-${col}`);
            
            return (
              <div
                key={`cell-${index}`}
                onClick={() => !isOccupied && handleCellClick(row, col)}
                style={{
                  gridRow: row,
                  gridColumn: col,
                  background: isOccupied ? 'transparent' : THEME.cellBg,
                  borderRadius: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: isOccupied ? 'default' : 'pointer',
                  transition: 'all 0.2s ease',
                  color: 'rgba(99, 102, 241, 0.4)',
                  fontSize: '1.5rem',
                  fontWeight: '300',
                  border: isOccupied ? 'none' : '1px dashed rgba(99, 102, 241, 0.2)'
                }}
                onMouseEnter={(e) => {
                  if (!isOccupied) {
                    e.currentTarget.style.background = THEME.cellHover;
                    e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isOccupied) {
                    e.currentTarget.style.background = THEME.cellBg;
                    e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.2)';
                  }
                }}
              >
                {!isOccupied && '+'}
              </div>
            );
          })}

          {/* Items */}
          {items.map((item, index) => (
            <div
              key={item.id}
              style={{
                gridColumn: `${item.colStart} / span ${item.colSpan}`,
                gridRow: `${item.rowStart} / span ${item.rowSpan}`,
                background: THEME.itemBg,
                borderRadius: '0.75rem',
                border: `2px solid ${THEME.itemBorder}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
                fontWeight: '600',
                color: 'white',
                position: 'relative',
                boxShadow: `0 0 30px ${THEME.accentGlow}, 0 10px 30px rgba(0, 0, 0, 0.3)`,
                zIndex: 10
              }}
            >
              {index + 1}
              
              {/* Delete Button */}
              <button
                onClick={(e) => handleDelete(item.id, e)}
                style={{
                  position: 'absolute',
                  top: '6px',
                  right: '6px',
                  width: '22px',
                  height: '22px',
                  background: '#ef4444',
                  border: 'none',
                  borderRadius: '6px',
                  color: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  transition: 'all 0.2s ease',
                  zIndex: 20,
                  boxShadow: '0 2px 8px rgba(239, 68, 68, 0.4)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#dc2626';
                  e.currentTarget.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#ef4444';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                ×
              </button>

              {/* Resize Handle */}
              <div
                onMouseDown={(e) => handleResizeStart(item.id, e)}
                style={{
                  position: 'absolute',
                  bottom: '6px',
                  right: '6px',
                  width: '18px',
                  height: '18px',
                  cursor: 'nwse-resize',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'rgba(255, 255, 255, 0.6)',
                  zIndex: 20,
                  background: 'rgba(99, 102, 241, 0.3)',
                  borderRadius: '4px'
                }}
              >
                <svg width="10" height="10" viewBox="0 0 10 10">
                  <path d="M9 1L1 9M9 5L5 9M9 9L9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
          ))}
        </div>

        {/* Reset Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', maxWidth: '700px', margin: '1.5rem auto 0' }}>
          <button
            onClick={() => { setItems([]); setNextId(1); }}
            style={{
              padding: '0.625rem 1.5rem',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '0.5rem',
              color: '#ef4444',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '600',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
              e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
            }}
          >
            Reset All
          </button>
        </div>

        {/* Code Output */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
          gap: '2rem', 
          maxWidth: '1000px', 
          margin: '3rem auto 0' 
        }}>
          {/* HTML */}
          <div style={{
            background: THEME.panelBg,
            border: `1px solid ${THEME.itemBorder}`,
            borderRadius: '1rem',
            padding: '1.5rem',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem',
              paddingBottom: '0.75rem',
              borderBottom: `1px solid ${THEME.itemBorder}`
            }}>
              <span style={{ 
                fontSize: '0.75rem', 
                fontWeight: 'bold', 
                color: THEME.accent, 
                textTransform: 'uppercase', 
                letterSpacing: '0.1em' 
              }}>HTML</span>
              <button
                onClick={() => copyToClipboard(html, 'html')}
                style={{
                  padding: '0.5rem 1rem',
                  background: 'rgba(99, 102, 241, 0.1)',
                  border: `1px solid ${THEME.itemBorder}`,
                  borderRadius: '0.5rem',
                  color: THEME.accent,
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(99, 102, 241, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)';
                }}
              >
                {showCopied === 'html' ? '✓ Copied!' : 'Copy'}
              </button>
            </div>
            <pre style={{
              fontSize: '0.8125rem',
              fontFamily: "'Fira Code', 'Consolas', monospace",
              overflow: 'auto',
              maxHeight: '200px',
              color: '#d1d5db',
              lineHeight: '1.6',
              background: 'rgba(0, 0, 0, 0.3)',
              padding: '1rem',
              borderRadius: '0.5rem',
              margin: 0
            }}>{html}</pre>
          </div>

          {/* CSS */}
          <div style={{
            background: THEME.panelBg,
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '1rem',
            padding: '1.5rem',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem',
              paddingBottom: '0.75rem',
              borderBottom: '1px solid rgba(139, 92, 246, 0.3)'
            }}>
              <span style={{ 
                fontSize: '0.75rem', 
                fontWeight: 'bold', 
                color: '#8b5cf6', 
                textTransform: 'uppercase', 
                letterSpacing: '0.1em' 
              }}>CSS</span>
              <button
                onClick={() => copyToClipboard(css, 'css')}
                style={{
                  padding: '0.5rem 1rem',
                  background: 'rgba(139, 92, 246, 0.1)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  borderRadius: '0.5rem',
                  color: '#8b5cf6',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(139, 92, 246, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(139, 92, 246, 0.1)';
                }}
              >
                {showCopied === 'css' ? '✓ Copied!' : 'Copy'}
              </button>
            </div>
            <pre style={{
              fontSize: '0.8125rem',
              fontFamily: "'Fira Code', 'Consolas', monospace",
              overflow: 'auto',
              maxHeight: '200px',
              color: '#d1d5db',
              lineHeight: '1.6',
              background: 'rgba(0, 0, 0, 0.3)',
              padding: '1rem',
              borderRadius: '0.5rem',
              margin: 0
            }}>{css}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GridGenerator;
