import React, { useEffect, useState } from 'react';

function HrmCbnvDonviList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/oracle/hrm-cbnv-donvi')
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Lỗi khi lấy dữ liệu HRM:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Đang tải dữ liệu...</p>;

  return (
    <div>
      <h2>Danh sách nhân viên HRM_CBNV_DONVI</h2>
      <table border="1" cellPadding="5" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th>MA_NV</th>
            <th>HO_TEN</th>
            <th>PHONG_BAN</th>
            <th>KHOI</th>
            <th>DON_VI</th>
            <th>CHUC_DANH</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.MA_NV}</td>
              <td>{item.HO_TEN}</td>
              <td>{item.PHONG_BAN}</td>
              <td>{item.KHOI}</td>
              <td>{item.DON_VI}</td>
              <td>{item.CHUC_DANH}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default HrmCbnvDonviList;
