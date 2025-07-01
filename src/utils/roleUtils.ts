/**
 * Utility functions for role-based access control
 */

// Get user role from authUser in localStorage
function getUserRole(): string | null {
  const authUserStr = localStorage.getItem("authUser");
  if (!authUserStr) return null;

  try {
    const authUser = JSON.parse(authUserStr);
    return authUser.role || null;
  } catch (e) {
    console.error("Error parsing authUser from localStorage:", e);
    return null;
  }
}

// Check if the current user has a specific role
export const hasRole = (role: string): boolean => {
  const userRole = getUserRole();
  return userRole?.toLowerCase() === role.toLowerCase();
};

// Check if the current user is an admin
export const isAdmin = (): boolean => {
  const userRole = getUserRole();
  return userRole?.toLowerCase() === "admin";
};

// Check if the current user is medical staff (nurse)
export const isMedicalStaff = (): boolean => {
  const userRole = getUserRole();
  return userRole?.toLowerCase() === "medicalstaff";
};
