import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-brand-dark border-t border-white/10 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-white mb-6">
              Grid<span className="text-brand-accent">Gen</span>
            </h3>
            <p className="text-gray-400 max-w-sm">
              Empowering developers to create stunning, responsive grid layouts without the headache. Open source and free forever.
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-6">Product</h4>
            <ul className="space-y-4 text-gray-400">
              <li><a href="#" className="hover:text-brand-accent transition-colors">Generator</a></li>
              <li><a href="#" className="hover:text-brand-accent transition-colors">Templates</a></li>
              <li><a href="#" className="hover:text-brand-accent transition-colors">Documentation</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-6">Community</h4>
            <ul className="space-y-4 text-gray-400">
              <li><a href="#" className="hover:text-brand-accent transition-colors">GitHub</a></li>
              <li><a href="#" className="hover:text-brand-accent transition-colors">Discord</a></li>
              <li><a href="#" className="hover:text-brand-accent transition-colors">Twitter</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} GridGen. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;