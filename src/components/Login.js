// src/pages/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [maNv, setMaNv] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/hrm-login/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ma_nv: maNv, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Đăng nhập thất bại');

      // ✅ Lưu vào localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('ma_nv', data.user.ma_nv);
      localStorage.setItem('ten_nv', data.user.ten_nv);
      localStorage.setItem('email', data.user.email || '');
      localStorage.setItem('so_dt', data.user.so_dt || '');
      localStorage.setItem('donvi_id', data.user.donvi_id || '');
      localStorage.setItem('chuc_danh', data.user.chuc_danh || '');
      localStorage.setItem('dia_chi', data.user.dia_chi || '');
      localStorage.setItem('nhanvien_id', data.user.nhanvien_id || '');
      localStorage.setItem('role', data.user.role || 'user');
      localStorage.setItem('isLoggedIn', 'true');

      // ✅ Điều hướng tới giao diện chính
      navigate('/app/hrm-oracle');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
      <h2>Đăng nhập</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <input
        type="text"
        placeholder="Mã nhân viên"
        value={maNv}
        onChange={(e) => setMaNv(e.target.value)}
        required
        autoComplete="username"
        style={{ width: '100%', padding: 8, marginBottom: 10 }}
      />

      <input
        type="password"
        placeholder="Mật khẩu"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        autoComplete="current-password"
        style={{ width: '100%', padding: 8, marginBottom: 10 }}
      />

      <button type="submit" style={{ width: '100%', padding: 10 }}>
        Đăng nhập
      </button>
    </form>
  );
}

export default Login;
