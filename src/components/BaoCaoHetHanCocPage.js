import React, { useEffect, useState } from 'react';
import axios from 'axios';

function BaoCaoHetHanCocPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/baocao-hethan/hethancoc');
      setData(res.data?.data || []);
    } catch (err) {
      console.error('❌ Lỗi khi tải dữ liệu:', err);
      setError('Không thể tải dữ liệu từ server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div style={{ fontFamily: 'Arial', padding: '10px' }}>
      <h2 style={{ backgroundColor: '#EF4444', color: '#fff', padding: '10px', borderRadius: '5px', textAlign: 'center' }}>
        ⏰ Báo Cáo Hết Hạn Đặt Cọc
      </h2>

      <div style={{ marginBottom: '15px', textAlign: 'center' }}>
        <button onClick={fetchData} disabled={loading} style={btnStyle('#3B82F6')}>🔄 Làm mới</button>
      </div>

      {loading ? (
        <p>⏳ Đang tải dữ liệu...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <>
          <p>🔢 Tổng số bản ghi: {data.length}</p>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead style={{ backgroundColor: '#FCD34D' }}>
                <tr>
                  {['STT', 'Mã TB', 'Tên TB', 'Ngày BĐ', 'Ngày KT', 'Đã Gia Hạn?', 'Nhân viên KT', 'Đơn vị'].map((col, idx) => (
                    <th key={idx} style={thStyle}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.length ? (
                  data.map((row, idx) => (
                    <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? '#FFF' : '#F9FAFB' }}>
                      <td style={tdStyle}>{idx + 1}</td>
                      <td style={tdStyle}>{row.MA_TB}</td>
                      <td style={tdStyle}>{row.TEN_TB}</td>
                      <td style={tdStyle}>{row.NGAY_BD}</td>
                      <td style={tdStyle}>{row.NGAY_KT}</td>
                      <td style={tdStyle}>{row.DA_GIA_HAN === 'ĐÃ GIA HẠN' ? '✅' : '❌'}</td>
                      <td style={tdStyle}>{row.NVKT}</td>
                      <td style={tdStyle}>{row.TEN_DV}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '10px' }}>Không có dữ liệu.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

const thStyle = {
  border: '1px solid #ccc',
  padding: '6px',
  textAlign: 'center',
  backgroundColor: '#FBBF24',
};

const tdStyle = {
  border: '1px solid #ccc',
  padding: '6px',
  textAlign: 'center',
};

const btnStyle = (bgColor) => ({
  padding: '6px 12px',
  backgroundColor: bgColor,
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  marginRight: '10px',
});

export default BaoCaoHetHanCocPage;
