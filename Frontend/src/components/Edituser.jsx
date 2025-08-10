import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Edituser() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const stringData = localStorage.getItem("user");
  const userData = JSON.parse(stringData);

  const [user, setUser] = useState({
    id : userData._id,
    username: userData.username,
    password: userData.password,
    role: userData.role,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axios.put(
        `http://localhost:3000/user/update/${userData._id}`,
        user
      );
      navigate("/viewroles");
    } catch (error) {
      console.error("Error updating user:", error);
      setError("Failed to update user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onchange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
    setError(""); // Clear error when user starts typing
  };

   const handleDelete = async (id) => {
        try {  
           await axios.delete(`http://localhost:3000/user/delete/${id}`); 
        } catch (error) {
          console.error('Error deleting user:', error);
        }
     
    }

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div
              className="card shadow-lg border-0"
              style={{
                background: "white",
                borderRadius: "16px",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                border: "1px solid #e2e8f0",
              }}
            >
              <div className="card-header bg-transparent border-0 text-center pt-4 pb-2">
                <h3
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(128, 0, 128, 0.85) 0%, rgba(102, 126, 234, 0.85) 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    fontWeight: 700,
                    fontSize: "1.8rem",
                  }}
                >
                  Edit User
                </h3>
                <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
                  Update user information
                </p>
              </div>

              <div className="card-body p-4">
                {/* Error Message */}
                {error && (
                  <div
                    className="alert alert-danger border-0 shadow-sm mb-4"
                    role="alert"
                    style={{ borderRadius: "12px", fontSize: "0.9rem" }}
                  >
                    <i className="fa-solid fa-exclamation-triangle me-2"></i>
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  {/* Username Field */}
                  <div className="mb-4">
                    <label
                      htmlFor="username"
                      className="form-label fw-semibold"
                      style={{ color: "#2d3748", fontSize: "0.95rem" }}
                    >
                      <i
                        className="fa-solid fa-user me-2"
                        style={{ color: "#667eea" }}
                      ></i>
                      Username
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="username"
                      name="username"
                      value={user.username}
                      onChange={onchange}
                      disabled
                      style={{
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0",
                        padding: "12px 16px",
                        fontSize: "0.95rem",
                        backgroundColor: "#f7fafc",
                        color: "#6c757d",
                        cursor: "not-allowed",
                      }}
                    />
                    <small className="text-muted mt-1 d-block">
                      <i className="fa-solid fa-info-circle me-1"></i>
                      Username cannot be changed
                    </small>
                  </div>

                  {/* Password Field */}
                  <div className="mb-4">
                    <label
                      htmlFor="password"
                      className="form-label fw-semibold"
                      style={{ color: "#2d3748", fontSize: "0.95rem" }}
                    >
                      <i
                        className="fa-solid fa-lock me-2"
                        style={{ color: "#667eea" }}
                      ></i>
                      Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"
                      value={user.password}
                      onChange={onchange}
                      disabled
                      style={{
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0",
                        padding: "12px 16px",
                        fontSize: "0.95rem",
                        backgroundColor: "#f7fafc",
                        color: "#6c757d",
                        cursor: "not-allowed",
                      }}
                    />
                    <small className="text-muted mt-1 d-block">
                      <i className="fa-solid fa-info-circle me-1"></i>
                      Password cannot be changed
                    </small>
                  </div>

                  {/* Role Selection */}
                  <div className="mb-4">
                    <label
                      className="form-label fw-semibold mb-3"
                      style={{ color: "#2d3748", fontSize: "0.95rem" }}
                    >
                      <i
                        className="fa-solid fa-user-tag me-2"
                        style={{ color: "#667eea" }}
                      ></i>
                      User Role
                    </label>
                    <div className="d-flex gap-4">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          id="adminRole"
                          name="role"
                          value="Admin"
                          checked={user.role === "Admin"}
                          onChange={onchange}
                          style={{
                            width: "1.2rem",
                            height: "1.2rem",
                            accentColor: "#667eea",
                          }}
                        />
                        <label
                          className="form-check-label fw-semibold ms-2"
                          htmlFor="adminRole"
                          style={{ color: "#2d3748", fontSize: "0.95rem" }}
                        >
                          <i className="fa-solid fa-user-shield me-1 text-success"></i>
                          Administrator
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          id="cashierRole"
                          name="role"
                          value="Cashier"
                          checked={user.role === "Cashier"}
                          onChange={onchange}
                          style={{
                            width: "1.2rem",
                            height: "1.2rem",
                            accentColor: "#667eea",
                          }}
                        />
                        <label
                          className="form-check-label fw-semibold ms-2"
                          htmlFor="cashierRole"
                          style={{ color: "#2d3748", fontSize: "0.95rem" }}
                        >
                          <i className="fa-solid fa-cash-register me-1 text-danger"></i>
                          Cashier
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="d-flex gap-3 mt-4">
                    <button
                      type="submit"
                      className="btn text-white fw-semibold"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(128, 0, 128, 0.85) 0%, rgba(102, 126, 234, 0.85) 100%)",
                        borderRadius: "8px",
                        padding: "8px 16px",
                        fontSize: "0.9rem",
                        border: "none",
                        boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)",
                      }}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <i className="fa-solid fa-spinner fa-spin me-2"></i>
                          Saving Changes...
                        </>
                      ) : (
                        <>
                          <i className="fa-solid fa-save me-2"></i>
                          Save Changes
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary fw-semibold w-25"
                      onClick={() => navigate("/viewroles")}
                      style={{
                        borderRadius: "8px",
                        padding: "8px 16px",
                        fontSize: "0.9rem",
                        border: "1px solid #e2e8f0",
                      }}
                    >
                      <i className="fa-solid fa-times me-2"></i>
                      Cancel
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm w-25"
                      onClick={() => handleDelete(user.id)}
                      style={{
                        borderRadius: "6px",
                        fontSize: "0.75rem",
                        padding: "0.25rem 0.5rem",
                      }}
                    >
                      <i className="fa-solid fa-trash me-1"></i>
                      Delete
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ marginTop: "60px" }}>
        <Footer />
      </div>
    </>
  );
}
