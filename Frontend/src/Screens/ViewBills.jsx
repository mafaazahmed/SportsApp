import "./Bill.css";
import { useState, useRef, useEffect } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import axios from "axios";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export default function ViewBills() {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [bills, setBillsList] = useState([]);
  const [selectedBill, setSelectedBill] = useState(null);
  const [displayedBills, setDisplayedBills] = useState([]);
  const [searchType, setSearchType] = useState(""); // "id", "date", "month", or ""
  const [selectedMonth, setSelectedMonth] = useState("");
  const billRef = useRef();

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

    if (value.trim().length === 0) {
      setSuggestions([]);
      setDisplayedBills([]);
      setSelectedBill(null);
      setProducts([]);
      setSearchType("");
      return;
    }

    // Check if search is by ID or date
    const isDateSearch = isQueryDate(value);
    
    if (isDateSearch) {
      // Search by date - show multiple bills
      // Convert MM/DD/YYYY to MM/DD/YY format for matching
      const dateParts = value.split('/');
      const month = dateParts[0];
      const day = dateParts[1];
      const year = dateParts[2].length === 4 ? dateParts[2].slice(-2) : dateParts[2]; // Handle both YYYY and YY
      const searchPattern = `${month}/${day}/${year}`;
      
      console.log('Date search:', { value, searchPattern, billsCount: bills.length });
      console.log('Sample bill dates:', bills.slice(0, 3).map(bill => bill.Date));
      
      const filtered = bills.filter((item) => {
        // Simple string matching - check if the search pattern exists in the date
        const matches = item.Date.includes(searchPattern);
        console.log(`Checking ${item.Date} against ${searchPattern}: ${matches}`);
        return matches;
      });
      
      console.log('Filtered bills:', filtered.length);
      setDisplayedBills(filtered);
      setSuggestions([]);
      setSelectedBill(null);
      setProducts([]);
      setSearchType("date");
    } else {
      // Search by ID - show single bill
      const filtered = bills.filter(
        (item) => item.bill_id.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
      setDisplayedBills([]);
      
      // If exact ID match found, auto-select the bill
      if (filtered.length === 1 && filtered[0].bill_id.toLowerCase() === value.toLowerCase()) {
        handleSuggestionClick(filtered[0]);
        setSearchType("id");
      } else {
        setSelectedBill(null);
        setProducts([]);
        setSearchType("id");
      }
    }
  };

  const handleSuggestionClick = (bill) => {
    const val = JSON.stringify(bill);
    localStorage.setItem("billDetails", val);
    setSelectedBill(bill);
    setProducts(bill.products);
    setQuery(bill.bill_id);
    setSuggestions([]);
    setDisplayedBills([]);
  };

  const showAllBills = () => {
    // If user has searched for a date, show bills for that date
    if (query && isQueryDate(query)) {
      // Convert MM/DD/YYYY to MM/DD/YY format for matching
      const dateParts = query.split('/');
      const month = dateParts[0];
      const day = dateParts[1];
      const year = dateParts[2].length === 4 ? dateParts[2].slice(-2) : dateParts[2]; // Handle both YYYY and YY
      const searchPattern = `${month}/${day}/${year}`;
      
      // Filter bills for the searched date
      const searchedBills = bills.filter(bill => {
        return bill.Date.includes(searchPattern);
      });
      setDisplayedBills(searchedBills);
      setSearchType("date");
    }
    // } else {
    //   // If no date is searched, show all bills
    //   setDisplayedBills(bills);
    //   setSearchType("all");
    // }
    
    setSuggestions([]);
    setSelectedBill(null);
    setProducts([]);
  };

  const downloadPDF = async () => {
    if (!billRef.current || !selectedBill) return;
    
    try {
      const canvas = await html2canvas(billRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });
      
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
      
      pdf.save(`bill_${selectedBill.bill_id}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  const printInvoice = () => {
    window.print();
  };

  // useEffect(() => {
  //   const clearAfterPrint = () => setProducts([]);
  //   window.addEventListener("afterprint", clearAfterPrint);
  //   return () => window.removeEventListener("afterprint", clearAfterPrint);
  // }, []);

  const subtotal = products.reduce((sum, p) => sum + p.price * p.quantity, 0);
  const discount = selectedBill?.discount || 0;
  const total = subtotal - (subtotal * discount) / 100;

  const isQueryDate = (q) => {
    // Check for MM/DD/YYYY format
    const mmddyyyy = /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(q);
    // Check for MM/DD/YY format
    const mmddyy = /^\d{1,2}\/\d{1,2}\/\d{2}$/.test(q);
    return mmddyyyy || mmddyy;
  };

  // Get available months from bills
  const getAvailableMonths = () => {
    const months = new Set();
    bills.forEach(bill => {
      const billDate = new Date(bill.Date);
      const yearMonth = `${billDate.getFullYear()}-${String(billDate.getMonth() + 1).padStart(2, '0')}`;
      months.add(yearMonth);
    });
    return Array.from(months).sort().reverse();
  };

  // Calculate current month turnover
  const getCurrentMonthTurnover = () => {
    const currentDate = new Date();
    const currentYearMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
    
    const currentMonthBills = bills.filter(bill => {
      const billDate = new Date(bill.Date);
      const billYearMonth = `${billDate.getFullYear()}-${String(billDate.getMonth() + 1).padStart(2, '0')}`;
      return billYearMonth === currentYearMonth;
    });
    
    return currentMonthBills.reduce((total, bill) => {
      const billTotal =
        bill.products.reduce((sum, p) => sum + p.price * p.quantity, 0) *
        (1 - bill.discount / 100);
      return total + billTotal;
    }, 0);
  };

  // Calculate turnover for selected month
  const getSelectedMonthTurnover = () => {
    if (!selectedMonth) return getCurrentMonthTurnover();
    return getMonthlyTurnover(selectedMonth);
  };

  // Calculate turnover for displayed bills
  const totalTurnover = displayedBills.reduce((total, bill) => {
    const billTotal =
      bill.products.reduce((sum, p) => sum + p.price * p.quantity, 0) *
      (1 - bill.discount / 100);
    return total + billTotal;
  }, 0);

  // Calculate monthly turnover for specific month
  const getMonthlyTurnover = (yearMonth) => {
    const monthlyBills = bills.filter(bill => {
      const billDate = new Date(bill.Date);
      const billYearMonth = `${billDate.getFullYear()}-${String(billDate.getMonth() + 1).padStart(2, '0')}`;
      return billYearMonth === yearMonth;
    });
    
    return monthlyBills.reduce((total, bill) => {
      const billTotal =
        bill.products.reduce((sum, p) => sum + p.price * p.quantity, 0) *
        (1 - bill.discount / 100);
      return total + billTotal;
    }, 0);
  };

  return (
    <>
      <Navbar />
    <div className="container mt-4">
      {/* Monthly Turnover Display */}
      <div className="container mt-4" style={{ maxWidth: "600px" }}>
        <div className="alert alert-success" style={{ 
          borderRadius: '12px', 
          border: '1px solid #9ae6b4', 
          background: 'linear-gradient(135deg, #f0fff4 0%, #e6fffa 100%)',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div>
              <strong style={{ color: '#22543d', fontSize: '1.1rem' }}>
                📊 Monthly Turnover
              </strong>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ 
                color: '#22543d', 
                fontSize: '1.5rem', 
                fontWeight: '700',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
              }}>
                (&#x62f;&#x2e;&#x625;){getSelectedMonthTurnover().toFixed(2)}
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <label style={{ color: '#2f855a', fontSize: '0.9rem', fontWeight: '500', margin: 0 }}>
              Select Month:
            </label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid #9ae6b4',
                background: 'white',
                color: '#22543d',
                fontSize: '0.9rem',
                fontWeight: '500',
                cursor: 'pointer',
                minWidth: '150px'
              }}
            >
              <option value="">Current Month</option>
              {getAvailableMonths().map((month) => {
                const [year, monthNum] = month.split('-');
                const monthName = new Date(year, monthNum - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
                return (
                  <option key={month} value={month}>
                    {monthName}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      </div>





      <div className="container mt-4" style={{ maxWidth: "600px" }}>
        <div className="d-flex gap-3 align-items-center">
          <input
          type="text"
          className="form-control"
              placeholder="Search by Bill ID or Date (MM/DD/YYYY or MM/DD/YY)"
          value={query}
          onChange={handleSearchChange}
          style={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
        />
        {/* <button
          onClick={showAllBills}
          className="btn"
          style={{
            borderRadius: '8px',
            fontWeight: 500,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            whiteSpace: 'nowrap'
          }}
        >
          📋 Show Bills
        </button> */}
          </div>

          {/* Show turnover for date/all search */}
          {displayedBills.length > 0 && (searchType === "date" || searchType === "all") && (
            <div className="alert alert-info mt-3" style={{ borderRadius: '8px', border: '1px solid #bee3f8', background: '#ebf8ff' }}>
              <strong>Total Bills Found:</strong> {displayedBills.length}
              <br />
              <strong>Daily Turnover:</strong> (&#x62f;&#x2e;&#x625;){totalTurnover.toFixed(2)}
        </div>
          )}

          {/* Multiple Bills Display for Date/All Search */}
          {displayedBills.length > 0 && (searchType === "date" || searchType === "all") && (
            <div className="mt-4">
              <h5 style={{ color: '#2d3748', marginBottom: '16px', fontWeight: '600' }}>
                📋 Bills Found ({displayedBills.length})
              </h5>
              <div style={{ 
                display: 'grid', 
                gap: '12px',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))'
              }}>
                {displayedBills.map((bill, index) => {
                  const billTotal =
                    bill.products.reduce((sum, p) => sum + p.price * p.quantity, 0) *
                    (1 - bill.discount / 100);
                  return (
                    <div
                      key={index}
                      className="card"
                      style={{
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
                      }}
                      onClick={() => handleSuggestionClick(bill)}
                    >
                      <div className="card-body p-3">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <span style={{ fontWeight: '600', color: '#2d3748', fontSize: '0.9rem' }}>
                            🧾 {bill.bill_id}
                          </span>
                          <span style={{ fontWeight: '700', color: '#38a169', fontSize: '1rem' }}>
                            (&#x62f;&#x2e;&#x625;){billTotal.toFixed(2)}
                          </span>
                        </div>
                        <div style={{ color: '#718096', fontSize: '0.85rem' }}>
                          📅 {bill.Date}
                        </div>
                        <div style={{ color: '#718096', fontSize: '0.85rem' }}>
                          📦 {bill.products.length} items
                        </div>
                        {bill.discount > 0 && (
                          <div style={{ color: '#e53e3e', fontSize: '0.85rem', fontWeight: '500' }}>
                            💰 {bill.discount}% discount applied
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Suggestions List for ID Search */}
        {suggestions.length > 0 && searchType === "id" && (
          <ul className="list-group mt-1" style={{ borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
              {suggestions.map((item, index) => {
                const itemTotal =
                  item.products.reduce((sum, p) => sum + p.price * p.quantity, 0) *
                  (1 - item.discount / 100);
                return (
              <li
                key={index}
                    className="list-group-item list-group-item-action d-flex justify-content-between"
                onClick={() => handleSuggestionClick(item)}
                style={{ cursor: "pointer", borderBottom: '1px solid #e2e8f0' }}
              >
                    <span style={{ fontWeight: 500 }}>
                      🧾 {item.bill_id} — 📅 {item.Date}
                    </span>
                    <span className="text-success" style={{ fontWeight: 600 }}>(&#x62f;&#x2e;&#x625;){itemTotal.toFixed(2)}</span>
              </li>
                );
              })}
          </ul>
        )}

        {/* Show message for ID search with multiple results */}
        {suggestions.length > 1 && searchType === "id" && (
          <div className="alert alert-warning mt-3" style={{ borderRadius: '8px', border: '1px solid #fbd38d', background: '#fef5e7' }}>
            <strong>Multiple bills found!</strong> Please select a specific bill from the list above or enter the exact Bill ID.
          </div>
        )}


      </div>

        {/* Selected Bill Display */}
        {selectedBill && (
          <>
      <div className="card p-4 mt-4" ref={billRef} style={{
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e2e8f0'
      }} >
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
                    Invoice ID: {selectedBill.bill_id}
                  </div>
                  <div style={{ fontWeight: 600, color: '#4a5568' }}>
                    Date: {selectedBill.Date}
                  </div>
                </div>
        </div>
        <table className="table" style={{ borderRadius: '8px', overflow: 'hidden' }} >
          <thead style={{ background: '#f7fafc', borderBottom: '2px solid #e2e8f0' }}>
            <tr>
                    <th style={{ width: '65%', fontWeight: 600, color: '#2d3748' }}>Product</th>
              <th style={{ width: '11.67%', fontWeight: 600, color: '#2d3748' }}>Quantity</th>
                    <th style={{ width: '11.67%', fontWeight: 600, color: '#2d3748' }}>Price (&#x62f;&#x2e;&#x625;)</th>
              <th style={{ width: '11.67%', fontWeight: 600, color: '#2d3748' }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td>
                  <input
                    value={p.name}
                    className="form-control"
                          readOnly
                          disabled
                          style={{ border: 'none', background: 'transparent', fontWeight: 500 }}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={p.quantity}
                    className="form-control"
                          readOnly
                          disabled
                          style={{ border: 'none', background: 'transparent', fontWeight: 500 }}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={p.price}
                    className="form-control"
                          readOnly
                          disabled
                          style={{ border: 'none', background: 'transparent', fontWeight: 500 }}
                  />
                </td>
                      <td style={{ fontWeight: 600, color: '#2d3748' }}>&#x62f;&#x2e;&#x625; {(p.price * p.quantity).toFixed(2)}</td>
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
                className="discount-input"
                value={discount}
                readOnly
                disabled
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

            {/* Action Buttons */}
      <div className="mt-4 d-flex justify-content-end gap-3">
        <button className="btn btn-outline-primary" onClick={printInvoice} style={{ borderRadius: '8px', fontWeight: 500, padding: '10px 24px' }}>
          🖨️ Print
        </button>
        <button className="btn btn-outline-success" onClick={downloadPDF} style={{ borderRadius: '8px', fontWeight: 500, padding: '10px 24px' }}>
          ⬇️ Download PDF
        </button>
      </div>
          </>
        )}
      </div>

      <div style={{ marginTop: "193px" }}>
        <Footer />
    </div>
    </>
  );
}

