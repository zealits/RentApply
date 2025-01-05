// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./components/Landing";
import MyPaymentForm from "./components/MyPaymentForm.js";
import MultiStepForm from "./pages/MultiStepForm";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route exact path="/" element={<Landing />} />
          <Route exact path="/payment" element={<MyPaymentForm />} />
          <Route path="/multiform" element={<MultiStepForm />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
