import React from 'react';
import Navbar from '../components/layout/Navbar';
import GridGenerator from '../components/grid/GridGenerator';

export default function Create() {
  return (
    <div className="min-h-screen bg-brand-dark text-white selection:bg-brand-accent selection:text-brand-dark">
      <Navbar />
      <main className="pt-24">
        <GridGenerator />
      </main>
    </div>
  );
}
