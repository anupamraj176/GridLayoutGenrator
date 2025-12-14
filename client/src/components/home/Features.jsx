import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    title: "Visual Control",
    description: "Manipulate grid lines with precision. What you see is exactly what you get.",
    number: "01"
  },
  {
    title: "Instant Export",
    description: "Production-ready Tailwind CSS code generated in milliseconds.",
    number: "02"
  },
  {
    title: "Responsive Core",
    description: "Built for the modern web. Fluid layouts that adapt to any screen.",
    number: "03"
  }
];

const Features = () => {
  const containerRef = useRef(null);
  const cardsRef = useRef([]);

  useGSAP(() => {
    cardsRef.current.forEach((card, index) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
          toggleActions: "restart none none reverse"
        },
        y: 100,
        opacity: 0,
        duration: 0.8,
        ease: "power4.out"
      });
    });
  }, { scope: containerRef });

  return (
    <div id="features" ref={containerRef} className="py-32 bg-brand-dark relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-24">
          <h2 className="text-brand-accent font-mono text-sm tracking-widest uppercase mb-4">Why GridGen?</h2>
          <p className="text-4xl md:text-6xl font-bold text-white tracking-tight">
            Power in every <br/>
            <span className="text-brand-primary">pixel.</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              ref={el => cardsRef.current[index] = el}
              className="group relative p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-500"
            >
              <div className="absolute top-0 right-0 p-8 opacity-20 text-6xl font-bold text-brand-primary group-hover:text-brand-accent transition-colors duration-500">
                {feature.number}
              </div>
              <div className="mt-16">
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-brand-accent transition-colors duration-300">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
              <div className="absolute bottom-0 left-0 w-0 h-1 bg-brand-accent group-hover:w-full transition-all duration-500 rounded-b-2xl"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;