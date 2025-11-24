import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API_URL from "../../config";
import "./Register.css";

function Register() {
  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nome || !sobrenome || !dataNascimento || !email || !senha || !confirmarSenha) {
      alert("Por favor, preencha todos os campos");
      return;
    }

    if (senha !== confirmarSenha) {
      alert("As senhas não coincidem");
      return;
    }

    try {
      // 🔧 corrigido — removido “/api” duplicado
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome,
          sobrenome,
          dataNascimento,
          email,
          senha,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Cadastro realizado com sucesso!");
        navigate("/login");
      } else {
        alert(data.error || "Erro ao cadastrar usuário.");
      }
    } catch (err) {
      console.error("Erro ao cadastrar:", err);
      alert("Erro ao conectar ao servidor.");
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <h1>Crie sua conta</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
          <input
            type="text"
            placeholder="Sobrenome"
            value={sobrenome}
            onChange={(e) => setSobrenome(e.target.value)}
          />
          <label className="label-data">Data de Nascimento:</label>
          <input
            type="date"
            value={dataNascimento}
            onChange={(e) => setDataNascimento(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirmar Senha"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
          />
          <button type="submit">Cadastrar</button>
        </form>

        <p className="login-text">
          Já tem uma conta? <Link to="/login">Entrar</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
