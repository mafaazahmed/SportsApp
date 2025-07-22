import "./Bill.css";
import { useState, useRef , useEffect} from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import randomId from 'random-id';
import axios from 'axios';
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";


export default function ViewBills() {
  
  
  const [products, setProducts] = useState([]);
 
  

  //Both query and suggestions is used for search option
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  //all productlist
   const[bills, setBillsList] = useState([]);
   

   useEffect(() => {
    const fetchBills = async () => {
      const response = await axios.get("http://localhost:3000/bill/show");
      setBillsList(response.data);
    };
    fetchBills();
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length === 0) {
      setSuggestions([]);
    } else {
      const filtered = bills.filter((item) => 
        item.bill_id.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
    }
  };

  const handleSuggestionClick = (value) => {
    let val = JSON.stringify(value);
    localStorage.setItem('billDetails', val);
    setQuery(value.bill_id);
    setSuggestions([]);
    const productList = data.products;
    setProducts(productList);
    setQuery("");
  };

    let billDetails = localStorage.getItem('billDetails');
    let data = JSON.parse(billDetails);
    let discount = data.discount;
    let id = data.bill_id;
    let date = data.Date;


  const billRef = useRef(); 

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
    window.print();
  };

  //   let addProducts = () => {
  //   const productList = data.products;
  //   setProducts(productList);
  //   setQuery("");
  // };

  const subtotal = products.reduce((sum, p) => sum + p.price * p.quantity, 0);
  let calDis = discount / 100;
  const total = subtotal - (subtotal * calDis);

    window.addEventListener('afterprint', () => {
      setProducts([]);
    })
 

  return (
    <>
    <Navbar/>
    <div className="container mt-4">

      {/* search bar  */}
      <div className="container mt-4" style={{ maxWidth: "600px" }}>
        <div className="d-flex">
          <input
          type="text"
          className="form-control"
          placeholder="Enter Bill Id..."
          value={query}
          onChange={handleSearchChange}
        />
         {/* <button className="btn btn-secondary mx-3" style={{width: "220px"}} onClick={() => addProducts()}>
          Search Bill
        </button> */}
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
                {item.bill_id}
              </li>
            ))}
          </ul>
        )}
      </div>


      {/* Billing Table */}
      <div className="card p-3 mt-3" ref={billRef}>
        <div className="d-flex mb-1">
           <h5><i className="fa-solid fa-basketball"></i> Sportshop_name</h5>
           <b className='mx-3'  style={{position : 'absolute', right : 0}}>Invoice ID : {id}</b>
           <b className='mx-3' style={{position : 'relative', right : 0}}>Date : {date}</b>
        </div>
        <table className="table table-bordered">
          <thead className="table-light">
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Price (&#x62f;&#x2e;&#x625;)</th>
              <th>Total</th>
              {/* <th>Remove</th> */}
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id}>
                <td>
                  <input
                    value={p.name}
                    className="form-control"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={p.quantity}
                    className="form-control"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={p.price}
                    className="form-control"
                  />
                </td>
                <td>&#x62f;&#x2e;&#x625;{p.price * p.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="text-end mt-3">
          <p>Subtotal : &#x62f;&#x2e;&#x625;{subtotal.toFixed(2)}</p>
          <p>Discount : <input type="number" style={{width : '40px'}} value={discount}/> %</p>
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
