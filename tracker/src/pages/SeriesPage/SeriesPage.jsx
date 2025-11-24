import React, { useState, useRef, useEffect } from "react";
import "./SeriesPage.css";
import { FaPlus } from "react-icons/fa";

const SeriesPage = ({ searchTerm }) => {
  const [filters, setFilters] = useState({
    showSeries: true,
    showAnimes: true,
  });
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const menuRef = useRef(null);

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
  ];

  const handleFilterChange = (event) => {
    const { name, checked } = event.target;
    setFilters({ ...filters, [name]: checked });
  };

  const handleAddClick = (id) => {
    setActiveMenu(activeMenu === id ? null : id);
  };

  const handleAddToList = (id, listName) => {
    alert(`"${allItems.find((i) => i.id === id).titulo}" adicionado à lista "${listName}"`);
    setActiveMenu(null);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredItems = allItems.filter((item) => {
    if (!filters.showSeries && item.tipo === "serie") return false;
    if (!filters.showAnimes && item.tipo === "anime") return false;
    if (
      searchTerm &&
      !item.titulo.toLowerCase().includes(searchTerm.toLowerCase())
    )
      return false;
    return true;
  });

  return (
    <div className="series-container">
      {/* Botão Filtrar */}
      <div
        className="filter-button"
        onClick={() => setShowFilterPanel(!showFilterPanel)}
      >
        <span className="filter-icon">⚙️</span> FILTRAR
      </div>

      {/* Painel pequeno */}
      {showFilterPanel && (
        <div className="filter-box">
          <button
            className="close-btn"
            onClick={() => setShowFilterPanel(false)}
          >
            ✖
          </button>
          <h3>Tipo de Mídia</h3>
          <label>
            <input
              type="checkbox"
              name="showSeries"
              checked={filters.showSeries}
              onChange={handleFilterChange}
            />{" "}
            Séries
          </label>
          <label>
            <input
              type="checkbox"
              name="showAnimes"
              checked={filters.showAnimes}
              onChange={handleFilterChange}
            />{" "}
            Animes
          </label>
        </div>
      )}

      {/* Cards */}
      <div className="series-grid">
        {filteredItems.map((item) => (
          <div key={item.id} className="anime-card">
            <img src={item.imagem} alt={item.titulo} className="anime-img" />
            <div className="anime-info">
              <h2>{item.titulo}</h2>
              <p>{item.descricao}</p>
            </div>

              {/* Ícone de adicionar */}
              <div className="add-icon" onClick={() => handleAddClick(item.id)}>
                <FaPlus />
              </div>

              {/* Menu de listas */}
              {activeMenu === item.id && (
                <div className="list-menu" ref={menuRef}>
                  <button onClick={() => handleAddToList(item.id, "Assistindo")}>👀 Assistindo</button>
                  <button onClick={() => handleAddToList(item.id, "Planejo ver")}>🕓 Planejo ver</button>
                  <button onClick={() => handleAddToList(item.id, "Completo")}>✅ Completo</button>
                </div>
              )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeriesPage;
