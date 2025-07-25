import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Header from "@/components/organisms/Header";
import Dashboard from "@/components/pages/Dashboard";
import Employees from "@/components/pages/Employees";
import EmployeeDetail from "@/components/pages/EmployeeDetail";
import EmployeeFormPage from "@/components/pages/EmployeeForm";
import Attendance from "@/components/pages/Attendance";
import Departments from "@/components/pages/Departments";
import Reports from "@/components/pages/Reports";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/employees/add" element={<EmployeeFormPage />} />
            <Route path="/employees/edit/:id" element={<EmployeeFormPage />} />
            <Route path="/employees/:id" element={<EmployeeDetail />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/departments" element={<Departments />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
        </main>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </Router>
  );
}

export default App;