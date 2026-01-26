export const isLoggedIn = () => {
  return localStorage.getItem("loggedIn") === "true";
};

export const mockLogin = () => {
  localStorage.setItem("loggedIn", "true");
};

export const mockLogout = () => {
  localStorage.removeItem("loggedIn");
};
