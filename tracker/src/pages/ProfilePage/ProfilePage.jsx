import React, { useEffect, useState } from "react";
import "./ProfilePage.css";

const ProfilePage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  if (!user) {
    return (
      <div className="profile-container">
        <h1>Carregando perfil...</h1>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <h1>Seu Perfil</h1>
      <div className="profile-card">
        <img
          src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
          alt="Foto de perfil"
          className="profile-avatar"
        />
        <div className="profile-info">
          <p><strong>Nome:</strong> {user.nome} {user.sobrenome}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Data de nascimento:</strong> {user.dataNascimento}</p>
          <p><strong>Membro desde:</strong> {/* opcional, se vier do backend */}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
