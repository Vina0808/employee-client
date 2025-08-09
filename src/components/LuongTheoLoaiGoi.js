import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Select, Table, Button, message } from 'antd';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import SignatureCanvas from 'react-signature-canvas';
import { exportAllLuongIntoOnePDF } from './ExportLuongNhanVienPDF';
import * as XLSX from 'xlsx';
import { FileExcelOutlined } from '@ant-design/icons';

const { Option } = Select;

const filterLabels = {
  phongBanHRM: 'Phòng ban',
  nhanVien: 'Nhân viên',
  congcubangoi: 'Công cụ bán gói',
  thuebaohvc: 'Thuê bao HVC',
  loaigiaodich: 'Loại giao dịch',
  hinhthuctb: 'Hình thức TB',
  dichvuvienthong: 'Dịch vụ viễn thông',
  thangNam: 'Tháng/Năm',
};

const customBtnStyle = (bgColor) => ({
  backgroundColor: bgColor,
  color: 'white',
  border: 'none',
  padding: '8px 16px',
  borderRadius: 6,
  fontWeight: 'bold',
});

function LuongTheoLoaiGoi() {
  const [data, setData] = useState([]);
  const [rawData, setRawData] = useState([]);
  const [filters, setFilters] = useState({
    phongBanHRM: [],
    nhanVien: [],
    congcubangoi: [],
    thuebaohvc: [],
    loaigiaodich: [],
    hinhthuctb: [],
    dichvuvienthong: [],
    thangNam: [],
  });
  const [selectedFilters, setSelectedFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const [showSigPad, setShowSigPad] = useState(false);
  const [signed, setSigned] = useState(false);
  const sigRef = useRef();
  const [pdfBlob, setPdfBlob] = useState(null);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null);

  const groupByMultipleFields = (data) => {
    const grouped = {};
    data.forEach(item => {
      const phong = item.PHONG_BAN_HRM || 'Không rõ';
      const nhanvien = item.NHAN_VIEN_BH || 'Không rõ';
      const congcubangoi = item.CONG_CU_BG || 'Không rõ';
      const thuebaohvc = item.THUEBAO_HVC || 'Không rõ';
      const loaiGD = item.LOAI_GIAO_DICH || 'Không rõ';
      const hinhthuc = item.HINHTHUC_TB || 'Không rõ';
      const dichvuvienthong = item.TEN_DVVT || 'Không rõ';
      const thangNam = item.THANGDL || 'Không rõ';
      const key = `${phong}|${nhanvien}|${congcubangoi}|${thuebaohvc}|${loaiGD}|${thangNam}`;

      if (!grouped[key]) {
        grouped[key] = {
          PHONG_BAN_HRM: phong,
          NHAN_VIEN_BH: nhanvien,
          CONG_CU_BG: congcubangoi,
          THUEBAO_HVC: thuebaohvc,
          LOAI_GIAO_DICH: loaiGD,
          HINHTHUC_TB: hinhthuc,
          TEN_DVVT: dichvuvienthong,
          THANG_NAM: thangNam,
          DOANH_THU: 0,
        };
      }
      grouped[key].DOANH_THU += item.GIA_GOI_CUOC || 0;
    });

    return Object.values(grouped);
  };

  const fetchData = async (params = {}) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/oracle/fact-hqkd-kenh-ban-goi', {
        params: {
          page: 1,
          pageSize: 1000,
          ...params,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const fetchedData = response.data?.data || [];
      setRawData(fetchedData);
      const groupedData = groupByMultipleFields(fetchedData);
      if (groupedData.length > 0) setData(groupedData);
      if (response.data?.filters) setFilters(response.data.filters);
    } catch (err) {
      console.error('❌ Lỗi khi lấy dữ liệu:', err);
      alert('⚠️ Không thể kết nối máy chủ. Dữ liệu cũ đang được giữ nguyên.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...selectedFilters, [key]: value };
    setSelectedFilters(newFilters);
    fetchData(newFilters);
  };

  const handleSendSignedPDF = async () => {
    if (!pdfBlob) {
      message.error('⚠️ Bạn chưa xuất PDF có chữ ký');
      return;
    }

    const formData = new FormData();
    formData.append('signedPDF', pdfBlob, 'luong_nhanvien_signed.pdf');
    formData.append('hrmName', rawData?.[0]?.NHAN_VIEN_BH || 'Không rõ');
    formData.append('hrmId', rawData?.[0]?.PHONG_BAN_HRM || 'Không rõ');
    formData.append('thangNam', rawData?.[0]?.THANGDL || 'Không rõ');

    try {
      await axios.post('http://localhost:5000/api/pdf/upload-signed', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      message.success('✅ Gửi PDF đã ký thành công');
    } catch (err) {
      console.error('❌ Lỗi khi gửi PDF:', err);
      message.error('🚫 Gửi PDF thất bại');
    }
  };

  const exportToExcel = () => {
    if (data.length === 0) {
      message.warning('⚠️ Không có dữ liệu để xuất.');
      return;
    }

    const excelData = data.map((item, idx) => ({
      STT: idx + 1,
      'Phòng ban': item.PHONG_BAN_HRM,
      'Nhân viên': item.NHAN_VIEN_BH,
      'Công cụ bán gói': item.CONG_CU_BG,
      'Thuê bao HVC': item.THUEBAO_HVC,
      'Loại giao dịch': item.LOAI_GIAO_DICH,
      'Hình thức TB': item.HINHTHUC_TB,
      'Dịch vụ Viễn thông': item.TEN_DVVT,
      'Tháng/Năm': item.THANG_NAM,
      'Doanh thu': item.DOANH_THU,
    }));

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'LuongTheoLoaiGoi');

    XLSX.writeFile(wb, `LuongTheoLoaiGoi_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const chartData = {
    labels: [...new Set(data.map(item => item.PHONG_BAN_HRM))],
    datasets: [
      {
        label: 'Tổng doanh thu theo Phòng ban',
        data: [...new Set(data.map(item => item.PHONG_BAN_HRM))].map(phong =>
          data.filter(item => item.PHONG_BAN_HRM === phong).reduce((sum, i) => sum + (i.DOANH_THU || 0), 0)
        ),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
    ],
  };

  const columns = [
    { title: 'Phòng ban', dataIndex: 'PHONG_BAN_HRM' },
    { title: 'Nhân viên', dataIndex: 'NHAN_VIEN_BH' },
    { title: 'Công cụ bán gói', dataIndex: 'CONG_CU_BG' },
    { title: 'Thuê bao HVC', dataIndex: 'THUEBAO_HVC' },
    { title: 'Loại giao dịch', dataIndex: 'LOAI_GIAO_DICH' },
    { title: 'Hình thức TB', dataIndex: 'HINHTHUC_TB' },
    { title: 'Dịch vụ viễn thông', dataIndex: 'TEN_DVVT' },
    {
      title: 'Doanh thu (VNĐ)',
      dataIndex: 'DOANH_THU',
      render: (value) => value.toLocaleString('vi-VN'),
    },
    { title: 'Tháng/Năm', dataIndex: 'THANG_NAM' },
  ];

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">📊 Tổng Hợp Lương Nhân Viên Theo Đơn Vị</h2>

      <div className="flex flex-wrap gap-3 mb-4">
        {Object.keys(filterLabels).map((filterKey) => (
          <Select
            key={filterKey}
            allowClear
            showSearch
            placeholder={`Chọn ${filterLabels[filterKey]}`}
            style={{
              minWidth: 220,
              backgroundColor: '#004d99',
              color: 'white',
              marginBottom: 6,
            }}
            dropdownStyle={{ backgroundColor: '#004d99', color: 'white' }}
            onChange={(value) => handleFilterChange(filterKey, value)}
          >
            {filters[filterKey]?.map((val) => (
              <Option key={val} value={val} style={{ color: 'white' }}>
                {val}
              </Option>
            ))}
          </Select>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <Button
          icon={<FileExcelOutlined />}
          onClick={exportToExcel}
          style={customBtnStyle('#28a745')}
        >
          Xuất Excel
        </Button>

        <Button
          style={customBtnStyle('#17a2b8')}
          onClick={() => {
            exportAllLuongIntoOnePDF(rawData, null, (blob) => {
              const url = URL.createObjectURL(blob);
              setPdfPreviewUrl(url);
              setPdfBlob(blob);
              setSigned(false);
            });
          }}
        >
          👁️ Xem trước PDF
        </Button>

        <Button
          style={customBtnStyle('#ffc107')}
          onClick={() => setShowSigPad(true)}
          disabled={signed}
        >
          ✍️ Ký tên & Xuất PDF
        </Button>

        <Button
          style={customBtnStyle('#007bff')}
          onClick={handleSendSignedPDF}
          disabled={!pdfBlob}
        >
          📤 Gửi PDF đã ký
        </Button>
      </div>

      {showSigPad && !signed && (
        <div className="bg-gray-100 p-4 mb-4 rounded">
          <SignatureCanvas
            ref={sigRef}
            penColor="black"
            canvasProps={{ width: 400, height: 150, className: 'border border-gray-300 rounded' }}
          />
          <div className="flex gap-2 mt-2">
            <Button type="primary" onClick={() => {
              if (sigRef.current) {
                const signature = sigRef.current.getCanvas().toDataURL('image/png');
                exportAllLuongIntoOnePDF(rawData, signature, (blob) => {
                  const url = URL.createObjectURL(blob);
                  setPdfPreviewUrl(url);
                  setPdfBlob(blob);
                  setSigned(true);
                  setShowSigPad(false);
                });
              }
            }}>
              ✅ Ký & Xuất PDF
            </Button>
            <Button onClick={() => sigRef.current?.clear()}>🧹 Xóa chữ ký</Button>
          </div>
        </div>
      )}

      {pdfPreviewUrl && (
        <iframe
          src={pdfPreviewUrl}
          title="Xem trước PDF"
          width="100%"
          height="700px"
          className="border mt-4"
        />
      )}

      <Bar data={chartData} />

      <Table
        className="mt-6"
        dataSource={data}
        columns={columns}
        rowKey={(record, idx) => idx}
        loading={loading}
        pagination={{ pageSize: 20 }}
      />
    </div>
  );
}

export default LuongTheoLoaiGoi;
