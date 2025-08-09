import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Select, message } from 'antd';
import { FileExcelOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';

const { Option } = Select;

function BaoCaoCocPage() {
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({ thang: [], ten_dv: [], nguoi_cn: [], ma_tb: [] });
  const [selectedFilters, setSelectedFilters] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchData = async (params = {}) => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/oracle/bao-cao-coc', {
        params,
      });
      setData(res.data?.data || []);
      if (res.data?.filters) setFilters(res.data.filters);
    } catch (err) {
      console.error('Lỗi lấy dữ liệu:', err);
      message.error('Không thể lấy dữ liệu từ server.');
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

  const handleExportExcel = () => {
    if (data.length === 0) {
      message.warning('Không có dữ liệu để xuất.');
      return;
    }
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'BaoCaoCoc');
    XLSX.writeFile(workbook, 'BaoCaoCoc.xlsx');
  };

  const handleClearFilters = () => {
    setSelectedFilters({});
    fetchData();
  };

  const columns = [
    { title: 'Tháng', dataIndex: 'THANG', key: 'THANG' },
    { title: 'Đơn vị', dataIndex: 'TEN_DV', key: 'TEN_DV' },
    { title: 'Người cập nhật', dataIndex: 'NGUOI_CN', key: 'NGUOI_CN' },
    { title: 'Mã TB', dataIndex: 'MA_TB', key: 'MA_TB' },
    { title: 'Tổng số tiền', dataIndex: 'TONG_TIEN', key: 'TONG_TIEN', render: val => val?.toLocaleString('vi-VN') },
  ];

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">📊 Báo Cáo Cọc</h2>

      <div className="flex flex-wrap gap-3 mb-4">
        <Select
          allowClear
          placeholder="Tháng"
          style={{ minWidth: 160 }}
          value={selectedFilters.thang}
          onChange={(value) => handleFilterChange('thang', value)}
        >
          {filters.thang.map((val) => (
            <Option key={val} value={val}>{val}</Option>
          ))}
        </Select>

        <Select
          allowClear
          placeholder="🏢 Địa chỉ ĐV"
          style={{ minWidth: 200 }}
          value={selectedFilters.ten_dv}
          onChange={(value) => handleFilterChange('ten_dv', value)}
        >
          {filters.ten_dv.map((val) => (
            <Option key={val} value={val}>{val}</Option>
          ))}
        </Select>

        <Select
          allowClear
          placeholder="👤 Nhân viên"
          style={{ minWidth: 180 }}
          value={selectedFilters.nguoi_cn}
          onChange={(value) => handleFilterChange('nguoi_cn', value)}
        >
          {filters.nguoi_cn.map((val) => (
            <Option key={val} value={val}>{val}</Option>
          ))}
        </Select>

        <Select
          allowClear
          placeholder="🔎 Mã TB"
          style={{ minWidth: 160 }}
          value={selectedFilters.ma_tb}
          onChange={(value) => handleFilterChange('ma_tb', value)}
        >
          {filters.ma_tb.map((val) => (
            <Option key={val} value={val}>{val}</Option>
          ))}
        </Select>

        <Button
          icon={<FileExcelOutlined />}
          onClick={handleExportExcel}
          style={{ backgroundColor: '#28a745', color: 'white', border: 'none' }}
        >
          📥 Xuất Excel
        </Button>

        <Button danger onClick={handleClearFilters}>❌ Xóa lọc</Button>
      </div>

      <Table
        dataSource={data}
        columns={columns}
        rowKey={(record, idx) => idx}
        loading={loading}
        pagination={{ pageSize: 20 }}
      />
    </div>
  );
}

export default BaoCaoCocPage;
