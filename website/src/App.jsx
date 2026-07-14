import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './components/CartContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Philosophy from './components/Philosophy';
import Catalog from './components/Catalog';
import HowItWorks from './components/HowItWorks';
import SourcingFAQ from './components/SourcingFAQ';
import Contact from './components/Contact';
import Footer from './components/Footer';
import MaterialPage from './components/MaterialPage';
import CheckoutPage from './components/CheckoutPage';
import CollectionPage from './components/CollectionPage';
import AdminPanel from './components/AdminPanel';


const HomeShowroom = () => (
  <>
    <Hero />
    <Philosophy />
    <Catalog />
    <HowItWorks />
    <SourcingFAQ />
    <Contact />
  </>
);

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          {/* ── Public storefront routes — Navbar + Footer wrapper ── */}
          <Route path="/*" element={
            <div className="bg-[#1A1A1A] text-[#FAF7F2] min-h-screen font-sans antialiased">
              <Navbar />
              <Routes>
                <Route path="/" element={<HomeShowroom />} />
                <Route path="/material/:materialType" element={<MaterialPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/collection" element={<CollectionPage />} />

              </Routes>
              <Footer />
            </div>
          } />
          {/* ── Back-office admin shell — full-screen, no Navbar/Footer ── */}
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
