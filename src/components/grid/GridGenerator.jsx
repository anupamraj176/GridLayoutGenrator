import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { gsap } from 'gsap';
import Toast from '../ui/Toast';

const GridGenerator = () => {
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
  const [outputMode, setOutputMode] = useState('css'); // 'css' or 'tailwind'
  const gridRef = useRef(null);
  const glowRef = useRef(null);
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const controlsRef = useRef(null);
  const codeOutputRef = useRef(null);
  const animationFrameRef = useRef(null);

  const THEME = {
    accent: "#6366f1",
    accentGlow: "rgba(99, 102, 241, 0.4)",
    accentLight: "rgba(99, 102, 241, 0.15)",
    bg: "#0a0a0a",
    cellBg: "rgba(99, 102, 241, 0.12)",
    cellHover: "rgba(99, 102, 241, 0.25)",
    itemBg: "linear-gradient(135deg, rgba(99, 102, 241, 0.35) 0%, rgba(139, 92, 246, 0.35) 100%)",
    itemBorder: "rgba(99, 102, 241, 0.6)",
    cardBg: "rgba(15, 15, 15, 0.8)",
    glassBorder: "rgba(99, 102, 241, 0.2)"
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
    // Helper to convert pixel gap to Tailwind class
    const getGapClass = (gapPx) => {
      const gapMap = {
        0: '0', 1: 'px', 2: '0.5', 4: '1', 6: '1.5', 8: '2', 10: '2.5',
        12: '3', 14: '3.5', 16: '4', 20: '5', 24: '6', 28: '7', 32: '8',
        36: '9', 40: '10', 44: '11', 48: '12'
      };
      // Find closest value
      const sorted = Object.keys(gapMap).map(Number).sort((a, b) => Math.abs(a - gapPx) - Math.abs(b - gapPx));
      return gapMap[sorted[0]] || '2';
    };

    if (outputMode === 'tailwind') {
      // Generate Tailwind HTML
      const gapClass = getGapClass(gap);
      const parentClasses = `grid grid-cols-${Math.min(cols, 12)} grid-rows-${Math.min(rows, 12)} gap-${gapClass}`;
      
      let tailwindHtml = `<div class="${parentClasses}">\n`;
      items.forEach((item, i) => {
        const itemClasses = [];
        if (item.colStart > 1) itemClasses.push(`col-start-${Math.min(item.colStart, 13)}`);
        if (item.colSpan > 1) itemClasses.push(`col-span-${Math.min(item.colSpan, 12)}`);
        if (item.rowStart > 1) itemClasses.push(`row-start-${Math.min(item.rowStart, 13)}`);
        if (item.rowSpan > 1) itemClasses.push(`row-span-${Math.min(item.rowSpan, 12)}`);
        
        const classStr = itemClasses.length > 0 ? ` class="${itemClasses.join(' ')}"` : '';
        tailwindHtml += `    <div${classStr}>${i + 1}</div>\n`;
      });
      tailwindHtml += `</div>`;
      
      // Generate Tailwind config note for custom values
      let tailwindCss = `/* Tailwind CSS Classes Used */\n\n`;
      tailwindCss += `/* Parent Container */\n`;
      tailwindCss += `/* ${parentClasses} */\n\n`;
      
      if (cols > 12 || rows > 12) {
        tailwindCss += `/* Note: For more than 12 columns/rows, add to tailwind.config.js:\n`;
        tailwindCss += `   extend: {\n`;
        tailwindCss += `     gridTemplateColumns: { '${cols}': 'repeat(${cols}, minmax(0, 1fr))' },\n`;
        tailwindCss += `     gridTemplateRows: { '${rows}': 'repeat(${rows}, minmax(0, 1fr))' }\n`;
        tailwindCss += `   }\n*/\n\n`;
      }
      
      tailwindCss += `/* Item Classes */\n`;
      items.forEach((item, i) => {
        const itemClasses = [];
        if (item.colStart > 1) itemClasses.push(`col-start-${Math.min(item.colStart, 13)}`);
        if (item.colSpan > 1) itemClasses.push(`col-span-${Math.min(item.colSpan, 12)}`);
        if (item.rowStart > 1) itemClasses.push(`row-start-${Math.min(item.rowStart, 13)}`);
        if (item.rowSpan > 1) itemClasses.push(`row-span-${Math.min(item.rowSpan, 12)}`);
        tailwindCss += `/* div${i + 1}: ${itemClasses.join(' ') || 'default position'} */\n`;
      });
      
      return { html: tailwindHtml, css: tailwindCss };
    }
    
    // Default CSS output
    const htmlCode = `<div class="parent">\n${items.map((_, i) => `    <div class="div${i + 1}">${i + 1}</div>`).join('\n')}\n</div>`;
    let cssCode = `.parent {\n  display: grid;\n  grid-template-columns: repeat(${cols}, 1fr);\n  grid-template-rows: repeat(${rows}, 1fr);\n  gap: ${gap}px;\n}\n`;
    items.forEach((item, i) => { 
      cssCode += `\n.div${i + 1} { grid-area: ${item.rowStart} / ${item.colStart} / ${item.rowStart + item.rowSpan} / ${item.colStart + item.colSpan}; }`; 
    });
    return { html: htmlCode, css: cssCode };
  }, [items, cols, rows, gap, outputMode]);

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
          textAlign: 'center', 
          fontSize: isSmallMobile ? '1.75rem' : isMobile ? '2rem' : '2.5rem', 
          fontWeight: 'bold', 
          marginBottom: isMobile ? '1.5rem' : '2rem',
          background: `linear-gradient(135deg, ${THEME.accent} 0%, #8b5cf6 100%)`,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          letterSpacing: '-0.02em'
        }}>
          CSS Grid Generator
        </h1>

        {/* Controls */}
        <div ref={controlsRef} style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: isSmallMobile ? '0.5rem' : '0.75rem', 
          marginBottom: isMobile ? '1.5rem' : '2rem', 
          flexWrap: 'wrap', 
          padding: '0 0.5rem' 
        }}>
          {[['Cols', cols, setCols], ['Rows', rows, setRows], ['Gap', gap, setGap]].map(([label, value, setter]) => (
            <div key={label} style={{
              background: THEME.cardBg,
              backdropFilter: 'blur(10px)',
              border: `1px solid ${THEME.glassBorder}`,
              padding: isSmallMobile ? '0.4rem 0.75rem' : isMobile ? '0.5rem 1rem' : '0.75rem 1.5rem', 
              borderRadius: '0.75rem', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              boxShadow: `0 4px 20px rgba(0,0,0,0.3), inset 0 1px 0 ${THEME.glassBorder}`,
              transition: 'all 0.3s ease'
            }}>
              <span style={{ color: '#9ca3af', fontSize: isSmallMobile ? '0.75rem' : '0.875rem', fontWeight: '500' }}>{label}</span>
              <input type="number" value={value}
                onChange={(e) => setter(Math.max(1, Math.min(12, parseInt(e.target.value) || 1)))}
                style={{ 
                  width: isSmallMobile ? '40px' : '50px', 
                  background: 'transparent', 
                  border: 'none', 
                  color: THEME.accent, 
                  fontSize: isSmallMobile ? '0.875rem' : '1rem', 
                  textAlign: 'center', 
                  outline: 'none', 
                  fontWeight: '700' 
                }}
              />
            </div>
          ))}
        </div>

        {/* Grid */}
        <div ref={gridRef} style={{
          display: 'grid', 
          gridTemplateColumns: `repeat(${cols}, 1fr)`, 
          gridTemplateRows: `repeat(${rows}, 1fr)`,
          gap: `${isSmallMobile ? Math.min(gap, 4) : gap}px`, 
          aspectRatio: isMobile ? 'auto' : '1',
          height: isMobile ? `${Math.min(rows * 50, 350)}px` : 'auto',
          maxWidth: isMobile ? '100%' : '700px', 
          margin: '0 auto',
          background: `linear-gradient(135deg, ${THEME.accentLight} 0%, rgba(139, 92, 246, 0.08) 100%)`,
          border: `1px solid ${THEME.itemBorder}`,
          borderRadius: isMobile ? '0.75rem' : '1rem', 
          padding: isSmallMobile ? '0.5rem' : isMobile ? '0.75rem' : '1rem', 
          userSelect: resizing ? 'none' : 'auto',
          boxShadow: `0 8px 32px rgba(99, 102, 241, 0.15), inset 0 0 60px rgba(99, 102, 241, 0.05)`
        }}>
          {Array.from({ length: rows * cols }).map((_, index) => {
            const row = Math.floor(index / cols) + 1;
            const col = (index % cols) + 1;
            const isOccupied = occupied.has(`${row}-${col}`);
            return (
              <div key={`cell-${index}`} onClick={() => !isOccupied && handleCellClick(row, col)}
                style={{
                  gridRow: row, gridColumn: col, 
                  background: isOccupied ? 'transparent' : THEME.cellBg,
                  borderRadius: isSmallMobile ? '0.35rem' : '0.5rem', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  cursor: isOccupied ? 'default' : 'pointer', 
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  color: 'rgba(99, 102, 241, 0.5)', 
                  fontSize: isSmallMobile ? '1rem' : '1.5rem', 
                  fontWeight: '300',
                  minHeight: isSmallMobile ? '30px' : isMobile ? '40px' : 'auto',
                  border: isOccupied ? 'none' : '1px dashed rgba(99, 102, 241, 0.2)'
                }}
                onMouseEnter={(e) => { 
                  if (!isOccupied) {
                    e.currentTarget.style.background = THEME.cellHover;
                    e.currentTarget.style.transform = 'scale(1.02)';
                    e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.4)';
                  }
                }}
                onMouseLeave={(e) => { 
                  if (!isOccupied) {
                    e.currentTarget.style.background = THEME.cellBg;
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.2)';
                  }
                }}
              >
                {!isOccupied && '+'}
              </div>
            );
          })}

          {items.map((item, index) => (
            <div key={item.id} style={{
              gridColumn: `${item.colStart} / span ${item.colSpan}`, 
              gridRow: `${item.rowStart} / span ${item.rowSpan}`,
              background: THEME.itemBg, 
              borderRadius: isSmallMobile ? '0.35rem' : '0.5rem', 
              border: `2px solid ${THEME.itemBorder}`,
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontSize: isSmallMobile ? '0.875rem' : '1.25rem', 
              fontWeight: '700', 
              color: 'white', 
              position: 'relative',
              boxShadow: `0 0 20px ${THEME.accentGlow}, inset 0 1px 0 rgba(255,255,255,0.1)`, 
              zIndex: 10,
              minHeight: isSmallMobile ? '30px' : isMobile ? '40px' : 'auto',
              transition: 'all 0.2s ease'
            }}>
              {index + 1}
              <button onClick={(e) => handleDelete(item.id, e)} style={{
                position: 'absolute', 
                top: isSmallMobile ? '2px' : '4px', 
                right: isSmallMobile ? '2px' : '4px', 
                width: isSmallMobile ? '16px' : '20px', 
                height: isSmallMobile ? '16px' : '20px',
                background: `linear-gradient(135deg, ${THEME.accent} 0%, #8b5cf6 100%)`, 
                border: 'none', 
                borderRadius: '4px', 
                color: 'white',
                cursor: 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontSize: isSmallMobile ? '10px' : '12px', 
                fontWeight: 'bold', 
                transition: 'all 0.2s ease', 
                zIndex: 20,
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
              }}>×</button>
              <div onMouseDown={(e) => handleResizeStart(item.id, e)} style={{
                position: 'absolute', 
                bottom: isSmallMobile ? '2px' : '4px', 
                right: isSmallMobile ? '2px' : '4px', 
                width: isSmallMobile ? '12px' : '16px', 
                height: isSmallMobile ? '12px' : '16px',
                cursor: 'nwse-resize', 
                color: 'rgba(255,255,255,0.7)', 
                zIndex: 20
              }}>
                <svg width={isSmallMobile ? "8" : "10"} height={isSmallMobile ? "8" : "10"} viewBox="0 0 10 10"><path d="M9 1L1 9M9 5L5 9M9 9L9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </div>
            </div>
          ))}
        </div>

        {/* Reset */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          maxWidth: isMobile ? '100%' : '700px', 
          margin: '1rem auto 0',
          padding: isMobile ? '0 0.5rem' : 0 
        }}>
          <button 
            onClick={() => { setItems([]); setNextId(1); }} 
            style={{
              padding: isSmallMobile ? '0.4rem 1rem' : '0.5rem 1.5rem', 
              background: THEME.cardBg,
              backdropFilter: 'blur(10px)',
              border: `1px solid ${THEME.glassBorder}`,
              borderRadius: '0.5rem', 
              color: THEME.accent, 
              cursor: 'pointer', 
              fontSize: isSmallMobile ? '0.8rem' : '0.875rem', 
              fontWeight: '600',
              transition: 'all 0.3s ease',
              boxShadow: `0 4px 15px rgba(0,0,0,0.2)`
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(99, 102, 241, 0.15)';
              e.currentTarget.style.borderColor = THEME.accent;
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = THEME.cardBg;
              e.currentTarget.style.borderColor = THEME.glassBorder;
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >Reset</button>
        </div>

        {/* Output Mode Toggle */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          maxWidth: isMobile ? '100%' : '1000px', 
          margin: '1.5rem auto 0',
          padding: isMobile ? '0 0.5rem' : 0 
        }}>
          <div style={{
            display: 'flex',
            background: THEME.cardBg,
            backdropFilter: 'blur(10px)',
            border: `1px solid ${THEME.glassBorder}`,
            borderRadius: '0.75rem',
            padding: '4px',
            gap: '4px'
          }}>
            <button
              onClick={() => setOutputMode('css')}
              style={{
                padding: isSmallMobile ? '0.5rem 1rem' : '0.6rem 1.5rem',
                background: outputMode === 'css' 
                  ? `linear-gradient(135deg, ${THEME.accent} 0%, #8b5cf6 100%)`
                  : 'transparent',
                border: 'none',
                borderRadius: '0.5rem',
                color: outputMode === 'css' ? 'white' : '#9ca3af',
                cursor: 'pointer',
                fontSize: isSmallMobile ? '0.75rem' : '0.875rem',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7.502 0C3.355 0 0 3.355 0 7.502s3.355 7.502 7.502 7.502c4.147 0 7.502-3.355 7.502-7.502S11.649 0 7.502 0zm0 12.504c-2.76 0-5.002-2.242-5.002-5.002S4.742 2.5 7.502 2.5s5.002 2.242 5.002 5.002-2.242 5.002-5.002 5.002zM19.998 0c-2.21 0-4.002 1.792-4.002 4.002V12h4.002c2.21 0 4.002-1.792 4.002-4.002V4.002C24 1.792 22.208 0 19.998 0z"/>
              </svg>
              CSS
            </button>
            <button
              onClick={() => setOutputMode('tailwind')}
              style={{
                padding: isSmallMobile ? '0.5rem 1rem' : '0.6rem 1.5rem',
                background: outputMode === 'tailwind'
                  ? `linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)`
                  : 'transparent',
                border: 'none',
                borderRadius: '0.5rem',
                color: outputMode === 'tailwind' ? 'white' : '#9ca3af',
                cursor: 'pointer',
                fontSize: isSmallMobile ? '0.75rem' : '0.875rem',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z"/>
              </svg>
              Tailwind
            </button>
          </div>
        </div>
        {/* Code Output */}
        <div ref={codeOutputRef} style={{ 
          display: 'grid', 
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', 
          gap: isMobile ? '1rem' : '2rem', 
          maxWidth: '1000px', 
          margin: isMobile ? '2rem auto 0' : '3rem auto 0', 
          padding: isMobile ? '0 0.5rem' : 0 
        }}>
          {[
            ['HTML', html, 'html'], 
            [outputMode === 'tailwind' ? 'Tailwind Info' : 'CSS', css, 'css']
          ].map(([label, code, type]) => (
            <div key={type} style={{
              background: THEME.cardBg,
              backdropFilter: 'blur(15px)',
              border: `1px solid ${THEME.glassBorder}`,
              borderRadius: '1rem', 
              padding: isSmallMobile ? '0.875rem' : isMobile ? '1rem' : '1.5rem',
              boxShadow: `0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)`,
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Gradient accent line */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '2px',
                background: `linear-gradient(90deg, ${THEME.accent}, #8b5cf6, ${THEME.accent})`,
                opacity: 0.6
              }} />
              
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                <button 
                  onClick={() => copyToClipboard(code, type)} 
                  style={{
                    padding: isSmallMobile ? '0.5rem 1.25rem' : '0.6rem 1.75rem', 
                    background: showCopied === type 
                      ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' 
                      : `linear-gradient(135deg, ${THEME.accent} 0%, #8b5cf6 100%)`,
                    border: 'none',
                    borderRadius: '0.5rem', 
                    color: 'white', 
                    cursor: 'pointer', 
                    fontSize: isSmallMobile ? '0.8rem' : '0.875rem', 
                    fontWeight: '700',
                    boxShadow: `0 4px 15px ${showCopied === type ? 'rgba(16, 185, 129, 0.4)' : 'rgba(99, 102, 241, 0.4)'}`,
                    transition: 'all 0.3s ease',
                    transform: showCopied === type ? 'scale(1.02)' : 'scale(1)'
                  }}
                  onMouseEnter={(e) => {
                    if (showCopied !== type) {
                      e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                      e.currentTarget.style.boxShadow = `0 8px 25px rgba(99, 102, 241, 0.5)`;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (showCopied !== type) {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = `0 4px 15px rgba(99, 102, 241, 0.4)`;
                    }
                  }}
                >{showCopied === type ? '✓ Copied!' : `Copy ${label}`}</button>
              </div>
              <pre style={{
                fontSize: isSmallMobile ? '0.7rem' : '0.8125rem', 
                fontFamily: "'Fira Code', 'Monaco', 'Consolas', monospace", 
                overflow: 'auto',
                maxHeight: isMobile ? '160px' : '200px', 
                color: '#e2e8f0', 
                lineHeight: '1.7', 
                background: 'rgba(0,0,0,0.4)',
                padding: isSmallMobile ? '0.75rem' : '1rem', 
                borderRadius: '0.5rem', 
                margin: 0,
                border: '1px solid rgba(99, 102, 241, 0.1)'
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

export default GridGenerator;
