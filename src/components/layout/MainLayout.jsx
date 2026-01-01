import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const MainLayout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />
      <main>
        <Outlet />
      </main>
      {isHomePage && <Footer />}
    </div>
  );
};

export default MainLayout;
