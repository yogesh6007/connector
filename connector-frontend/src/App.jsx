import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import RoleSelection from "./pages/RoleSelection";
import Dashboard from "./pages/Dashboard";


import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Role Selection / Login */}
          <Route path="/login" element={<RoleSelection />} />

          {/* Student Dashboard */}
          <Route path="/student" element={<Dashboard />} />

          {/* Discover Page */}
         
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;