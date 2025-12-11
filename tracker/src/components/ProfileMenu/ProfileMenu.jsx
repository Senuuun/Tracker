import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ProfileMenu.css";

const ProfileMenu = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profilePic, setProfilePic] = useState(localStorage.getItem("profilePic"));
  const navigate = useNavigate();

  let user = null;
  try {
    const storedUser = localStorage.getItem("user");
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch (err) {
    console.error("Erro ao ler usuário do localStorage:", err);
  }

  // Atualiza quando a foto muda
  useEffect(() => {
    const updatePic = () => {
      setProfilePic(localStorage.getItem("profilePic"));
    };

    window.addEventListener("storage", updatePic);
    return () => window.removeEventListener("storage", updatePic);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="profilemenu-container">
      <img
        src={
          profilePic ||
          "https://cdn-icons-png.flaticon.com/512/149/149071.png"
        }
        alt="Avatar"
        className="profilemenu-avatar"
        onClick={() => setMenuOpen(!menuOpen)}
      />

      {menuOpen && (
        <div className="profilemenu-dropdown">
          <button className="profilemenu-close" onClick={() => setMenuOpen(false)}>
            ✕
          </button>

          {user ? (
            <>
              <div className="profilemenu-userinfo">
                <img
                  src={
                    profilePic ||
                    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  }
                  alt="Avatar"
                  className="profilemenu-useravatar"
                />
                <div>
                  <p className="profilemenu-username">{user?.nome || "Usuário"}</p>
                  <p className="profilemenu-email">
                    {user?.email || "email@exemplo.com"}
                  </p>
                </div>
              </div>

              <hr />

              <button onClick={() => navigate("/profile")}>Configurações</button>
              <button onClick={handleLogout} className="logout-btn">
                Sair da Conta
              </button>
            </>
          ) : (
            <div className="profilemenu-empty">
              <p>Ainda sem informações.</p>
              <p>Cadastre-se para poder ver seu perfil!</p>
              <button
                onClick={() => navigate("/register")}
                className="register-btn"
              >
                Criar Conta
              </button>
              <button onClick={() => navigate("/login")} className="login-btn">
                Fazer Login
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
