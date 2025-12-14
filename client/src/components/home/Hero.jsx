import React, { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { TextPlugin } from "gsap/TextPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(TextPlugin, ScrollTrigger);

const CARDS = [
  { id: 1, title: "Cyber Grid", subtitle: "Neon Architecture", color: "bg-purple-900" },
  { id: 2, title: "Fluid Mesh", subtitle: "Organic Flow", color: "bg-blue-900" },
  { id: 3, title: "Glass Morph", subtitle: "Transparent Layers", color: "bg-teal-900" },
  { id: 4, title: "Neo Brutalism", subtitle: "Bold Structures", color: "bg-rose-900" },
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

  useGSAP(() => {
    /* -------- TEXT INTRO -------- */
    const chars = titleRef.current.querySelectorAll(".char");

    gsap.from(chars, {
      y: 120,
      opacity: 0,
      rotateX: 80,
      stagger: 0.04,
      duration: 1.6,
      ease: "power4.out",
    });

    gsap.to(titleRef.current.querySelector(".highlight"), {
      text: "Perfection",
      delay: 0.6,
      duration: 1,
      ease: "none",
    });

    gsap.from(subtitleRef.current, {
      y: 40,
      opacity: 0,
      delay: 1.1,
      duration: 1,
      ease: "power3.out",
    });

    gsap.from(btnRef.current.children, {
      y: 30,
      opacity: 0,
      stagger: 0.15,
      delay: 1.4,
      duration: 0.8,
      ease: "power3.out",
    });

    /* -------- FLOATING BACKGROUND -------- */
    gsap.to(circleRef.current, {
      y: 100,
      scale: 1.15,
      duration: 7,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    /* -------- HORIZONTAL SCROLL -------- */
    const getWidth = () =>
      scrollTrackRef.current.scrollWidth - window.innerWidth;

    const scrollTween = gsap.to(scrollTrackRef.current, {
      x: () => -getWidth(),
      ease: "none",
      scrollTrigger: {
        trigger: scrollSectionRef.current,
        pin: true,
        scrub: 1,
        start: "top top",
        end: () => `+=${getWidth()}`,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const skew = gsap.utils.clamp(-10, 10, self.getVelocity() / 250);
          gsap.to(cardsRef.current, {
            skewX: skew,
            duration: 0.2,
            ease: "power3.out",
          });
          gsap.to(cardsRef.current, {
            skewX: 0,
            duration: 0.6,
            ease: "power3.out",
            delay: 0.2,
          });
        },
      },
    });

    cardsRef.current.forEach((card) => {
      const img = card.querySelector(".card-image");

      gsap.to(img, {
        scale: 1.2,
        x: -60,
        ease: "none",
        scrollTrigger: {
          trigger: card,
          containerAnimation: scrollTween,
          start: "left right",
          end: "right left",
          scrub: true,
        },
      });

      gsap.from(card, {
        opacity: 0.4,
        scale: 0.95,
        scrollTrigger: {
          trigger: card,
          containerAnimation: scrollTween,
          start: "left 80%",
          end: "left 20%",
          scrub: true,
        },
      });
    });

    /* -------- CURSOR GLOW (PERFORMANCE SAFE) -------- */
    const xTo = gsap.quickTo(glowRef.current, "x", {
      duration: 0.8,
      ease: "power3.out",
    });
    const yTo = gsap.quickTo(glowRef.current, "y", {
      duration: 0.8,
      ease: "power3.out",
    });

    const moveGlow = (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };

    window.addEventListener("mousemove", moveGlow);
    return () => window.removeEventListener("mousemove", moveGlow);
  }, { scope: containerRef });

  /* -------- MAGNETIC BUTTON -------- */
  const magnetic = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(e.currentTarget, {
      x: x * 0.35,
      y: y * 0.35,
      duration: 0.3,
      ease: "power3.out",
    });
  };

  const resetMagnetic = (e) => {
    gsap.to(e.currentTarget, {
      x: 0,
      y: 0,
      duration: 0.4,
      ease: "power3.out",
    });
  };

  return (
    <div ref={containerRef} className="bg-neutral-950 overflow-x-hidden text-white">
      <div
        ref={glowRef}
        className="fixed top-0 left-0 w-[420px] h-[420px] -translate-x-1/2 -translate-y-1/2 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none z-0 mix-blend-screen"
      />

      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          ref={circleRef}
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-indigo-600/20 rounded-full blur-[140px]"
        />

        <div className="relative z-10 text-center max-w-7xl mx-auto px-6">
          <h1 ref={titleRef} className="text-7xl md:text-9xl font-bold tracking-tighter mb-8">
            {"Grid Layouts".split("").map((c, i) => (
              <span key={i} className="char inline-block origin-bottom">{c}</span>
            ))}
            <br />
            <span className="text-indigo-400 highlight">...</span>
          </h1>

          <p ref={subtitleRef} className="mt-6 max-w-2xl mx-auto text-xl md:text-2xl text-gray-400">
            Experience the future of web design.
            <br />
            Fast. Fluid. <span className="text-indigo-400">Flawless.</span>
          </p>

          <div ref={btnRef} className="mt-12 flex justify-center gap-6">
            <button
              onMouseMove={magnetic}
              onMouseLeave={resetMagnetic}
              className="px-10 py-4 bg-indigo-500 rounded-full font-bold shadow-[0_0_40px_-10px_rgba(99,102,241,0.6)]"
            >
              Start Creating
            </button>

            <button
              onMouseMove={magnetic}
              onMouseLeave={resetMagnetic}
              className="px-10 py-4 border border-white/20 rounded-full hover:bg-white/5 backdrop-blur-sm"
            >
              Explore Features
            </button>
          </div>
        </div>
      </section>

      <section ref={scrollSectionRef} className="relative h-screen overflow-hidden bg-neutral-900">
        <div ref={scrollTrackRef} className="flex h-full items-center gap-20 pl-24 pr-24 w-max">
          {CARDS.map((card, i) => (
            <div
              key={card.id}
              ref={(el) => (cardsRef.current[i] = el)}
              className={`relative w-[40vw] h-[60vh] ${card.color} rounded-3xl overflow-hidden border border-white/10`}
            >
              <div className="card-image absolute inset-0 bg-gradient-to-br from-white/10 to-black/40 scale-110" />
              <div className="absolute bottom-0 p-10 bg-gradient-to-t from-black/80 to-transparent w-full">
                <h4 className="text-4xl font-bold">{card.title}</h4>
                <p className="text-indigo-300 mt-2 font-mono">{card.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Hero;
