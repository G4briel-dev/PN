
import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Enter/Login.jsx";
import Register from "./pages/Register/Register.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/registro" element={<Register />} />
      <Route path="*" element={<div style={{padding:40}}>Página não encontrada</div>} />
    </Routes>
  );
}
