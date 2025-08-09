import React from 'react';
import { useNavigate } from 'react-router-dom';

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <button onClick={handleLogout} style={{ marginTop: 20 }}>
      🚪 Đăng xuất
    </button>
  );
}

export default LogoutButton;
