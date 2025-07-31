import { useState } from "react";

export default function Footer() {
  const [showHours, setShowHours] = useState(false);

  const toggleHours = () => {
    setShowHours(!showHours);
  };

  return (
    <>
      <footer
        className="text-white mt-auto"
        style={{
          background: "linear-gradient(135deg, rgba(128, 0, 128, 0.85) 0%, rgba(102, 126, 234, 0.85) 100%)",
          backdropFilter: "blur(15px)",
          WebkitBackdropFilter: "blur(15px)",
          borderTop: "1px solid rgba(255, 255, 255, 0.2)",
          boxShadow: "0 -8px 32px rgba(0, 0, 0, 0.15), inset 0 -1px 0 rgba(255, 255, 255, 0.1)",
          padding: "30px 0",
          width: '100%'
        }}
      >
        <div className="container">
          <div className="row">
            {/* Business Info */}
            <div className="col-md-4 mb-3">
              <h5 className="mb-3 d-flex align-items-center">
                <div 
                  style={{ 
                    width: "60px", 
                    height: "60px", 
                    borderRadius: "50%", 
                    overflow: "hidden",
                    marginRight: "18px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.8)",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    transition: "all 0.3s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.05)';
                    e.target.style.boxShadow = '0 12px 35px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.9)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1)';
                    e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.8)';
                  }}
                >
                  <img
                    src="/shams_small_logo.png"
                    alt="Shams Sports Logo"
                    style={{ 
                      width: "100%", 
                      height: "100%", 
                      objectFit: "cover",
                      objectPosition: "center"
                    }}
                  />
                </div>
                <span style={{ 
                  color: "#fff", 
                  fontWeight: 900, 
                  fontSize: "2.2rem", 
                  textShadow: "2px 2px 4px rgba(0,0,0,0.3), 0 0 20px rgba(255,255,255,0.1)", 
                  letterSpacing: '2px',
                  background: "linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text"
                }}>
                  SHAMS SPORTS
                </span>
              </h5>
              <p className="mb-1">
                <i className="fa-solid fa-location-dot me-2"></i>
                Ramez Mall, Sharjah, United Arab Emirates
              </p>
              <p className="mb-1">
                <i className="fa-solid fa-phone me-2"></i>
                +971 56 634 9898
              </p>
              <p className="mb-1">
                <i className="fa-solid fa-envelope me-2"></i>
                shamsyonex@gmail.com
              </p>
              <p className="mb-1">
                <i className="fa-solid fa-globe me-2"></i>
                ShamsSports.com
              </p>
            </div>

            {/* Business Status */}
            <div className="col-md-4 mb-3">
              <h6 className="mb-3" style={{ 
                fontSize: '1.1rem', 
                fontWeight: '700', 
                textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                color: '#fff'
              }}>Business Status</h6>
              <div className="mb-2">
                <button 
                  className="btn btn-link text-white p-0 text-decoration-none"
                  onClick={toggleHours}
                  style={{ 
                    textAlign: 'left',
                    padding: '8px 16px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: 'none',
                    transition: 'all 0.3s ease',
                    fontWeight: '600'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <i className="fa-solid fa-clock me-2"></i>
                  <span className="text-white">Open now</span>
                  <i className={`fa-solid fa-chevron-${showHours ? 'up' : 'down'} ms-2`}></i>
                </button>
                
                {showHours && (
                  <div className="mt-3 p-4" style={{ 
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(15px)',
                    borderRadius: '16px',
                    fontSize: '14px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                  }}>
                    <h6 className="mb-3" style={{ 
                      fontWeight: '700', 
                      color: '#fff',
                      textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                    }}>Hours</h6>
                    <div className="mb-2" style={{ lineHeight: '1.8' }}>
                      <strong style={{ color: '#fff' }}>Monday:</strong> <span style={{ color: '#f0f0f0' }}>10:00 - 23:00</span><br/>
                      <strong style={{ color: '#fff' }}>Tuesday:</strong> <span style={{ color: '#f0f0f0' }}>10:00 - 23:00</span><br/>
                      <strong style={{ color: '#fff' }}>Wednesday:</strong> <span style={{ color: '#f0f0f0' }}>10:00 - 23:00</span><br/>
                      <strong style={{ color: '#fff' }}>Thursday:</strong> <span style={{ color: '#f0f0f0' }}>10:00 - 23:30</span><br/>
                      <strong style={{ color: '#fff' }}>Friday:</strong> <span style={{ color: '#f0f0f0' }}>14:00 - 23:30</span><br/>
                      <strong style={{ color: '#fff' }}>Saturday:</strong> <span style={{ color: '#f0f0f0' }}>10:00 - 23:00</span><br/>
                      <strong style={{ color: '#fff' }}>Sunday:</strong> <span style={{ color: '#f0f0f0' }}>10:00 - 23:00</span>
                    </div>
                   {/* <small className="text-muted">Updated about 4 years ago</small> */}
                    
                    <hr className="my-2" />
                    <h6 className="mb-2">Services</h6>
                    <div>
                      <i className="fa-solid fa-utensils me-2"></i>Dine in<br/>
                      <i className="fa-solid fa-umbrella-beach me-2"></i>Outdoor seating
                    </div>
                  </div>
                )}
              </div>
              <p className="mb-1">
                <i className="fa-solid fa-star me-2"></i>
                Not yet rated (1 review)
              </p>
            </div>

            {/* Quick Links */}
            <div className="col-md-4 mb-3">
              <h6 className="mb-3">Quick Links</h6>
              <p className="mb-1">
                <i className="fa-solid fa-shoe-prints me-2"></i>
                Sports Equipment
              </p>
              <p className="mb-1">
                <i className="fa-solid fa-tshirt me-2"></i>
                Sports Apparel
              </p>
              <p className="mb-1">
                <i className="fa-solid fa-headset me-2"></i>
                Customer Support
              </p>
            </div>
          </div>

          {/* Copyright */}
          <div className="row mt-3">
            <div className="col-12">
              <hr className="border-light" />
              <p className="text-center mb-0">
                © 2025 Shams Sports, Inc. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
