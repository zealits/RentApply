import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./components/Landing";
import MyPaymentForm from "./components/MyPaymentForm.js";
import MultiStepForm from "./pages/MultiStepForm";
import Navbar from "./components/Navbar.js";
import Footer from "./components/Footer.js";
import Preloader from "./components/Preloader.js";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // Show preloader for 5 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      {loading ? (
        <Preloader />
      ) : (
        <>
          {/* <Navbar /> */}
          <Routes>
            <Route exact path="/" element={<Landing />} />
            <Route exact path="/payment" element={<MyPaymentForm />} />
            <Route path="/multiform" element={<MultiStepForm />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          <Footer />
        </>
      )}
    </Router>
  );
}

export default App;
