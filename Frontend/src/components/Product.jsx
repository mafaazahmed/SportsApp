import { useState, useEffect } from "react";
import axios from "axios";
import Card from "./Card";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Product() {
  const [product, setProduct] = useState([]);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState(false);
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
    
    // Check for view mode
    const isViewMode = localStorage.getItem('viewMode') === 'true';
    setViewMode(isViewMode);
    
    // Listen for custom view mode change event
    const handleViewModeChange = (event) => {
      setViewMode(event.detail);
    };
    
    window.addEventListener('viewModeChange', handleViewModeChange);
    
    return () => {
      window.removeEventListener('viewModeChange', handleViewModeChange);
    };
  }, []);

  // Show content if authenticated OR in view mode
  const shouldShowContent = localStorage.getItem('authToken') || viewMode;

  return (
    <>
    {shouldShowContent && 
    <><Navbar /><div>
          <div
            id="carouselExampleControls"
            className="carousel slide mb-4"
            data-bs-ride="carousel"
            data-bs-interval="5000"
            data-bs-pause="hover"
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
                    onChange={(e) => setSearch(e.target.value)}
                    style={{
                      borderRadius: "8px",
                      border: "1px solid rgba(255, 255, 255, 0.3)",
                      background: "rgba(255, 255, 255, 0.9)",
                      backdropFilter: "blur(10px)",
                      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)"
                    }} />
                </div>
              </div>
              <div className="carousel-item active">
                <img
                  src="/Carousels/3db5d101-7084-4130-96f6-16ae85b54c24.jpg"
                  className="d-block w-100"
                  style={{ 
                    height: "500px", 
                    objectFit: "cover",
                    objectPosition: "center"
                  }}
                  alt="Premium Sports Collection" />
              </div>
              <div className="carousel-item">
                <img
                  src="/Carousels/8677c745-74fb-4bdf-8c4d-4385c6334e94.jpg"
                  className="d-block w-100"
                  style={{ 
                    height: "500px", 
                    objectFit: "cover",
                    objectPosition: "center"
                  }}
                  alt="Sports Equipment Collection" />
              </div>
              <div className="carousel-item">
                <img
                  src="/Carousels/1952d8af-08a3-43be-9f59-13ea5600c306.jpg"
                  className="d-block w-100"
                  style={{ 
                    height: "500px", 
                    objectFit: "cover",
                    objectPosition: "center"
                  }}
                  alt="Athletic Footwear Collection" />
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
        </div><div className="container w-100" style={{ color: 'rgba(148, 30, 148, 0.85)'}}>
            {productCat != []
              ? productCat.map((data, index) => {
                return (<div key={index + 1} className="row mb-3">
                  <div key={data._id} className="fs-3 m-3">
                    <b style={{color : "linear-gradient(135deg, rgba(128, 0, 128, 0.85) 0%, rgba(102, 126, 234, 0.85) 100%)"}}><i>{data}</i></b>
                  </div>
                  <hr />
                  {product != []
                    ? product.filter((item) => (item.category === data) && (item.name.toLowerCase().includes(search)))
                      .map((data) => {
                        return (
                          <div key={data._id} className="col-12 col-md-6 col-lg-3">
                            <Card product={data} viewMode={viewMode} />
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
