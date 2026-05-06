import { Link, useNavigate, useLocation } from "react-router-dom";
import { isAuthenticated, mockLogout } from "../utils/mockAuth";
import { useState } from "react";

/* Google Font */
const fontLink = document.createElement("link");
fontLink.href =
  "https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700&display=swap";
fontLink.rel = "stylesheet";
document.head.appendChild(fontLink);

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const loggedIn = isAuthenticated();

    
  const [showMenu, setShowMenu] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    mockLogout();
    navigate("/login");
  };

  return (
    <nav style={styles.nav}>
      <Link to={"/"} style={{textDecoration: "none"}}><h2 style={styles.logo}>🎬 I Cinema</h2> </ Link>

      <div style={styles.links}>

        {/* <Link
          to="/home"
          style={{
            ...styles.linkBox,
            ...(isActive("/my-bookings") && styles.activeBox)
          }}
        >
          Home
        </Link> */}

        <Link
          to="/"
          style={{ ...styles.linkBox, ...(isActive("/movies") && styles.activeBox) }}
        >
           Home
        </Link>

        <Link
          to="movies"
          style={{ ...styles.linkBox, ...(isActive("/movies") && styles.activeBox) }}
        >
          🎥 Movies
        </Link>

        <Link
          to="/my-bookings"
          style={{
            ...styles.linkBox,
            ...(isActive("/my-bookings") && styles.activeBox)
          }}
        >
          🎟 Booking History
        </Link>

        {loggedIn ? (
          <div
            style={styles.profileWrapper}
            onMouseEnter={() => setShowMenu(true)}
            onMouseLeave={() => setShowMenu(false)}
          >
            <div style={styles.profileIcon}>👤</div>

            {showMenu && (
              <div style={styles.dropdown}>
                {/* <div style={styles.userName}>{userName}</div> */}
                <button onClick={handleLogout} style={styles.logoutBtn}>
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            style={styles.linkBox}
          >
            🔐 Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

/* ================= STYLES ================= */

const styles: any = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 30px",
    backgroundColor: "#1c1c1c"
  },

  logo: {
    fontFamily: "'Cinzel', serif",
    fontSize: "26px",
    fontWeight: 600,
    letterSpacing: "3px",
    color: "#FFFFFF",
    textTransform: "uppercase",
    margin: 0,
    cursor: "pointer"
  },

  links: {
    display: "flex",
    alignItems: "center",
    gap: "14px"
  },

  linkBox: {
    backgroundColor: "#fff",
    padding: "8px 16px",
    borderRadius: "12px",
    cursor: "pointer",
    border: "none",
    fontWeight: 500,
    textDecoration: "none",
    color: "#000"
  },

  activeBox: {
    backgroundColor: "#e6f0ff",
    border: "1px solid #4d79ff"
  },

  profileWrapper: {
    position: "relative",
    paddingBottom: "10px"
  },

  profileIcon: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontSize: "20px"
  },

  dropdown: {
    position: "absolute",
    top: "48px",
    right: 0,
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
    padding: "10px",
    minWidth: "160px",
    zIndex: 10
  },

  userName: {
    fontWeight: 600,
    marginBottom: "8px",
    textAlign: "center"
  },

  logoutBtn: {
    width: "100%",
    padding: "6px",
    border: "none",
    backgroundColor: "#ffe5e5",
    borderRadius: "8px",
    cursor: "pointer"
  }
};
