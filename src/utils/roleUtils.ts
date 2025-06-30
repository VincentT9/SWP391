/**
 * Utility functions for role-based access control
 */

// Check if the current user has a specific role
export const hasRole = (role: string): boolean => {
  const userRole = localStorage.getItem("userRole");
  return userRole?.toLowerCase() === role.toLowerCase();
};

// Check if the current user is an admin
export const isAdmin = (): boolean => {
  const userRole = localStorage.getItem("userRole");
  return userRole?.toLowerCase() === "admin";
};

// Check if the current user is medical staff (nurse)
export const isMedicalStaff = (): boolean => {
  const userRole = localStorage.getItem("userRole");
  return userRole?.toLowerCase() === "medicalstaff";
};
