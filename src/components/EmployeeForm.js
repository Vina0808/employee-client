import axios from 'axios';
import { useState } from 'react';

function AddEmployeeForm() {
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    position: '',
    department: '',
    salary: '',
    dateOfBirth: '',  // Nhập dạng DD/MM/YYYY
    gender: '',
    email: '',
    phoneNumber: '',
    address: '',
    status: '', // Thêm trường trạng thái
  });

  const handleChange = (e) => {
    setNewEmployee({ ...newEmployee, [e.target.name]: e.target.value });
  };

  // Hàm chuyển đổi ngày DD/MM/YYYY => YYYY-MM-DD
  function convertDDMMYYYYtoISO(dateStr) {
    const parts = dateStr.split('/');
    if (parts.length !== 3) return null;
    const [dd, mm, yyyy] = parts;
    if (
      dd.length !== 2 || mm.length !== 2 || yyyy.length !== 4 ||
      isNaN(dd) || isNaN(mm) || isNaN(yyyy)
    ) return null;
    return `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
  }

  // Chuyển giới tính từ tiếng Việt sang chuẩn backend
  const convertGender = (genderStr) => {
    if (genderStr.toLowerCase() === 'nam') return 'Male';
    if (genderStr.toLowerCase() === 'nữ') return 'Female';
    return 'Other';
  };

  // Chuyển trạng thái từ tiếng Việt sang chuẩn backend
  const convertStatus = (statusStr) => {
    if (statusStr.toLowerCase() === 'hoạt động') return 'Active';
    if (statusStr.toLowerCase() === 'không hoạt động') return 'Inactive';
    return 'Active'; // Mặc định
  };

  const handleAddEmployee = async () => {
    const {
      name, position, department, salary, dateOfBirth,
      gender, email, phoneNumber, address, status
    } = newEmployee;

    // Kiểm tra bắt buộc
    if (!name || !position || !department || !salary ||
        !dateOfBirth || !gender || !email || !phoneNumber || !address) {
      alert("Vui lòng nhập đầy đủ thông tin nhân viên.");
      return;
    }

    const salaryNumber = Number(salary);
    if (!salaryNumber || salaryNumber <= 0) {
      alert("Vui lòng nhập mức lương hợp lệ.");
      return;
    }

    const dobISO = convertDDMMYYYYtoISO(dateOfBirth);
    if (!dobISO) {
      alert("Ngày sinh không hợp lệ. Định dạng đúng: DD/MM/YYYY");
      return;
    }

    const payload = {
      name,
      position,
      department,
      salary: salaryNumber,
      dateOfBirth: dobISO,
      gender: convertGender(gender),
      email,
      phoneNumber,
      address,
      status: convertStatus(status),
    };

    try {
      const res = await axios.post('http://localhost:5000/api/employees', payload);
      alert('Thêm nhân viên thành công!');
      setNewEmployee({
        name: '',
        position: '',
        department: '',
        salary: '',
        dateOfBirth: '',
        gender: '',
        email: '',
        phoneNumber: '',
        address: '',
        status: '',
      });
    } catch (error) {
      alert('Lỗi khi thêm nhân viên: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
      <h2>Thêm Nhân Viên</h2>
      <input name="name" placeholder="Tên" value={newEmployee.name} onChange={handleChange} style={{ width: '100%', marginBottom: 8 }} />
      <input name="position" placeholder="Chức vụ" value={newEmployee.position} onChange={handleChange} style={{ width: '100%', marginBottom: 8 }} />
      <input name="department" placeholder="Phòng ban" value={newEmployee.department} onChange={handleChange} style={{ width: '100%', marginBottom: 8 }} />
      <input name="salary" placeholder="Lương" type="number" value={newEmployee.salary} onChange={handleChange} style={{ width: '100%', marginBottom: 8 }} />
      <input name="dateOfBirth" placeholder="Ngày sinh (DD/MM/YYYY)" value={newEmployee.dateOfBirth} onChange={handleChange} style={{ width: '100%', marginBottom: 8 }} />
      <input name="gender" placeholder="Giới tính (Nam/Nữ/Khác)" value={newEmployee.gender} onChange={handleChange} style={{ width: '100%', marginBottom: 8 }} />
      <input name="email" placeholder="Email" type="email" value={newEmployee.email} onChange={handleChange} style={{ width: '100%', marginBottom: 8 }} />
      <input name="phoneNumber" placeholder="Số điện thoại" value={newEmployee.phoneNumber} onChange={handleChange} style={{ width: '100%', marginBottom: 8 }} />
      <input name="address" placeholder="Địa chỉ" value={newEmployee.address} onChange={handleChange} style={{ width: '100%', marginBottom: 8 }} />
      <input name="status" placeholder="Trạng thái (Hoạt động/Không hoạt động)" value={newEmployee.status} onChange={handleChange} style={{ width: '100%', marginBottom: 8 }} />
      <button onClick={handleAddEmployee} style={{ width: '100%', padding: 10, backgroundColor: '#4CAF50', color: 'white', border: 'none' }}>
        Thêm nhân viên
      </button>
    </div>
  );
}

export default Ad
