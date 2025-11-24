import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./ListDetail.css";

const ListDetail = () => {
  const { id } = useParams();
  const [lista, setLista] = useState(null);

  useEffect(() => {
    // Simulação — depois aqui você faz um fetch para o backend tipo:
    // fetch(`/api/lists/${id}?userId=${usuarioLogado.id}`)
    //   .then(res => res.json())
    //   .then(data => setLista(data));
    const listasFake = [
      { id: 1, nome: "Minhas Séries", series: [] },
      { id: 2, nome: "Para Assistir", series: [] },
      { id: 3, nome: "Favoritos", series: [] },
    ];
    const encontrada = listasFake.find((l) => l.id === Number(id));
    setLista(encontrada);
  }, [id]);

  if (!lista) return <p style={{ color: "white" }}>Carregando...</p>;

  return (
    <div className="list-detail-page">
      <h1>{lista.nome}</h1>
      <div className="list-actions">
        <span className="counter">{lista.series.length}/100 Itens</span>
      </div>

      <div className="list-content">
        {lista.series.length === 0 ? (
          <div className="empty-state">
            <img src="/tv-empty.png" alt="Vazio" />
            <p>Nenhuma série adicionada ainda.</p>
          </div>
        ) : (
          <div className="series-grid">
            {lista.series.map((serie) => (
              <div key={serie.id} className="serie-card">
                <img src={serie.image} alt={serie.title} />
                <p>{serie.title}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ListDetail;
