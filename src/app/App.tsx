import { BrowserRouter } from "react-router-dom";
// import AppRoutes from "./routes";
import Navbar from "../common/components/Navbar";
import AppRoutes from "./routes";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <AppRoutes />
    </BrowserRouter>
  );
}
