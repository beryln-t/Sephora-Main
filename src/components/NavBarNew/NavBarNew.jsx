import { NavLink } from "react-router-dom";
import "./NavBarNew.css";

export default function NavBarNew() {
  return (
    <nav
      style={{ flexDirection: "column" }}
      className="headerMenu navbar navbar-expand-lg navbar-light bg-white border-bottom"
    >
      <ul className="navbar-nav justify-content-center">
        <li className="nav-item">
          <NavLink className="nav-link text-black nav-link-hover" to="/">
            Browse Products
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link text-black nav-link-hover" to="/booking">
            Appointment Booking
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link text-black nav-link-hover" to="/maps">
            Locate Us
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
