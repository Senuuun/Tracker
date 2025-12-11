// DetailsPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./DetailsPage.css";
import API_URL from "../../config"; 

const DetailsPage = () => {
  const { id } = useParams(); 
  const [item, setItem] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const [lists, setLists] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const savedItems = JSON.parse(localStorage.getItem("media-details")) || {};
    if (savedItems[id]) setItem(savedItems[id]);
  }, [id]);

  useEffect(() => {
    const fetchLists = async () => {
      if (!token) return;
      try {
        const res = await fetch(`${API_URL}/lists`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const data = await res.json();
        setLists(data);
      } catch (err) {
        console.error("Erro fetch lists:", err);
      }
    };
    fetchLists();
  }, [token]);

  // Se item existe mas não tem os campos de "informações", busca detalhado
  useEffect(() => {
    if (!item) return;

    const needsDetails =
      item.generos === undefined &&
      item.episodios === undefined &&
      item.estudio === undefined &&
      item.status === undefined;

    if (!needsDetails) return;

    const fetchExtra = async () => {
      try {
        // Detecta tipo pelo id (prefixo)
        if (id.startsWith("tv-")) {
          // tvmaze
          const showId = id.split("tv-")[1];
          // buscar show
          const showRes = await fetch(`https://api.tvmaze.com/shows/${showId}`);
          if (!showRes.ok) throw new Error("Erro ao buscar detalhes (TVMaze)");
          const show = await showRes.json();

          // buscar episódios (contagem)
          const epsRes = await fetch(`https://api.tvmaze.com/shows/${showId}/episodes`);
          let episodes = [];
          if (epsRes.ok) {
            episodes = await epsRes.json();
          }

          const merged = {
            ...item,
            generos: Array.isArray(show.genres) && show.genres.length ? show.genres.join(", ") : "Não informado",
            episodios: episodes.length || (show.episodes ? show.episodes : "Não informado"),
            estudio:
              (show.network && show.network.name) ||
              (show.webChannel && show.webChannel.name) ||
              show.network?.name ||
              "Não informado",
            status: show.status || "Desconhecido",
          };

          setItem(merged);
          // atualizar localStorage
          const saved = JSON.parse(localStorage.getItem("media-details")) || {};
          saved[id] = merged;
          localStorage.setItem("media-details", JSON.stringify(saved));
        } else if (id.startsWith("anime-")) {
          // Jikan (MyAnimeList) v4
          const malId = id.split("anime-")[1];
          // endpoint: https://api.jikan.moe/v4/anime/{id} (retorna data)
          const animeRes = await fetch(`https://api.jikan.moe/v4/anime/${malId}`);
          if (!animeRes.ok) throw new Error("Erro ao buscar detalhes (Jikan)");
          const animeJson = await animeRes.json();
          const a = animeJson.data || {};

          // gerar strings
          const genres =
            Array.isArray(a.genres) && a.genres.length
              ? a.genres.map((g) => g.name).join(", ")
              : Array.isArray(a.themes) && a.themes.length
              ? a.themes.map((g) => g.name).join(", ")
              : "Não informado";

          const studios = Array.isArray(a.studios) && a.studios.length ? a.studios.map((s) => s.name).join(", ") : "Não informado";

          const merged = {
            ...item,
            generos: genres,
            episodios: a.episodes ?? "Não informado",
            estudio: studios,
            status: a.status || "Desconhecido",
          };

          setItem(merged);
          const saved = JSON.parse(localStorage.getItem("media-details")) || {};
          saved[id] = merged;
          localStorage.setItem("media-details", JSON.stringify(saved));
        } else {
          // Se não reconhece, só aplica defaults
          const merged = {
            ...item,
            generos: item.generos ?? "Não informado",
            episodios: item.episodios ?? "Não informado",
            estudio: item.estudio ?? "Não informado",
            status: item.status ?? "Desconhecido",
          };
          setItem(merged);
          const saved = JSON.parse(localStorage.getItem("media-details")) || {};
          saved[id] = merged;
          localStorage.setItem("media-details", JSON.stringify(saved));
        }
      } catch (err) {
        console.error("Erro ao buscar detalhes extras:", err);
        // aplica valores padrão para evitar caixas vazias
        const merged = {
          ...item,
          generos: item.generos ?? "Não informado",
          episodios: item.episodios ?? "Não informado",
          estudio: item.estudio ?? "Não informado",
          status: item.status ?? "Desconhecido",
        };
        setItem(merged);
        const saved = JSON.parse(localStorage.getItem("media-details")) || {};
        saved[id] = merged;
        localStorage.setItem("media-details", JSON.stringify(saved));
      }
    };

    fetchExtra();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item, id]);

  // Adicionar item na lista (mesma lógica do SeriesPage)
  const addToList = async (listId) => {
    try {
      const res = await fetch(`${API_URL}/lists/${listId}/add`, {
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
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erro ao adicionar");

      alert("Adicionado à lista!");
      setMenuOpen(false);
    } catch (err) {
      alert("Erro: " + (err.message || err));
      console.error(err);
    }
  };

  if (!item) return <h2 className="loadingDetails">Carregando...</h2>;

  return (
    <>
      <div className="details-bg">
        <div className="details-content">
          <h1 className="details-title">{item.titulo}</h1>

          <div className="details-meta">
            <span>{item.tipo === "anime" ? "Anime" : "Série"}</span>
            <span>⭐ {item.score || "N/A"}</span>
          </div>

          <p className="details-description" dangerouslySetInnerHTML={{ __html: item.descricao || "" }} />

          <div className="details-buttons">
            <button className="btn-primary" onClick={() => setShowDetails((p) => !p)}>
              {showDetails ? "▲ Ocultar" : "📘 Detalhes"}
            </button>

            <button className="btn-round" onClick={() => setMenuOpen((p) => !p)}>
              +
            </button>

            {menuOpen && (
              <div className="add-menu">
                <p>Adicionar na lista:</p>
                {lists.length === 0 ? (
                  <div style={{ color: "#bbb", padding: 6 }}>Você não tem listas</div>
                ) : (
                  lists.map((l) => (
                    <button key={l.id} className="menu-item" onClick={() => addToList(l.id)}>
                      ➕ {l.title}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        <div className="poster-box">
          <img src={item.imagem} alt={item.titulo} />
        </div>
      </div>

      <section className={`extra-info ${showDetails ? "open" : ""}`}>
        <h2>Informações da Obra</h2>

        <div className="info-grid">
          <div className="info-box">
            <h3>🏷 Gêneros</h3>
            <p>{item.generos ?? "Não informado"}</p>
          </div>

          <div className="info-box">
            <h3>📺 Episódios</h3>
            <p>{item.episodios ?? "Não informado"}</p>
          </div>

          <div className="info-box">
            <h3>🎬 Estúdio</h3>
            <p>{item.estudio ?? "Não informado"}</p>
          </div>

          <div className="info-box">
            <h3>📌 Status</h3>
            <p>{item.status ?? "Desconhecido"}</p>
          </div>
        </div>
      </section>
    </>
  );
};

export default DetailsPage;
