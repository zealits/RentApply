import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import React, { useEffect, useState } from "react";
import UserNav from "./assets/UserNav.js"
import MultiStepForm from "./pages/MultiStepForm.js"



function App() {
 
  

  
  return (
    <div>
      <Router>
    
          
{/* 
        {isAuthenticated && (
          <>
            {user.role === "admin" && <AdminNav />}
            {user.role === "user" && <UserNav />}
          </>
        )} */}


        <div>
          <Routes>
            {/* {!isAuthenticated && <Route path="/" element={<Login />} />} */}
            <Route exact path="/" element={<MultiStepForm />} />
          
            {/* {isAuthenticated && totpVerified && user.is2FAEnabled ? (
              <Route path="/" element={<TotpPage />} />
            ) : (
              isAuthenticated &&
              !totpVerified && (
                <>
                  {user.role === "user" && (
                    <>
                      <Route exact path="/" element={<Home />} />
                  
                    </>
                  )}

                  {user.role === "admin" && (
                    <>
                      <Route exact path="/" element={<ProjectReferrals />} />
                   
                    </>
                  )}

                  {user.role === "superadmin" && (
                    <>
                      <Route exact path="/" element={<SuperAdminDashboard />} />
                    </>
                  )}
                </>
              )
            )} */}

           

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;