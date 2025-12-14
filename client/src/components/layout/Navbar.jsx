import React, { useRef, useEffect, useState } from 'react';

const Navbar = () => {
  const navRef = useRef(null);
  const linksRef = useRef([]);
  const underlineRef = useRef(null);
  const logoRef = useRef(null);
  const ctaRef = useRef(null);
  const glowRef = useRef(null);
  const particleContainerRef = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // Scroll-aware navigation
    let lastScroll = 0;
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      
      if (currentScroll > 80) {
        setIsScrolled(true);
        if (navRef.current) {
          navRef.current.style.height = '64px';
          navRef.current.style.backdropFilter = 'blur(20px)';
          navRef.current.style.background = 'rgba(10, 10, 10, 0.85)';
          navRef.current.style.borderColor = 'rgba(255, 255, 255, 0.15)';
        }
      } else {
        setIsScrolled(false);
        if (navRef.current) {
          navRef.current.style.height = '80px';
          navRef.current.style.backdropFilter = 'blur(0px)';
          navRef.current.style.background = 'rgba(10, 10, 10, 0.7)';
          navRef.current.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        }
      }

      // Hide/show on scroll direction
      if (currentScroll > lastScroll && currentScroll > 100) {
        if (navRef.current) {
          navRef.current.style.transform = 'translateY(-100%)';
        }
      } else {
        if (navRef.current) {
          navRef.current.style.transform = 'translateY(0)';
        }
      }
      lastScroll = currentScroll;
    };

    window.addEventListener('scroll', handleScroll);

    // Initial entrance animation
    setTimeout(() => {
      if (logoRef.current) {
        logoRef.current.animate([
          { opacity: 0, transform: 'translateY(-20px)' },
          { opacity: 1, transform: 'translateY(0)' }
        ], {
          duration: 800,
          fill: 'forwards',
          easing: 'cubic-bezier(0.16, 1, 0.3, 1)'
        });
      }

      linksRef.current.forEach((link, i) => {
        if (link) {
          setTimeout(() => {
            link.animate([
              { opacity: 0, transform: 'translateY(-20px)' },
              { opacity: 1, transform: 'translateY(0)' }
            ], {
              duration: 600,
              fill: 'forwards',
              easing: 'cubic-bezier(0.16, 1, 0.3, 1)'
            });
          }, i * 100);
        }
      });

      if (ctaRef.current) {
        setTimeout(() => {
          ctaRef.current.animate([
            { opacity: 0, transform: 'translateY(-20px) scale(0.9)' },
            { opacity: 1, transform: 'translateY(0) scale(1)' }
          ], {
            duration: 700,
            fill: 'forwards',
            easing: 'cubic-bezier(0.16, 1, 0.3, 1)'
          });
        }, 300);
      }
    }, 100);

    // Underline slide effect
    linksRef.current.forEach((link) => {
      if (!link) return;

      const handleMouseEnter = () => {
        const rect = link.getBoundingClientRect();
        const navRect = navRef.current.getBoundingClientRect();
        
        if (underlineRef.current) {
          underlineRef.current.style.left = `${rect.left}px`;
          underlineRef.current.style.width = `${rect.width}px`;
          underlineRef.current.style.opacity = '1';
          underlineRef.current.style.transform = 'scaleX(1)';
        }

        // Glow effect
        if (glowRef.current) {
          glowRef.current.style.left = `${rect.left + rect.width / 2}px`;
          glowRef.current.style.opacity = '0.4';
          glowRef.current.style.transform = 'translate(-50%, -50%) scale(1)';
        }

        // Create particle trail
        createParticles(rect.left + rect.width / 2, rect.top + rect.height / 2);
      };

      const handleMouseLeave = () => {
        if (underlineRef.current) {
          underlineRef.current.style.opacity = '0';
          underlineRef.current.style.transform = 'scaleX(0.8)';
        }
        if (glowRef.current) {
          glowRef.current.style.opacity = '0';
          glowRef.current.style.transform = 'translate(-50%, -50%) scale(0.8)';
        }
      };

      link.addEventListener('mouseenter', handleMouseEnter);
      link.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Create particle effect
  const createParticles = (x, y) => {
    if (!particleContainerRef.current) return;

    for (let i = 0; i < 3; i++) {
      const particle = document.createElement('div');
      particle.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: 4px;
        height: 4px;
        background: rgba(139, 92, 246, 0.8);
        border-radius: 50%;
        pointer-events: none;
        z-index: 100;
      `;
      particleContainerRef.current.appendChild(particle);

      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 30 + 20;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;

      particle.animate([
        { transform: 'translate(0, 0) scale(1)', opacity: 1 },
        { transform: `translate(${tx}px, ${ty}px) scale(0)`, opacity: 0 }
      ], {
        duration: 600,
        easing: 'cubic-bezier(0.16, 1, 0.3, 1)'
      }).onfinish = () => particle.remove();
    }
  };

  // Magnetic effect
  const magnetic = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    e.currentTarget.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
  };

  const resetMagnetic = (e) => {
    e.currentTarget.style.transform = 'translate(0, 0)';
  };

  // CTA button effects
  const handleCTAHover = (e) => {
    if (ctaRef.current) {
      ctaRef.current.style.transform = 'scale(1.05)';
      ctaRef.current.style.boxShadow = '0 0 30px rgba(139, 92, 246, 0.5)';
    }
  };

  const handleCTALeave = (e) => {
    if (ctaRef.current) {
      ctaRef.current.style.transform = 'scale(1)';
      ctaRef.current.style.boxShadow = '0 0 20px rgba(139, 92, 246, 0.3)';
    }
  };

  return (
    <>
      {/* Particle Container */}
      <div ref={particleContainerRef} style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 100 }} />

      <nav
        ref={navRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          zIndex: 50,
          background: 'rgba(10, 10, 10, 0.7)',
          backdropFilter: 'blur(0px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          height: '80px'
        }}
      >
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 1.5rem',
          height: '100%'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '100%'
          }}>
            {/* Logo */}
            <a
              ref={logoRef}
              href="#"
              style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: 'white',
                textDecoration: 'none',
                letterSpacing: '-0.05em',
                opacity: 0,
                position: 'relative',
                display: 'inline-block'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              Grid<span style={{ 
                color: '#8b5cf6',
                display: 'inline-block',
                transition: 'transform 0.3s ease'
              }}>Gen</span>
            </a>

            {/* Navigation Links */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '2.5rem',
              position: 'relative'
            }}>
              {['Home', 'Features', 'Templates', 'Docs'].map((item, i) => (
                <a
                  key={item}
                  ref={(el) => (linksRef.current[i] = el)}
                  href={item === 'Home' ? '#' : `#${item.toLowerCase()}`}
                  onMouseMove={magnetic}
                  style={{
                    position: 'relative',
                    color: '#d1d5db',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    textDecoration: 'none',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    opacity: 0,
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#ffffff';
                  }}
                  onMouseLeave={(e) => {
                    resetMagnetic(e);
                    e.currentTarget.style.color = '#d1d5db';
                  }}
                >
                  {item}
                </a>
              ))}

              {/* CTA Button */}
              <button
                ref={ctaRef}
                onMouseEnter={handleCTAHover}
                onMouseLeave={handleCTALeave}
                style={{
                  padding: '0.625rem 1.5rem',
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '9999px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)',
                  opacity: 0,
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <span style={{ position: 'relative', zIndex: 1 }}>Get Started</span>
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)',
                  opacity: 0,
                  transition: 'opacity 0.3s ease'
                }} />
              </button>
            </div>
          </div>
        </div>

        {/* Animated Background Pattern */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '100%',
          background: 'radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.03) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(139, 92, 246, 0.03) 0%, transparent 50%)',
          pointerEvents: 'none',
          opacity: isScrolled ? 1 : 0,
          transition: 'opacity 0.4s ease'
        }} />
      </nav>

      {/* GSAP Underline */}
      <span
        ref={underlineRef}
        style={{
          position: 'fixed',
          top: '76px',
          left: 0,
          height: '2px',
          background: 'linear-gradient(90deg, transparent, #8b5cf6, transparent)',
          opacity: 0,
          pointerEvents: 'none',
          zIndex: 51,
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          transformOrigin: 'center',
          transform: 'scaleX(0.8)'
        }}
      />

      {/* Glow Effect */}
      <div
        ref={glowRef}
        style={{
          position: 'fixed',
          top: '40px',
          left: 0,
          width: '150px',
          height: '150px',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 49,
          opacity: 0,
          filter: 'blur(40px)',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          transform: 'translate(-50%, -50%) scale(0.8)'
        }}
      />
    </>
  );
};

export default Navbar;