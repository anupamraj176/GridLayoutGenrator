import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Hero from '../components/home/Hero';
import Features from '../components/home/Features';

const Home = () => {
  return (
    <div className="min-h-screen bg-brand-dark text-white selection:bg-brand-accent selection:text-brand-dark">
      <Navbar />
      <main>
        <Hero />
        <Features />
      </main>
      <Footer />
    </div>
  );
};

export default Home;