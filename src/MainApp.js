// src/MainApp.js
import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate
} from 'react-router-dom';

import Login from './components/Login';
import MyNavbar from './components/Navbar';
import ThongTinCaNhan from './components/ThongTinCaNhan';
import EmployeeList from './components/EmployeeList';
import SalesData from './components/SalesData';
import UploadExcel from './components/UploadExcel';
import ExcelDataList from './components/ExcelDataList';
import LuongTheoLoaiGoi from './components/LuongTheoLoaiGoi';
import FactKenhBanGoiList from './components/FactKenhBanGoiList';
import LuongPDFViewer from './components/LuongPDFViewer';
import BaoCaoCocPage from './components/BaoCaoCocPage';
import LuongCocDashboard from './components/LuongCocDashboard';
import BaoCaoHetHanPage from './components/BaoCaoHetHanCocPage';
import OracleExcelUpload from './components/OracleExcelUpload'; // Upload lương Excel lên SQL Oracle
import ExcelUploadGHTT13 from './components/ExcelUploadGHTT13'; // Upload GHTT_13


const PrivateRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

const AppLayout = () => (
  <div>
    <MyNavbar />
    <div
      style={{
        paddingTop: '90px',
        paddingLeft: 15,
        paddingRight: 15,
        backgroundColor: '#f8f9fa',
        minHeight: '100vh'
      }}
    >
      <Outlet />
    </div>
  </div>
);

const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/login" replace /> },
  { path: '/login', element: <Login /> },
  {
    path: '/app',
    element: (
      <PrivateRoute>
        <AppLayout />
      </PrivateRoute>
    ),
    children: [
      { path: 'employee-list', element: <EmployeeList /> },
      { path: 'hrm-oracle', element: <ThongTinCaNhan /> },
      { path: 'sales-data', element: <SalesData /> },
      { path: 'upload-salary', element: <UploadExcel /> },
      { path: 'sales-summary', element: <ExcelDataList /> },
      { path: 'salary-by-package/:type', element: <LuongTheoLoaiGoi /> },
      { path: 'fact-hqkd-kenh-ban-goi', element: <FactKenhBanGoiList /> },
      { path: 'pdf-viewer', element: <LuongPDFViewer /> },
      { path: 'report-deposit', element: <BaoCaoCocPage /> },
      { path: 'baocao/hethancoc', element: <BaoCaoHetHanPage /> },
      { path: 'oracle-excel-upload', element: <OracleExcelUpload /> },
      { path: 'upload-ght13', element: <ExcelUploadGHTT13 /> },


      // 🔄 Đường dẫn không dấu
      { path: 'salary-by-package/tien-luong-coc', element: <LuongCocDashboard /> }
    ]
  }
]);

export default function MainApp() {
  return <RouterProvider router={router} />;
}
