import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

const Navbar = () => {
  const navRef = useRef(null);

  useGSAP(() => {
    gsap.from(navRef.current, {
      y: -100,
      opacity: 0,
      duration: 1.2,
      ease: 'power4.out'
    });
  }, { scope: navRef });

  return (
    <nav ref={navRef} className="fixed top-0 left-0 w-full z-50 bg-brand-dark/80 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0 flex items-center">
            <a href="#" className="text-2xl font-bold text-white tracking-tighter">
              Grid<span className="text-brand-accent">Gen</span>
            </a>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a href="#" className="text-gray-300 hover:text-brand-accent px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300">Home</a>
              <a href="#features" className="text-gray-300 hover:text-brand-accent px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300">Features</a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;