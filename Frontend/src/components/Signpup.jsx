import { useState } from "react";
import axios from "axios";
import Footer from "./Footer";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";


export default function Signup() {
    const [user, setUser] = useState({username:'', password:'', role:''});
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        navigate('/product')
        const createUser = await axios.post("http://localhost:3000/user/signup", user);
        console.log(createUser);
        setUser({username:'', password:'', role:''});

    }

    const onchange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    }



  return (
    <>
      <Navbar/>
      <div className=" d-flex justify-content-center align-items-center -5">
      <form onSubmit={handleSubmit} style={{
            height: "350px",
            width: "350px",
            border: "2px solid black",
            borderRadius : '25px',
            marginTop: "50px",
          }}>
        <div className="m-5 d-flex">
          <label htmlFor="exampleInputEmail1" className="form-label">
            Username
          </label>
          <input
            type="text"
            className="form-control mx-1"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            name="username" value={user.username}
            onChange={onchange}
          />
        </div>
        <div className="m-5 d-flex">
          <label htmlFor="exampleInputPassword1" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control mx-1"
            id="exampleInputPassword1"
            name="password" value={user.password}
            onChange={onchange}
          />
        </div>
         <div className="d-flex m-5">
            Role : 
        <div className="form-check">
          <input
            className="form-check-input mx-1"
            type="radio"
            id="flexRadioDefault1"
            name="role" value={'Admin'}
            onChange={onchange}
          />
          <label className="form-check-label" htmlFor="flexRadioDefault1">
            Admin
          </label>
        </div>
        <div className="form-check">
          <input
            className="form-check-input mx-1"
            type="radio"
            id="flexRadioDefault2"
            name="role" value={'Cashier'}
            onChange={onchange}
          />
          <label className="form-check-label" htmlFor="flexRadioDefault2">
            Cashier
          </label>
        </div>
        </div>
        <button type="submit" className="btn text-white mx-5" style={{backgroundColor : 'purple'}}>
          Add New User
        </button>
      </form>
      </div>
      <div className="fixed-bottom"><Footer/></div>
    </>
  );
}
