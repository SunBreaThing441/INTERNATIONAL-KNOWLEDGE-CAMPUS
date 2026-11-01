import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

/**
 * ProtectedRoute: Declarative navigation guard enforcing role-based access control.
 *
 * Security Guarantees:
 * 1. Session Verification: Validates that currentUser has a non-empty _id and recognized role.
 * 2. Unauthenticated Guard: Redirects unauthenticated visits to the appropriate login portal,
 *    preserving location.pathname in state.from for seamless return.
 * 3. Cross-Role Isolation: Prevents privilege escalation (e.g., Student attempting /Admin/*
 *    or Teacher attempting /Admin/*) by immediately rerouting them to their own authorized portal.
 */
const ProtectedRoute = ({ children, allowedRoles = [], redirectPath }) => {
  const location = useLocation();
  const { currentUser, currentRole } = useSelector((state) => state.user);

  // 1. Session verification & integrity check
  const isAuthenticated = Boolean(
    currentUser &&
    currentUser._id &&
    currentRole &&
    ["Admin", "Teacher", "Student"].includes(currentRole)
  );

  if (!isAuthenticated) {
    // Determine the optimal login gateway based on the requested route
    let loginTarget = redirectPath;
    if (!loginTarget) {
      if (location.pathname.startsWith("/Admin")) {
        loginTarget = "/Adminlogin";
      } else if (location.pathname.startsWith("/Teacher")) {
        loginTarget = "/Teacherlogin";
      } else if (location.pathname.startsWith("/Student")) {
        loginTarget = "/Studentlogin";
      } else {
        loginTarget = "/choose";
      }
    }

    return <Navigate to={loginTarget} state={{ from: location }} replace />;
  }

  // 2. Cross-role isolation guard: Authenticated, but accessing unauthorized area
  if (allowedRoles.length > 0 && !allowedRoles.includes(currentRole)) {
    return <Navigate to={`/${currentRole}/dashboard`} replace />;
  }

  return children;
};

export default ProtectedRoute;
