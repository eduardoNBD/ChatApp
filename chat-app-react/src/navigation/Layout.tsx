import React from 'react';
import { Routes, Route } from 'react-router-dom';

const Layout = () => {
  return (
    <div>
      <main>
        <Routes>
          <Route path="/" element={<div>Home Page</div>} />
          <Route path="/chat" element={<div>Chat Page</div>} />
          {/* Agrega más rutas según necesites */}
        </Routes>
      </main>
    </div>
  );
};

export default Layout;