//import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Login from './components/Login';
import Product from './components/Product';
import ViewRoles from './Screens/ViewRoles';
import Bill from './Screens/Bill';
import Addproduct from './components/Addproduct';
import Editproduct from './components/Editproduct';
import Signup from './components/Signpup';
import Edituser from './components/Edituser';
import ViewBills from './Screens/ViewBills';


function App() {
  

  return (
   <Router>
    <Routes>
      <Route exact path='/' element={<Login/>}></Route>
      <Route exact path='/product' element={<Product/>}></Route>
      <Route exact path='/viewRoles' element={<ViewRoles/>}></Route>
      <Route exact path='/generate_bill' element={<Bill/>}></Route>
      <Route exact path='/addproduct' element={<Addproduct/>}></Route>
      <Route exact path='/editproduct' element={<Editproduct/>}></Route>
      <Route exact path='/signup' element={<Signup/>}></Route>
      <Route exact path='/edituser' element={<Edituser/>}></Route>
      <Route exact path='/viewbills' element={<ViewBills/>}></Route>
    </Routes>
   </Router>
  )
}

export default App
