import React, { useState } from 'react';
import axios from 'axios';

function UploadExcel() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file) {
      alert('Vui lòng chọn file Excel');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('http://localhost:5000/api/upload-excel', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage(res.data.message + ` - Đã thêm ${res.data.insertedCount} bản ghi`);
    } catch (error) {
      setMessage('Lỗi upload: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={{ marginBottom: '20px' }}>📤 Upload File lên Dữ liệu</h2>
        <input 
          type="file" 
          accept=".xls,.xlsx" 
          onChange={handleFileChange} 
          style={styles.input}
        />
        <button onClick={handleUpload} style={styles.button}>Tải lên</button>
        {message && <p style={styles.message}>{message}</p>}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f2f5',
  },
  card: {
    backgroundColor: 'white',
    padding: '30px 40px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    textAlign: 'center',
    maxWidth: '400px',
    width: '100%',
  },
  input: {
    marginBottom: '15px',
    display: 'block',
    margin: '0 auto 15px auto',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#1890ff',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  message: {
    marginTop: '20px',
    color: '#333',
  },
};

export default UploadExcel;
