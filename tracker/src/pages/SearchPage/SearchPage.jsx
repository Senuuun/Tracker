import React, { useState } from "react";
import { Plus } from "lucide-react"; // ícone de "+"
import "./SearchPage.css";

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const allItems = [
    {
      id: 1,
      titulo: "Frieren: Beyond Journey’s End",
      descricao:
        "Uma elfa maga reflete sobre a passagem do tempo após o fim de sua jornada.",
      imagem: "https://cdn.myanimelist.net/images/anime/1015/138006.jpg",
      tipo: "anime",
    },
    {
      id: 2,
      titulo: "Attack on Titan",
      descricao:
        "A humanidade luta contra titãs em um mundo cercado por muralhas.",
      imagem: "https://cdn.myanimelist.net/images/anime/10/47347.jpg",
      tipo: "anime",
    },
    {
      id: 3,
      titulo: "Breaking Bad",
      descricao:
        "Um professor de química vira produtor de metanfetamina.",
      imagem:
        "https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
      tipo: "serie",
    },
    {
      id: 4,
      titulo: "Friends",
      descricao:
        "Seis amigos vivendo altos e baixos da vida em Nova York.",
      imagem:
        "https://image.tmdb.org/t/p/w500/f496cm9enuEsZkSPzCwnTESEK5s.jpg",
      tipo: "serie",
    },
  ];

  const filteredItems = allItems.filter((item) =>
    item.titulo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="search-container">
      {/* Barra de busca */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Resultados */}
      <div className="results-section">
        {searchTerm.length === 0 ? (
          <p className="hint">
            Digite algo para buscar suas séries e animes...
          </p>
        ) : filteredItems.length === 0 ? (
          <p className="no-results">Nenhum resultado encontrado.</p>
        ) : (
          <div className="results-grid">
            {filteredItems.map((item) => (
              <div key={item.id} className="result-card">
                <img src={item.imagem} alt={item.titulo} />
                <div className="result-info">
                  <h4>{item.titulo}</h4>
                  <p>{item.descricao}</p>
                  <span className="tag">
                    {item.tipo === "anime" ? "Anime" : "Série"}
                  </span>
                </div>
                <button className="add-btn">
                  <Plus size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
