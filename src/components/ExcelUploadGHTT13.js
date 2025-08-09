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

const { Title, Text } = Typography;

const ExcelUploadGHTT13 = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadInfo, setUploadInfo] = useState(null); // ✅ Thêm để hiển thị Label

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/upload-ght13');
      setData(res.data);
    } catch (error) {
      console.error('❌ Lỗi khi lấy dữ liệu GHTT_13:', error);
      message.error('Không thể lấy dữ liệu từ Oracle!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const uploadProps = {
    name: 'file',
    accept: '.xlsx',
    showUploadList: false,
    customRequest: async ({ file, onSuccess, onError }) => {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      try {
        const res = await axios.post('http://localhost:5000/api/upload-ght13', formData);
        message.success(res.data.message || '✅ Upload thành công!');
        setUploadInfo({
          message: res.data.message || 'Upload thành công!',
          count: res.data.insertedCount || 0
        });
        fetchData();
        onSuccess();
      } catch (err) {
        console.error('❌ Upload lỗi:', err);
        message.error('Upload thất bại!');
        setUploadInfo(null);
        onError(err);
      } finally {
        setUploading(false);
      }
    }
  };

  const columns = [
    { title: 'PHANVUNG_ID', dataIndex: 'PHANVUNG_ID', key: 'PHANVUNG_ID' },
    { title: 'THUEBAO_ID', dataIndex: 'THUEBAO_ID', key: 'THUEBAO_ID' },
    { title: 'KHACHHANG_ID', dataIndex: 'KHACHHANG_ID', key: 'KHACHHANG_ID' },
    { title: 'MA_TB', dataIndex: 'MA_TB', key: 'MA_TB' },
    { title: 'NGAY_KTDC', dataIndex: 'NGAY_KTDC', key: 'NGAY_KTDC' },
    { title: 'TEN_TTVT', dataIndex: 'TEN_TTVT', key: 'TEN_TTVT' },
    { title: 'THANG_KT', dataIndex: 'THANG_KT', key: 'THANG_KT' },
    { title: 'TIEN_DC', dataIndex: 'TIEN_DC', key: 'TIEN_DC' },
    { title: 'TEN_KM', dataIndex: 'TEN_KM', key: 'TEN_KM' },
    { title: 'TEN_CTKM', dataIndex: 'TEN_CTKM', key: 'TEN_CTKM' },
    { title: 'TRANGTHAI_BH', dataIndex: 'TRANGTHAI_BH', key: 'TRANGTHAI_BH' },
    { title: 'TENNV_TH_PCT', dataIndex: 'TENNV_TH_PCT', key: 'TENNV_TH_PCT' },
    { title: 'NGAY_TAO', dataIndex: 'NGAY_TAO', key: 'NGAY_TAO' },
    {
      title: 'NGAY_CN',
      dataIndex: 'NGAY_CN',
      key: 'NGAY_CN',
      render: value => value ? new Date(value).toLocaleString() : ''
    }
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>📦 Dữ liệu GHTT_13 từ Oracle</Title>

      <Space style={{ marginBottom: 8 }}>
        <Upload {...uploadProps}>
          <Button icon={<UploadOutlined />} loading={uploading}>
            Tải lên Excel
          </Button>
        </Upload>
        <Button icon={<ReloadOutlined />} onClick={fetchData} loading={loading}>
          Làm mới
        </Button>
      </Space>

      {/* ✅ Hiển thị Label kết quả Upload */}
      {uploadInfo && (
        <div style={{ marginBottom: 16 }}>
          <Text type="success">📢 {uploadInfo.message}</Text><br />
          <Text strong>Tổng Row upload cập nhật: {uploadInfo.count.toLocaleString()} Row</Text>
        </div>
      )}

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

export default ExcelUploadGHTT13;
