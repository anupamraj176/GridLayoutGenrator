import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { TextPlugin } from 'gsap/TextPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(TextPlugin, ScrollTrigger);

const Hero = () => {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const btnRef = useRef(null);
  const circleRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline();

    // Initial Load Animation
    tl.from(titleRef.current, {
      y: 100,
      opacity: 0,
      duration: 1.5,
      ease: 'power4.out'
    })
    .to(titleRef.current.querySelector('.highlight'), {
      text: {
        value: "Perfection",
        delimiter: ""
      },
      duration: 1,
      ease: "none",
    }, "-=0.5")
    .from(subtitleRef.current, {
      y: 30,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    }, "-=0.5")
    .from(btnRef.current, {
      y: 20,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    }, "-=0.5");

    // Scroll Parallax for Background Circle
    gsap.to(circleRef.current, {
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1
      },
      y: 200,
      scale: 1.2,
      opacity: 0.5
    });

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-brand-dark pt-20">
      
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div ref={circleRef} className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-brand-primary/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-brand-dark to-transparent z-10"></div>
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 ref={titleRef} className="text-6xl md:text-8xl font-bold tracking-tighter text-white mb-8">
          Grid Layouts <br />
          <span className="text-brand-accent highlight">...</span>
        </h1>
        
        <p ref={subtitleRef} className="mt-6 max-w-2xl mx-auto text-xl md:text-2xl text-gray-400 font-light leading-relaxed">
          Experience the future of web design. <br/>
          Fast. Fluid. <span className="text-brand-accent">Flawless.</span>
        </p>

        <div ref={btnRef} className="mt-12 flex flex-col sm:flex-row justify-center gap-6">
          <a href="#generator" className="group relative px-8 py-4 bg-brand-accent text-brand-dark font-bold rounded-full overflow-hidden transition-transform hover:scale-105">
            <span className="relative z-10">Start Creating</span>
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          </a>
          <a href="#features" className="px-8 py-4 border border-white/20 text-white font-medium rounded-full hover:bg-white/5 transition-colors">
            Explore Features
          </a>
        </div>
      </div>
    </div>
  );
};

export default Hero;