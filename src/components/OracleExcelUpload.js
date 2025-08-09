import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table,
  Typography,
  Spin,
  Button,
  Upload,
  message,
  Space
} from 'antd';
import {
  UploadOutlined,
  ReloadOutlined
} from '@ant-design/icons';

const { Title } = Typography;

const OracleExcelUpload = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/oracle-upload/data');
      setData(res.data);
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu từ Oracle:', error);
      message.error('❌ Không thể lấy dữ liệu!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const props = {
    name: 'file',
    accept: '.xlsx',
    showUploadList: false,
    customRequest: async ({ file, onSuccess, onError }) => {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      try {
        const res = await axios.post('http://localhost:5000/api/oracle-upload/upload', formData);
        message.success(res.data.message || '✅ Upload thành công!');
        fetchData(); // Làm mới sau khi upload
        onSuccess();
      } catch (err) {
        console.error('❌ Upload lỗi:', err);
        message.error('❌ Upload thất bại!');
        onError(err);
      } finally {
        setUploading(false);
      }
    }
  };

  const columns = [
    { title: 'STT', dataIndex: 'STT', key: 'STT' },
    { title: 'HRM BH', dataIndex: 'HRM_BH', key: 'HRM_BH' },
    { title: 'Nhân viên', dataIndex: 'NHAN_VIEN', key: 'NHAN_VIEN' },
    { title: 'Phòng ban HRM', dataIndex: 'PHONG_BAN_HRM', key: 'PHONG_BAN_HRM' },
    { title: 'Số TB', dataIndex: 'SO_TB', key: 'SO_TB' },
    { title: 'User BH', dataIndex: 'USER_BH', key: 'USER_BH' },
    {
      title: 'Ngày BH',
      dataIndex: 'NGAY_BH',
      key: 'NGAY_BH',
      render: (value) => value ? new Date(value).toLocaleString() : ''
    },
    { title: 'Gói cước', dataIndex: 'GOI_CUOC', key: 'GOI_CUOC' },
    { title: 'Chu kỳ gói', dataIndex: 'CHU_KY_GOI', key: 'CHU_KY_GOI' },
    { title: 'Giá gói', dataIndex: 'GIA_GOI', key: 'GIA_GOI' },
    { title: 'Loại TB Tháng', dataIndex: 'LOAI_TB_THANG', key: 'LOAI_TB_THANG' },
    { title: 'Hình thức TB', dataIndex: 'HINH_THUC_TB', key: 'HINH_THUC_TB' },
    { title: 'Công cụ bán gói', dataIndex: 'CONG_CU_BAN_GOI', key: 'CONG_CU_BAN_GOI' },
    { title: 'Thuê bao HVC', dataIndex: 'THUE_BAO_HVC', key: 'THUE_BAO_HVC' },
    { title: 'Loại giao dịch', dataIndex: 'LOAI_GIAO_DICH', key: 'LOAI_GIAO_DICH' },
    { title: 'Dịch vụ viễn thông', dataIndex: 'DICH_VU_VIEN_THONG', key: 'DICH_VU_VIEN_THONG' },
    { title: 'Tháng DL', dataIndex: 'THANG_DL', key: 'THANG_DL' },
    {
      title: 'Ngày CN',
      dataIndex: 'NGAY_CN',
      key: 'NGAY_CN',
      render: (value) => value ? new Date(value).toLocaleString() : ''
    }
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>📊 Dữ liệu EXCEL_UPLOAD từ Oracle</Title>

      <Space style={{ marginBottom: 16 }}>
        <Upload {...props}>
          <Button icon={<UploadOutlined />} loading={uploading}>
            Tải lên Excel
          </Button>
        </Upload>
        <Button icon={<ReloadOutlined />} onClick={fetchData} loading={loading}>
          Làm mới
        </Button>
      </Space>

      {loading ? (
        <Spin size="large" />
      ) : (
        <Table
          columns={columns}
          dataSource={data}
          rowKey={(record, index) => index}
          pagination={{ pageSize: 20 }}
          scroll={{ x: 1500 }}
        />
      )}
    </div>
  );
};

export default OracleExcelUpload;
