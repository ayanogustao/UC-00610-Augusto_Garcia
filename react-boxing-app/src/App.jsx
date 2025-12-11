import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";


import HomePage from "./pages/HomePage.jsx";
import ListPage from "./pages/ListPage.jsx";
import DetailPage from "./pages/DetailPage.jsx";

function App() {
  return (
    <>
      <Navbar />

      <div className="container my-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/lutadores" element={<ListPage />} />
          <Route path="/lutadores/:id" element={<DetailPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>

      <Footer />
    </>
  );
}

export default App;
