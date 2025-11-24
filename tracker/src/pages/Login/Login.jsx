import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API_URL from "../../config";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !senha.trim()) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Login realizado com sucesso!");
        localStorage.setItem("token", data.token);

        // Se o backend retornou o user, usa ele
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        } else {
          // Caso contrário, extrai o id do token (fallback)
          const payload = JSON.parse(atob(data.token.split(".")[1]));
          localStorage.setItem("user", JSON.stringify({ id: payload.id }));
        }

        navigate("/home"); // redireciona após login
      } else {
        alert(data.error || data.message || "Erro ao realizar login.");
      }
    } catch (err) {
      console.error("Erro ao logar:", err);
      alert("Erro ao conectar ao servidor.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>Tracker</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
          <button type="submit">Entrar</button>
        </form>
        <p className="register-text">
          Ainda não tem conta? <Link to="/register">Cadastre-se</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
