import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Addproduct() {
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: "",
    price: 0,
    quantity: 0,
    category: "shoe",
  });

  const [error, setError] = useState(""); // For validation alert

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (
      !product.name.trim() ||
      product.price <= 0 ||
      product.quantity <= 0 ||
      !product.category
    ) {
      setError("Please fill in all fields");
      return;
    }

    setError(""); // Clear error if valid

    try {
      let res = await axios.post("http://localhost:3000/product/add", product);
      console.log(res);
      setProduct({ name: "", price: 0, quantity: 1, category: "shoe" });
      navigate("/product");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    }
  };

  const onChange = async (e) => {
    if (!e.target.name) {
      const file = e.target.files[0];
      console.log(file);

      if (!file) return;

      const data = new FormData();
      data.append("file", file);
      await axios.post("http://localhost:3000/product/upload", data);
    }

    setProduct({ ...product, [e.target.name]: e.target.value });
  };

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
                  Add New Product
                </h3>
                <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
                  Fill in the details to add a new product
                </p>
              </div>

              <div className="card-body p-4">
                {/* Alert Box */}
                {error && (
                  <div
                    style={{
                      backgroundColor: "#fed7d7",
                      color: "#742a2a",
                      padding: "12px 16px",
                      borderRadius: "8px",
                      marginBottom: "16px",
                      display: "flex",
                      alignItems: "center",
                      fontSize: "0.9rem",
                      fontWeight: "500",
                    }}
                  >
                    <i
                      className="fa-solid fa-triangle-exclamation me-2"
                      style={{ color: "#c53030" }}
                    ></i>
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label
                      htmlFor="category"
                      className="form-label fw-semibold"
                      style={{
                        color: "#2d3748",
                        fontSize: "0.95rem",
                      }}
                    >
                      <i
                        className="fa-solid fa-tags me-2"
                        style={{ color: "#667eea" }}
                      ></i>
                      Category
                    </label>
                    <select
                      className="form-select"
                      aria-label="Default select example"
                      id="category"
                      name="category"
                      value={product.category}
                      onChange={onChange}
                      style={{
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0",
                        padding: "12px 16px",
                        fontSize: "0.95rem",
                      }}
                    >
                      <option value={"shoe"}>Shoe</option>
                      <option value="T-shirt">T-shirt</option>
                      <option value="Bat">Bat</option>
                      <option value="Ball">Ball</option>
                      <option value="Sports-bag">Sports-bag</option>
                    </select>
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="exampleInputEmail1"
                      className="form-label fw-semibold"
                      style={{
                        color: "#2d3748",
                        fontSize: "0.95rem",
                      }}
                    >
                      <i
                        className="fa-solid fa-box me-2"
                        style={{ color: "#667eea" }}
                      ></i>
                      Product Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="exampleInputEmail1"
                      name="name"
                      value={product.name}
                      onChange={onChange}
                      placeholder="Enter product name"
                      style={{
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0",
                        padding: "12px 16px",
                        fontSize: "0.95rem",
                      }}
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="formFile"
                      className="form-label fw-semibold"
                      style={{
                        color: "#2d3748",
                        fontSize: "0.95rem",
                      }}
                    >
                      <i
                        className="fa-solid fa-image me-2"
                        style={{ color: "#667eea" }}
                      ></i>
                      Upload Image
                    </label>
                    <input
                      className="form-control"
                      type="file"
                      id="formFile"
                      onChange={onChange}
                      style={{
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0",
                        padding: "8px 12px",
                        fontSize: "0.9rem",
                      }}
                    />
                  </div>

                  <div className="row mb-4">
                    <div className="col-md-6">
                      <label
                        htmlFor="price"
                        className="form-label fw-semibold"
                        style={{
                          color: "#2d3748",
                          fontSize: "0.95rem",
                        }}
                      >
                        <span
                          style={{
                            color: "#667eea",
                            fontWeight: "bold",
                          }}
                        >
                          (₹)
                        </span>{" "}
                        Price
                      </label>
                      <input
                        type="number"
                        min="0"
                        className="form-control"
                        id="price"
                        name="price"
                        value={product.price}
                        onChange={(e) =>
                          setProduct({
                            ...product,
                            price: Math.max(0, Number(e.target.value)),
                          })
                        }
                        placeholder="0.00"
                        style={{
                          borderRadius: "8px",
                          border: "1px solid #e2e8f0",
                          padding: "12px 16px",
                          fontSize: "0.95rem",
                        }}
                      />
                    </div>
                    <div className="col-md-6">
                      <label
                        htmlFor="quantity"
                        className="form-label fw-semibold"
                        style={{
                          color: "#2d3748",
                          fontSize: "0.95rem",
                        }}
                      >
                        <i
                          className="fa-solid fa-cubes me-2"
                          style={{ color: "#667eea" }}
                        ></i>
                        Quantity
                      </label>
                      <input
                        type="number"
                        min="0"
                        className="form-control"
                        id="quantity"
                        name="quantity"
                        value={product.quantity}
                        onChange={(e) =>
                          setProduct({
                            ...product,
                            quantity: Math.max(0, Number(e.target.value)),
                          })
                        }
                        placeholder="1"
                        style={{
                          borderRadius: "8px",
                          border: "1px solid #e2e8f0",
                          padding: "12px 16px",
                          fontSize: "0.95rem",
                        }}
                      />
                    </div>
                  </div>

                  <div className="d-flex gap-3 mt-4">
                    <button
                      type="submit"
                      className="btn text-white fw-semibold flex-fill"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(128, 0, 128, 0.85) 0%, rgba(102, 126, 234, 0.85) 100%)",
                        borderRadius: "8px",
                        padding: "8px 16px",
                        fontSize: "0.9rem",
                        border: "none",
                        boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)",
                      }}
                    >
                      <i className="fa-solid fa-plus me-2"></i>
                      Add Product
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary fw-semibold"
                      onClick={() => navigate("/product")}
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
