
// export const isLoggedIn = () => {
//     return localStorage.getItem("loggedIn") === "true";
//   };
  
  export const mockLogin = (emailValue: string) => {
    localStorage.setItem("token","mock-jwt-token");
    // localStorage.setItem("userEmail", emailValue);

  };
  
  export const mockLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");

  };

  export const getUserEmail=()=>{
    return localStorage.getItem("userEmail");
  }

export const getToken = (): string | null => 
  localStorage.getItem("token");

export const setToken = (token: string) => 
  localStorage.setItem("token", token);

export const clearToken = () => 
  localStorage.removeItem("token");

export const isAuthenticated = ():boolean => {
const token = localStorage.getItem("token"); return!! token; // true if token exists };
};

export const isLoggedIn = ():boolean => {
  return isAuthenticated();
}