import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ExcelDataList = () => {
  const [excelData, setExcelData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('2025');
  const [searchKey, setSearchKey] = useState('');
  const [editRowId, setEditRowId] = useState(null);
  const [editData, setEditData] = useState({
    Nguoi_dieu_chinh: '',
    HRM_phoi_hop_OB: '',
  });

  const parseDateTime = (datetimeStr) => {
    if (!datetimeStr) return null;
    const [datePart, timePart = '00:00:00'] = datetimeStr.split(' ');
    const [day, month, year] = datePart.split('/').map(Number);
    const [hour, minute, second] = timePart.split(':').map(Number);
    return new Date(year, month - 1, day, hour, minute, second);
  };

  const formatDateTime = (dateInput) => {
    const date = new Date(dateInput);
    if (isNaN(date)) return '';
    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  };

  const fetchExcelData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/exceldatas');
      setExcelData(response.data);
    } catch (error) {
      console.error('Lỗi khi fetch dữ liệu Excel:', error);
    }
  };

  useEffect(() => {
    fetchExcelData();
  }, []);

  useEffect(() => {
    const key = searchKey.trim();
    const isNumber = /^\d+$/.test(key);
    const upperKey = key.toUpperCase();

    const filtered = excelData.filter((item) => {
      const sdt = item.So_dien_thoai_bh?.toString() || '';
      const hrm = item.HRM_bh?.toString().toUpperCase() || '';

      if (!key) {
        const dateObj = parseDateTime(item.Thoi_gian_giao_dich);
        if (!dateObj) return false;

        const matchMonth = month ? dateObj.getMonth() + 1 === parseInt(month) : true;
        const matchYear = year ? dateObj.getFullYear() === parseInt(year) : true;

        return matchMonth && matchYear;
      }

      const matchKey = isNumber ? sdt.includes(key) : hrm.includes(upperKey);

      const dateObj = parseDateTime(item.Thoi_gian_giao_dich);
      if (!matchKey || !dateObj) return false;

      const matchMonth = month ? dateObj.getMonth() + 1 === parseInt(month) : true;
      const matchYear = year ? dateObj.getFullYear() === parseInt(year) : true;

      return matchKey && matchMonth && matchYear;
    });

    filtered.sort((a, b) => {
      const d1 = parseDateTime(a.Thoi_gian_giao_dich);
      const d2 = parseDateTime(b.Thoi_gian_giao_dich);
      return d2 - d1;
    });

    setFilteredData(filtered);
  }, [excelData, month, year, searchKey]);

  const handleEditClick = () => {
  const key = searchKey.trim();

  if (!key) {
    alert('Vui lòng nhập số điện thoại để tra cứu trước khi sửa.');
    return;
  }

  const row = filteredData.find((item) => {
    const sdt = item.So_dien_thoai_bh?.toString() || '';
    return sdt.includes(key);
  });

  if (!row) {
    alert('Không tìm thấy bản ghi để sửa với số điện thoại đã nhập.');
    return;
  }

  setEditRowId(row._id);
  setEditData({
    Nguoi_dieu_chinh: row.Nguoi_dieu_chinh || '',
    HRM_phoi_hop_OB: row.HRM_phoi_hop_OB || '',
  });
};

  const handleAcceptClick = async () => {
    try {
      const now = new Date();
      const Ngay_dieu_chinh = now.toISOString();

      await axios.put(`http://localhost:5000/api/exceldatas/${editRowId}`, {
        ...editData,
        Ngay_dieu_chinh,
      });

      alert('Cập nhật thành công');
      setEditRowId(null);
      setEditData({ Nguoi_dieu_chinh: '', HRM_phoi_hop_OB: '' });
      fetchExcelData();
    } catch (error) {
      console.error('Lỗi cập nhật:', error);
      alert('Cập nhật thất bại');
    }
  };

  return (
    <div>
      <h2>Dữ liệu Excel</h2>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Nhập số điện thoại để tra cứu"
          value={searchKey}
          onChange={(e) => setSearchKey(e.target.value)}
          style={{ width: 200, padding: 5 }}
        />
        <button onClick={handleEditClick}>Sửa</button>
      </div>

      {editRowId && (
        <div style={{ marginBottom: 20 }}>
          <label style={{ marginRight: 10 }}>
            Người điều chỉnh:
            <input
              type="text"
              value={editData.Nguoi_dieu_chinh}
              onChange={(e) => setEditData({ ...editData, Nguoi_dieu_chinh: e.target.value })}
              style={{ marginLeft: 5, padding: 5 }}
            />
          </label>
          <label style={{ marginRight: 10 }}>
            HRM phối hợp OB:
            <input
              type="text"
              value={editData.HRM_phoi_hop_OB}
              onChange={(e) => setEditData({ ...editData, HRM_phoi_hop_OB: e.target.value })}
              style={{ marginLeft: 5, padding: 5 }}
            />
          </label>
          <button onClick={handleAcceptClick}>Chấp nhận</button>
        </div>
      )}

      <div style={{ marginBottom: 20 }}>
        <label>
          Tháng:
          <select value={month} onChange={(e) => setMonth(e.target.value)} style={{ marginLeft: 10 }}>
            <option value="">Tất cả</option>
            {[...Array(12)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </label>
        <label style={{ marginLeft: 20 }}>
          Năm:
          <select value={year} onChange={(e) => setYear(e.target.value)} style={{ marginLeft: 10 }}>
            <option value="">Tất cả</option>
            {[2025].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </label>
      </div>

      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            {filteredData[0] &&
              Object.keys(filteredData[0])
                .filter((key) => key !== '__v' && key !== 'HRM_bh' && key !== 'Ten_khach_hang')
                .map((key) => (
                  <th key={key} style={{ padding: '8px', border: '1px solid #ccc' }}>
                    {key}
                  </th>
                ))}
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item) => (
            <tr key={item._id}>
              {Object.entries(item)
                .filter(([key]) => key !== '__v' && key !== 'HRM_bh' && key !== 'Ten_khach_hang')
                .map(([key, value]) => (
                  <td key={key} style={{ padding: '8px', border: '1px solid #ccc' }}>
                    {key === 'Thoi_gian_giao_dich' && value
                      ? value // Hiển thị nguyên định dạng gốc từ DB
                      : (key === 'ngay_cn' || key === 'Ngay_dieu_chinh') && value
                      ? formatDateTime(new Date(value))
                      : value?.toString()}
                  </td>
                ))}
            </tr>
          ))}
          {filteredData.length === 0 && (
            <tr>
              <td colSpan={10} style={{ textAlign: 'center' }}>
                Không có dữ liệu phù hợp
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ExcelDataList;
