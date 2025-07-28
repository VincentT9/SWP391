import React from "react";
import { useAuth } from "../auth/AuthContext";
import ParentLayout from "./ParentLayout";
import AdminLayout from "./AdminLayout";
import MainLayout from "./MainLayout"; // For unauthenticated users and fallback

const LayoutSelector = () => {
  const { user } = useAuth();

  // Determine which layout to use based on user role
  const getLayout = () => {
    if (!user?.isAuthenticated) {
      // For unauthenticated users, use the original MainLayout for promo pages
      return <MainLayout />;
    }

    switch (user?.role) {
      case "Parent":
        return <ParentLayout />;
      case "Admin":
      case "MedicalStaff":
        return <AdminLayout />;
      default:
        // Fallback to original layout
        return <MainLayout />;
    }
  };

  return getLayout();
};

export default LayoutSelector;