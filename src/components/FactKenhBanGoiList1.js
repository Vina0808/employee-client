import React, { useEffect, useState, useCallback } from 'react';
import CustomSelect from './ui/CustomSelect';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

function FactKenhBanGoiList() {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    soTB: '',
    phongBH: '',
    nhanVien: '',
    thangNam: '',
    loaigiaodich: '',
    dichvuvienthong: '',
  });

  const [dropdowns, setDropdowns] = useState({
    phongBH: [],
    nhanVien: [],
    loaigiaodich: [],
    thangNam: [],
    dichvuvienthong: [],
  });

  const handleClearFilters = () => {
    setFilters({
      soTB: '',
      phongBH: '',
      nhanVien: '',
      thangNam: '',
      loaigiaodich: '',
      dichvuvienthong: '',
    });
    setPage(1);
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page,
        pageSize,
        ...filters,
      });

      const res = await fetch(`http://localhost:5000/api/oracle/fact-hqkd-kenh-ban-goi?${params}`);

      if (!res.ok) {
        const errText = await res.text();
        console.error('❌ API trả về lỗi:', res.status, errText);
        return;
      }

      const json = await res.json();

      setData(Array.isArray(json.data) ? json.data : []);
      setTotal(json.total || 0);
      setDropdowns({
        phongBH: json.filters?.phongBH || [],
        nhanVien: json.filters?.nhanVien || [],
        thangNam: json.filters?.thangNam || [],
        loaigiaodich: json.filters?.loaigiaodich || [],
        dichvuvienthong: json.filters?.dichvuvienthong || [],
      });
    } catch (error) {
      console.error('❌ Lỗi khi fetch dữ liệu:', error);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, filters]);

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 10 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, [fetchData]);

  const handleInputChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setPage(1);
  };

  const handleCustomSelectChange = (name, val) => {
    setFilters({ ...filters, [name]: val });
    setPage(1);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date)) return '';
    return `${String(date.getDate()).padStart(2, '0')}/${
      String(date.getMonth() + 1).padStart(2, '0')}/${
      date.getFullYear()}`;
  };

  const mapToOptions = (arr) => arr.map((item) => ({ value: item, label: item }));

  const exportToExcel = () => {
    if (!data || data.length === 0) return alert('Không có dữ liệu để xuất.');

    const exportData = data.map((row, idx) => ({
      STT: (page - 1) * pageSize + idx + 1,
      'Phòng BH': row.PHONG_BH,
      'HRM BH': row.HRM_BH,
      'Nhân viên': row.NHAN_VIEN_BH,
      'Số TB': row.SO_TB,
      'User BH': row.USER_BH,
      'Ngày BH': formatDate(row.NGAY_BH),
      'Gói cước': row.TEN_GOI_CUOC,
      'Chu kỳ gói': row.CHU_KY_GOI,
      'Giá gói': row.GIA_GOI_CUOC,
      'Loại TB Tháng': row.LOAI_TB_THANG,
      'Hình thức TB': row.HINHTHUC_TB,
      'Công cụ bán gói': row.CONG_CU_BG,
      'Thuê bao HVC': row.THUEBAO_HVC,
      'Loại giao dịch': row.LOAI_GIAO_DICH,
      'Tháng DL': row.THANGDL,
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Export');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'KenhBanHang.xlsx');
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '10px' }}>
      <h2 style={{ backgroundColor: '#007BFF', color: 'white', padding: '10px', borderRadius: '5px', textAlign: 'center' }}>
        📊 Dữ liệu Tổng hợp Kênh Bán Hàng
      </h2>

      <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#E3F2FD', borderRadius: '5px', display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
        <input name="soTB" placeholder="Số TB" value={filters.soTB} onChange={handleInputChange} style={{ padding: '5px' }} />

        <CustomSelect value={filters.phongBH} onChange={(val) => handleCustomSelectChange('phongBH', val)} options={mapToOptions(dropdowns.phongBH)} placeholder="-- Phòng BH --" />
        <CustomSelect value={filters.nhanVien} onChange={(val) => handleCustomSelectChange('nhanVien', val)} options={mapToOptions(dropdowns.nhanVien)} placeholder="-- Nhân viên --" />
        <CustomSelect value={filters.thangNam} onChange={(val) => handleCustomSelectChange('thangNam', val)} options={mapToOptions(dropdowns.thangNam)} placeholder="-- Tháng/Năm --" />
        <CustomSelect value={filters.loaigiaodich} onChange={(val) => handleCustomSelectChange('loaigiaodich', val)} options={mapToOptions(dropdowns.loaigiaodich)} placeholder="-- LOẠI GIAO DỊCH --" />
        <CustomSelect value={filters.dichvuvienthong} onChange={(val) => handleCustomSelectChange('dichvuvienthong', val)} options={mapToOptions(dropdowns.dichvuvienthong)} placeholder="-- Dịch vụ viễn thông --" />

        <button onClick={handleClearFilters} style={{ padding: '6px 12px', backgroundColor: '#FF5722', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>❌ Xóa lọc</button>
        <button onClick={exportToExcel} style={{ padding: '6px 12px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>📥 Xuất Excel</button>
        <button onClick={fetchData} disabled={loading} style={{ marginLeft: 'auto', padding: '6px 12px', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>🔄 Làm mới</button>
      </div>

      {loading ? (
        <p>⏳ Đang tải dữ liệu...</p>
      ) : (
        <div>
          <p>🔢 Tổng bản ghi: {total}</p>
          <table style={{ width: '100%', fontSize: '14px', borderCollapse: 'collapse', border: '1px solid #ccc' }}>
            <thead style={{ backgroundColor: '#f2f2f2' }}>
              <tr>
                {[ 'STT', 'Phòng BH', 'HRM BH', 'Nhân viên', 'Số TB', 'User BH', 'Ngày BH', 'Gói cước', 'Chu kỳ gói', 'Giá gói', 'Loại TB Tháng', 'Hình thức TB', 'Công cụ bán gói', 'Thuê bao HVC', 'Loại giao dịch', 'Tháng DL' ].map((header, idx) => (
                  <th key={idx} style={{ border: '1px solid #ccc', padding: '6px', textAlign: 'center' }}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((row, idx) => (
                  <tr key={idx}>
                    <td style={tdStyle}>{(page - 1) * pageSize + idx + 1}</td>
                    <td style={tdStyle}>{row.PHONG_BH}</td>
                    <td style={tdStyle}>{row.HRM_BH}</td>
                    <td style={tdStyle}>{row.NHAN_VIEN_BH}</td>
                    <td style={tdStyle}>{row.SO_TB}</td>
                    <td style={tdStyle}>{row.USER_BH}</td>
                    <td style={tdStyle}>{formatDate(row.NGAY_BH)}</td>
                    <td style={tdStyle}>{row.TEN_GOI_CUOC}</td>
                    <td style={tdStyle}>{row.CHU_KY_GOI}</td>
                    <td style={tdStyle}>{row.GIA_GOI_CUOC}</td>
                    <td style={tdStyle}>{row.LOAI_TB_THANG}</td>
                    <td style={tdStyle}>{row.HINHTHUC_TB}</td>
                    <td style={tdStyle}>{row.CONG_CU_BG}</td>
                    <td style={tdStyle}>{row.THUEBAO_HVC}</td>
                    <td style={tdStyle}>{row.LOAI_GIAO_DICH}</td>
                    <td style={tdStyle}>{row.THANGDL}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="16" style={{ textAlign: 'center', padding: '10px' }}>Không có dữ liệu.</td>
                </tr>
              )}
            </tbody>
          </table>

          <div style={{ marginTop: '10px', textAlign: 'center' }}>
            <button disabled={page <= 1} onClick={() => setPage(page - 1)}>◀ Trang trước</button>
            <span style={{ margin: '0 10px' }}>Trang {page}</span>
            <button disabled={data.length < pageSize} onClick={() => setPage(page + 1)}>Trang sau ▶</button>
          </div>
        </div>
      )}
    </div>
  );
}

const tdStyle = {
  border: '1px solid #ccc',
  padding: '4px 8px',
  textAlign: 'center',
};

export default FactKenhBanGoiList;
