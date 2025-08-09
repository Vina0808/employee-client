import React, { useEffect, useState } from 'react';
import { Table, Select, Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;
const { Option } = Select;

function ThongTinCaNhan() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const ma_nv = localStorage.getItem('ma_nv');
  const role = (localStorage.getItem('role') || '').toLowerCase();
  const chuc_danh = (localStorage.getItem('chuc_danh') || '').toLowerCase();
  const token = localStorage.getItem('token');

  const adminChucDanhKeywords = [
    'giám đốc',
    'trưởng phòng',
    'phó phòng',
    'điều hành',
    'quản lý',
    'chính sách'
  ];

  const managerTitles = [
    'giám đốc trung tâm',
    'phó giám đốc trung tâm',
    'giám đốc phòng bán hàng',
    'phó giám đốc phòng bán hàng'
  ];

  const isAdminByChucDanh = adminChucDanhKeywords.some(keyword =>
    chuc_danh.includes(keyword)
  );

  const isManagerByChucDanh = managerTitles.some(title =>
    chuc_danh.includes(title)
  );

  const getRoleLabel = () => {
    if (role === 'admin' || ma_nv === 'VNP019482' || isAdminByChucDanh) {
      return 'Admin: toàn bộ nhân sự';
    }
    if (role === 'manager' || isManagerByChucDanh) {
      return 'Manager: quản lý nhân sự đơn vị';
    }
    return 'Cá nhân';
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!token || !ma_nv || !role) {
        navigate('/login');
        return;
      }

      try {
        const res = await fetch('http://localhost:5000/api/hrm-login/employees', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await res.json();

        if (!res.ok) {
          throw new Error(result.message || 'Lỗi lấy dữ liệu');
        }

        let visibleData = result;

        if (role === 'user' && !isAdminByChucDanh && !isManagerByChucDanh) {
          visibleData = result.filter(item => item.ma_nv === ma_nv);
        } else if (role === 'manager' || isManagerByChucDanh) {
          const myUnit = result.find(item => item.ma_nv === ma_nv)?.donvi_dl_id;
          visibleData = result.filter(item => item.donvi_dl_id === myUnit);
        }

        setData(visibleData);
        setFilteredData(visibleData);

        const uniqueValues = (key) =>
          [...new Set(visibleData.map((item) => item[key] || ''))].filter(Boolean);

        setFilters({
          ma_nv: uniqueValues('ma_nv'),
          ten_nv: uniqueValues('ten_nv'),
          email: uniqueValues('email'),
          so_dt: uniqueValues('so_dt'),
          chuc_danh: uniqueValues('chuc_danh'),
          donvi_dl_id: uniqueValues('donvi_dl_id'),
          dia_chi: uniqueValues('dia_chi'),
        });
      } catch (err) {
        console.error('❌ Lỗi lấy dữ liệu:', err.message);
        message.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [ma_nv, role, chuc_danh, token, navigate]);

  const handleFilterChange = (key, selectedValues) => {
    const newSelectedFilters = {
      ...selectedFilters,
      [key]: selectedValues,
    };
    setSelectedFilters(newSelectedFilters);

    const filtered = data.filter((item) =>
      Object.entries(newSelectedFilters).every(([field, values]) => {
        if (!values || values.length === 0) return true;
        return values.includes(item[field]);
      })
    );

    setFilteredData(filtered);
  };

  const createColumn = (title, dataIndex) => ({
    title: (
      <div>
        {title}
        <br />
        <Select
          mode="multiple"
          allowClear
          showSearch
          style={{ width: '100%' }}
          placeholder={`Lọc ${title}`}
          value={selectedFilters[dataIndex]}
          onChange={(vals) => handleFilterChange(dataIndex, vals)}
        >
          {filters[dataIndex]?.map((v) => (
            <Option key={v} value={v}>
              {v}
            </Option>
          ))}
        </Select>
      </div>
    ),
    dataIndex,
    key: dataIndex,
    sorter: (a, b) => {
      const aVal = (a[dataIndex] ?? '').toString();
      const bVal = (b[dataIndex] ?? '').toString();
      return aVal.localeCompare(bVal);
    },
  });

  const columns = [
    createColumn('Mã NV', 'ma_nv'),
    createColumn('Tên NV', 'ten_nv'),
    createColumn('Email', 'email'),
    createColumn('Số ĐT', 'so_dt'),
    createColumn('Chức danh', 'chuc_danh'),
    createColumn('Đơn vị DL', 'donvi_dl_id'),
    createColumn('Địa chỉ', 'dia_chi'),
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>Thông tin nhân viên ({getRoleLabel()})</Title>
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="ma_nv"
        loading={loading}
        bordered
        pagination={{ pageSize: 10 }}
        scroll={{ x: '100%' }}
      />
    </div>
  );
}

export default ThongTinCaNhan;
