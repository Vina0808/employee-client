// LuongCocDashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Select, Spin, Empty, Statistic } from 'antd';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const { Option } = Select;

function LuongCocDashboard() {
  const [rawData, setRawData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
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

  const generateChart = (groupedArray) => {
    if (!groupedArray.length) return null;

    const isFilteredByDV = !!selectedFilters.diachi_nv;
    const groupedByField = groupedArray.reduce((acc, item) => {
      const label = isFilteredByDV ? item.TEN_NV || 'Không rõ' : item.DIACHI_NV || 'Không rõ';
      if (!acc[label]) acc[label] = 0;
      acc[label] += item.SOTIEN || 0;
      return acc;
    }, {});

    const labels = Object.keys(groupedByField);
    const data = Object.values(groupedByField);

    return {
      labels,
      datasets: [
        {
          label: isFilteredByDV ? '💰 Tổng tiền theo Nhân viên' : '💰 Tổng tiền theo Địa chỉ ĐV',
          data,
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  const calculateTotal = (data) => data.reduce((sum, item) => sum + (item.SOTIEN || 0), 0);

  const handleFilter = () => {
    let data = [...rawData];
    if (selectedFilters.thang) data = data.filter((item) => item.THANG === selectedFilters.thang);
    if (selectedFilters.diachi_nv) data = data.filter((item) => item.DIACHI_NV === selectedFilters.diachi_nv);
    if (selectedFilters.ma_tb) data = data.filter((item) => item.MA_TB === selectedFilters.ma_tb);
    if (selectedFilters.ten_nv) data = data.filter((item) => item.TEN_NV === selectedFilters.ten_nv);

    const grouped = groupData(data);
    setFilteredData(grouped);
    setChartData(generateChart(grouped));
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get('http://localhost:5000/api/baocao/luong-tien-coc');
        const all = res.data?.data || [];
        setRawData(all);

        setFilters({
          thang: [...new Set(all.map((d) => d.THANG))].filter(Boolean),
          diachi_nv: [...new Set(all.map((d) => d.DIACHI_NV))].filter(Boolean),
          ten_nv: [],
          ma_tb: [...new Set(all.map((d) => d.MA_TB))].filter(Boolean),
        });

        const grouped = groupData(all);
        setFilteredData(grouped);
        setChartData(generateChart(grouped));
      } catch (err) {
        console.error('❌ Lỗi khi lấy dữ liệu:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedFilters.diachi_nv) {
      const filteredByDV = rawData.filter((item) => item.DIACHI_NV === selectedFilters.diachi_nv);
      setFilters((prev) => ({
        ...prev,
        ten_nv: [...new Set(filteredByDV.map((d) => d.TEN_NV))].filter(Boolean),
      }));
    } else {
      setFilters((prev) => ({
        ...prev,
        ten_nv: [...new Set(rawData.map((d) => d.TEN_NV))].filter(Boolean),
      }));
    }

    handleFilter();
  }, [selectedFilters]);

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

      <div className="flex flex-wrap gap-4 items-center mb-4">
        <Select className="min-w-[200px] max-w-[280px]" allowClear placeholder="🗓️ Tháng"
          onChange={(val) => setSelectedFilters((prev) => ({ ...prev, thang: val }))}>
          {filters.thang.map((val) => <Option key={val} value={val}>{val}</Option>)}
        </Select>

        <Select className="min-w-[260px] max-w-[320px]" allowClear placeholder="🏢 Địa chỉ ĐV"
          onChange={(val) => setSelectedFilters((prev) => ({ ...prev, diachi_nv: val }))}>
          {filters.diachi_nv.map((val) => <Option key={val} value={val}>{val}</Option>)}
        </Select>

        <Select className="min-w-[200px] max-w-[260px]" allowClear placeholder="🔎 Mã TB"
          onChange={(val) => setSelectedFilters((prev) => ({ ...prev, ma_tb: val }))}>
          {filters.ma_tb.map((val) => <Option key={val} value={val}>{val}</Option>)}
        </Select>

        <Select className="min-w-[240px] max-w-[300px]" allowClear placeholder="👤 Nhân viên"
          value={selectedFilters.ten_nv}
          onChange={(val) => setSelectedFilters((prev) => ({ ...prev, ten_nv: val }))}>
          {filters.ten_nv.map((val) => <Option key={val} value={val}>{val}</Option>)}
        </Select>

        <button
          onClick={() => {
            const ws = XLSX.utils.json_to_sheet(filteredData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'LuongCoc');
            const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
            const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
            saveAs(blob, 'LuongCoc.xlsx');
          }}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow ml-auto"
        >
          📥 Xuất Excel
        </button>
      </div>

      <div className="mb-6 text-center">
        <p className="text-lg font-bold text-red-600 mb-1">💵 Tổng số tiền</p>
        <Statistic
          value={calculateTotal(filteredData)}
          valueStyle={{ color: '#e53e3e', fontWeight: 'bold', fontSize: 24 }}
          precision={0}
          suffix="VNĐ"
          groupSeparator="."
        />
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
