import axios from 'axios';

const API_URL = 'https://app-vina.onrender.com/api/employees';

// Các hàm cũ ...
export const getEmployees = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách nhân viên:', error);
    return [];
  }
};

export const addEmployee = async (employee) => {
  try {
    const response = await axios.post(API_URL, employee);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi thêm nhân viên:', error);
    throw error;
  }
};

export const updateEmployee = async (id, employee) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, employee);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi cập nhật nhân viên:', error);
    throw error;
  }
};

export const deleteEmployee = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi xóa nhân viên:', error);
    throw error;
  }
};

// ==== Thêm hàm upload file bảng lương ====
export const uploadSalaryFile = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/upload-salary`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi upload file bảng lương:', error);
    throw error;
  }
};
