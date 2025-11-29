// src/pages/Login/App.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cruz from "../../assets/Cruz3.jpg";
import Logo from "../../assets/LogoK.png";
import "./App.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (!email) return alert("Digite seu email");
    if (!senha) return alert("Digite sua senha");

    try {
      const response = await fetch("http://localhost:4000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email,
          password: senha
        })
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Erro ao fazer login");
        return;
      }

      // Salva o token JWT
      localStorage.setItem("token", data.token);

      alert("Login realizado com sucesso!");

      // Redireciona para página protegida
      navigate("/dashboard");

    } catch (error) {
      alert("Erro ao conectar com o servidor");
      console.error("Erro:", error);
    }
  }

  return (
    <div className="main">
      <div className="box-image">
        <img src={Cruz} alt="cruz" />
      </div>

      <div className="box-login">
        <div className="box-logo">
          <img src={Logo} alt="IBR Shekinah" />
        </div>

        <form className="inputs-login" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            className="input-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="password-row">
            <input
              type={mostrarSenha ? "text" : "password"}
              placeholder="Senha"
              className="input-password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />

            <button
              type="button"
              className="button-eye"
              onClick={() => setMostrarSenha((s) => !s)}
              aria-label={mostrarSenha ? "Esconder senha" : "Mostrar senha"}
            >
              {mostrarSenha ? (
                <i className="fas fa-eye-slash" />
              ) : (
                <i className="fas fa-eye" />
              )}
            </button>
          </div>

          <button className="login" type="submit">
            Entrar
          </button>
        </form>

        <div className="register-link">
          <span>Não tem conta?</span>{" "}
          <Link to="/registro" className="link-register">
            Registre-se
          </Link>
        </div>
      </div>
    </div>
  );
}
