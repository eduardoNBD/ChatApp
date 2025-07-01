import React from 'react';
import Login from '@pages/Login';

const NoAuthLayout = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Login />
    </div>
  );
};

export default NoAuthLayout;
