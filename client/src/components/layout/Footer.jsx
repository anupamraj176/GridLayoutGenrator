import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const footerRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: footerRef.current,
        start: "top 90%",
      }
    });

    tl.from(".footer-content", {
      y: 50,
      opacity: 0,
      duration: 1,
      stagger: 0.1,
      ease: "power3.out"
    });
  }, { scope: footerRef });

  return (
    <footer ref={footerRef} className="relative bg-brand-dark border-t border-white/10 pt-24 pb-12 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-brand-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* CTA Section */}
        <div className="footer-content flex flex-col md:flex-row justify-between items-center mb-20 pb-20 border-b border-white/10">
          <div className="text-center md:text-left mb-8 md:mb-0">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to build better layouts?
            </h2>
            <p className="text-gray-400 text-lg">
              Start creating production-ready CSS grids in seconds.
            </p>
          </div>
        </div>

        <div className="footer-content grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          <div className="md:col-span-5">
            <a href="#" className="inline-block text-3xl font-bold text-white tracking-tighter mb-6">
              Grid<span className="text-brand-accent">Gen</span>
            </a>
            <p className="text-gray-400 max-w-sm leading-relaxed">
              The modern visual builder for CSS Grid layouts. Designed for developers who care about precision and performance. Open source and free forever.
            </p>
          </div>
          
          <div className="md:col-span-2 md:col-start-7">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-6">Product</h4>
            <ul className="space-y-4 text-gray-400">
              <li><a href="#" className="hover:text-brand-accent transition-colors">Generator</a></li>
              <li><a href="#" className="hover:text-brand-accent transition-colors">Templates</a></li>
              <li><a href="#" className="hover:text-brand-accent transition-colors">Showcase</a></li>
              <li><a href="#" className="hover:text-brand-accent transition-colors">Changelog</a></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-6">Resources</h4>
            <ul className="space-y-4 text-gray-400">
              <li><a href="#" className="hover:text-brand-accent transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-brand-accent transition-colors">Grid Guide</a></li>
              <li><a href="#" className="hover:text-brand-accent transition-colors">Shortcuts</a></li>
              <li><a href="#" className="hover:text-brand-accent transition-colors">FAQ</a></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-6">Community</h4>
            <ul className="space-y-4 text-gray-400">
              <li><a href="#" className="hover:text-brand-accent transition-colors">GitHub</a></li>
              <li><a href="#" className="hover:text-brand-accent transition-colors">Discord</a></li>
              <li><a href="#" className="hover:text-brand-accent transition-colors">Twitter</a></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-content pt-8 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} GridGen. All rights reserved.</p>
          <div className="flex space-x-8 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;