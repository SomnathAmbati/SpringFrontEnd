import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Navbar from "../common/components/Navbar";
import AppRoutes from "./routes";
import ProtectedRoute from "../common/components/ProtectedRoute";
import BookingSummary from "../booking/pages/BookingSummary";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes> <Route path="/booking/summary"
         element={
          <ProtectedRoute>
            <BookingSummary/>
          </ProtectedRoute>
         }
         ></Route>
            <Route path="/booking" element={<Navigate to="/booking/summary" replace />} />

         </Routes>
      

      <AppRoutes />
    </BrowserRouter>
  );
}


