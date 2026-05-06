// import { Navigate, Outlet } from "react-router-dom";

// import { isAuthenticated } from "../utils/mockAuth";

// import { ReactNode } from "react";

// // interface Props {

// // children: ReactNode; 
// // }

// const ProtectedRoute = () => { 
//     return isAuthenticated() ?<Outlet/> : <Navigate to="/login" replace />;
// };

// export default ProtectedRoute;

// src/components/ProtectedRoute.tsx
// import { Navigate } from "react-router-dom";
// import { getToken } from "../utils/mockAuth";
 

// const ProtectedRoute = ({ children }: { children: JSX.Element }) => {

//   return getToken() ? children : <Navigate to="/login" replace />;
// };

// export default ProtectedRoute;

import { JSX } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;



