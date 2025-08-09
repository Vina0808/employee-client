import React from 'react';
import { Navbar, Nav, NavDropdown, Container, Image } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';

function MyNavbar() {
  const navigate = useNavigate();
  const ten_nv = localStorage.getItem('ten_nv');
  const ma_nv = localStorage.getItem('ma_nv');
  const avatar_url = localStorage.getItem('avatar_url') || `${process.env.PUBLIC_URL}/default-avatar.png`;

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div
      className="navbar-custom"
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL + '/banner.jpg'})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    >
      <Navbar
        expand="lg"
        variant="dark"
        fixed="top"
        className="shadow"
        style={{ backgroundColor: '#60a5fa' }}
      >
        <Container fluid>
          <Navbar.Toggle aria-controls="navbar-nav" />
          <Navbar.Collapse id="navbar-nav">
            <Nav className="me-auto">
              {/* Menu giữ nguyên như cũ */}
              <NavDropdown title="Hệ thống" id="nav-dropdown-system">
                <NavDropdown.Item as={Link} to="/app/hrm-management">Khai báo HRM</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/app/user-management">Khai báo User quản lý</NavDropdown.Item>
              </NavDropdown>

              <NavDropdown title="Trang chủ" id="nav-dropdown-home">
                <NavDropdown.Item as={Link} to="/app/content">Nội dung</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/app/news">Tin tức</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/app/documents">Văn bản</NavDropdown.Item>
              </NavDropdown>

              <NavDropdown title="Thông tin cá nhân" id="nav-dropdown-personal-info">
                <NavDropdown.Item as={Link} to="/app/employee-list">Danh sách nhân viên</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/app/employee-plans">Kế hoạch nhân viên</NavDropdown.Item>
                <NavDropdown title="Lương nhân viên" id="nav-dropdown-employee-salary" drop="end">
                  <NavDropdown.Item as={Link} to="/app/employee-salary">Bảng tổng lương</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/app/salary-by-package/ptm">Lương theo gói PTM</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/app/salary-by-package/tien-luong-coc">Tiền lương cọc</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/app/salary-by-package/giahan">Lương theo gói GIA HAN</NavDropdown.Item>
                </NavDropdown>
                <NavDropdown.Divider />
                <NavDropdown.Item as={Link} to="/app/hrm-oracle">Dữ liệu HRM từ Oracle</NavDropdown.Item>
                <NavDropdown title="Dữ liệu bán hàng nhân viên" id="nav-dropdown-sales-data" drop="end">
                  <NavDropdown.Item as={Link} to="/app/sales-data">Bảng tổng hợp</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/app/fact-hqkd-kenh-ban-goi">📊 FACT_HQKD Kênh bán gói</NavDropdown.Item>
                </NavDropdown>
              </NavDropdown>

              <NavDropdown title="Tra cứu Bán hàng" id="nav-dropdown-sales-lookup">
                <NavDropdown.Item as={Link} to="/app/sales-summary">Tra cứu tổng hợp</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/app/sales-ptm">Tra cứu dịch vụ PTM</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/app/sales-territory">Tra cứu địa bàn</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/app/sales-directory">Tra cứu danh bạ</NavDropdown.Item>
              </NavDropdown>

              <NavDropdown title="Báo cáo" id="nav-dropdown-reports">
                <NavDropdown.Item as={Link} to="/app/report-ptm-core">Báo cáo PTM dịch vụ cốt lõi</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/app/report-channel-management">Báo cáo quản trị Kênh</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/app/report-fee">Báo cáo Cước</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/app/report-deposit">Báo cáo Cọc</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/app/baocao/hethancoc">Báo cáo Hết hạn cọc</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/app/report-action-program">Báo cáo chương trình hành động</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/app/report-monitoring-cancellation">Báo cáo giám sát giảm hủy</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/app/report-ob-ippc">Báo cáo OB IPPC</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/app/report-revenue-territory">Báo cáo Doanh thu địa bàn</NavDropdown.Item>
              </NavDropdown>

              <NavDropdown title="Report quản trị" id="nav-dropdown-report-admin">
                <NavDropdown.Item as={Link} to="/app/report-ioc">Report IOC</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/app/report-tcty">Report Tcty</NavDropdown.Item>
              </NavDropdown>

              <NavDropdown title="Dữ liệu" id="nav-dropdown-data">
                <NavDropdown.Item as={Link} to="/app/api-source">API Hệ thống khác</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item as={Link} to="/app/upload-employee">Upload: Danh sách nhân sự</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/app/upload-salary">Upload: Bảng lương</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/app/oracle-excel-upload">Upload: Bảng bán hàng</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/app/upload-ght13">Upload: Bảng GHTT_13</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/app/upload-customers">Upload: Bảng khách hàng</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/app/upload-plans">Upload: Bảng kế hoạch</NavDropdown.Item>
              </NavDropdown>
            </Nav>

            {/* Góc phải: Avatar + Tên + Mã NV + Logout */}
            <Nav className="ms-auto align-items-center" style={{ gap: '10px' }}>
              <Image
                src={avatar_url}
                roundedCircle
                width={40}
                height={40}
                alt="avatar"
                style={{
                  objectFit: 'cover',
                  border: '2px solid white'
                }}
              />
              <div className="d-flex flex-column align-items-end" style={{ lineHeight: 1.4 }}>
                <span style={{ color: '#dc2626', fontWeight: 'bold' }}>
                  👤 {ten_nv || 'Người dùng'}
                </span>
                <span style={{ color: '#dc2626', fontWeight: 'bold' }}>
                  🆔 {ma_nv || '---'}
                </span>
                <Nav.Link
                  onClick={handleLogout}
                  style={{
                    color: '#dc2626',
                    fontWeight: 'bold',
                    padding: 0,
                    fontSize: '0.9rem'
                  }}
                >
                  🚪 Đăng xuất
                </Nav.Link>
              </div>
            </Nav>

          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}

export default MyNavbar;
