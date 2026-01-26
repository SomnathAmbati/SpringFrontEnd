import { Link, useNavigate } from "react-router-dom";
import { isLoggedIn, mockLogin, mockLogout } from "../utils/mockAuth";

const Navbar = () => {
  const navigate = useNavigate();
  const loggedIn = isLoggedIn();

  const handleAuthClick = () => {
    if (loggedIn) {
      mockLogout();
      navigate("/");
    } else {
      mockLogin();
      navigate("/");
    }
  };

  return (
    <nav style={styles.nav}>
      <h2 style={styles.logo}>🎬 Cinema</h2>

      <div style={styles.links}>
        <Link to="/">Movies</Link>

        {loggedIn && <Link to="/my-bookings">My Bookings</Link>}

        <button onClick={handleAuthClick}>
          {loggedIn ? "Logout" : "Login"}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    padding: "12px 24px",
    background: "#222",
    color: "#fff"
  },
  logo: { margin: 0 },
  links: {
    display: "flex",
    gap: "16px",
    alignItems: "center"
  }
};
