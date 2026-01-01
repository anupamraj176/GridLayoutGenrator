import React, { useRef, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navRef = useRef(null);
  const logoRef = useRef(null);
  const linksRef = useRef([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Grid Generator', path: '/grid' },
    { name: 'Cyber Grid', path: '/cyber-grid' },
    { name: 'Fluid Mesh', path: '/fluid-mesh' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      
      if (currentScroll > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
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
    }, 100);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <nav
      ref={navRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 1000,
        background: isScrolled ? 'rgba(10, 10, 10, 0.95)' : 'rgba(10, 10, 10, 0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        height: '70px'
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
          <Link
            ref={logoRef}
            to="/"
            style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: 'white',
              textDecoration: 'none',
              letterSpacing: '-0.05em',
              opacity: 0,
              display: 'inline-block',
              transition: 'transform 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            Grid<span style={{ color: '#8b5cf6' }}>Gen</span>
          </Link>

          {/* Desktop Navigation */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2rem'
          }}
          className="desktop-nav"
          >
            {navLinks.map((link, i) => (
              <Link
                key={link.name}
                ref={(el) => (linksRef.current[i] = el)}
                to={link.path}
                style={{
                  position: 'relative',
                  color: location.pathname === link.path ? '#8b5cf6' : '#d1d5db',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  opacity: 0,
                  padding: '0.5rem 0'
                }}
                onMouseEnter={(e) => {
                  if (location.pathname !== link.path) {
                    e.currentTarget.style.color = '#ffffff';
                  }
                }}
                onMouseLeave={(e) => {
                  if (location.pathname !== link.path) {
                    e.currentTarget.style.color = '#d1d5db';
                  }
                }}
              >
                {link.name}
                {location.pathname === link.path && (
                  <span style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: 'linear-gradient(90deg, #8b5cf6, #6366f1)',
                    borderRadius: '1px'
                  }} />
                )}
              </Link>
            ))}

            <Link
              to="/grid"
              style={{
                padding: '0.625rem 1.5rem',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '9999px',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)',
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 0 30px rgba(139, 92, 246, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 0 20px rgba(139, 92, 246, 0.3)';
              }}
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="mobile-menu-btn"
            style={{
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              padding: '0.5rem',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            {isMobileMenuOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          className="mobile-menu"
          style={{
            position: 'absolute',
            top: '70px',
            left: 0,
            right: 0,
            background: 'rgba(10, 10, 10, 0.98)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              style={{
                color: location.pathname === link.path ? '#8b5cf6' : '#d1d5db',
                fontSize: '1rem',
                fontWeight: '500',
                textDecoration: 'none',
                padding: '0.75rem 1rem',
                borderRadius: '0.5rem',
                background: location.pathname === link.path ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
                transition: 'all 0.2s ease'
              }}
            >
              {link.name}
            </Link>
          ))}
          <Link
            to="/grid"
            style={{
              padding: '0.875rem 1.5rem',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
              color: 'white',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              fontWeight: '600',
              textDecoration: 'none',
              textAlign: 'center',
              marginTop: '0.5rem'
            }}
          >
            Get Started
          </Link>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-menu-btn {
            display: flex !important;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
