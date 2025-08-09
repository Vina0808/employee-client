// src/pages/Login.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [maNV, setMaNV] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // reset lỗi trước khi gửi

    try {
      const API_BASE_URL = 'https://app-vina.onrender.com';  // Thay bằng URL backend của bạn
      const response = await axios.post(`${API_BASE_URL}/api/hrm-login/login`, {
        username: maNV,   // gửi username là mã nhân viên
        password: password
      });

      // Lưu token và username vào localStorage để dùng khi gọi API khác
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('username', response.data.username);

      // Điều hướng về trang chính sau khi đăng nhập thành công
      navigate('/');
    } catch (err) {
      // Xử lý lỗi, có thể lấy lỗi từ response hoặc hiển thị mặc định
      setError(err.response?.data?.message || 'Sai mã nhân viên hoặc mật khẩu');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '60px auto', padding: 20, border: '1px solid #ccc', borderRadius: 8 }}>
      <h2>Đăng nhập HRM</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>Mã nhân viên</label><br />
          <input
            type="text"
            value={maNV}
            onChange={(e) => setMaNV(e.target.value)}
            required
            placeholder="Nhập mã nhân viên"
            style={{ width: '100%', padding: 8, boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Mật khẩu</label><br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Nhập mật khẩu"
            style={{ width: '100%', padding: 8, boxSizing: 'border-box' }}
          />
        </div>

        <button type="submit" style={{ width: '100%', padding: 10, backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: 4 }}>
          Đăng nhập
        </button>
      </form>
    </div>
  );
}

export default Login;
