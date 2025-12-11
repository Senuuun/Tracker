import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import "./SearchPage.css";

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔍 Função de busca unificada
  const fetchResults = async (query) => {
    if (!query) {
      setResults([]);
      return;
    }

    setLoading(true);

    try {
      // TVMaze (Séries e alguns animes)
      const seriesPromise = fetch(
        `https://api.tvmaze.com/search/shows?q=${query}`
      ).then((res) => res.json());

      // Jikan (Animes)
      const animesPromise = fetch(
        `https://api.jikan.moe/v4/anime?q=${query}&limit=15`
      ).then((res) => res.json());

      const [seriesData, animeData] = await Promise.all([
        seriesPromise,
        animesPromise,
      ]);

      // Transformar dados da TVMaze
      const formattedSeries =
        seriesData.map((item) => ({
          id: `serie-${item.show.id}`,
          titulo: item.show.name,
          titulo_normalized: item.show.name.toLowerCase().trim(),
          descricao: item.show.summary
            ? item.show.summary.replace(/<[^>]+>/g, "")
            : "Sem descrição disponível.",
          imagem:
            item.show.image?.medium ||
            "https://via.placeholder.com/210x295?text=Sem+Imagem",
          tipo: "serie",
        })) || [];

      // Transformar dados do Jikan (Mais confiável)
      const formattedAnimes =
        animeData.data?.map((anime) => ({
          id: `anime-${anime.mal_id}`,
          titulo: anime.title,
          titulo_normalized: anime.title.toLowerCase().trim(),
          descricao: anime.synopsis || "Sem descrição disponível.",
          imagem:
            anime.images?.jpg?.image_url ||
            "https://via.placeholder.com/210x295?text=Sem+Imagem",
          tipo: "anime",
        })) || [];

      // 🔥 Remover duplicados: se o título existir no Jikan, remover do TVMaze
      const animeTitles = new Set(
        formattedAnimes.map((a) => a.titulo_normalized)
      );

      const seriesWithoutAnimeDuplicates = formattedSeries.filter(
        (s) => !animeTitles.has(s.titulo_normalized)
      );

      // Unir tudo
      const finalResults = [...seriesWithoutAnimeDuplicates, ...formattedAnimes];

      setResults(finalResults);
    } catch (error) {
      console.error("Erro ao buscar:", error);
    }

    setLoading(false);
  };

  // Rodar busca sempre que searchTerm mudar
  useEffect(() => {
    const delay = setTimeout(() => fetchResults(searchTerm), 500);
    return () => clearTimeout(delay);
  }, [searchTerm]);

  return (
    <div className="search-container">
      {/* Barra de busca */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar séries ou animes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Resultados */}
      <div className="results-section">
        {searchTerm.length === 0 ? (
          <p className="hint">
            Digite algo para buscar séries e animes...
          </p>
        ) : loading ? (
          <p className="loading">Carregando...</p>
        ) : results.length === 0 ? (
          <p className="no-results">Nenhum resultado encontrado.</p>
        ) : (
          <div className="results-grid">
            {results.map((item) => (
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
