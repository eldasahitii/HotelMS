import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../Assets/images/logo.png";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useAuth } from "../Context/AuthContext"; //  import context

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const { userRole, setUserRole, loading } = useAuth(); //  use global role

  const logout = async () => {
    try {
      await axios.post("https://localhost:7117/api/Auth/logout", {}, { withCredentials: true });
    } catch (e) {
      // ignore errors
    }
    setUserRole(null); //  clear role in context
    navigate("/login");
  };

  const navLinkStyle = (path) =>
    `nav-link px-3 fw-semibold fs-6 ${
      location.pathname === path
        ? "text-dark border-bottom border-2 border-dark"
        : "text-secondary"
    }`;

  if (location.pathname === "/login") return null;
  if (loading) return null; // still loading role

  const dashboardLinks = {
    CleaningManager: [
      { path: "/manager/cleaning-staff", label: "Cleaning Staff" },
      { path: "/manager/assignments", label: "Assignments" },
    ],
  RoomManager: [
  { path: "/manager/room-dashboard", label: "Room Dashboard" },
  { path: "/admin/reservation-dashboard", label: "Room Reservations" },
  { path: "/room-manager/review-dashboard", label: "Room Reviews" },
  { path: "/room-manager-receptionist-management", label: "Manage Recepsionists" },
],
    RoomRecepsionist: [
    { path: "/recepsionist-dashboard", label: "Room Availability Dashboard" },
    { path: "/recepsionist-reservations", label: "Room Reservations" },
  ],

    CleaningStaff: [
      { path: "/cleaningstaff/dashboard", label: "My Dashboard" },
    ],
          Customer: [
    { path: "/user/profile", label: "My Profile" },
  ],
    // Add more roles here
    RestaurantManager: [
      { path: "/manager/restaurant-hosts", label: "Hosts"},
      { path: "/manager/restaurant-menu", label: "Menu"},
      { path: "/manager/restaurant-tables", label: "Tables"},
      { path: "/manager/restaurant-reservations", label: "Reservations"}
    ],
    RestaurantHost: [
      { path: "/host/dashboard", label: "Reservations" }
    ],

  };

  const toggleDropdown = () => setShowDropdown(!showDropdown);
  const closeDropdown = () => setShowDropdown(false);

  return (
    <header className="bg-white shadow-sm border-bottom py-2">
      <nav className="navbar navbar-expand-lg navbar-light container">
        <Link to="/" className="navbar-brand d-flex align-items-center">
          <img src={logo} alt="Hotel Logo" style={{ height: "120px" }} className="img-fluid" />
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
          onClick={() => setShowDropdown(false)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav gap-lg-5 gap-3 text-center align-items-center">
            <li className="nav-item">
              <Link to="/homepage" className={navLinkStyle("/homepage")}>HOME</Link>
            </li>
            <li className="nav-item">
              <Link to="/about" className={navLinkStyle("/about")}>ABOUT US</Link>
            </li>
                 <li className="nav-item">
              <Link to="/rooms" className={navLinkStyle("/rooms")}>ROOMS</Link>
            </li>
            <li className="nav-item">
              <Link to="/restaurant" className={navLinkStyle("/restaurant")}>RESTAURANT</Link>
            </li>
            <li className="nav-item">
              <Link to="/spa" className={navLinkStyle("/spa")}>POOL & SPA</Link>
            </li>
            <li className="nav-item">
              <Link to="/book" className={navLinkStyle("/book")}>BOOK NOW</Link>
            </li>

            {!userRole && (
              <li className="nav-item dropdown position-relative">
                <button
                  className="btn nav-link text-secondary d-flex align-items-center gap-1"
                  type="button"
                  onClick={toggleDropdown}
                  aria-expanded={showDropdown}
                  style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                >
                  <i className="bi bi-person-circle fs-4"></i>
                  <span className="d-none d-lg-inline fw-semibold">MEMBERS</span>
                </button>

                {showDropdown && (
                  <ul
                    className="dropdown-menu dropdown-menu-end show mt-2 shadow"
                    style={{ minWidth: "160px" }}
                    onMouseLeave={closeDropdown}
                  >
                    <li>
                      <Link to="/login" className="dropdown-item" onClick={closeDropdown}>Log In</Link>
                    </li>
                    <li>
                      <Link to="/signup" className="dropdown-item" onClick={closeDropdown}>Sign Up</Link>
                    </li>
                  </ul>
                )}
              </li>
            )}

            {userRole && (
              <li className="nav-item dropdown position-relative">
                <button
                  className="btn nav-link text-secondary d-flex align-items-center gap-1"
                  type="button"
                  onClick={toggleDropdown}
                  aria-expanded={showDropdown}
                  style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                >
                  <i className="bi bi-person-circle fs-4"></i>
                  <span className="d-none d-lg-inline fw-semibold">DASHBOARD</span>
                </button>

                {showDropdown && (
                  <ul
                    className="dropdown-menu dropdown-menu-end show mt-2 shadow"
                    style={{ minWidth: "160px" }}
                    onMouseLeave={closeDropdown}
                  >
                    {dashboardLinks[userRole]?.map(({ path, label }) => (
                      <li key={path}>
                        <Link to={path} className="dropdown-item" onClick={closeDropdown}>{label}</Link>
                      </li>
                    ))}
                    <li>
                      <button className="dropdown-item text-danger" onClick={() => { logout(); closeDropdown(); }}>
                        Logout
                      </button>
                    </li>
                  </ul>
                )}
              </li>
            )}
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
