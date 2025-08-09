// ⚠️ GIỮ NGUYÊN PHẦN import, không đổi logic xử lý
import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { Table, Select, Spin, Empty, Statistic } from 'antd';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { FileExcelOutlined, ReloadOutlined } from '@ant-design/icons';

const { Option } = Select;

// ✅ Hàm tạo style cho nút giống file LuongTheoLoaiGoi
const customBtnStyle = (bgColor) => ({
  backgroundColor: bgColor,
  color: 'white',
  border: 'none',
  padding: '8px 16px',
  borderRadius: 6,
  fontWeight: 'bold',
});

function LuongCocDashboard() {
  const [rawData, setRawData] = useState([]);
  const [filters, setFilters] = useState({ thang: [], diachi_nv: [], ma_tb: [], ten_nv: [] });
  const [selectedFilters, setSelectedFilters] = useState({});
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);

  const groupData = (data) => {
    const grouped = {};
    data.forEach((item) => {
      const key = `${item.THANG}-${item.MA_TB}`;
      if (!grouped[key]) {
        grouped[key] = {
          THANG: item.THANG,
          MA_TB: item.MA_TB,
          DIACHI_NV: item.DIACHI_NV,
          TEN_NV: item.TEN_NV,
          SOTIEN: 0,
        };
      }
      grouped[key].SOTIEN += parseFloat(item.SOTIEN || 0);
    });
    return Object.values(grouped);
  };

  const filteredData = useMemo(() => {
    let data = [...rawData];
    if (selectedFilters.thang) data = data.filter((item) => item.THANG === selectedFilters.thang);
    if (selectedFilters.diachi_nv) data = data.filter((item) => item.DIACHI_NV === selectedFilters.diachi_nv);
    if (selectedFilters.ten_nv) data = data.filter((item) => item.TEN_NV === selectedFilters.ten_nv);
    if (selectedFilters.ma_tb) data = data.filter((item) => item.MA_TB === selectedFilters.ma_tb);
    return groupData(data);
  }, [rawData, selectedFilters]);

  const generateChart = (groupedArray) => {
    if (!groupedArray.length) return null;

    const isFilteredByDV = !!selectedFilters.diachi_nv;
    const groupedByField = groupedArray.reduce((acc, item) => {
      const label = isFilteredByDV ? item.TEN_NV || 'Không rõ' : item.DIACHI_NV || 'Không rõ';
      acc[label] = (acc[label] || 0) + item.SOTIEN;
      return acc;
    }, {});

    return {
      labels: Object.keys(groupedByField),
      datasets: [
        {
          label: isFilteredByDV ? '💰 Tổng tiền theo Nhân viên' : '💰 Tổng tiền theo Địa chỉ ĐV',
          data: Object.values(groupedByField),
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  const calculateTotal = (data) => data.reduce((sum, item) => sum + (item.SOTIEN || 0), 0);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams(selectedFilters).toString();
      const res = await axios.get(`http://localhost:5000/api/baocao/luong-tien-coc?${params}`);
      const all = res.data?.data || [];
      setRawData(all);

      setFilters({
      thang: [...new Set(all.map((d) => d.THANG))]
        .filter(Boolean)
        .sort((a, b) => a - b), // 👈 Sắp xếp số tăng dần
      diachi_nv: [...new Set(all.map((d) => d.DIACHI_NV))].filter(Boolean),
      ten_nv: [...new Set(all.map((d) => d.TEN_NV))].filter(Boolean),
      ma_tb: [...new Set(all.map((d) => d.MA_TB))].filter(Boolean),
    });

    } catch (err) {
      console.error('❌ Lỗi khi lấy dữ liệu:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedFilters]);

  useEffect(() => {
    setChartData(generateChart(filteredData));
  }, [filteredData]);

  const columns = [
    { title: 'Tháng', dataIndex: 'THANG' },
    { title: 'Mã TB', dataIndex: 'MA_TB' },
    { title: 'Nhân viên', dataIndex: 'TEN_NV', render: (val) => val || 'Không rõ' },
    { title: 'Địa chỉ ĐV', dataIndex: 'DIACHI_NV' },
    {
      title: 'Tổng số tiền',
      dataIndex: 'SOTIEN',
      render: (value) => Number(value).toLocaleString('vi-VN') + ' đ',
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">
        📊 Dashboard Lương Tiền Cọc Nhân Viên Theo Tháng
      </h2>

      <div className="bg-white p-4 rounded shadow mb-6 overflow-x-auto">
        <div className="flex flex-wrap gap-3 mb-4">
          {[
            { key: 'thang', label: '🗓️ Tháng' },
            { key: 'diachi_nv', label: '🏢 Địa chỉ ĐV' },
            { key: 'ten_nv', label: '👤 Nhân viên' },
            { key: 'ma_tb', label: '🔎 Mã TB' },
          ].map(({ key, label }) => (
            <Select
              key={key}
              allowClear
              showSearch
              placeholder={`Chọn ${label}`}
              style={{
                minWidth: 220,
                backgroundColor: '#004d99',
                color: 'white',
              }}
              dropdownStyle={{ backgroundColor: '#004d99', color: 'white' }}
              value={selectedFilters[key]}
              onChange={(val) => setSelectedFilters((prev) => ({ ...prev, [key]: val }))}
            >
              {filters[key].map((val) => (
                <Option key={val} value={val} style={{ color: 'white' }}>
                  {val}
                </Option>
              ))}
            </Select>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => {
              const ws = XLSX.utils.json_to_sheet(filteredData);
              const wb = XLSX.utils.book_new();
              XLSX.utils.book_append_sheet(wb, ws, 'LuongCoc');
              const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
              const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
              saveAs(blob, 'LuongCoc.xlsx');
            }}
            style={customBtnStyle('#28a745')}
          >
            <FileExcelOutlined /> Xuất Excel
          </button>

          <button
            onClick={() => setSelectedFilters({})}
            style={customBtnStyle('#dc3545')}
          >
            <ReloadOutlined /> Xoá lọc
          </button>
        </div>
      </div>

      {/* Tổng số tiền và số TB */}
      <div className="mb-6 bg-white py-4 px-6 rounded shadow max-w-2xl mx-auto">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-lg font-extrabold text-gray-800 mb-1">💵 Tổng số tiền</p>
            <Statistic
              value={calculateTotal(filteredData)}
              valueStyle={{ color: '#e53e3e', fontWeight: 'bold', fontSize: 24 }}
              precision={0}
              suffix="VNĐ"
              groupSeparator="."
            />
          </div>
          <div className="text-right">
            <p className="text-lg font-extrabold text-gray-800 mb-1">📌 Số lượng TB đã gia hạn</p>
            <p className="text-blue-700 font-bold text-2xl">
              {filteredData.length.toLocaleString('vi-VN')}
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center mt-10">
          <Spin tip="Đang tải dữ liệu..." />
        </div>
      ) : (
        <>
          {chartData ? (
            <div className="mb-6 max-w-6xl mx-auto bg-white p-4 rounded shadow">
              <Bar data={chartData} />
            </div>
          ) : (
            <Empty description="Không có dữ liệu biểu đồ" />
          )}

          <div className="bg-white p-4 rounded shadow">
            <Table
              columns={columns}
              dataSource={filteredData}
              rowKey={(r, idx) => idx}
              pagination={{ pageSize: 20 }}
              locale={{ emptyText: 'Không có dữ liệu bảng' }}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default LuongCocDashboard;
