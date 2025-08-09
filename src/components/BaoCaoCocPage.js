import React, { useEffect, useState, useCallback } from 'react';
import CustomSelect from '../components/ui/CustomSelect';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import axios from 'axios';

function BaoCaoCocPage() {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    thang: '',
    ten_dv: '',
    nguoi_cn: '',
    ma_tb: '',
  });

  const [dropdownOptions, setDropdownOptions] = useState({
    thang: [],
    ten_dv: [],
    nguoi_cn: [],
    ma_tb: [],
  });

  const handleClearFilters = () => {
    setFilters({
      thang: '',
      ten_dv: '',
      nguoi_cn: '',
      ma_tb: '',
    });
    setPage(1);
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/baocao/giahan-datcoc', {
        params: {
          ...filters,
          page,
          pageSize,
        },
      });

      const resData = res.data;
      setData(resData.data || []);
      setTotal(resData.total || 0);

      const all = resData.all || [];
      setDropdownOptions({
        thang: [...new Set(all.map((d) => d.THANG))],
        ten_dv: [...new Set(all.map((d) => d.TEN_DV))],
        nguoi_cn: [...new Set(all.map((d) => d.NGUOI_CN))],
        ma_tb: [...new Set(all.map((d) => d.MA_TB))],
      });
    } catch (err) {
      console.error('❌ Lỗi fetch dữ liệu:', err);
    } finally {
      setLoading(false);
    }
  }, [filters, page, pageSize]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCustomSelectChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPage(1);
  };

  const exportToExcel = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/baocao/giahan-datcoc/export', {
        params: filters,
      });
      const allData = res.data?.data || [];

      if (!allData.length) return alert('Không có dữ liệu để xuất.');

      const exportData = allData.map((row, idx) => ({
        STT: idx + 1,
        'Mã TB': row.MA_TB,
        'Tên KH': row.TEN_KH,
        'Số tiền': row.SOTIEN,
        'Số tháng': row.SOTHANG,
        'Đơn vị': row.TEN_DV,
        'Người CN': row.NGUOI_CN,
        'Mã nhân viên MG': row.MA_NV_MG,
        'Tên nhân viên MG': row.TEN_NV_MG,
        'Tháng': row.THANG,
        'Hình thức trả': row.HT_TRA,
        'Loại hình TB': row.LOAIHINH_TB,
        'Loại DC': row.LOAI_DC,
        'Ngày bắt đầu': row.NGAY_BDDC,
        'Ngày kết thúc': row.NGAY_KTDC,
        'Dịch vụ viễn thông': row.TEN_DVVT,
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'BaoCaoCoc');
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      saveAs(new Blob([excelBuffer], { type: 'application/octet-stream' }), 'BaoCaoCoc.xlsx');
    } catch (error) {
      console.error('❌ Lỗi xuất Excel:', error);
    }
  };

  const mapToOptions = (arr) =>
    arr.filter(Boolean).map((item) => ({ value: item, label: item }));

  return (
    <div style={{ fontFamily: 'Arial', padding: '10px' }}>
      <h2 style={{ backgroundColor: '#007BFF', color: '#fff', padding: '10px', borderRadius: '5px', textAlign: 'center' }}>
        📊 Báo cáo Gia hạn Đặt cọc
      </h2>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px',
          marginBottom: '15px',
          backgroundColor: '#E3F2FD',
          padding: '10px',
          borderRadius: '5px',
        }}
      >
        <CustomSelect
          value={filters.thang}
          onChange={(val) => handleCustomSelectChange('thang', val)}
          options={mapToOptions(dropdownOptions.thang)}
          placeholder="-- Tháng --"
        />
        <CustomSelect
          value={filters.ten_dv}
          onChange={(val) => handleCustomSelectChange('ten_dv', val)}
          options={mapToOptions(dropdownOptions.ten_dv)}
          placeholder="-- Đơn vị --"
        />
        <CustomSelect
          value={filters.nguoi_cn}
          onChange={(val) => handleCustomSelectChange('nguoi_cn', val)}
          options={mapToOptions(dropdownOptions.nguoi_cn)}
          placeholder="-- Người CN --"
        />
        <CustomSelect
          value={filters.ma_tb}
          onChange={(val) => handleCustomSelectChange('ma_tb', val)}
          options={mapToOptions(dropdownOptions.ma_tb)}
          placeholder="-- Mã TB --"
        />

        <button onClick={handleClearFilters} style={btnStyle('#FF5722')}>❌ Xóa lọc</button>
        <button onClick={exportToExcel} style={btnStyle('#4CAF50')}>📥 Xuất Excel</button>
        <button onClick={fetchData} disabled={loading} style={btnStyle('#007BFF')}>🔄 Làm mới</button>
      </div>

      {loading ? (
        <p>⏳ Đang tải dữ liệu...</p>
      ) : (
        <>
          <p>🔢 Tổng bản ghi: {total}</p>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead style={{ backgroundColor: '#f2f2f2' }}>
              <tr>
                {[
                  'STT',
                  'Mã TB',
                  'Tên KH',
                  'Số tiền',
                  'Số tháng',
                  'Đơn vị',
                  'Người CN',
                  'Mã nhân viên MG',
                  'Tên nhân viên MG',
                  'Tháng',
                  'Hình thức trả',
                  'Loại hình TB',
                  'Loại DC',
                  'Ngày BD',
                  'Ngày KT',
                  'Dịch vụ viễn thông',
                ].map((col, idx) => (
                  <th key={idx} style={thStyle}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.length ? (
                data.map((row, idx) => (
                  <tr key={idx}>
                    <td style={tdStyle}>{(page - 1) * pageSize + idx + 1}</td>
                    <td style={tdStyle}>{row.MA_TB}</td>
                    <td style={tdStyle}>{row.TEN_KH}</td>
                    <td style={tdStyle}>{row.SOTIEN?.toLocaleString()}</td>
                    <td style={tdStyle}>{row.SOTHANG}</td>
                    <td style={tdStyle}>{row.TEN_DV}</td>
                    <td style={tdStyle}>{row.NGUOI_CN}</td>
                    <td style={tdStyle}>{row.MA_NV_MG}</td>
                    <td style={tdStyle}>{row.TEN_NV_MG}</td>
                    <td style={tdStyle}>{row.THANG}</td>
                    <td style={tdStyle}>{row.HT_TRA}</td>
                    <td style={tdStyle}>{row.LOAIHINH_TB}</td>
                    <td style={tdStyle}>{row.LOAI_DC}</td>
                    <td style={tdStyle}>{row.NGAY_BDDC ? new Date(row.NGAY_BDDC).toLocaleDateString() : ''}</td>
                    <td style={tdStyle}>{row.NGAY_KTDC ? new Date(row.NGAY_KTDC).toLocaleDateString() : ''}</td>
                    <td style={tdStyle}>{row.TEN_DVVT}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="16" style={{ textAlign: 'center', padding: '10px' }}>
                    Không có dữ liệu.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div style={{ marginTop: '10px', textAlign: 'center' }}>
            <button disabled={page <= 1} onClick={() => setPage(page - 1)}>◀ Trang trước</button>
            <span style={{ margin: '0 10px' }}>Trang {page}</span>
            <button disabled={data.length < pageSize} onClick={() => setPage(page + 1)}>Trang sau ▶</button>
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
};

const tdStyle = {
  border: '1px solid #ccc',
  padding: '4px 8px',
  textAlign: 'center',
};

const btnStyle = (bgColor) => ({
  padding: '6px 12px',
  backgroundColor: bgColor,
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
});

export default BaoCaoCocPage;
