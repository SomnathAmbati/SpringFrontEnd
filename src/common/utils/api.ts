import axios from "axios";
// import { getToken } from "./mockAuth";

const api = axios.create({
  baseURL: `${process.env.REACT_APP_API_BASE_URL}/api`,
});
api.interceptors.request.use((config) => { 
  const token = localStorage.getItem("token"); 
  if (token) { 
    config.headers=config.headers??{}; 
    config.headers.Authorization = `Bearer ${token}`;
  } 
 return config;
 },
);

export default api;


