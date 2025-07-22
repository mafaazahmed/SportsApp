import { useState, useEffect } from "react";
import axios from "axios";
import Card from "./Card";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Product() {
  const [product, setProduct] = useState([]);
  const [search, setSearch] = useState('');
  const productCat = [];

  product.map((data) => {
        if(!productCat.includes(data.category)){
          productCat.push(data.category);
        }
      })

  useEffect(() => {
      const productData = async () => {
      const response = await axios.get("http://localhost:3000/product/show");
      setProduct(response.data);
    };
    productData();
  }, []);
  return (
    <>
    {localStorage.getItem('authToken') 
    && 
    <><Navbar /><div>
          <div
            id="carouselExampleControls"
            className="carousel slide mb-3"
            data-bs-ride="carousel"
          >
            <div className="carousel-inner">
              <div className="carousel-caption" style={{ zIndex: "10" }}>
                <div className="d-flex justify-content-center">
                  <input
                    className="form-control me-2"
                    type="search"
                    placeholder="Search products"
                    aria-label="Search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)} />
                </div>
              </div>
              <div className="carousel-item active">
                <img
                  src="https://images.unsplash.com/photo-1722003185511-e9320e4a5d00?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHJhY2tldHxlbnwwfHwwfHx8MA%3D%3D"
                  className="d-block w-100"
                  style={{ maxHeight: "450px", objectFit: "contain !important" }}
                  alt="Batminton" />
              </div>
              <div className="carousel-item">
                <img
                  src="https://media.istockphoto.com/id/1340904676/photo/oversized-t-shirt-mockup-in-front-side-and-back-views.jpg?s=612x612&w=0&k=20&c=tPd_xzjsrVnYOZgcCLziB29cv1eGclW_GduHzRyJWUc="
                  className="d-block w-100"
                  style={{ maxHeight: "450px", objectFit: "contain !important" }}
                  alt="T-shirt" />
              </div>
              <div className="carousel-item">
                <img
                  src="https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8c3BvcnRzJTIwc2hvZXN8ZW58MHx8MHx8fDA%3D"
                  className="d-block w-100"
                  style={{ maxHeight: "450px", objectFit: "contain !important" }}
                  alt="Shoes" />
              </div>
            </div>
            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target="#carouselExampleControls"
              data-bs-slide="prev"
            >
              <span
                className="carousel-control-prev-icon"
                aria-hidden="true"
              ></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button
              className="carousel-control-next"
              type="button"
              data-bs-target="#carouselExampleControls"
              data-bs-slide="next"
            >
              <span
                className="carousel-control-next-icon"
                aria-hidden="true"
              ></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>
        </div><div className="container w-100" style={{ color: 'purple' }}>
            {productCat != []
              ? productCat.map((data, index) => {
                return (<div key={index + 1} className="row mb-3">
                  <div key={data._id} className="fs-3 m-3">
                    <b><i>{data}</i></b>
                  </div>
                  <hr />
                  {product != []
                    ? product.filter((item) => (item.category === data) && (item.name.toLowerCase().includes(search)))
                      .map((data) => {
                        return (
                          <div key={data._id} className="col-12 col-md-6 col-lg-3">
                            <Card product={data} />
                          </div>
                        );
                      })
                    : <div> No Such Data Found </div>}

                </div>);
              }) : ""}
          </div><Footer /></>
    }
    </>
  );
}
