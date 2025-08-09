import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import RootLayout from './layouts/RootLayout';
import Login from './pages/Login';
import EmployeePage from './pages/EmployeePage';
import ExcelDataList from './components/ExcelDataList';
import HrmCbnvDonviList from './components/HrmCbnvDonviList';
import RequireAuth from './components/RequireAuth';
import LuongTheoLoaiGoi from './pages/LuongTheoLoaiGoi';
import FactKenhBanGoiList from './components/FactKenhBanGoiList';
import LuongPDFViewer from './components/LuongPDFViewer'; // ✅ Thêm component mới

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Trang đăng nhập */}
        <Route path="/login" element={<Login />} />

        {/* Các route yêu cầu đăng nhập */}
        <Route 
          path="/" 
          element={
            <RequireAuth>
              <RootLayout />
            </RequireAuth>
          }
        >
          {/* Trang chính */}
          <Route index element={<EmployeePage />} />
          <Route path="sales-summary" element={<ExcelDataList />} />
          <Route path="hrm-cbnv" element={<HrmCbnvDonviList />} />
          <Route path="salary-by-package/:type" element={<LuongTheoLoaiGoi />} />

          {/* Route PDF Viewer mới */}
          <Route path="pdf-viewer" element={<LuongPDFViewer />} />

          {/* Route nhóm khác */}
          <Route path="app">
            <Route path="fact-hqkd-kenh-ban-goi" element={<FactKenhBanGoiList />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
