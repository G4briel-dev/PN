// src/pages/Register/Register.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../../assets/logoK.png";

import "./Register.css";

export default function Register() {
  const [form, setForm] = useState({ nome: "", email: "", senha: "" });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();

  if (!form.nome || !form.email || !form.senha)
    return alert("Preencha todos os campos");

  async function registerUser() {
    try {
      const response = await fetch("http://localhost:4000/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: form.email,
          password: form.senha
        })
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Erro ao registrar");
        return;
      }

      localStorage.setItem("token", data.token);

      alert("Conta criada com sucesso!");
    } catch (err) {
      alert("Erro ao conectar com o servidor");
    }
  }

  registerUser();
  }

  return (
    <div className="register-container">
      <div className="register-image">
        <p></p>
      </div>

      <div className="register-content">
        <img src={Logo} alt="logo" className="register-logo" />
        <h2 className="register-title">Criar Conta</h2>

        <form onSubmit={handleSubmit} className="register-form">
          <input
            name="nome"
            placeholder="Nome completo"
            value={form.nome}
            onChange={handleChange}
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />

          <input
            name="senha"
            type="password"
            placeholder="Senha"
            value={form.senha}
            onChange={handleChange}
          />

          <button type="submit" className="register-button">
            Registrar
          </button>
        </form>

        <p className="register-login-link">
          Já tem conta?{" "}
          <Link to="/" className="register-login-link-a">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}
