import React, { useState, useEffect } from "react";
import "./SeriesPage.css";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const SeriesPage = ({ searchTerm }) => {
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    showSeries: true,
    showAnimes: true,
  });

  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);

  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLists, setUserLists] = useState([]);

  const [showGenresMenu, setShowGenresMenu] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState(null);

  /* ===========================
     BUSCAR LISTAS DO USUÁRIO
  ============================ */
  const fetchUserLists = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/lists", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Falha ao buscar listas");

      const data = await res.json();
      setUserLists(data);
    } catch (err) {
      console.error("Erro ao buscar listas:", err);
    }
  };

  /* ===========================
      BUSCAR SÉRIES
  ============================ */
  const fetchSeries = async () => {
    const res = await fetch("https://api.tvmaze.com/shows?page=1");
    const data = await res.json();

    return data
      .filter((s) => s.image)
      .map((s) => ({
        id: `tv-${s.id}`,
        titulo: s.name,
        descricao: s.summary?.replace(/<[^>]*>?/gm, "") || "Sem descrição.",
        imagem: s.image?.medium || s.image?.original,
        score: s.rating?.average || 0,
        tipo: "serie",
        generos: s.genres || [],
      }))
      .sort((a, b) => b.score - a.score);
  };

  /* ===========================
      BUSCAR ANIMES
  ============================ */
  const fetchAnimes = async () => {
    const res = await fetch(
      "https://api.jikan.moe/v4/anime?limit=25&order_by=score&sort=desc"
    );
    const data = await res.json();

    const unique = new Map();
    data.data.forEach((a) => {
      if (!unique.has(a.mal_id)) {
        unique.set(a.mal_id, {
          id: `anime-${a.mal_id}`,
          titulo: a.title,
          descricao: a.synopsis || "Sem descrição.",
          imagem: a.images?.jpg?.image_url,
          score: a.score || 0,
          tipo: "anime",
          generos: a.genres?.map((g) => g.name) || [],
        });
      }
    });

    return [...unique.values()];
  };

  /* ===========================
      CARREGAR TUDO
  ============================ */
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [series, animes] = await Promise.all([fetchSeries(), fetchAnimes()]);
        setAllItems([...series, ...animes].sort((a, b) => b.score - a.score));
        await fetchUserLists();
      } catch (err) {
        console.error("Erro no carregamento:", err);
      }
      setLoading(false);
    };

    load();
  }, []);

  /* ===========================
     FECHAR MENU AO CLICAR FORA (CORRIGIDO)
  ============================ */
  useEffect(() => {
    const handleClickOutside = (e) => {
      const clickedInsideCard = e.target.closest(".anime-card");

      // se o clique não foi dentro de um card → fechar menu
      if (!clickedInsideCard) {
        setActiveMenu(null);
      }
    };

    if (activeMenu !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeMenu]);

  /* ===========================
      ABRIR MENU DE LISTAS
  ============================ */
  const handleAddClick = async (id) => {
    await fetchUserLists();
    setActiveMenu(activeMenu === id ? null : id);
  };

  /* ===========================
      ADICIONAR À LISTA
  ============================ */
  const handleAddToList = async (item, list) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:5000/api/lists/${list.id}/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            mediaId: item.id,
            titulo: item.titulo,
            imagem: item.imagem,
            tipo: item.tipo,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Erro ao adicionar");
        return;
      }

      alert(`📌 Adicionado à lista: ${list.title}`);
      setActiveMenu(null);
    } catch (err) {
      console.error("Erro ao adicionar:", err);
    }
  };

  /* ===========================
      DETALHES
  ============================ */
  const openDetails = (item) => {
    const saved = JSON.parse(localStorage.getItem("media-details")) || {};
    saved[item.id] = item;
    localStorage.setItem("media-details", JSON.stringify(saved));
    navigate(`/details/${item.id}`);
  };

  /* ===========================
      FILTROS
  ============================ */
  const filteredItems = allItems.filter((item) => {
    if (!filters.showSeries && item.tipo === "serie") return false;
    if (!filters.showAnimes && item.tipo === "anime") return false;

    if (searchTerm && !item.titulo.toLowerCase().includes(searchTerm.toLowerCase()))
      return false;

    if (selectedGenre && !item.generos.includes(selectedGenre)) return false;

    return true;
  });

  const topRated = filteredItems.slice(0, 20);
  const newReleased = filteredItems.slice(20, 40);
  const moreToWatch = filteredItems.slice(40, 60);

  /* ===========================
      RENDERIZAÇÃO
  ============================ */
  return (
    <div className="series-container">

      <div className="genres-button" onClick={() => setShowGenresMenu(!showGenresMenu)}>
        🎬 GÊNEROS
      </div>

      {showGenresMenu && (
        <div className="genres-menu">
          <button onClick={() => setSelectedGenre(null)}>Todos</button>
          {Array.from(new Set(allItems.flatMap(i => i.generos))).map((g) => (
            <button key={g} onClick={() => { setSelectedGenre(g); setShowGenresMenu(false); }}>
              {g}
            </button>
          ))}
        </div>
      )}

      <div className="filter-button" onClick={() => setShowFilterPanel(!showFilterPanel)}>
        ⚙️ FILTRAR
      </div>

      {showFilterPanel && (
        <div className="filter-box">
          <button className="close-btn" onClick={() => setShowFilterPanel(false)}>✖</button>
          <h3>Filtrar</h3>

          <label>
            <input
              type="checkbox"
              checked={filters.showSeries}
              onChange={() => setFilters({ ...filters, showSeries: !filters.showSeries })}
            />
            Mostrar Séries
          </label>

          <label>
            <input
              type="checkbox"
              checked={filters.showAnimes}
              onChange={() => setFilters({ ...filters, showAnimes: !filters.showAnimes })}
            />
            Mostrar Animes
          </label>
        </div>
      )}

      {loading && <h2 style={{ textAlign: "center", marginTop: "100px" }}>Carregando...</h2>}

      {!loading && (
        <div className="series-grid">

          {[
            { title: "Mais Bem Avaliados", data: topRated },
            { title: "Novos Lançamentos", data: newReleased },
            { title: "Para Assistir Agora", data: moreToWatch }
          ].map((section, index) => (
            <React.Fragment key={index}>
              <h2 className="section-title">{section.title}</h2>

              <div className="carousel-row">
                {section.data.map((item) => (
                  <div key={item.id} className="anime-card">

                    <img
                      className="anime-img"
                      src={item.imagem}
                      alt={item.titulo}
                      onClick={() => openDetails(item)}
                    />

                    <div className="anime-info" onClick={() => openDetails(item)}>
                      <h2>{item.titulo}</h2>
                    </div>

                    {/* ÍCONE + */}
                    <div
                      className="add-icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddClick(item.id);
                      }}
                    >
                      <FaPlus />
                    </div>

                    {/* MENU */}
                    {activeMenu === item.id && (
                      <div className="list-menu" onClick={(e) => e.stopPropagation()}>
                        {userLists.map(list => (
                          <button key={list.id} onClick={() => handleAddToList(item, list)}>
                            📌 {list.title}
                          </button>
                        ))}
                      </div>
                    )}

                  </div>
                ))}
              </div>
            </React.Fragment>
          ))}

        </div>
      )}
    </div>
  );
};

export default SeriesPage;
