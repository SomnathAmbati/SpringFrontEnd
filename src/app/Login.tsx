import React, { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../common/utils/api";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [successMessage, setSuccessMessage] = useState<string>("");

  // refs
  const name = useRef<HTMLInputElement | null>(null);
  const email = useRef<HTMLInputElement | null>(null);
  const password = useRef<HTMLInputElement | null>(null);

  // error states (UI only)
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const redirectTo = location.state?.redirectTo || "/movies";
  const intent = location.state?.intent;
  const seatIds = location.state?.seatIds;
  const showId = location.state?.showId;

  /* ---------------- BUTTON CLICK ---------------- */
  const HandleButtonClick = async () => {
    const nameValue = name.current?.value || "";
    const emailValue = email.current?.value || "";
    const passwordValue = password.current?.value || "";

    // clear previous errors
    setNameError("");
    setEmailError("");
    setPasswordError("");

    let hasError = false;

    // EMAIL validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailValue) {
      setEmailError("Email is required");
      hasError = true;
    } else if (!emailRegex.test(emailValue)) {
      setEmailError("Please enter a valid email address");
      hasError = true;
    }

    // PASSWORD validation
    if (!passwordValue) {
      setPasswordError("Password is required");
      hasError = true;
    } else if (passwordValue.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      hasError = true;
    }

    // NAME validation (only for signup)
    if (!isLoggedIn && !nameValue.trim()) {
      setNameError("Name is required");
      hasError = true;
    }

    if (hasError) return;

    /* ---------------- LOGIN ---------------- */
    if (isLoggedIn) {
      try {
        const res = await api.post("/auth/login", {
          email: emailValue,
          password: passwordValue,
        });

        const { token } = res.data;

        localStorage.setItem("token", token);
        localStorage.setItem("isLoggedIn", "true");
        setSuccessMessage("✅ Logged in successfully");

        setTimeout(() => {
          if (intent === "payment" && seatIds && showId) {
            navigate(
              `/payment?showId=${showId}&seats=${seatIds}`,
              { replace: true }
            );
          } else {
            navigate(redirectTo, { replace: true });
          }
        }, 1000);

      } catch (err: any) {
        if (err.response?.status === 401 || err.response?.status === 500) {
          setEmailError("Invalid email or password");
        } else {
          setEmailError("Server error. Please try again.");
        }
      }
    }

    /* ---------------- SIGN UP ---------------- */
    else {
      try {
        await api.post("/users/register", {
          name: nameValue,
          email: emailValue,
          password: passwordValue,
        });

        setSuccessMessage("✅ Account created successfully. Please log in.");

        setTimeout(() => {
          setIsLoggedIn(true);
          setSuccessMessage("");
        }, 1500);

      } catch (err: any) {
        setEmailError(
          err.response?.data?.message || "Account already exists"
        );
      }
    }
  };

  const SignUp = () => {
    setIsLoggedIn(!isLoggedIn);
    setNameError("");
    setEmailError("");
    setPasswordError("");
    setSuccessMessage("");
  };

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-white">
      <div className="card border-0 shadow-lg rounded-5" style={{ width: "420px" }}>
        
        {/* Header */}
        <div
          className="card-header text-center text-white rounded-top-5"
          style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
        >
          <h3 className="fw-bold mb-0 py-2">
            {isLoggedIn ? "Welcome Back 👋" : "Create Account 🚀"}
          </h3>
        </div>

        {/* Body */}
        <div className="card-body p-4 bg-white">
          <form onSubmit={(e) => e.preventDefault()}>

            {/* Name */}
            {!isLoggedIn && (
              <div className="mb-3">
                <input
                  ref={name}
                  type="text"
                  className="form-control form-control-lg rounded-pill border-2"
                  placeholder="👤 Your Name"
                />
                {nameError && (
                  <small className="text-danger ms-3">{nameError}</small>
                )}
              </div>
            )}

            {/* Email */}
            <div className="mb-3">
              <input
                ref={email}
                type="email"
                className="form-control form-control-lg rounded-pill border-2"
                placeholder="📧 Email address"
              />
              {emailError && (
                <small className="text-danger ms-3">{emailError}</small>
              )}
            </div>

            {/* Password */}
            <div className="mb-3">
              <input
                ref={password}
                type="password"
                className="form-control form-control-lg rounded-pill border-2"
                placeholder="🔒 Password"
              />
              {passwordError && (
                <small className="text-danger ms-3">{passwordError}</small>
              )}
            </div>

            {successMessage && (
              <div className="alert alert-success text-center py-2">
                {successMessage}
              </div>
            )}

            <button
              type="button"
              onClick={HandleButtonClick}
              className="btn btn-lg w-100 rounded-pill text-white fw-bold mt-2"
              style={{
                background: "linear-gradient(135deg, #ff512f, #f09819)",
                border: "none",
              }}
            >
              {isLoggedIn ? "Sign In" : "Sign Up"}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="card-footer bg-white border-0 text-center pb-4">
          <span className="text-muted">
            {isLoggedIn ? "New here?" : "Already have an account?"}
          </span>{" "}
          <span
            className="fw-bold"
            style={{ cursor: "pointer", color: "#764ba2" }}
            onClick={SignUp}
          >
            {isLoggedIn ? "Create account" : "Sign in"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;



