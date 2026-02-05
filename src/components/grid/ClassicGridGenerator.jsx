import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { gsap } from 'gsap';
import Toast from '../ui/Toast';

const ClassicGridGenerator = () => {
  const [rows, setRows] = useState(5);
  const [cols, setCols] = useState(5);
  const [gap, setGap] = useState(8);
  const [items, setItems] = useState([]);
  const [nextId, setNextId] = useState(1);
  const [showCopied, setShowCopied] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [resizing, setResizing] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isSmallMobile, setIsSmallMobile] = useState(window.innerWidth < 480);
  const gridRef = useRef(null);
  const glowRef = useRef(null);
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const controlsRef = useRef(null);
  const codeOutputRef = useRef(null);
  const animationFrameRef = useRef(null);

  const THEME = {
    accent: "#10b981",
    accentGlow: "rgba(16, 185, 129, 0.4)",
    accentLight: "rgba(16, 185, 129, 0.15)",
    bg: "#0a0a0a",
    cellBg: "rgba(16, 185, 129, 0.12)",
    cellHover: "rgba(16, 185, 129, 0.25)",
    itemBg: "linear-gradient(135deg, rgba(16, 185, 129, 0.35) 0%, rgba(34, 197, 94, 0.35) 100%)",
    itemBorder: "rgba(16, 185, 129, 0.6)",
    cardBg: "rgba(15, 15, 15, 0.8)",
    glassBorder: "rgba(16, 185, 129, 0.2)"
  };

  const occupied = useMemo(() => {
    const occupiedSet = new Set();
    items.forEach(item => {
      for (let r = item.rowStart; r < item.rowStart + item.rowSpan; r++) {
        for (let c = item.colStart; c < item.colStart + item.colSpan; c++) {
          occupiedSet.add(`${r}-${c}`);
        }
      }
    });
    return occupiedSet;
  }, [items]);

  const getCellFromPosition = useCallback((clientX, clientY) => {
    if (!gridRef.current) return null;
    const rect = gridRef.current.getBoundingClientRect();
    const cellWidth = rect.width / cols;
    const cellHeight = rect.height / rows;
    const col = Math.floor((clientX - rect.left) / cellWidth) + 1;
    const row = Math.floor((clientY - rect.top) / cellHeight) + 1;
    return { row: Math.max(1, Math.min(row, rows)), col: Math.max(1, Math.min(col, cols)) };
  }, [cols, rows]);

  const handleCellClick = useCallback((row, col) => {
    if (occupied.has(`${row}-${col}`)) return;
    setItems(prevItems => [...prevItems, { id: nextId, rowStart: row, colStart: col, rowSpan: 1, colSpan: 1 }]);
    setNextId(prevId => prevId + 1);
  }, [occupied, nextId]);

  const handleDelete = useCallback((id, e) => {
    e.stopPropagation();
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  }, []);

  const handleResizeStart = useCallback((id, e) => {
    e.stopPropagation();
    e.preventDefault();
    const item = items.find(i => i.id === id);
    if (item) setResizing({ id, item: { ...item } });
  }, [items]);

  useEffect(() => {
    if (!resizing) return;
    const handleMouseMove = (e) => {
      const cell = getCellFromPosition(e.clientX, e.clientY);
      if (!cell) return;
      const item = resizing.item;
      const newColSpan = Math.max(1, cell.col - item.colStart + 1);
      const newRowSpan = Math.max(1, cell.row - item.rowStart + 1);
      
      // Early exit if bounds are exceeded
      if (item.rowStart + newRowSpan - 1 > rows || item.colStart + newColSpan - 1 > cols) return;
      
      // Check for overlaps
      let canResize = true;
      for (let r = item.rowStart; r < item.rowStart + newRowSpan && canResize; r++) {
        for (let c = item.colStart; c < item.colStart + newColSpan && canResize; c++) {
          const overlapping = items.find(i => 
            i.id !== resizing.id && 
            r >= i.rowStart && r < i.rowStart + i.rowSpan && 
            c >= i.colStart && c < i.colStart + i.colSpan
          );
          if (overlapping) canResize = false;
        }
      }
      
      if (canResize) {
        setItems(prevItems => prevItems.map(i => 
          i.id === resizing.id ? { ...i, colSpan: newColSpan, rowSpan: newRowSpan } : i
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
  }, [resizing, items, rows, cols, getCellFromPosition]);

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
      gsap.fromTo(controlsRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out", delay: 0.3 }
      );
      gsap.fromTo(gridRef.current,
        { scale: 0.95, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.7, ease: "back.out(1.2)", delay: 0.4 }
      );
      if (codeOutputRef.current) {
        gsap.fromTo(codeOutputRef.current.children,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.15, ease: "power2.out", delay: 0.6 }
        );
      }
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

  const { html, css } = useMemo(() => {
    const htmlCode = `<div class="parent">\n${items.map((_, i) => `    <div class="div${i + 1}">${i + 1}</div>`).join('\n')}\n</div>`;
    let cssCode = `.parent {\n  display: grid;\n  grid-template-columns: repeat(${cols}, 1fr);\n  grid-template-rows: repeat(${rows}, 1fr);\n  gap: ${gap}px;\n}\n`;
    items.forEach((item, i) => { 
      cssCode += `\n.div${i + 1} { grid-area: ${item.rowStart} / ${item.colStart} / ${item.rowStart + item.rowSpan} / ${item.colStart + item.colSpan}; }`; 
    });
    return { html: htmlCode, css: cssCode };
  }, [items, cols, rows, gap]);

  const copyToClipboard = useCallback((text, type) => {
    navigator.clipboard.writeText(text);
    setShowCopied(type);
    setToastMessage(`${type.toUpperCase()} copied to clipboard!`);
    setShowToast(true);
    setTimeout(() => setShowCopied(null), 2000);
  }, []);

  return (
    <div ref={containerRef} style={{ background: THEME.bg, minHeight: '100vh', color: 'white', paddingTop: isMobile ? '85px' : '100px' }}>
      <div ref={glowRef} style={{
        position: 'fixed', top: 0, left: 0, width: isMobile ? '300px' : '400px', height: isMobile ? '300px' : '400px',
        transform: 'translate(-50%, -50%)',
        background: `radial-gradient(circle, ${THEME.accentGlow} 0%, transparent 70%)`,
        borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0
      }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: isMobile ? '1rem' : '2rem', position: 'relative', zIndex: 1 }}>
        <h1 ref={titleRef} style={{
          textAlign: 'center', fontSize: isSmallMobile ? '1.75rem' : isMobile ? '2rem' : '2.5rem', fontWeight: 'bold', marginBottom: '2rem',
          background: `linear-gradient(135deg, ${THEME.accent} 0%, #22c55e 100%)`,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
        }}>
          Classic Grid Generator
        </h1>

        {/* Controls */}
        <div ref={controlsRef} style={{ display: 'flex', justifyContent: 'center', gap: isSmallMobile ? '0.5rem' : '0.75rem', marginBottom: '2rem', flexWrap: 'wrap', padding: '0 1rem' }}>
          {[['Cols', cols, setCols], ['Rows', rows, setRows], ['Gap', gap, setGap]].map(([label, value, setter]) => (
            <div key={label} style={{
              background: 'rgba(16, 185, 129, 0.1)', border: `1px solid ${THEME.itemBorder}`,
              padding: isMobile ? '0.5rem 1rem' : '0.75rem 1.5rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem'
            }}>
              <span style={{ color: '#9ca3af', fontSize: '0.875rem' }}>{label}</span>
              <input type="number" value={value}
                onChange={(e) => setter(Math.max(1, Math.min(12, parseInt(e.target.value) || 1)))}
                style={{ width: '50px', background: 'transparent', border: 'none', color: THEME.accent, fontSize: '1rem', textAlign: 'center', outline: 'none', fontWeight: '600' }}
              />
            </div>
          ))}
        </div>

        {/* Grid */}
        <div ref={gridRef} style={{
          display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)`,
          gap: `${gap}px`, aspectRatio: isMobile ? 'auto' : '1', height: isMobile ? `${Math.min(rows * 50, 350)}px` : 'auto', maxWidth: '700px', margin: '0 auto',
          background: 'rgba(16, 185, 129, 0.05)', border: `1px solid ${THEME.itemBorder}`,
          borderRadius: '1rem', padding: isSmallMobile ? '0.5rem' : isMobile ? '0.75rem' : '1rem', userSelect: resizing ? 'none' : 'auto'
        }}>
          {Array.from({ length: rows * cols }).map((_, index) => {
            const row = Math.floor(index / cols) + 1;
            const col = (index % cols) + 1;
            const isOccupied = occupied.has(`${row}-${col}`);
            return (
              <div key={`cell-${index}`} onClick={() => !isOccupied && handleCellClick(row, col)}
                style={{
                  gridRow: row, gridColumn: col, background: isOccupied ? 'transparent' : THEME.cellBg,
                  borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: isOccupied ? 'default' : 'pointer', transition: 'all 0.2s ease',
                  color: 'rgba(16, 185, 129, 0.5)', fontSize: '1.5rem', fontWeight: '300'
                }}
                onMouseEnter={(e) => { if (!isOccupied) e.currentTarget.style.background = THEME.cellHover; }}
                onMouseLeave={(e) => { if (!isOccupied) e.currentTarget.style.background = THEME.cellBg; }}
              >
                {!isOccupied && '+'}
              </div>
            );
          })}

          {items.map((item, index) => (
            <div key={item.id} style={{
              gridColumn: `${item.colStart} / span ${item.colSpan}`, gridRow: `${item.rowStart} / span ${item.rowSpan}`,
              background: THEME.itemBg, borderRadius: '0.5rem', border: `2px solid ${THEME.itemBorder}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.25rem', fontWeight: '600', color: 'white', position: 'relative',
              boxShadow: `0 0 20px ${THEME.accentGlow}`, zIndex: 10
            }}>
              {index + 1}
              <button onClick={(e) => handleDelete(item.id, e)} style={{
                position: 'absolute', top: '4px', right: '4px', width: '20px', height: '20px',
                background: THEME.accent, border: 'none', borderRadius: '4px', color: 'white',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '12px', fontWeight: 'bold', transition: 'all 0.2s ease', zIndex: 20
              }}>×</button>
              <div onMouseDown={(e) => handleResizeStart(item.id, e)} style={{
                position: 'absolute', bottom: '4px', right: '4px', width: '16px', height: '16px',
                cursor: 'nwse-resize', color: 'rgba(255,255,255,0.6)', zIndex: 20
              }}>
                <svg width="10" height="10" viewBox="0 0 10 10"><path d="M9 1L1 9M9 5L5 9M9 9L9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </div>
            </div>
          ))}
        </div>

        {/* Reset */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', maxWidth: '700px', margin: '1rem auto 0' }}>
          <button onClick={() => { setItems([]); setNextId(1); }} style={{
            padding: '0.5rem 1.5rem', background: 'rgba(16, 185, 129, 0.1)', border: `1px solid ${THEME.itemBorder}`,
            borderRadius: '0.375rem', color: THEME.accent, cursor: 'pointer', fontSize: '0.875rem', fontWeight: '500'
          }}>Reset</button>
        </div>

        {/* Code Output */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '1.5rem' : '2rem', maxWidth: '1000px', margin: '3rem auto 0', padding: isMobile ? '0 1rem' : 0 }}>
          {[['HTML', html, 'html'], ['CSS', css, 'css']].map(([label, code, type]) => (
            <div key={type} style={{
              background: 'rgba(0, 0, 0, 0.5)', border: `1px solid ${THEME.itemBorder}`,
              borderRadius: '0.75rem', padding: isMobile ? '1rem' : '1.5rem', backdropFilter: 'blur(10px)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                <button onClick={() => copyToClipboard(code, type)} style={{
                  padding: '0.5rem 1.5rem', background: THEME.accent, border: 'none',
                  borderRadius: '0.375rem', color: 'white', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '600'
                }}>{showCopied === type ? '✓ Copied!' : `Copy ${label}`}</button>
              </div>
              <pre style={{
                fontSize: '0.8125rem', fontFamily: "'Fira Code', monospace", overflow: 'auto',
                maxHeight: '200px', color: '#d1d5db', lineHeight: '1.6', background: 'rgba(0,0,0,0.3)',
                padding: '1rem', borderRadius: '0.5rem', margin: 0
              }}>{code}</pre>
            </div>
          ))}
        </div>
      </div>
      <Toast 
        message={toastMessage} 
        isVisible={showToast} 
        onClose={() => setShowToast(false)} 
        accentColor={THEME.accent}
      />    </div>
  );
};

export default ClassicGridGenerator;
