import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <>
      <nav
        className="navbar navbar-expand-lg text-white"
        style={{ backgroundColor: "purple" }}
      >
        <div className="container-fluid">
          <Link className="navbar-brand text-white fs-3" to="/product">
            <i>
              <i className="fa-solid fa-volleyball"></i>Products
            </i>
          </Link>
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
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <Link
                  className="nav-link text-white active fs-5"
                  aria-current="page"
                  to="/generate_bill"
                >
                  Generate Bill
                </Link>
              </li>
              <li>
                <Link
                  className="nav-link text-white active fs-5"
                  aria-current="page"
                  to="/"
                >
                  Switch-User
                </Link>
              </li>
              <li>
                <Link className="nav-link text-white active fs-5" to="/viewbills">
                  View-Bills
                </Link>
              </li>
            </ul>
            {localStorage.getItem("admin") && (
              <div className="d-flex">
                <Link className="btn  text-white m-1" to="/addproduct">
                  Add Product
                </Link>
                <Link className="btn  text-white m-1" to="/viewroles">
                  View Roles
                </Link>
                <Link className="btn  text-white m-1" to="/signup">
                  Add User
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
