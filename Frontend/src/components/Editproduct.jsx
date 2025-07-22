import { useState} from "react";
import axios from "axios";
import {useNavigate} from 'react-router-dom';
import Navbar from "./Navbar";
import Footer from "./Footer";


export default function Editproduct() {
    const navigate = useNavigate()
    const stringData = localStorage.getItem('product');
    const productData = JSON.parse(stringData);
    const [product, setProduct] = useState({
        name:productData.name, 
        price:productData.price, 
        quantity:productData.quantity, 
        category:productData.category})

   const handleSubmit = async (e) => {
        e.preventDefault();
        navigate('/product');
       let res = await axios.put(`http://localhost:3000/product/update/${productData._id}`,  product);
      
    }

 const onChange = async (e) => {
    if(!e.target.name){
    const file = e.target.files[0];
    console.log(file);

    if(!file) return

    const data = new FormData();
    data.append("file", file);
    await axios.post("http://localhost:3000/product/editimg", data);

    }
   
    setProduct({ ...product, [e.target.name]: e.target.value});
  };

  return (
    <>
      <Navbar/>
      <div className=" d-flex justify-content-center align-items-center m-3">
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="category" className="form-label mt-3">
            Category
          </label>
          <select
            className="form-select "
            aria-label="Default select example"
            id="category"
            name="category"
            value={product.category}
            onChange={onChange}
          >
            <option value={"shoe"}>Shoe</option>
            <option value="T-shirt">T-shirt</option>
            <option value="Bat">Bat</option>
            <option value="Ball">Ball</option>
            <option value="Sports-bag">Sports-bag</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">
            Product name
          </label>
          <input
            type="text"
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            name="name"
            value={product.name}
            onChange={onChange}
          />
        </div>
         <div className="mb-5">
          <label htmlFor="formFile" className="form-label">
            Upload Image
          </label>
          <input className="form-control" type="file" id="formFile" onChange={onChange}/>
        </div>
        <div className="mb-3 d-flex">
          <label htmlFor="exampleInputPassword1" className="form-label">
            Price
          </label>
          <input
            type="number"
            className="form-control mx-1"
            id="exampleInputPassword1"
            name="price"
            value={product.price}
            onChange={onChange}
          />
          <label htmlFor="exampleInputQuantity" className="form-label">
            Qty
          </label>
          <input
            type="number"
            className="form-control mx-1"
            id="exampleInputQuantity"
            name="quantity"
            value={product.quantity}
            onChange={onChange}
          />
        </div>
        <button type="submit" className="btn text-white m-auto" style={{backgroundColor : 'purple'}}>
          Edit Product
        </button>
      </form>
      </div>
       <div className="fixed-bottom"><Footer/></div>
    </>
  );
}
