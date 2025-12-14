import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { TextPlugin } from 'gsap/TextPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(TextPlugin, ScrollTrigger);

const CARDS = [
  { id: 1, title: "Cyber Grid", subtitle: "Neon Architecture", color: "bg-purple-900" },
  { id: 2, title: "Fluid Mesh", subtitle: "Organic Flow", color: "bg-blue-900" },
  { id: 3, title: "Glass Morph", subtitle: "Transparent Layers", color: "bg-teal-900" },
  { id: 4, title: "Neo Brutalism", subtitle: "Bold Structures", color: "bg-rose-900" },
];

const Hero = () => {
  const containerRef = useRef(null);
  const heroRef = useRef(null);

  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const btnRef = useRef(null);
  const circleRef = useRef(null);
  const glowRef = useRef(null);

  const scrollSectionRef = useRef(null);
  const scrollTrackRef = useRef(null);
  const cardsRef = useRef([]);

  useGSAP(() => {
    const titleChars = titleRef.current.querySelectorAll('span.char');

    const tl = gsap.timeline();

    tl.from(titleChars, {
      y: 120,
      opacity: 0,
      rotateX: 80,
      stagger: 0.04,
      duration: 1.6,
      ease: 'power4.out'
    })
    .to(titleRef.current.querySelector('.highlight'), {
      text: "Perfection",
      duration: 1,
      ease: "none"
    }, "-=1")
    .from(subtitleRef.current, {
      y: 40,
      opacity: 0,
      duration: 1.2,
      ease: 'power3.out'
    }, "-=0.8")
    .from(btnRef.current.children, {
      y: 30,
      opacity: 0,
      stagger: 0.15,
      duration: 0.8,
      ease: 'power3.out'
    }, "-=1");

    gsap.to(circleRef.current, {
      y: 80,
      scale: 1.1,
      duration: 6,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    const totalWidth = scrollTrackRef.current.scrollWidth - window.innerWidth;

    const scrollTween = gsap.to(scrollTrackRef.current, {
      x: -totalWidth,
      ease: "none",
      scrollTrigger: {
        trigger: scrollSectionRef.current,
        pin: true,
        scrub: 1,
        start: "top top",
        end: `+=${totalWidth}`,
        onUpdate: (self) => {
          const skew = self.getVelocity() / 300;
          gsap.to(cardsRef.current, {
            skewX: skew,
            overwrite: 'auto',
            duration: 0.1
          });
        }
      }
    });

    cardsRef.current.forEach((card) => {
      const img = card.querySelector('.card-image');
      gsap.to(img, {
        scale: 1.2,
        x: -50,
        ease: "none",
        scrollTrigger: {
          trigger: card,
          containerAnimation: scrollTween,
          start: "left right",
          end: "right left",
          scrub: true,
        }
      });
    });

    const moveGlow = (e) => {
      gsap.to(glowRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 1,
        ease: "power3.out"
      });
    };

    window.addEventListener("mousemove", moveGlow);
    return () => window.removeEventListener("mousemove", moveGlow);

  }, { scope: containerRef });

  const magnetic = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(e.currentTarget, {
      x: x * 0.4,
      y: y * 0.4,
      duration: 0.3,
      ease: "power3.out"
    });
  };

  const resetMagnetic = (e) => {
    gsap.to(e.currentTarget, {
      x: 0,
      y: 0,
      duration: 0.4,
      ease: "power3.out"
    });
  };

  return (
    <div ref={containerRef} className="bg-neutral-950 overflow-x-hidden text-white">

      <div
        ref={glowRef}
        className="fixed top-0 left-0 w-[400px] h-[400px] -translate-x-1/2 -translate-y-1/2 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none z-0 mix-blend-screen"
      />

      <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          ref={circleRef}
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-indigo-600/20 rounded-full blur-[120px]"
        />

        <div className="relative z-10 text-center max-w-7xl mx-auto px-6">
          <h1 ref={titleRef} className="text-7xl md:text-9xl font-bold tracking-tighter mb-8 perspective-1000">
            {"Grid Layouts".split("").map((c, i) => (
              <span key={i} className="char inline-block origin-bottom">{c}</span>
            ))}
            <br />
            <span className="text-indigo-400 highlight">...</span>
          </h1>

          <p ref={subtitleRef} className="mt-6 max-w-2xl mx-auto text-xl md:text-2xl text-gray-400 font-light">
            Experience the future of web design.<br />
            Fast. Fluid. <span className="text-indigo-400">Flawless.</span>
          </p>

          <div ref={btnRef} className="mt-12 flex justify-center gap-6">
            <button
              onMouseMove={magnetic}
              onMouseLeave={resetMagnetic}
              className="px-10 py-4 bg-indigo-500 text-white font-bold rounded-full shadow-[0_0_30px_-5px_rgba(99,102,241,0.6)]"
            >
              Start Creating
            </button>

            <button
              onMouseMove={magnetic}
              onMouseLeave={resetMagnetic}
              className="px-10 py-4 border border-white/20 hover:bg-white/5 rounded-full backdrop-blur-sm transition-colors"
            >
              Explore Features
            </button>
          </div>
        </div>
      </section>

      <section ref={scrollSectionRef} className="relative h-screen overflow-hidden bg-neutral-900">
        <div className="absolute top-10 left-10 z-10">
          <h2 className="text-xl font-mono text-indigo-400/80">02 / FEATURE SHOWCASE</h2>
        </div>

        <div ref={scrollTrackRef} className="flex h-full items-center pl-20 pr-20 gap-20 w-max">
          <div className="w-[30vw] shrink-0">
            <h3 className="text-6xl font-bold leading-tight">
              Discover<br />
              <span className="text-indigo-500">New Dimensions</span>
            </h3>
            <p className="mt-6 text-gray-400 text-lg">
              Scroll to explore our latest collection of layouts.
            </p>
          </div>

          {CARDS.map((card, i) => (
            <div
              key={card.id}
              ref={el => cardsRef.current[i] = el}
              className={`relative w-[40vw] h-[60vh] ${card.color} shrink-0 rounded-3xl overflow-hidden group border border-white/10`}
            >
              <div className="card-image absolute inset-0 bg-gradient-to-br from-white/10 to-black/40 scale-110" />

              <div className="absolute bottom-0 left-0 p-10 w-full bg-gradient-to-t from-black/80 to-transparent">
                <h4 className="text-4xl font-bold">{card.title}</h4>
                <p className="text-indigo-300 mt-2 font-mono">{card.subtitle}</p>
              </div>
            </div>
          ))}

          <div className="w-[30vw] shrink-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-2xl text-gray-500">Next Step</p>
              <h3 className="text-5xl font-bold mt-2">Get Started</h3>
            </div>
          </div>
        </div>
      </section>

      <div className="h-screen flex items-center justify-center bg-black">
        <p className="text-neutral-600">Footer / Next Section</p>
      </div>
    </div>
  );
};

export default Hero;
