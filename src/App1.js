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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Các route bảo vệ (RequireAuth) */}
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

          {/* Route cho /app/fact-kenh-ban-goi-list */}
          <Route path="app">
            <Route path="fact-hqkd-kenh-ban-goi" element={<FactKenhBanGoiList />} />
          </Route>

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
