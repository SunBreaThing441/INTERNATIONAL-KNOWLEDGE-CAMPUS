import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

/**
 * PublicRoute: Guard for public-only authentication gateways (/choose, /Adminlogin, etc.).
 * If a user already possesses an active authenticated session, redirects them to their
 * dedicated dashboard to eliminate auth confusion or accidental re-login.
 */
const PublicRoute = ({ children }) => {
  const { currentUser, currentRole } = useSelector((state) => state.user);

  const isAuthenticated = Boolean(
    currentUser &&
    currentUser._id &&
    currentRole &&
    ["Admin", "Teacher", "Student"].includes(currentRole)
  );

  if (isAuthenticated) {
    return <Navigate to={`/${currentRole}/dashboard`} replace />;
  }

  return children;
};

export default PublicRoute;
