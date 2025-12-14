import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Hero from '../components/home/Hero';

const Home = () => {
  return (
    <div className="min-h-screen bg-brand-dark text-white selection:bg-brand-accent selection:text-brand-dark">
      <Navbar />
      <main>
        <Hero />
      </main>
      <Footer />
    </div>
  );
};

export default Home;