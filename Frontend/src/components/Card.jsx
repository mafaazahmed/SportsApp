import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import { useState } from 'react';


export default function Card(props) {
    
  const navigate = useNavigate();
    


    let handleEdit = async (Product) => {
      //console.log(upProduct);
      let productData = JSON.stringify(Product);
      localStorage.setItem('product', productData);
      navigate('/Editproduct');
      }
      
    

    let handleDelete = async (id) => {
    const removeProduct = axios.delete(`http://localhost:3000/product/delete/${id}`);
    console.log(removeProduct);
    navigate('/product');
  }
  return (
    <>
      <div className="card mb-3 w-100"  style={{ width: "16rem", maxHeight: "360px", backgroundColor: 'whitesmoke'}}>
        <img src={`http://localhost:3000/images/${props.product.img}`} className="card-img-top" alt="..." style={{ height: "180px", objectFit: "fill"}}/>
        <div className="card-body">
          <p className="card-text">{props.product.name}</p>
          <div className='d-flex'>
           <p className="card-text">Price : {props.product.price} &#x62f;&#x2e;&#x625;</p>
           <p className="card-text mx-2">Quantity : {props.product.quantity}</p>
           </div>
           <div>
            {localStorage.getItem('admin') && (
              <>
                <button onClick={() => handleEdit(props.product)} className="btn btn-outline-dark mx-3">Edit</button>
                <button onClick={() => handleDelete(props.product._id)} className="btn btn-outline-danger">Delete</button>
              </>
            )}
           </div>
        </div>
      </div>
    </>
  );
}
