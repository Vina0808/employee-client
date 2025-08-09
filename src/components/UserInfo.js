import React from 'react';
import LogoutButton from './LogoutButton'; // ✅ Thêm dòng này

function UserInfo() {
  const ma_nv = localStorage.getItem('ma_nv');
  const ten_nv = localStorage.getItem('ten_nv');
  const email = localStorage.getItem('email');
  const so_dt = localStorage.getItem('so_dt');
  const donvi_id = localStorage.getItem('donvi_id');
  const chuc_danh = localStorage.getItem('chuc_danh');
  const dia_chi = localStorage.getItem('dia_chi');
  const nhanvien_id = localStorage.getItem('nhanvien_id');

  const getInitials = (name) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Thông tin nhân viên</h2>

      {/* Avatar */}
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          backgroundColor: '#1976d2',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 28,
          marginBottom: 10
        }}
      >
        {getInitials(ten_nv)}
      </div>

      {/* Bảng thông tin */}
      <table style={{ borderCollapse: 'collapse' }}>
        <tbody>
          <tr><td><strong>Mã NV:</strong></td><td>{ma_nv}</td></tr>
          <tr><td><strong>Tên NV:</strong></td><td>{ten_nv}</td></tr>
          <tr><td><strong>Email:</strong></td><td>{email}</td></tr>
          <tr><td><strong>Số ĐT:</strong></td><td>{so_dt}</td></tr>
          <tr><td><strong>Chức danh:</strong></td><td>{chuc_danh}</td></tr>
          <tr><td><strong>Đơn vị ID:</strong></td><td>{donvi_id}</td></tr>
          <tr><td><strong>Địa chỉ:</strong></td><td>{dia_chi}</td></tr>
          <tr><td><strong>Nhân viên ID:</strong></td><td>{nhanvien_id}</td></tr>
        </tbody>
      </table>

      {/* Nút đăng xuất */}
      <LogoutButton />
    </div>
  );
}

export default UserInfo;
