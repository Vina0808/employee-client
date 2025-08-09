import React from 'react';
import { Outlet } from 'react-router-dom';
import MyNavbar from '../components/MyNavbar';

function RootLayout() {
  return (
    <>
      <MyNavbar />
      <div style={{ paddingTop: '70px' }}> {/* Tránh navbar fixed chồng lên */}
        <Outlet />
      </div>
    </>
  );
}

export default RootLayout;
