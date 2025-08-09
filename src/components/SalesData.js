import React, { useEffect, useState } from 'react';
import axios from 'axios';

function SalesData() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get('http://localhost:5000/api/sales');
      setSales(response.data);
    } catch (err) {
      setError('Không thể tải dữ liệu bán hàng');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (sales.length === 0) return <p>Không có dữ liệu bán hàng</p>;

  return (
    <div className="container mt-4">
      <h3 style={{ color: '#000' }}>Dữ liệu bán hàng theo nhân viên</h3>
      <table
        className="table table-striped table-bordered"
        style={{
          backgroundColor: '#fff',
          borderColor: '#ddd',
          color: '#000',
        }}
      >
        <thead
          style={{
            color: '#000',
            backgroundColor: '#f8f9fa', // màu nền sáng cho header
            borderColor: '#ddd',
          }}
        >
          <tr>
            <th>SĐT</th>
            {/* <th>Thời gian giao dịch</th> */}
            <th>Số eload</th>
            <th>HRM</th>
            <th>Nhân viên</th>
            <th>Đơn vị</th>
            <th>Tên gói cước</th>
            <th>Doanh thu</th>
            <th>Số tháng</th>
            <th>Loại gói</th>
            <th>Đơn giá</th>
          </tr>
        </thead>
        <tbody style={{ color: '#000' }}>
          {sales.map((s, index) => {
            // key được tạo dựa trên một số trường để đảm bảo duy nhất
            const key = `${s.so_dien_thoai_bh ?? 'unknown'}_${s.hrm_bh ?? 'unknown'}_${s.ten_goi_cuoc ?? 'unknown'}_${index}`;
            return (
              <tr key={key}>
                <td>{s.so_dien_thoai_bh ?? ''}</td>
                {/* <td>{s.thoi_gian_giao_dich ?? ''}</td> */}
                <td>{s.so_eload_bh ?? ''}</td>
                <td>{s.hrm_bh ?? ''}</td>
                <td>{s.nhan_vien_bh ?? ''}</td>
                <td>{s.don_vi_bh ?? ''}</td>
                <td>{s.ten_goi_cuoc ?? ''}</td>
                <td>{s.doanh_thu_goi ?? ''}</td>
                <td>{s.so_thang ?? ''}</td>
                <td>{s.loai_goi ?? ''}</td>
                <td>{s.don_gia ?? ''}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default SalesData;
