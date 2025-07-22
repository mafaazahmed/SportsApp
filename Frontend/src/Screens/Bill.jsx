import "./Bill.css";
import { useState, useRef , useEffect} from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import randomId from 'random-id';
import axios from 'axios';
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";


export default function Bill() {
  
  
  const [id, setId] = useState('');
  const [products, setProducts] = useState([]);
  const [discount, setDiscount] = useState(0);

  const date = new Date(); 
  const f = new Intl.DateTimeFormat("en-us",{ 
    dateStyle : "short", 
    timeStyle : "short" 
  }); 
  const dateAndTime = f.format(date);

  const generateID = () => {
    const len = 6;
    const pattern = 'aA0';
    setId(randomId(len, pattern));
  }

  useEffect(() => {
   generateID();
  }, [])


  window.addEventListener('afterprint', () => {
      generateID();
      setProducts([]);
      setDiscount(0);
    })
  
  // const [customer, setCustomer] = useState({ name: '', email: '' });
 
  //Both query and suggestions is used for search option
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  //all productlist
  const[productList, setProductList] = useState([]);

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
    if(e.target.value >= 0){
      setDiscount(e.target.value);
    } 
  };
  let calDis = discount / 100;
  //setTotal(subtotal - (subtotal * calDis));
  const total = subtotal - (subtotal * calDis);

  const downloadPDF = () => {
    const input = billRef.current;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${id}.pdf`);
    });
  };

  const printInvoice = async () => {
    const bill = {
      id: id,
      products : products,
      discount : discount,
      total : total,
      Date : dateAndTime
    };
    let bill_data = await axios.post('http://localhost:3000/bill/createBill', bill)
    console.log(bill_data);
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
    localStorage.setItem('product', val);
    setQuery(value.name);
    setSuggestions([]);
  };

    let addProducts = () => {
    let product = localStorage.getItem('product');
    let data = JSON.parse(product);
    const newProduct = { _id: data._id, name: data.name, price: data.price, quantity: 1 };
    setProducts([...products, newProduct]);
    setQuery("");
  };

  return (
    <>
    <Navbar/>
    <div className="container mt-4">
      {/* <h2 className="text-center text-primary">Billing System</h2> */}

      {/* search bar  */}
      <div className="container mt-4" style={{ maxWidth: "600px" }}>
        <div className="d-flex">
          <input
          type="text"
          className="form-control"
          placeholder="Search products..."
          value={query}
          onChange={handleSearchChange}
        />
         <button className="btn btn-secondary mx-3" style={{width: "220px"}} onClick={() => addProducts()}>
          + Add Product
        </button>
        </div>
        {suggestions.length > 0 && (
          <ul className="list-group mt-1">
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

      {/* Customer Details
      <div className="card p-3 mt-3">
        <h5>Customer Details</h5>
        <div className="row">
          <div className="col-md-6">
            <input name="name" value={customer.name} onChange={handleCustomerChange} className="form-control mb-2" placeholder="Customer Name" />
          </div>
          <div className="col-md-6">
            <input name="email" value={customer.email} onChange={handleCustomerChange} className="form-control mb-2" placeholder="Customer Email" />
          </div>
        </div>
      </div> */}

      {/* Billing Table */}
      <div className="card p-3 mt-3" ref={billRef}>
        <div className="d-flex mb-1">
           <h5><i className="fa-solid fa-basketball"></i> Sportshop name</h5>
           <b className='mx-3'  style={{position : 'absolute', right : 0}}>Invoice ID : {id}</b>
           <b className='mx-3' style={{position : 'relative', right : 0}}>Date : {dateAndTime}</b>
        </div>
        <table className="table table-bordered">
          <thead className="table-light">
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Price (&#x62f;&#x2e;&#x625;)</th>
              <th>Total</th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id}>
                <td>
                  <input
                    value={p.name}
                    className="form-control"
                    onChange={(e) => handleChange(p._id, "name", e.target.value)}
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
                  />
                </td>
                <td>&#x62f;&#x2e;&#x625;{p.price * p.quantity}</td>
                <td>
                  <button
                    onClick={() => removeProduct(p._id)}
                    className="bg-danger text-white mx-3 mt-1 border border-white rounded"
                  >
                  <i className="fa-solid fa-xmark"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* <button className="btn btn-secondary" onClick={addProduct}>
          + Add Product
        </button> */}

        {/* Totals */}
        <div className="text-end mt-3">
          <p>Subtotal : &#x62f;&#x2e;&#x625;{subtotal.toFixed(2)}</p>
          <p>Discount : <input type="number" onChange={handleDiscount} style={{width : '40px'}} value={discount}/> %</p>
          <p className="h5 text-success">
            Total : &#x62f;&#x2e;&#x625;{total.toFixed(2)}  
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-4 d-flex justify-content-end gap-2">
        <button className="btn btn-outline-primary" onClick={printInvoice}>
          🖨️ Print
        </button>
        <button className="btn btn-outline-success" onClick={downloadPDF}>
          ⬇️ Download PDF
        </button>
      </div>
    </div>
    <div style={{marginTop : '111px'}}><Footer/></div>
    </>
  );
}
