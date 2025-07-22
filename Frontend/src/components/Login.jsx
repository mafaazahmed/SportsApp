import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [userInfo, setUserInfo] = useState({ username: "", password: "" });
  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response = await axios.post(
        "http://localhost:3000/user/login",
        userInfo
      );

      if (response.data.success && response.data.admin) {
        localStorage.setItem("admin", true);
        localStorage.setItem("authToken", response.data.authToken);
        console.log( localStorage.getItem("authToken"));
        navigate("/product");
      } else {
        localStorage.removeItem("admin");
        localStorage.setItem("authToken", response.data.authToken);
        console.log( localStorage.getItem("authToken"));
        navigate("/product");
      }
    } catch (error) {
      let msg = error.response.data.error;
      localStorage.setItem("error", true);
      //console.log(msg);
      alert(msg);
    }
  };

  const onChange = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };
  return (
    <>
    {/* alert alert-danger alert-dismissible fade show col-10 offset-1 */}
      <div className="container mt-3 d-flex justify-content-center">
        <form
          className="needs-validation"
          noValidate
          onSubmit={handleSubmit}
          style={{
            height: "470px",
            width: "470px",
            border: "2px solid black",
            borderRadius: "25px",
            marginTop: "50px",
          }}
        >
          <h3 className="m-5" style={{ color: "purple" }}>
            <i className="fa-solid fa-baseball"></i> Sports Application
          </h3>
          <div className="m-5">
            <label htmlFor="exampleInputEmail1" className="form-label">
              Enter Username :
            </label>
            <input
              required
              type="username"
              minLength={8}
              className="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              name="username"
              value={userInfo.username}
              onChange={onChange}
            />
            <div className="invalid-feedback">
              username length must be more than 8 characters
            </div>
          </div>
          <div className="m-5">
            <label htmlFor="exampleInputPassword1" className="form-label">
              Enter Password :
            </label>
            <input
              required
              minLength={8}
              type="password"
              className="form-control"
              id="exampleInputPassword1"
              name="password"
              value={userInfo.password}
              onChange={onChange}
            />
            <div className="invalid-feedback">
              password length must be more than 8 characters
            </div>
          </div>
          <button
            type="submit"
            className="btn mx-5  text-white"
            style={{ backgroundColor: "purple" }}
          >
            Login
          </button>
        </form>
      </div>
    </>
  );
}
