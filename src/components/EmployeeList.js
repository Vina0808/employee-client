import React, { useState, useEffect } from 'react';
import axios from 'axios';

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true); // Thêm trạng thái loading
  const [error, setError] = useState(null); // Thêm trạng thái lỗi

  useEffect(() => {
    axios.get('http://localhost:5000/api/employees')
      .then(response => {
        setEmployees(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError('Lỗi khi lấy danh sách nhân viên');
        setLoading(false);
        console.error('Lỗi khi lấy danh sách nhân viên:', error);
      });
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">Danh sách nhân viên</h2>

      {loading ? (
        <p>Đang tải...</p> // Hiển thị thông báo khi đang tải
      ) : error ? (
        <p className="text-red-500">{error}</p> // Hiển thị thông báo lỗi nếu có
      ) : employees.length === 0 ? (
        <p>Không có nhân viên nào.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {employees.map((emp) => (
            <div key={emp._id} className="p-4 border rounded shadow">
              <img 
                src={emp.avatar || '/default-avatar.png'} // Dùng ảnh mặc định nếu không có avatar
                alt={emp.name}
                className="w-32 h-32 object-cover mx-auto mb-2 rounded-full"
              />
              <h3 className="text-lg font-semibold">{emp.name}</h3>
              <p>Chức danh: {emp.position}</p>
              <p>Phòng ban: {emp.department}</p>
              <p>Email: {emp.email}</p>
              <p>Điện thoại: {emp.phone}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default EmployeeList;
