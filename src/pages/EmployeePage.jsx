// src/pages/EmployeePage.jsx
import React, { useState, useEffect } from 'react';
import SalesData from '../components/SalesData';
import UploadExcel from '../components/UploadExcel';
import { getEmployees, addEmployee, updateEmployee, deleteEmployee } from '../services/api';

function EmployeePage() {
  const [employees, setEmployees] = useState([]);

  const emptyEmployee = {
    name: '',
    position: '',
    department: '',
    salary: '',
    dateOfBirth: '',
    gender: 'Male',
    email: '',
    phoneNumber: '',
    address: '',
    status: 'Active',
  };

  const [newEmployee, setNewEmployee] = useState(emptyEmployee);
  const [editingEmployee, setEditingEmployee] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    const data = await getEmployees();
    setEmployees(data);
  };

  const handleAddEmployee = async () => {
    if (!newEmployee.name || !newEmployee.position || !newEmployee.department
      || !newEmployee.salary || !newEmployee.dateOfBirth || !newEmployee.email
      || !newEmployee.phoneNumber || !newEmployee.address) {
      alert('Vui lòng nhập đủ thông tin bắt buộc');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(newEmployee.email)) {
      alert('Email không hợp lệ');
      return;
    }

    if (!/^\d{10,12}$/.test(newEmployee.phoneNumber)) {
      alert('Số điện thoại không hợp lệ (10-12 chữ số)');
      return;
    }

    const payload = {
      ...newEmployee,
      salary: Number(newEmployee.salary),
      dateOfBirth: new Date(newEmployee.dateOfBirth).toISOString(),
      status: newEmployee.status || 'Active',
      gender: newEmployee.gender || 'Male',
    };

    await addEmployee(payload);
    await fetchEmployees();
    setNewEmployee(emptyEmployee);
  };

  const handleEditClick = (emp) => {
    setEditingEmployee({
      ...emp,
      dateOfBirth: emp.dateOfBirth ? emp.dateOfBirth.substring(0, 10) : '',
    });
  };

  const handleUpdateEmployee = async () => {
    if (!editingEmployee.name || !editingEmployee.position || !editingEmployee.department
      || !editingEmployee.salary || !editingEmployee.dateOfBirth || !editingEmployee.email
      || !editingEmployee.phoneNumber || !editingEmployee.address) {
      alert('Vui lòng nhập đủ thông tin bắt buộc');
      return;
    }

    const payload = {
      ...editingEmployee,
      salary: Number(editingEmployee.salary),
      dateOfBirth: new Date(editingEmployee.dateOfBirth).toISOString(),
      status: editingEmployee.status || 'Active',
      gender: editingEmployee.gender || 'Male',
    };

    await updateEmployee(editingEmployee._id, payload);
    await fetchEmployees();
    setEditingEmployee(null);
  };

  const handleDeleteEmployee = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa nhân viên này?')) {
      await deleteEmployee(id);
      await fetchEmployees();
    }
  };

  return (
    <>
      <h2>Danh sách nhân viên</h2>

      {employees.length === 0 ? (
        <p>Chưa có dữ liệu nhân viên.</p>
      ) : (
        employees.map(emp => (
          <div key={emp._id} style={{ marginBottom: 8, borderBottom: '1px solid #ccc', paddingBottom: 4 }}>
            <b>{emp.name}</b> - {emp.position} - {emp.department} - Lương: {emp.salary.toLocaleString()} VNĐ - {emp.gender} - {emp.status}
            <button onClick={() => handleEditClick(emp)} style={{ marginLeft: 8, cursor: 'pointer' }}>Sửa</button>
            <button onClick={() => handleDeleteEmployee(emp._id)} style={{ marginLeft: 8, cursor: 'pointer' }}>Xóa</button>
          </div>
        ))
      )}

      <h3 style={{ marginTop: 40 }}>{editingEmployee ? 'Sửa nhân viên' : 'Thêm nhân viên mới'}</h3>

      <input
        placeholder="Tên"
        value={editingEmployee ? editingEmployee.name : newEmployee.name}
        onChange={(e) => {
          const val = e.target.value;
          if (editingEmployee) setEditingEmployee({ ...editingEmployee, name: val });
          else setNewEmployee({ ...newEmployee, name: val });
        }}
        style={{ width: '100%', padding: 6, marginBottom: 10 }}
      />

      <input
        placeholder="Vị trí"
        value={editingEmployee ? editingEmployee.position : newEmployee.position}
        onChange={(e) => {
          const val = e.target.value;
          if (editingEmployee) setEditingEmployee({ ...editingEmployee, position: val });
          else setNewEmployee({ ...newEmployee, position: val });
        }}
        style={{ width: '100%', padding: 6, marginBottom: 10 }}
      />

      <input
        placeholder="Phòng ban"
        value={editingEmployee ? editingEmployee.department : newEmployee.department}
        onChange={(e) => {
          const val = e.target.value;
          if (editingEmployee) setEditingEmployee({ ...editingEmployee, department: val });
          else setNewEmployee({ ...newEmployee, department: val });
        }}
        style={{ width: '100%', padding: 6, marginBottom: 10 }}
      />

      <input
        placeholder="Lương"
        type="number"
        value={editingEmployee ? editingEmployee.salary : newEmployee.salary}
        onChange={(e) => {
          const val = e.target.value;
          if (editingEmployee) setEditingEmployee({ ...editingEmployee, salary: val });
          else setNewEmployee({ ...newEmployee, salary: val });
        }}
        style={{ width: '100%', padding: 6, marginBottom: 10 }}
      />

      <label>Ngày sinh:</label>
      <input
        type="date"
        value={editingEmployee ? editingEmployee.dateOfBirth : newEmployee.dateOfBirth}
        onChange={(e) => {
          const val = e.target.value;
          if (editingEmployee) setEditingEmployee({ ...editingEmployee, dateOfBirth: val });
          else setNewEmployee({ ...newEmployee, dateOfBirth: val });
        }}
        style={{ width: '100%', padding: 6, marginBottom: 10 }}
      />

      <label>Giới tính:</label>
      <select
        value={editingEmployee ? editingEmployee.gender : newEmployee.gender}
        onChange={(e) => {
          const val = e.target.value;
          if (editingEmployee) setEditingEmployee({ ...editingEmployee, gender: val });
          else setNewEmployee({ ...newEmployee, gender: val });
        }}
        style={{ width: '100%', padding: 6, marginBottom: 10 }}
      >
        <option value="Male">Nam</option>
        <option value="Female">Nữ</option>
        <option value="Other">Khác</option>
      </select>

      <input
        placeholder="Email"
        type="email"
        value={editingEmployee ? editingEmployee.email : newEmployee.email}
        onChange={(e) => {
          const val = e.target.value;
          if (editingEmployee) setEditingEmployee({ ...editingEmployee, email: val });
          else setNewEmployee({ ...newEmployee, email: val });
        }}
        style={{ width: '100%', padding: 6, marginBottom: 10 }}
      />

      <input
        placeholder="Số điện thoại"
        value={editingEmployee ? editingEmployee.phoneNumber : newEmployee.phoneNumber}
        onChange={(e) => {
          const val = e.target.value;
          if (editingEmployee) setEditingEmployee({ ...editingEmployee, phoneNumber: val });
          else setNewEmployee({ ...newEmployee, phoneNumber: val });
        }}
        style={{ width: '100%', padding: 6, marginBottom: 10 }}
      />

      <input
        placeholder="Địa chỉ"
        value={editingEmployee ? editingEmployee.address : newEmployee.address}
        onChange={(e) => {
          const val = e.target.value;
          if (editingEmployee) setEditingEmployee({ ...editingEmployee, address: val });
          else setNewEmployee({ ...newEmployee, address: val });
        }}
        style={{ width: '100%', padding: 6, marginBottom: 10 }}
      />

      <label>Trạng thái:</label>
      <select
        value={editingEmployee ? editingEmployee.status : newEmployee.status}
        onChange={(e) => {
          const val = e.target.value;
          if (editingEmployee) setEditingEmployee({ ...editingEmployee, status: val });
          else setNewEmployee({ ...newEmployee, status: val });
        }}
        style={{ width: '100%', padding: 6, marginBottom: 10 }}
      >
        <option value="Active">Hoạt động</option>
        <option value="Inactive">Không hoạt động</option>
      </select>

      {editingEmployee ? (
        <>
          <button onClick={handleUpdateEmployee} style={{ marginRight: 8, cursor: 'pointer' }}>
            Cập nhật
          </button>
          <button onClick={() => setEditingEmployee(null)} style={{ cursor: 'pointer' }}>
            Hủy
          </button>
        </>
      ) : (
        <button onClick={handleAddEmployee} style={{ cursor: 'pointer' }}>
          Thêm nhân viên
        </button>
      )}

      {/* Component phụ nếu cần */}
      <SalesData />
      <UploadExcel />
    </>
  );
}

export default EmployeePage;
