import { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import axios from 'axios';

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/product/show')
      .then(res => setProducts(res.data))
      .catch(() => setProducts([]));
  }, []);

  return (
    <>
      <Navbar />
      <section className="flex flex-col md:flex-row items-center justify-between px-8 py-12 bg-gradient-to-r from-blue-50 to-blue-100 rounded-3xl shadow-lg mb-10">
        <div className="max-w-lg w-full mb-10 md:mb-0">
          <div className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-3">
            Elevate Your <span className="text-blue-600">Performance</span>
          </div>
          <div className="text-gray-500 text-lg mb-8">
            Discover premium sports equipment and apparel designed for champions. From professional athletes to weekend warriors.
          </div>
          <div className="flex gap-4 mb-8">
            <button className="bg-gradient-to-r from-blue-600 to-orange-400 text-white font-semibold px-7 py-3 rounded-xl shadow hover:from-blue-700 hover:to-orange-500 transition">Shop Collection</button>
            <button className="border-2 border-blue-600 text-blue-600 font-semibold px-7 py-3 rounded-xl bg-white hover:bg-blue-600 hover:text-white transition">View Catalog</button>
          </div>
          <div className="flex gap-10 mt-4">
            <div>
              <div className="text-2xl font-bold text-gray-900">50k+</div>
              <div className="text-gray-500 text-base">Happy Athletes</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">1000+</div>
              <div className="text-gray-500 text-base">Premium Products</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">98%</div>
              <div className="text-gray-500 text-base">Satisfaction Rate</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-xl flex items-center justify-center p-8">
          <img src={require('../../Backend/public/images/1751712278155_shoes.webp')} alt="Shoe" className="max-w-xs max-h-64 rounded-xl shadow-md" />
        </div>
      </section>
      <section className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-12">
          {products.slice(0, 6).map((product, idx) => (
            <div key={product._id || idx} className="bg-white rounded-2xl shadow-md p-5 flex flex-col items-center hover:shadow-lg transition">
              <img src={product.image || require('../../Backend/public/images/1751712278155_shoes.webp')} alt={product.name} className="w-32 h-32 object-contain mb-4 rounded-lg bg-gray-50" />
              <div className="text-lg font-semibold text-gray-900 mb-1">{product.name}</div>
              <div className="text-blue-600 font-bold text-xl mb-2">₹{product.price}</div>
              <button className="bg-gradient-to-r from-blue-600 to-orange-400 text-white font-semibold px-5 py-2 rounded-lg shadow hover:from-blue-700 hover:to-orange-500 transition">Add to Cart</button>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </>
  );
} 