import React, { useState, useEffect, useRef } from 'react';

const CyberGridGenerator = () => {
  const [rows, setRows] = useState(6);
  const [cols, setCols] = useState(6);
  const [rowGap, setRowGap] = useState(12);
  const [colGap, setColGap] = useState(12);
  const [items, setItems] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [copied, setCopied] = useState(null);
  const glowRef = useRef(null);

  // Theme Constants based on "Cyber Grid"
  const THEME = {
    accent: "#a855f7",
    accentGlow: "rgba(168, 85, 247, 0.4)",
    secondary: "#6366f1",
    bg: "#0a0a0a",
    panelBg: "rgba(15, 15, 20, 0.8)",
    border: "rgba(168, 85, 247, 0.2)"
  };

  useEffect(() => {
    const moveGlow = (e) => {
      if (glowRef.current) {
        glowRef.current.style.left = `${e.clientX}px`;
        glowRef.current.style.top = `${e.clientY}px`;
      }
    };
    window.addEventListener('mousemove', moveGlow);
    return () => window.removeEventListener('mousemove', moveGlow);
  }, []);

  const handleCellClick = (index) => {
    const exists = items.find(i => i.id === index);
    if (exists) {
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

  const updateItem = (field, val) => {
    setItems(items.map(i => i.id === selectedItemId ? { ...i, [field]: val } : i));
  };

  const copyCode = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const cssCode = `.cyber-grid {
  display: grid;
  grid-template-columns: repeat(${cols}, 1fr);
  grid-template-rows: repeat(${rows}, 1fr);
  gap: ${rowGap}px ${colGap}px;
}
${items.map((item, i) => `.item-${i + 1} {
  grid-column: ${item.colStart} / ${item.colEnd};
  grid-row: ${item.rowStart} / ${item.rowEnd};
}`).join('\n')}`;

  return (
    <div style={{ background: THEME.bg, minHeight: '100vh', color: 'white', position: 'relative', overflow: 'hidden', fontFamily: 'Inter, sans-serif' }}>
      {/* Interactive Background Glow */}
      <div ref={glowRef} style={{
        position: 'fixed', width: '600px', height: '600px', borderRadius: '50%',
        background: `radial-gradient(circle, ${THEME.accentGlow} 0%, transparent 70%)`,
        transform: 'translate(-50%, -50%)', pointerEvents: 'none', zIndex: 0, filter: 'blur(100px)'
      }} />

      <div style={{ display: 'flex', position: 'relative', zIndex: 1, height: '100vh' }}>
        
        {/* Workspace */}
        <div style={{ flex: 1, padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-0.05em', marginBottom: '10px' }}>
              CYBER <span style={{ color: THEME.accent, textShadow: `0 0 20px ${THEME.accent}` }}>GRID</span>
            </h2>
            <div style={{ width: '50px', height: '4px', background: THEME.accent, margin: '0 auto' }} />
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gridTemplateRows: `repeat(${rows}, 1fr)`,
            gap: `${rowGap}px ${colGap}px`,
            width: '100%', maxWidth: '650px', aspectRatio: '1/1',
            background: 'rgba(0,0,0,0.4)', padding: '20px', borderRadius: '12px',
            border: `1px solid ${THEME.border}`,
            boxShadow: `0 0 40px rgba(0,0,0,0.5), inset 0 0 20px ${THEME.accent}10`
          }}>
            {Array.from({ length: rows * cols }).map((_, idx) => {
              const item = items.find(i => i.id === idx);
              const isSelected = selectedItemId === idx;
              return (
                <div 
                  key={idx}
                  onClick={() => handleCellClick(idx)}
                  style={{
                    borderRadius: '4px', cursor: 'pointer', transition: 'all 0.2s',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '12px', fontWeight: 'bold',
                    ...(item ? {
                      gridColumn: `${item.colStart} / ${item.colEnd}`,
                      gridRow: `${item.rowStart} / ${item.rowEnd}`,
                      background: isSelected ? THEME.accent : `${THEME.accent}30`,
                      border: `1px solid ${THEME.accent}`,
                      boxShadow: isSelected ? `0 0 20px ${THEME.accent}` : 'none',
                    } : {
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.05)'
                    })
                  }}
                >
                  {item ? items.indexOf(item) + 1 : ''}
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar Controls */}
        <div style={{
          width: '400px', background: THEME.panelBg, backdropFilter: 'blur(20px)',
          borderLeft: `1px solid ${THEME.border}`, padding: '40px', overflowY: 'auto'
        }}>
          <section style={{ marginBottom: '40px' }}>
            <h3 style={{ fontSize: '0.8rem', letterSpacing: '0.2em', color: THEME.accent, marginBottom: '20px' }}>SYSTEM CONFIG</h3>
            
            {/* Grid Sliders */}
            {[['Rows', rows, setRows], ['Cols', cols, setCols], ['Row Gap', rowGap, setRowGap], ['Col Gap', colGap, setColGap]].map(([label, val, setter]) => (
              <div key={label} style={{ marginBottom: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px' }}>
                  <span>{label.toUpperCase()}</span>
                  <span style={{ color: THEME.accent }}>{val}</span>
                </div>
                <input type="range" min="1" max="12" value={val} onChange={(e) => setter(parseInt(e.target.value))} 
                  style={{ width: '100%', accentColor: THEME.accent, cursor: 'pointer' }} />
              </div>
            ))}
          </section>

          {selectedItemId !== null && (
            <section style={{ border: `1px solid ${THEME.accent}40`, padding: '20px', borderRadius: '8px', background: `${THEME.accent}05` }}>
              <h3 style={{ fontSize: '0.8rem', letterSpacing: '0.1em', marginBottom: '20px' }}>NODE_{selectedItemId} PARAMETERS</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {['colStart', 'colEnd', 'rowStart', 'rowEnd'].map(field => (
                  <div key={field}>
                    <label style={{ fontSize: '10px', opacity: 0.6 }}>{field.toUpperCase()}</label>
                    <input 
                      type="text" 
                      value={items.find(i => i.id === selectedItemId)[field]}
                      onChange={(e) => updateItem(field, e.target.value)}
                      style={{ width: '100%', background: '#000', border: '1px solid rgba(255,255,255,0.1)', color: THEME.accent, padding: '8px', fontSize: '12px', marginTop: '4px', outline: 'none' }}
                    />
                  </div>
                ))}
              </div>
              <button 
                onClick={() => { setItems(items.filter(i => i.id !== selectedItemId)); setSelectedItemId(null); }}
                style={{ width: '100%', marginTop: '15px', padding: '10px', background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', cursor: 'pointer', fontSize: '11px' }}
              >
                DELETE NODE
              </button>
            </section>
          )}

          <section style={{ marginTop: '40px' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h3 style={{ fontSize: '0.8rem', letterSpacing: '0.2em' }}>GENERATED SOURCE</h3>
                <button 
                  onClick={() => copyCode(cssCode, 'CSS')}
                  style={{ background: THEME.accent, border: 'none', color: 'white', padding: '4px 12px', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer', borderRadius: '2px' }}
                >
                  {copied === 'CSS' ? 'COPIED!' : 'COPY CSS'}
                </button>
             </div>
             <pre style={{ 
               background: '#000', padding: '15px', borderRadius: '4px', fontSize: '11px', 
               color: '#d1d5db', border: '1px solid rgba(255,255,255,0.05)', overflowX: 'auto',
               lineHeight: '1.6'
             }}>
               {cssCode}
             </pre>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CyberGridGenerator;