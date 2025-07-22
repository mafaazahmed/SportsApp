import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function ViewRoles() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await axios.get("http://localhost:3000/user/show");
      setUsers(response.data);
    };
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    navigate('/product');
    await axios.delete(`http://localhost:3000/user/delete/${id}`);
  }

  const handleEdit = async (data) => {
    let userData = JSON.stringify(data);
    localStorage.setItem('user', userData);
    navigate('/Edituser');
  }

  return (
    <>
      <Navbar/>
      <div className="d-flex justify-content-center align-items-center border-1">
      <table className="table table-striped w-75 mt-5" style={{ border: '2px solid grey' , borderRadius : '25px'}}>
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Username</th>
            <th scope="col">Roles</th>
            <th scope="col">Edit_Role</th>
            <th scope="col">Delete</th>
          </tr>
        </thead>
        <tbody>
          {users.map((data, idx) => (
            <tr key={idx}>
              <th scope="row">{idx + 1}</th>
              <td>{data.username}</td>
              <td>{data.role}</td>
              <td><button className="btn btn-dark" onClick={() => handleEdit(data)}>Edit</button></td>
              <td><button className="btn btn-danger" onClick={() => handleDelete(data._id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
       <div className="fixed-bottom"><Footer/></div>
    </>
  );
}
