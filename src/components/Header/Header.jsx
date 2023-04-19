import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Header.css";
import { logout } from "../../utilities/users-service";

export default function Header({ setUser, customer }) {
  const isSignedIn = customer;
  const navigate = useNavigate();
  const location = useLocation();
  const { role } = customer || {};

  const handleLogout = (e) => {
    e.preventDefault();
    setUser(null);
    logout();
    navigate("/login");
  };

  return (
    <nav className="stickyNavBar navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto align-items-center my-auto">
            {!isSignedIn && (
              <React.Fragment>
                <li className="nav-item">
                  <Link
                    className={`nav-link text-white ${
                      location.pathname === "/login" ? "active" : ""
                    }`}
                    to="/login"
                  >
                    Log In
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={`nav-link text-white ${
                      location.pathname === "/signup" ? "active" : ""
                    }`}
                    to="/signup"
                  >
                    Register
                  </Link>
                </li>
              </React.Fragment>
            )}
            {!!customer && (
              <li className="nav-item">
                <div
                  style={{
                    color: "white",
                    paddingRight: "0.5rem",
                    paddingLeft: "0.5rem",
                  }}
                >
                  Hello,{" "}
                  <em style={{ fontStyle: "italic" }}>{customer.name}</em>
                </div>
              </li>
            )}
          </ul>

          {isSignedIn && (
            <ul className="navbar-nav">
              {["CUSTOMER"].includes(role) && (
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle text-white"
                    id="navbarDropdownMenuLink"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    My Account
                  </a>
                  <ul
                    className="dropdown-menu right"
                    aria-labelledby="navbarDropdownMenuLink"
                  >
                    <li>
                      <Link className="dropdown-item" to="/history">
                        Upcoming Appointments
                      </Link>
                    </li>
                    <li>
                      <a className="dropdown-item" onClick={handleLogout}>
                        Log Out
                      </a>
                    </li>
                  </ul>
                </li>
              )}
              {["OPSADMIN", "HRADMIN"].includes(role) && (
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle text-white"
                    id="navbarDropdownMenuLink"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Admin Tools
                  </a>
                  <ul
                    className="dropdown-menu right"
                    aria-labelledby="navbarDropdownMenuLink"
                  >
                    {role === "OPSADMIN" && (
                      <React.Fragment>
                        <li>
                          <Link className="dropdown-item" to="/productpage">
                            Product Portfolio
                          </Link>
                        </li>
                        <li>
                          <Link className="dropdown-item" to="/adminlocation">
                            Inventory Management
                          </Link>
                        </li>
                      </React.Fragment>
                    )}
                    {role === "HRADMIN" && (
                      <React.Fragment>
                        <li>
                          <Link className="dropdown-item" to="/admin">
                            Staff Scheduling
                          </Link>
                        </li>
                      </React.Fragment>
                    )}
                    <li>
                      <a className="dropdown-item" onClick={handleLogout}>
                        Log Out
                      </a>
                    </li>
                  </ul>
                </li>
              )}
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
}
