// src/components/UserProfileMenu.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

function UserProfileMenu() {
  const navigate = useNavigate();
  const ten_nv = localStorage.getItem('ten_nv');
  const role = localStorage.getItem('role');
  const ma_nv = localStorage.getItem('ma_nv');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div style={{ position: 'absolute', top: 10, right: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
      <img
        src={`https://ui-avatars.com/api/?name=${ten_nv}&background=random&rounded=true&size=32`}
        alt="avatar"
        style={{ borderRadius: '50%', width: 32, height: 32 }}
      />
      <div>
        <div style={{ fontWeight: 'bold' }}>{ten_nv}</div>
        <div style={{ fontSize: '12px', color: 'gray' }}>{ma_nv} - {role}</div>
      </div>
      <button onClick={handleLogout} style={{ marginLeft: 10 }}>Đăng xuất</button>
    </div>
  );
}

export default UserProfileMenu;
