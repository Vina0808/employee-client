import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Select, Table, Button, message } from 'antd';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import SignatureCanvas from 'react-signature-canvas';
import { exportAllLuongIntoOnePDF } from './ExportLuongNhanVienPDF';

const { Option } = Select;

function LuongTheoLoaiGoi() {
  const [data, setData] = useState([]);
  const [rawData, setRawData] = useState([]);
  const [filters, setFilters] = useState({
    phongBanHRM: [],
    phongBH: [],
    nhanVien: [],
    loaigiaodich: [],
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
      const loaiGD = item.LOAI_GIAO_DICH || 'Không rõ';
      const thangNam = item.THANGDL || 'Không rõ';
      const key = `${phong} | ${nhanvien} | ${loaiGD} | ${thangNam}`;

      if (!grouped[key]) {
        grouped[key] = {
          PHONG_BAN_HRM: phong,
          NHAN_VIEN_BH: nhanvien,
          LOAI_GIAO_DICH: loaiGD,
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
    const token = localStorage.getItem('token'); // 👈 lấy token từ localStorage

    const response = await axios.get('http://localhost:5000/api/oracle/fact-hqkd-kenh-ban-goi', {
      params: {
        page: 1,
        pageSize: 1000,
        ...params,
      },
      headers: {
        Authorization: `Bearer ${token}`, // 👈 thêm dòng này
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
    { title: 'Loại giao dịch', dataIndex: 'LOAI_GIAO_DICH' },
    { title: 'Tháng/Năm', dataIndex: 'THANG_NAM' },
    {
      title: 'Doanh thu (VNĐ)',
      dataIndex: 'DOANH_THU',
      render: (value) => value.toLocaleString('vi-VN'),
    },
  ];

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">📊 Tổng Hợp Lương Nhân Viên Theo Đơn Vị</h2>

      <div className="flex gap-4 mb-4 justify-end">
        <Button
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

        <Button onClick={() => setShowSigPad(true)} disabled={signed}>
          ✍️ Ký tên & Xuất PDF
        </Button>

        <Button onClick={handleSendSignedPDF} disabled={!pdfBlob}>
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
            <Button
              type="primary"
              onClick={() => {
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
              }}
            >
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

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
        <Select allowClear placeholder="Chọn Phòng ban" onChange={(value) => handleFilterChange('phongBanHRM', value)}>
          {filters.phongBanHRM.map((val) => (
            <Option key={val} value={val}>{val}</Option>
          ))}
        </Select>

        <Select allowClear placeholder="Chọn Nhân viên" onChange={(value) => handleFilterChange('nhanVien', value)}>
          {filters.nhanVien.map((val) => (
            <Option key={val} value={val}>{val}</Option>
          ))}
        </Select>

        <Select allowClear placeholder="Loại giao dịch" onChange={(value) => handleFilterChange('loaigiaodich', value)}>
          {filters.loaigiaodich.map((val) => (
            <Option key={val} value={val}>{val}</Option>
          ))}
        </Select>

        <Select allowClear placeholder="Dịch vụ viễn thông" onChange={(value) => handleFilterChange('dichvuvienthong', value)}>
          {filters.dichvuvienthong.map((val) => (
            <Option key={val} value={val}>{val}</Option>
          ))}
        </Select>

        <Select allowClear placeholder="Tháng/Năm" onChange={(value) => handleFilterChange('thangNam', value)}>
          {filters.thangNam.map((val) => (
            <Option key={val} value={val}>{val}</Option>
          ))}
        </Select>
      </div>

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
