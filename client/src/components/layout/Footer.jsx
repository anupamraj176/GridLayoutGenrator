import React, { useRef, useEffect } from 'react';

// Simulating GSAP and plugins
const gsap = {
  to: (target, vars) => {},
  from: (target, vars) => {},
  fromTo: (target, from, to) => {},
  timeline: (vars) => ({
    fromTo: function() { return this; },
    from: function() { return this; },
    to: function() { return this; }
  }),
  registerPlugin: () => {},
  utils: {
    random: (min, max) => Math.random() * (max - min) + min
  }
};

const ScrollTrigger = {};
gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const footerRef = useRef(null);
  const blobRef = useRef(null);
  const lineRef = useRef(null);
  const cursorRef = useRef(null);
  const particlesRef = useRef(null);

  useEffect(() => {
    // Particle system
    const particles = [];
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.cssText = `
        position: absolute;
        width: ${Math.random() * 4 + 1}px;
        height: ${Math.random() * 4 + 1}px;
        background: rgba(255, 255, 255, ${Math.random() * 0.5 + 0.2});
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        pointer-events: none;
      `;
      particlesRef.current?.appendChild(particle);
      particles.push(particle);

      // Animate particles
      const animateParticle = () => {
        const duration = Math.random() * 3000 + 2000;
        const tx = Math.random() * 100 - 50;
        const ty = Math.random() * 100 - 50;
        
        particle.animate([
          { transform: 'translate(0, 0)', opacity: particle.style.opacity },
          { transform: `translate(${tx}px, ${ty}px)`, opacity: 0 }
        ], {
          duration,
          easing: 'ease-in-out',
          iterations: Infinity
        });
      };
      
      animateParticle();
    }

    // Ambient blob animation
    const animateBlob = () => {
      if (blobRef.current) {
        blobRef.current.animate([
          { transform: 'translate(-50%, 0) scale(1)', opacity: 0.3 },
          { transform: 'translate(-50%, 0) scale(1.2)', opacity: 0.5 },
          { transform: 'translate(-50%, 0) scale(1)', opacity: 0.3 }
        ], {
          duration: 8000,
          iterations: Infinity,
          easing: 'ease-in-out'
        });
      }
    };

    // Line draw animation
    const animateLine = () => {
      if (lineRef.current) {
        lineRef.current.animate([
          { transform: 'scaleX(0)', opacity: 0 },
          { transform: 'scaleX(1)', opacity: 1 }
        ], {
          duration: 1200,
          fill: 'forwards',
          easing: 'cubic-bezier(0.16, 1, 0.3, 1)'
        });
      }
    };

    // Content entrance
    const animateContent = () => {
      const items = footerRef.current?.querySelectorAll('.footer-content-item');
      items?.forEach((item, index) => {
        setTimeout(() => {
          item.animate([
            { transform: 'translateY(30px)', opacity: 0 },
            { transform: 'translateY(0)', opacity: 1 }
          ], {
            duration: 800,
            fill: 'forwards',
            easing: 'cubic-bezier(0.16, 1, 0.3, 1)'
          });
        }, index * 50);
      });
    };

    // Magnetic cursor effect
    const handleMouseMove = (e) => {
      if (!cursorRef.current) return;
      
      const { clientX, clientY } = e;
      cursorRef.current.style.transform = `translate(${clientX - 10}px, ${clientY - 10}px)`;

      // Magnetic effect on links
      const links = footerRef.current?.querySelectorAll('a');
      links?.forEach(link => {
        const rect = link.getBoundingClientRect();
        const linkCenterX = rect.left + rect.width / 2;
        const linkCenterY = rect.top + rect.height / 2;
        const distance = Math.sqrt(
          Math.pow(clientX - linkCenterX, 2) + Math.pow(clientY - linkCenterY, 2)
        );

        if (distance < 100) {
          const pullStrength = (100 - distance) / 100;
          const pullX = (clientX - linkCenterX) * pullStrength * 0.3;
          const pullY = (clientY - linkCenterY) * pullStrength * 0.3;
          link.style.transform = `translate(${pullX}px, ${pullY}px)`;
          link.style.color = '#ffffff';
        } else {
          link.style.transform = 'translate(0, 0)';
          link.style.color = '';
        }
      });
    };

    animateBlob();
    
    // Trigger animations on mount (simulating scroll trigger)
    setTimeout(() => {
      animateLine();
      animateContent();
    }, 100);

    footerRef.current?.addEventListener('mousemove', handleMouseMove);

    return () => {
      footerRef.current?.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleLinkHover = (e) => {
    e.target.style.transition = 'all 0.2s ease-out';
    e.target.style.transform += ' skewX(-5deg)';
    e.target.style.color = '#ffffff';
  };

  const handleLinkLeave = (e) => {
    e.target.style.transform = e.target.style.transform.replace(' skewX(-5deg)', '');
  };

  const FooterLink = ({ href, children }) => (
    <li>
      <a 
        href={href}
        onMouseEnter={handleLinkHover}
        onMouseLeave={handleLinkLeave}
        style={{ 
          display: 'inline-block',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          willChange: 'transform'
        }}
      >
        {children}
      </a>
    </li>
  );

  return (
    <footer ref={footerRef} style={{
      position: 'relative',
      background: '#0a0a0a',
      paddingTop: '6rem',
      paddingBottom: '3rem',
      overflow: 'hidden',
      minHeight: '600px'
    }}>
      
      {/* Custom Cursor */}
      <div ref={cursorRef} style={{
        position: 'fixed',
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        border: '2px solid rgba(139, 92, 246, 0.5)',
        pointerEvents: 'none',
        zIndex: 9999,
        transition: 'transform 0.1s ease-out',
        mixBlendMode: 'difference'
      }} />

      {/* Particles Container */}
      <div ref={particlesRef} style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden'
      }} />

      {/* Background Gradient Blob */}
      <div 
        ref={blobRef}
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          height: '500px',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
          filter: 'blur(120px)',
          borderRadius: '50%',
          pointerEvents: 'none'
        }}
      />

      {/* Top Border Line */}
      <div 
        ref={lineRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '1px',
          background: 'linear-gradient(to right, transparent, rgba(255, 255, 255, 0.2), transparent)',
          transformOrigin: 'center'
        }}
      />

      <div style={{
        position: 'relative',
        zIndex: 10,
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 1.5rem'
      }}>
        
        {/* CTA Section */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: '5rem',
          paddingBottom: '5rem',
          position: 'relative',
          textAlign: 'center'
        }} className="footer-content-item">
          <div>
            <h2 style={{
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '1rem',
              background: 'linear-gradient(135deg, #fff 0%, #8b5cf6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Ready to build better layouts?
            </h2>
            <p style={{
              color: '#9ca3af',
              fontSize: '1.125rem'
            }}>
              Start creating production-ready CSS grids in seconds.
            </p>
          </div>
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '1px',
            background: 'rgba(255, 255, 255, 0.05)'
          }} />
        </div>

        {/* Main Grid Content */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '3rem',
          marginBottom: '4rem'
        }}>
          <div className="footer-content-item">
            <a href="#" style={{
              display: 'inline-block',
              fontSize: '2rem',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '1.5rem',
              textDecoration: 'none'
            }}>
              Grid<span style={{ color: '#8b5cf6' }}>Gen</span>
            </a>
            <p style={{
              color: '#9ca3af',
              maxWidth: '400px',
              lineHeight: '1.6'
            }}>
              The modern visual builder for CSS Grid layouts. Designed for developers who care about precision and performance.
            </p>
          </div>
          
          <div className="footer-content-item">
            <h4 style={{
              fontSize: '0.875rem',
              fontWeight: 'bold',
              color: 'white',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '1.5rem'
            }}>Product</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#9ca3af' }}>
              <FooterLink href="#">Generator</FooterLink>
              <FooterLink href="#">Templates</FooterLink>
              <FooterLink href="#">Showcase</FooterLink>
              <FooterLink href="#">Changelog</FooterLink>
            </ul>
          </div>

          <div className="footer-content-item">
            <h4 style={{
              fontSize: '0.875rem',
              fontWeight: 'bold',
              color: 'white',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '1.5rem'
            }}>Resources</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#9ca3af' }}>
              <FooterLink href="#">Documentation</FooterLink>
              <FooterLink href="#">Grid Guide</FooterLink>
              <FooterLink href="#">Shortcuts</FooterLink>
              <FooterLink href="#">FAQ</FooterLink>
            </ul>
          </div>

          <div className="footer-content-item">
            <h4 style={{
              fontSize: '0.875rem',
              fontWeight: 'bold',
              color: 'white',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '1.5rem'
            }}>Community</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#9ca3af' }}>
              <FooterLink href="#">GitHub</FooterLink>
              <FooterLink href="#">Discord</FooterLink>
              <FooterLink href="#">Twitter</FooterLink>
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="footer-content-item" style={{
          paddingTop: '2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          color: '#6b7280',
          fontSize: '0.875rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
          <p>&copy; {new Date().getFullYear()} GridGen. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '2rem' }}>
            <a href="#" style={{ color: '#6b7280', textDecoration: 'none', transition: 'color 0.3s' }}>Privacy Policy</a>
            <a href="#" style={{ color: '#6b7280', textDecoration: 'none', transition: 'color 0.3s' }}>Terms of Service</a>
            <a href="#" style={{ color: '#6b7280', textDecoration: 'none', transition: 'color 0.3s' }}>Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;