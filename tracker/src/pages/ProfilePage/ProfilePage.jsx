import React, { useEffect, useState, useRef } from "react";
import "./ProfilePage.css";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [profilePic, setProfilePic] = useState(localStorage.getItem("profilePic"));
  const [watching, setWatching] = useState(JSON.parse(localStorage.getItem("watchingNow")) || null);

  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const fileInputRef = useRef(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleProfilePicChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setProfilePic(reader.result);
      localStorage.setItem("profilePic", reader.result);

      // atualiza Topbar e ProfileMenu
      window.dispatchEvent(new Event("storage"));
    };
    reader.readAsDataURL(file);
  };

  const searchMedia = async (query) => {
    setSearchQuery(query);
    if (query.length < 3) return setSearchResults([]);

    try {
      const [animeRes, tvRes] = await Promise.all([
        fetch(`https://api.jikan.moe/v4/anime?q=${query}&limit=10`).then(r => r.json()),
        fetch(`https://api.tvmaze.com/search/shows?q=${query}`).then(r => r.json())
      ]);

      const animeResults = animeRes.data.map(a => ({
        title: a.title,
        image: a.images.jpg.image_url,
        type: "Anime"
      }));

      const tvResults = tvRes.map(s => ({
        title: s.show.name,
        image: s.show.image ? s.show.image.medium : null,
        type: "Série"
      }));

      setSearchResults([...animeResults, ...tvResults]);
    } catch (error) {
      console.error("Erro na busca:", error);
    }
  };

  const selectWatching = (item) => {
    setWatching(item);
    localStorage.setItem("watchingNow", JSON.stringify(item));
    setSearchModalOpen(false);
  };

  if (!user) return <h1>Carregando...</h1>;

  return (
    <div className="profile-wrapper">
      <div className="profile-header">
        <div className="profile-avatar-container" onClick={() => fileInputRef.current.click()}>
          <img
            src={profilePic || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
            className="profile-avatar"
            alt="Foto de perfil"
          />

          <div className="avatar-hover">Trocar foto</div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleProfilePicChange}
            style={{ display: "none" }}
          />
        </div>

        <div className="profile-user-info">
          <h1>{user.nome} {user.sobrenome}</h1>
          <p>Ingressou em {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      <hr className="divider" />

      <h2>Assistindo agora</h2>

      <div className="watching-now clickable" onClick={() => setSearchModalOpen(true)}>
        {watching ? (
          <>
            <img src={watching.image} className="watching-img" alt={watching.title} />
            <p>{watching.title}</p>
          </>
        ) : (
          <p>Clique para escolher</p>
        )}
      </div>

      {searchModalOpen && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Buscar série ou anime</h3>

            <input
              className="search-input"
              value={searchQuery}
              onChange={(e) => searchMedia(e.target.value)}
              placeholder="Digite o nome..."
            />

            <div className="search-results">
              {searchResults.map((item, i) => (
                <div key={i} className="search-item" onClick={() => selectWatching(item)}>
                  <img src={item.image} className="result-img" alt={item.title} />
                  <div>
                    <p className="result-title">{item.title}</p>
                    <span>{item.type}</span>
                  </div>
                </div>
              ))}
            </div>

            <button className="close-button" onClick={() => setSearchModalOpen(false)}>
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
