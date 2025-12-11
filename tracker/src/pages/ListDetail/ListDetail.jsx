import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import API_URL from "../../config";
import "./ListDetail.css";
import { BsThreeDotsVertical } from "react-icons/bs";

const ListDetail = () => {
  const { id } = useParams();
  const [lista, setLista] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const menuRef = useRef(null);

  const fetchLista = async () => {
    const res = await fetch(`${API_URL}/lists/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    setLista(data);
    setLoading(false);
  };

  useEffect(() => {
    if (token) fetchLista();
  }, [id]);

  useEffect(() => {
    const closeMenu = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setActiveMenu(null);
      }
    };

    document.addEventListener("mousedown", closeMenu);
    return () => document.removeEventListener("mousedown", closeMenu);
  }, []);

      const handleDeleteItem = async (itemId) => {
      try {
        const res = await fetch(`${API_URL}/lists/item/${itemId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` }
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        setLista(prev => ({
          ...prev,
          ListItems: prev.ListItems.filter(i => i.id !== itemId)
        }));

        setActiveMenu(null);
      } catch (error) {
        alert("Erro ao remover item.");
      }
    };

  if (loading) return <p style={{ color: "white" }}>Carregando...</p>;
  if (!lista) return <p style={{ color: "white" }}>Lista não encontrada.</p>;

  const items = Array.isArray(lista.ListItems) ? lista.ListItems : [];

  return (
    <div className="list-detail-page">
      <h1>{lista.title}</h1>

      <div className="list-actions">
        <span className="counter">{items.length} itens</span>
      </div>

      <div className="list-content">
        {items.length === 0 ? (
          <div className="empty-state">
            <img src="/tv-empty.png" alt="Vazio" />
            <p>Nenhum item adicionado ainda.</p>
          </div>
        ) : (
          <div className="items-grid">
            {items.map(item => (
              <div className="item-card" key={item.id}>
                <img src={item.imagem} alt={item.titulo} />
                <p>{item.titulo}</p>

                {/* 🔥 TRÊS PONTINHOS */}
                <div
                  className="item-menu-btn"
                  onClick={() => setActiveMenu(activeMenu === item.id ? null : item.id)}
                >
                  <BsThreeDotsVertical size={22} />
                </div>

                {/* 🔥 MENU DE OPÇÕES */}
                {activeMenu === item.id && (
                  <div className="item-menu" ref={menuRef}>
                    <button onClick={() => handleDeleteItem(item.id)}>
                      ❌ Excluir {item.tipo === "anime" ? "este anime" : "esta série"} desta lista
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ListDetail;
