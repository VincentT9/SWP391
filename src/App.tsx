import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { AuthProvider } from "./components/auth/AuthContext";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme/theme";
import MainLayout from "./components/layout/MainLayout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Pages
import HomePage from "./components/home/HomePage";
import HealthRecordsPage from "./components/health-records/HealthRecordsPage";
import HealthDeclarationFormPage from "./components/health-records/HealthDeclarationForm";
import MedicationPage from "./components/medication/MedicationPage";
import MedicalEventsPage from "./components/medical-events/MedicalEventsPage";
import HealthCheckPage from "./components/health-check/StudentRecordsPage";
import DashboardPage from "./components/dashboard/DashboardPage";
import UserProfilePage from "./components/user/UserProfilePage";
import AdminPage from "./components/admin/AdminPage";
import LoginPage from "./components/user/LoginPage";
import RegisterPage from "./components/user/RegisterPage";
import NotificationsPage from "./components/notifications/NotificationsPage";
import MedicalSupplier from "./components/admin/MedicalSupplier";
import StudentManagementPage from "./components/admin/StudentManagementPage";
import VaccinationPage from "./components/vaccination/VaccinationPage";
import ParentMedicationDashboard from "./components/medication/parent/ParentMedicationDashboard";

function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/homepage" element={<HomePage />} />
            <Route path="/" element={<MainLayout />}>
              <Route index element={<HomePage />} />
              <Route path="health-records" element={<HealthRecordsPage />} />
              <Route
                path="health-declaration"
                element={<HealthDeclarationFormPage />}
              />
              <Route path="medication" element={<MedicationPage />} />
              <Route path="medical-events" element={<MedicalEventsPage />} />
              <Route path="vaccination" element={<VaccinationPage />} />
              <Route path="health-check" element={<HealthCheckPage />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="profile" element={<UserProfilePage />} />
              <Route path="user-management" element={<AdminPage />} />
              <Route path="medical-supplier" element={<MedicalSupplier />} />
              <Route
                path="admin/students"
                element={<StudentManagementPage />}
              />
            </Route>
          </Routes>
        </Router>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
