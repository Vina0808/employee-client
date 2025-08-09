import React, { useState } from 'react';

function EmployeeCard({
  _id,
  name,
  position,
  department,
  salary,
  email,
  phone,
  dob,
  gender,
  avatar,
  onDelete,
  onUpdate,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedData, setUpdatedData] = useState({
    name,
    position,
    department,
    salary,
    email,
    phone,
    dob,
    gender,
    avatar,
  });

  const handleEditToggle = () => setIsEditing(!isEditing);

  const handleSaveUpdate = () => {
    onUpdate(_id, updatedData); // Gửi dữ liệu đã cập nhật lên API
    setIsEditing(false); // Tắt chế độ chỉnh sửa
  };

  const handleCancelUpdate = () => {
    setUpdatedData({
      name,
      position,
      department,
      salary,
      email,
      phone,
      dob,
      gender,
      avatar,
    });
    setIsEditing(false); // Hủy bỏ chỉnh sửa
  };

  return (
    <div className="border p-4 rounded shadow-lg">
      <img src={avatar} alt={name} className="w-32 h-32 rounded-full mx-auto" />
      {isEditing ? (
        <div>
          {/* Inputs for each field to edit */}
          <div>
            <label>Tên:</label>
            <input
              type="text"
              value={updatedData.name}
              onChange={(e) =>
                setUpdatedData({ ...updatedData, name: e.target.value })
              }
            />
          </div>
          <div>
            <label>Vị trí:</label>
            <input
              type="text"
              value={updatedData.position}
              onChange={(e) =>
                setUpdatedData({ ...updatedData, position: e.target.value })
              }
            />
          </div>
          <div>
            <label>Phòng ban:</label>
            <input
              type="text"
              value={updatedData.department}
              onChange={(e) =>
                setUpdatedData({ ...updatedData, department: e.target.value })
              }
            />
          </div>
          <div>
            <label>Lương:</label>
            <input
              type="number"
              value={updatedData.salary}
              onChange={(e) =>
                setUpdatedData({ ...updatedData, salary: e.target.value })
              }
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={updatedData.email}
              onChange={(e) =>
                setUpdatedData({ ...updatedData, email: e.target.value })
              }
            />
          </div>
          <div>
            <label>Số điện thoại:</label>
            <input
              type="tel"
              value={updatedData.phone}
              onChange={(e) =>
                setUpdatedData({ ...updatedData, phone: e.target.value })
              }
            />
          </div>
          <div>
            <label>Ngày sinh:</label>
            <input
              type="date"
              value={updatedData.dob}
              onChange={(e) =>
                setUpdatedData({ ...updatedData, dob: e.target.value })
              }
            />
          </div>
          <div>
            <label>Giới tính:</label>
            <input
              type="text"
              value={updatedData.gender}
              onChange={(e) =>
                setUpdatedData({ ...updatedData, gender: e.target.value })
              }
            />
          </div>
          <div>
            <label>Ảnh đại diện:</label>
            <input
              type="text"
              value={updatedData.avatar}
              onChange={(e) =>
                setUpdatedData({ ...updatedData, avatar: e.target.value })
              }
            />
          </div>
          <button onClick={handleSaveUpdate}>Lưu</button>
          <button onClick={handleCancelUpdate}>Hủy</button>
        </div>
      ) : (
        <div>
          <h3 className="text-xl font-semibold">{name}</h3>
          <p><strong>Vị trí:</strong> {position}</p>
          <p><strong>Phòng ban:</strong> {department}</p>
          <p><strong>Lương:</strong> {salary} VND</p>
          <p><strong>Email:</strong> {email}</p>
          <p><strong>Số điện thoại:</strong> {phone}</p>
          <p><strong>Ngày sinh:</strong> {new Date(dob).toLocaleDateString()}</p>
          <p><strong>Giới tính:</strong> {gender}</p>
          <button onClick={handleEditToggle}>Sửa</button>
          <button onClick={() => onDelete(_id)}>Xóa</button>
        </div>
      )}
    </div>
  );
}

export default EmployeeCard;
