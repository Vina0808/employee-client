// src/components/EmployeeHRM.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function EmployeeHRM() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/oracle/hrm-cbnv-donvi')
      .then(response => {
        setEmployees(response.data.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Không thể tải dữ liệu HRM từ Oracle');
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Đang tải dữ liệu HRM...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Danh sách nhân sự từ Oracle</h2>
      <table className="table-auto w-full border border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Mã NV</th>
            <th className="border p-2">Họ Tên</th>
            <th className="border p-2">Phòng Ban</th>
            <th className="border p-2">Khối</th>
            <th className="border p-2">Đơn Vị</th>
            <th className="border p-2">Chức Danh</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(emp => (
            <tr key={emp.MA_NV}>
              <td className="border p-2">{emp.MA_NV}</td>
              <td className="border p-2">{emp.HO_TEN}</td>
              <td className="border p-2">{emp.PHONG_BAN}</td>
              <td className="border p-2">{emp.KHOI}</td>
              <td className="border p-2">{emp.DON_VI}</td>
              <td className="border p-2">{emp.CHUC_DANH}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EmployeeHRM;
