import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const MainLayout = () => {
  const location = useLocation();
  const isGridPage = location.pathname === '/grid';

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />
      <main>
        <Outlet />
      </main>
      {!isGridPage && <Footer />}
    </div>
  );
};

export default MainLayout;
