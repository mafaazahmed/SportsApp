import "./Bill.css";
import { useState, useRef, useEffect } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import axios from "axios";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export default function Bill() {
  const [id, setId] = useState("");
  const [products, setProducts] = useState([]);
  const [discount, setDiscount] = useState(0);

  const date = new Date(); 
  const f = new Intl.DateTimeFormat("en-us", {
    dateStyle: "short",
    timeStyle: "short",
  }); 
  const dateAndTime = f.format(date);

  const generateID = () => {
    const len = 6;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < len; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
    setId(result);
  };

  useEffect(() => {
   generateID();
  }, []);

  window.addEventListener("afterprint", () => {
      generateID();
      setProducts([]);
      setDiscount(0);
  });
  
  // const [customer, setCustomer] = useState({ name: '', email: '' });
 
  //Both query and suggestions is used for search option
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  //all productlist
  const [productList, setProductList] = useState([]);

  const billRef = useRef();


  const handleChange = (_id, field, value) => {
    setProducts(
      products.map((p) =>
        p._id === _id
          ? {
              ...p,
              [field]:
                field === "quantity" || field === "price"
                  ? Number(value)
                  : value,
            }
          : p
      )
    );
  };

  // const handleCustomerChange = (e) => {
  //   setCustomer({ ...customer, [e.target.name]: e.target.value });
  // };

  const removeProduct = (_id) => {
    setProducts(products.filter((p) => p._id !== _id));
  };

  const subtotal = products.reduce((sum, p) => sum + p.price * p.quantity, 0);

  const handleDiscount = (e) => {
    if (e.target.value >= 0) {
      setDiscount(e.target.value);
    } 
  };
  let calDis = discount / 100;
  //setTotal(subtotal - (subtotal * calDis));
  const total = subtotal - subtotal * calDis;

  const printInvoice = async () => {
    const bill = {
      id: id,
      products: products,
      discount: discount,
      total: total,
      Date: dateAndTime,
    };
    let response = await axios.post(
      "http://localhost:3000/bill/createBill",
      bill
    );
    console.log(response);
    window.print();
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await axios.get("http://localhost:3000/product/show");
      setProductList(response.data);
    };
    fetchUsers();
  }, []);
  
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length === 0) {
      setSuggestions([]);
    } else {
      const filtered = productList.filter((item) => 
        item.name.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
    }
  };

  const handleSuggestionClick = (value) => {
    let val = JSON.stringify(value);
    localStorage.setItem("product", val);
    setQuery(value.name);
    setSuggestions([]);
  };

    let addProducts = () => {
  const product = localStorage.getItem("product");
  if (!product) return;

  const data = JSON.parse(product);
  const newProduct = {
    _id: data._id,
    name: data.name,
    price: data.price,
    quantity: 1,
  };

  const existingProduct = products.find((p) => p._id === newProduct._id);

  if (existingProduct) {
    // Increase quantity if product already exists
    const updatedProducts = products.map((p) =>
      p._id === newProduct._id ? { ...p, quantity: p.quantity + 1 } : p
    );
    setProducts(updatedProducts);
  } else {
    // Add new product if not found
    setProducts([...products, newProduct]);
  }

    setQuery("");
  };

  const downloadPDF = async () => {
    if (!billRef.current) return;
    
    try {
      // Add class to hide remove column during PDF generation
      const table = billRef.current.querySelector('table');
      if (table) {
        table.classList.add('pdf-generating');
      }
      
      const canvas = await html2canvas(billRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });
      
      // Remove the class after canvas generation
      if (table) {
        table.classList.remove('pdf-generating');
      }
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save(`bill_${id}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
      
      // Remove the class in case of error
      const table = billRef.current?.querySelector('table');
      if (table) {
        table.classList.remove('pdf-generating');
      }
    }
  };


  return (
    <>
      <Navbar />
    <div className="container mt-4">
      {/* search bar  */}
      <div className="container mt-4" style={{ maxWidth: "600px" }}>
        <div className="d-flex">
          <input
          type="text"
          className="form-control"
          placeholder="Search products..."
          value={query}
          onChange={handleSearchChange}
          style={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
        />
            <button
              className="btn mx-3"
              style={{ 
                width: "220px", 
                borderRadius: '8px', 
                fontWeight: 500,
                background: 'linear-gradient(135deg, rgba(128, 0, 128, 0.85) 0%, rgba(102, 126, 234, 0.85) 100%)',
                color: 'white',
                border: 'none'
              }}
              onClick={() => addProducts()}
            >
          + Add Product
        </button>
        </div>
        {suggestions.length > 0 && (
          <ul className="list-group mt-1" style={{ borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
            {suggestions.map((item, index) => (
              <li
                key={index}
                className="list-group-item list-group-item-action"
                onClick={() => handleSuggestionClick(item)}
                style={{ cursor: "pointer" }}
              >
                {item.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Billing Table */}
      <div className="card p-4 mt-4" ref={billRef} style={{
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e2e8f0'
      }}>
          <div className="d-flex mb-3 align-items-center">
            <h5 className="d-flex align-items-center">
              <div 
                style={{ 
                  width: "70px", 
                  height: "70px", 
                  borderRadius: "50%", 
                  overflow: "hidden",
                  marginRight: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#fff",
                  border: '2px solid #e2e8f0'
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
              <span style={{ color: "#1a202c", fontWeight: 700, fontSize: "1.5rem" }}>
                Shams Sports
              </span>
            </h5>
            <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
              <div style={{ fontWeight: 600, color: '#4a5568', marginBottom: '4px' }}>
                Invoice ID: {id}
              </div>
              <div style={{ fontWeight: 600, color: '#4a5568' }}>
                Date: {dateAndTime}
              </div>
            </div>
        </div>
        <table className="table" style={{ borderRadius: '8px', overflow: 'hidden' }}>
          <thead style={{ background: '#f7fafc', borderBottom: '2px solid #e2e8f0' }}>
            <tr>
                <th style={{ width: '65%', fontWeight: 600, color: '#2d3748' }}>Product</th>
              <th style={{ width: '11.67%', fontWeight: 600, color: '#2d3748' }}>Quantity</th>
              <th style={{ width: '11.67%', fontWeight: 600, color: '#2d3748' }}>Price (&#x62f;&#x2e;&#x625;)</th>
              <th style={{ width: '11.67%', fontWeight: 600, color: '#2d3748' }}>Total</th>
                <th style={{ width: '11.67%', fontWeight: 600, color: '#2d3748' }}>Remove</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td>
                  <input
                    value={p.name}
                    className="form-control"
                      onChange={(e) =>
                        handleChange(p._id, "name", e.target.value)
                      }
                      disabled
                      style={{ border: 'none', background: 'transparent', fontWeight: 500 }}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={p.quantity}
                    className="form-control"
                    onChange={(e) =>
                      handleChange(p._id, "quantity", e.target.value)
                    }
                    style={{ borderRadius: '6px', border: 'none', background: 'transparent', fontWeight: 500 }}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={p.price}
                    className="form-control"
                    onChange={(e) =>
                      handleChange(p._id, "price", e.target.value)
                    }
                      disabled
                      style={{ border: 'none', background: 'transparent', fontWeight: 500 }}
                  />
                </td>
                <td style={{ fontWeight: 600, color: '#2d3748' }}>&#x62f;&#x2e;&#x625; {p.price * p.quantity}</td>
                <td>
                  <button
                    onClick={() => removeProduct(p._id)}
                      className="btn btn-danger"
                      style={{ borderRadius: '6px', padding: '4px 8px' }}
                  >
                  <i className="fa-solid fa-xmark"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="totals-section">
          <div className="totals-row">
            <span className="totals-label">Subtotal:</span>
            <span className="totals-value">&#x62f;&#x2e;&#x625; {subtotal.toFixed(2)}</span>
          </div>
          <div className="totals-row">
            <span className="totals-label">Discount:</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="number"
                onChange={handleDiscount}
                className="discount-input"
                value={discount}
              />
              <span style={{ fontWeight: 600, color: '#4a5568' }}>%</span>
            </div>
          </div>
          <div className="totals-row total-row">
            <span className="totals-label">Total:</span>
            <span className="total-value">&#x62f;&#x2e;&#x625; {total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-4 d-flex justify-content-end gap-3">
        <button className="btn btn-outline-primary" onClick={printInvoice} style={{ borderRadius: '8px', fontWeight: 500, padding: '10px 24px' }}>
          🖨️ Print
        </button>
          <button className="btn btn-outline-success" onClick={downloadPDF} style={{ borderRadius: '8px', fontWeight: 500, padding: '10px 24px' }}>
          ⬇️ Download PDF
        </button>
      </div>
    </div>
      <div style={{ marginTop: "111px" }}>
        <Footer />
      </div>
    </>
  );
}
