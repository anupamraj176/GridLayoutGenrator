import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const TEMPLATES = [
  {
    id: 1,
    title: "Cyber Grid",
    subtitle: "Neon Architecture",
    gradient: "linear-gradient(135deg, rgba(147, 51, 234, 0.2) 0%, rgba(88, 28, 135, 0.8) 100%)",
    borderColor: "rgba(147, 51, 234, 0.3)",
    accentColor: "#a855f7",
    path: "/cyber-grid"
  },
  {
    id: 2,
    title: "Fluid Mesh",
    subtitle: "Organic Flow",
    gradient: "linear-gradient(135deg, rgba(37, 99, 235, 0.2) 0%, rgba(30, 58, 138, 0.8) 100%)",
    borderColor: "rgba(59, 130, 246, 0.3)",
    accentColor: "#3b82f6",
    path: "/fluid-mesh"
  },
  {
    id: 3,
    title: "Classic Grid",
    subtitle: "Clean Design",
    gradient: "linear-gradient(135deg, rgba(5, 150, 105, 0.2) 0%, rgba(6, 78, 59, 0.8) 100%)",
    borderColor: "rgba(16, 185, 129, 0.3)",
    accentColor: "#10b981",
    path: "/classic-grid"
  }
];

const Hero = () => {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const btnRef = useRef(null);
  const circleRef = useRef(null);
  const glowRef = useRef(null);
  const scrollSectionRef = useRef(null);
  const scrollTrackRef = useRef(null);
  const cardsRef = useRef([]);
  const meshRef = useRef(null);
  const [titleText, setTitleText] = useState("...");

  useEffect(() => {
    // Animated mesh background
    const createMesh = () => {
      if (!meshRef.current) return;
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      meshRef.current.appendChild(canvas);

      const particles = [];
      const particleCount = 50;

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5
        });
      }

      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = 'rgba(99, 102, 241, 0.1)';
        ctx.lineWidth = 1;

        particles.forEach((p, i) => {
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
          if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

          ctx.beginPath();
          ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(99, 102, 241, 0.3)';
          ctx.fill();

          particles.slice(i + 1).forEach(p2 => {
            const dx = p.x - p2.x;
            const dy = p.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 150) {
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.globalAlpha = 1 - dist / 150;
              ctx.stroke();
              ctx.globalAlpha = 1;
            }
          });
        });

        requestAnimationFrame(animate);
      };
      animate();
    };

    createMesh();

    // Title character animation
    setTimeout(() => {
      const chars = titleRef.current?.querySelectorAll('.char');
      chars?.forEach((char, i) => {
        setTimeout(() => {
          char.animate([
            { transform: 'translateY(120px) rotateX(80deg)', opacity: 0 },
            { transform: 'translateY(0) rotateX(0deg)', opacity: 1 }
          ], {
            duration: 1600,
            fill: 'forwards',
            easing: 'cubic-bezier(0.16, 1, 0.3, 1)'
          });
        }, i * 40);
      });
    }, 100);

    // Type writer effect
    setTimeout(() => {
      const words = ['Perfection', 'Innovation', 'Excellence'];
      let wordIndex = 0;
      let charIndex = 0;
      
      const typeWriter = () => {
        if (charIndex < words[wordIndex].length) {
          setTitleText(words[wordIndex].substring(0, charIndex + 1));
          charIndex++;
          setTimeout(typeWriter, 100);
        } else {
          setTimeout(() => {
            charIndex = 0;
            wordIndex = (wordIndex + 1) % words.length;
            setTitleText('');
            setTimeout(typeWriter, 500);
          }, 2000);
        }
      };
      typeWriter();
    }, 1200);

    // Subtitle animation
    setTimeout(() => {
      subtitleRef.current?.animate([
        { transform: 'translateY(40px)', opacity: 0 },
        { transform: 'translateY(0)', opacity: 1 }
      ], {
        duration: 1000,
        fill: 'forwards',
        easing: 'cubic-bezier(0.16, 1, 0.3, 1)'
      });
    }, 1500);

    // Button stagger
    setTimeout(() => {
      const buttons = btnRef.current?.children;
      Array.from(buttons || []).forEach((btn, i) => {
        setTimeout(() => {
          btn.animate([
            { transform: 'translateY(30px)', opacity: 0 },
            { transform: 'translateY(0)', opacity: 1 }
          ], {
            duration: 800,
            fill: 'forwards',
            easing: 'cubic-bezier(0.16, 1, 0.3, 1)'
          });
        }, i * 150);
      });
    }, 1800);

    // Floating circle
    const animateCircle = () => {
      circleRef.current?.animate([
        { transform: 'translate(-50%, 0) scale(1)' },
        { transform: 'translate(-50%, 100px) scale(1.15)' },
        { transform: 'translate(-50%, 0) scale(1)' }
      ], {
        duration: 7000,
        iterations: Infinity,
        easing: 'ease-in-out'
      });
    };
    animateCircle();

    // Cursor glow
    const moveGlow = (e) => {
      if (glowRef.current) {
        glowRef.current.style.left = `${e.clientX}px`;
        glowRef.current.style.top = `${e.clientY}px`;
      }
    };
    window.addEventListener('mousemove', moveGlow);

    return () => {
      window.removeEventListener('mousemove', moveGlow);
    };
  }, []);

  useGSAP(() => {
    gsap.to(scrollTrackRef.current, {
      x: () => -(scrollTrackRef.current.scrollWidth - window.innerWidth),
      ease: "none",
      scrollTrigger: {
        trigger: scrollSectionRef.current,
        pin: true,
        scrub: 1,
        start: "top top",
        end: () => `+=${scrollTrackRef.current.scrollWidth - window.innerWidth}`,
        invalidateOnRefresh: true,
      },
    });
  }, { scope: containerRef });

  const magnetic = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    e.currentTarget.style.transform = `translate(${x * 0.35}px, ${y * 0.35}px) scale(1.05)`;
  };

  const resetMagnetic = (e) => {
    e.currentTarget.style.transform = 'translate(0, 0) scale(1)';
  };

  const handleCardMove = (e, index) => {
    const card = cardsRef.current[index];
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    
    const shine = card.querySelector('.shine-effect');
    if (shine) {
      shine.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255, 255, 255, 0.25) 0%, transparent 50%)`;
      shine.style.opacity = '1';
    }

    if (Math.random() > 0.92) {
      createParticle(e.clientX, e.clientY, TEMPLATES[index].accentColor);
    }
  };

  const handleCardLeave = (index) => {
    const card = cardsRef.current[index];
    if (!card) return;

    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
    
    const shine = card.querySelector('.shine-effect');
    if (shine) shine.style.opacity = '0';
  };

  const createParticle = (x, y, color) => {
    const particle = document.createElement('div');
    particle.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      width: ${Math.random() * 8 + 3}px;
      height: ${Math.random() * 8 + 3}px;
      background: ${color};
      border-radius: 50%;
      pointer-events: none;
      z-index: 100;
      box-shadow: 0 0 20px ${color}, 0 0 40px ${color};
    `;
    document.body.appendChild(particle);

    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 100 + 60;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance;

    particle.animate([
      { transform: 'translate(0, 0) scale(1)', opacity: 1 },
      { transform: `translate(${tx}px, ${ty}px) scale(0)`, opacity: 0 }
    ], {
      duration: 1200,
      easing: 'cubic-bezier(0.16, 1, 0.3, 1)'
    }).onfinish = () => particle.remove();
  };

  const handleButtonMove = (e) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    button.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px) scale(1.08)`;
  };

  const handleButtonLeave = (e) => {
    e.currentTarget.style.transform = 'translate(0, 0) scale(1)';
  };

  return (
    <div ref={containerRef} style={{ background: '#0a0a0a', overflow: 'hidden', color: 'white' }}>
      <div
        ref={glowRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '420px',
          height: '420px',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(80px)',
          pointerEvents: 'none',
          zIndex: 0,
          mixBlendMode: 'screen'
        }}
      />

      {/* Hero Section */}
      <section style={{
        position: 'relative',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        <div ref={meshRef} style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.4
        }} />

        <div
          ref={circleRef}
          style={{
            position: 'absolute',
            top: '33%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '900px',
            height: '900px',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(100px)'
          }}
        />

        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.5) 100%)',
          pointerEvents: 'none'
        }} />

        <div style={{
          position: 'relative',
          zIndex: 10,
          textAlign: 'center',
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 1.5rem'
        }}>
          <h1
            ref={titleRef}
            style={{
              fontSize: 'clamp(3.5rem, 10vw, 8rem)',
              fontWeight: 'bold',
              letterSpacing: '-0.05em',
              marginBottom: '2rem',
              lineHeight: '1.1',
              perspective: '1000px'
            }}
          >
            {"Grid Layouts".split("").map((c, i) => (
              <span 
                key={i} 
                className="char" 
                style={{
                  display: 'inline-block',
                  transformOrigin: 'bottom',
                  opacity: 0
                }}
              >
                {c === " " ? "\u00A0" : c}
              </span>
            ))}
            <br />
            <span style={{
              color: '#6366f1',
              textShadow: '0 0 40px rgba(99, 102, 241, 0.6)',
              display: 'inline-block',
              minWidth: '400px',
              textAlign: 'left'
            }}>
              {titleText}
              <span style={{
                display: 'inline-block',
                width: '4px',
                height: '0.8em',
                background: '#6366f1',
                marginLeft: '8px',
                animation: 'blink 1s infinite'
              }} />
            </span>
          </h1>

          <p 
            ref={subtitleRef} 
            style={{
              marginTop: '1.5rem',
              maxWidth: '768px',
              margin: '0 auto',
              fontSize: 'clamp(1.125rem, 2vw, 1.5rem)',
              color: '#9ca3af',
              opacity: 0,
              lineHeight: '1.6'
            }}
          >
            Experience the future of web design.
            <br />
            Fast. Fluid. <span style={{ color: '#6366f1', fontWeight: 'bold' }}>Flawless.</span>
          </p>

          <div ref={btnRef} style={{
            marginTop: '3rem',
            display: 'flex',
            justifyContent: 'center',
            gap: '1.5rem',
            flexWrap: 'wrap'
          }}>
            <Link
              to="/grid"
              onMouseMove={magnetic}
              onMouseLeave={resetMagnetic}
              style={{
                display: 'inline-block',
                padding: '1rem 2.5rem',
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                borderRadius: '9999px',
                fontWeight: 'bold',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                boxShadow: '0 0 60px rgba(99, 102, 241, 0.5), 0 10px 30px rgba(0, 0, 0, 0.3)',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                fontSize: '1rem',
                opacity: 0,
                position: 'relative',
                overflow: 'hidden',
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 0 80px rgba(99, 102, 241, 0.8), 0 15px 40px rgba(0, 0, 0, 0.4)';
              }}
            >
              Start Creating
            </Link>

            <button
              onMouseMove={magnetic}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
              }}
              onMouseLeave={(e) => {
                resetMagnetic(e);
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              }}
              style={{
                padding: '1rem 2.5rem',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '9999px',
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                fontSize: '1rem',
                opacity: 0
              }}
            >
              Explore Features
            </button>
          </div>
        </div>
      </section>

      {/* Horizontal Scroll Template Section */}
      <section 
        ref={scrollSectionRef} 
        style={{
          position: 'relative',
          height: '100vh',
          overflow: 'hidden',
          background: '#0f0f0f'
        }}
      >
        <div
          ref={scrollTrackRef}
          style={{
            display: 'flex',
            height: '100%',
            alignItems: 'center',
            gap: '8rem',
            paddingLeft: '6rem',
            paddingRight: '6rem',
            width: 'max-content',
            transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          <div style={{ width: '40vw', flexShrink: 0 }}>
            <p style={{
              fontSize: '0.875rem',
              letterSpacing: '0.1em',
              color: '#9ca3af',
              marginBottom: '1.5rem'
            }}>
              EXPLORE STYLES
            </p>
            <h2 style={{
              fontSize: 'clamp(3rem, 6vw, 5rem)',
              fontWeight: 'bold',
              lineHeight: '1.1',
              color: 'white'
            }}>
              Start with a <br/>
              <span style={{
                background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: '0 0 60px rgba(139, 92, 246, 0.3)'
              }}>
                Template.
              </span>
            </h2>
          </div>

          {TEMPLATES.map((item, index) => (
            <div
              key={item.id}
              ref={(el) => (cardsRef.current[index] = el)}
              onMouseMove={(e) => handleCardMove(e, index)}
              onMouseLeave={() => handleCardLeave(index)}
              style={{
                position: 'relative',
                width: '40vw',
                height: '65vh',
                flexShrink: 0,
                borderRadius: '1.5rem',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: '2rem',
                border: `1px solid ${item.borderColor}`,
                background: item.gradient,
                transformStyle: 'preserve-3d',
                perspective: '1000px',
                cursor: 'pointer',
                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: `0 20px 60px ${item.accentColor}20`
              }}
            >
              <div 
                className="shine-effect"
                style={{
                  position: 'absolute',
                  inset: 0,
                  opacity: 0,
                  transition: 'opacity 0.3s ease',
                  pointerEvents: 'none',
                  zIndex: 2
                }}
              />

              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(255, 255, 255, 0.05)',
                opacity: 0,
                transition: 'opacity 0.5s ease',
                zIndex: 1
              }} />

              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '50%',
                backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
                backgroundSize: '30px 30px',
                opacity: 0.3,
                zIndex: 0
              }} />

              <div style={{
                position: 'absolute',
                top: '2rem',
                left: '2rem',
                width: '60px',
                height: '2px',
                background: item.accentColor,
                boxShadow: `0 0 20px ${item.accentColor}`
              }} />
              <div style={{
                position: 'absolute',
                top: '2rem',
                left: '2rem',
                width: '2px',
                height: '60px',
                background: item.accentColor,
                boxShadow: `0 0 20px ${item.accentColor}`
              }} />

              <div style={{
                position: 'absolute',
                top: '2rem',
                right: '2rem',
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                border: `2px solid ${item.accentColor}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: item.accentColor,
                fontWeight: 'bold',
                fontSize: '1.5rem',
                background: 'rgba(0, 0, 0, 0.5)',
                backdropFilter: 'blur(10px)',
                boxShadow: `0 0 30px ${item.accentColor}40`,
                zIndex: 3
              }}>
                {String(index + 1).padStart(2, '0')}
              </div>

              <div style={{ position: 'relative', zIndex: 10 }}>
                <h3 style={{
                  fontSize: '2.5rem',
                  fontWeight: 'bold',
                  color: 'white',
                  marginBottom: '0.5rem',
                  letterSpacing: '-0.02em',
                  textShadow: `0 0 40px ${item.accentColor}40`
                }}>
                  {item.title}
                </h3>
                <p style={{
                  color: '#d1d5db',
                  fontFamily: 'monospace',
                  fontSize: '0.875rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  marginBottom: '2rem',
                  opacity: 0.8
                }}>
                  {item.subtitle}
                </p>

                <Link
                  to={item.path}
                  onMouseMove={handleButtonMove}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = item.accentColor;
                    e.currentTarget.style.boxShadow = `0 10px 40px ${item.accentColor}60, 0 0 60px ${item.accentColor}40`;
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={handleButtonLeave}
                  style={{
                    display: 'inline-block',
                    padding: '0.875rem 2rem',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: `2px solid ${item.accentColor}`,
                    borderRadius: '9999px',
                    color: 'white',
                    fontSize: '0.875rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    backdropFilter: 'blur(10px)',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: `0 0 20px ${item.accentColor}40`,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    textDecoration: 'none'
                  }}
                >
                  Explore Template →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section style={{
        padding: '6rem 2rem',
        background: '#0a0a0a'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 'bold',
            marginBottom: '1rem',
            background: 'linear-gradient(135deg, #ffffff 0%, #9ca3af 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Create Beautiful Grid Layouts
          </h2>
          <p style={{
            color: '#9ca3af',
            fontSize: '1.125rem',
            maxWidth: '600px',
            margin: '0 auto 4rem'
          }}>
            Design responsive CSS grid layouts visually with drag-and-drop simplicity
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            {/* Feature Card 1 */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px dashed rgba(99, 102, 241, 0.3)',
              borderRadius: '1rem',
              padding: '2rem',
              transition: 'all 0.3s ease'
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                borderRadius: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem',
                fontSize: '1.5rem'
              }}>
                🎯
              </div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                marginBottom: '0.75rem',
                color: 'white'
              }}>
                Drag & Drop
              </h3>
              <p style={{ color: '#9ca3af', lineHeight: '1.6' }}>
                Click to add items and drag the corner handle to resize. No coding required.
              </p>
            </div>

            {/* Feature Card 2 */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px dashed rgba(139, 92, 246, 0.3)',
              borderRadius: '1rem',
              padding: '2rem',
              transition: 'all 0.3s ease'
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
                borderRadius: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem',
                fontSize: '1.5rem'
              }}>
                📋
              </div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                marginBottom: '0.75rem',
                color: 'white'
              }}>
                Copy Code
              </h3>
              <p style={{ color: '#9ca3af', lineHeight: '1.6' }}>
                Get clean HTML and CSS code instantly. Just copy and paste into your project.
              </p>
            </div>

            {/* Feature Card 3 */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px dashed rgba(16, 185, 129, 0.3)',
              borderRadius: '1rem',
              padding: '2rem',
              transition: 'all 0.3s ease'
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                borderRadius: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem',
                fontSize: '1.5rem'
              }}>
                ⚡
              </div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                marginBottom: '0.75rem',
                color: 'white'
              }}>
                Real-time Preview
              </h3>
              <p style={{ color: '#9ca3af', lineHeight: '1.6' }}>
                See your changes instantly as you design. What you see is what you get.
              </p>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes blink {
          0%, 50%, 100% { opacity: 1; }
          25%, 75% { opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default Hero;
