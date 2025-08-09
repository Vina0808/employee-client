import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate
} from 'react-router-dom';

import Login from './components/Login';
import EmployeeList from './components/EmployeeList';
import EmployeeHRM from './components/EmployeeHRM';
import SalesData from './components/SalesData';
import UploadExcel from './components/UploadExcel';
import ExcelDataList from './components/ExcelDataList';
import Navbar from './components/Navbar';
import LuongTheoLoaiGoi from './components/LuongTheoLoaiGoi'; // hoặc './pages/LuongTheoLoaiGoi' tuỳ theo cấu trúc
import FactKenhBanGoiList from './components/FactKenhBanGoiList';


// Component bảo vệ route, kiểm tra đăng nhập
const PrivateRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

// Layout chính có Navbar + Outlet cho các route con
const AppLayout = () => (
  <>
    <Navbar />
    <Outlet />
  </>
);

// Định nghĩa router, nhớ tất cả route con đều trong /app/*
const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace /> // mặc định chuyển đến login
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/app',
    element: (
      <PrivateRoute>
        <AppLayout />
      </PrivateRoute>
    ),
    children: [
      { path: 'employee-list', element: <EmployeeList /> },
      { path: 'hrm-oracle', element: <EmployeeHRM /> },
      { path: 'sales-data', element: <SalesData /> },
      { path: 'upload-salary', element: <UploadExcel /> },
      { path: 'sales-summary', element: <ExcelDataList /> },
      { path: 'salary-by-package/:type', element: <LuongTheoLoaiGoi /> },
      { path: 'fact-hqkd-kenh-ban-goi', element: <FactKenhBanGoiList /> },
    ]
  }
]);

function MainApp() {
  return <RouterProvider router={router} />;
}

export default MainApp;
