import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../../config";
import "./MyList.css";

const MyList = () => {
  const navigate = useNavigate();
  const [lists, setLists] = useState([]);
  const token = localStorage.getItem("token");

  // MODALS
  const [showModal, setShowModal] = useState(false);
  const [newListName, setNewListName] = useState("");

  const [showEditModal, setShowEditModal] = useState(false);
  const [editListName, setEditListName] = useState("");
  const [editListId, setEditListId] = useState(null);

  // MENU DE OPÇÕES
  const [openMenuId, setOpenMenuId] = useState(null);

  const fetchLists = () => {
    fetch(`${API_URL}/lists`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setLists(data);
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchLists();
  }, [token, navigate]);

  // Criar lista
  const handleCreateListConfirm = async () => {
    if (!newListName.trim()) return;

    const res = await fetch(`${API_URL}/lists`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title: newListName }),
    });

    if (res.ok) {
      setShowModal(false);
      setNewListName("");
      fetchLists(); // 🔁 atualiza listas com itens
    }
  };

  // Editar lista
  const openEditModal = (list) => {
    setEditListName(list.title);
    setEditListId(list.id);
    setShowEditModal(true);
  };

  const handleEditListConfirm = async () => {
    if (!editListName.trim()) return;

    const res = await fetch(`${API_URL}/lists/${editListId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title: editListName }),
    });

    if (res.ok) {
      setShowEditModal(false);
      fetchLists(); // 🔁 atualiza após editar
    }
  };

  // Excluir lista
  const deleteList = async (id) => {
    if (!window.confirm("Deseja excluir esta lista?")) return;

    const res = await fetch(`${API_URL}/lists/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) fetchLists(); // 🔁 remove e recarrega
  };

  const handleOpenList = (id) => navigate(`/list/${id}`);

  return (
    <div className="mylist-container">
      <div className="mylist-header">
        <button onClick={() => setShowModal(true)}>Create New List</button>
        <span>{lists.length} / 10 lists</span>
      </div>

      <div className="mylist-grid">
        {lists.map((list) => (
          <div
            className="mylist-card"
            key={list.id}
            onClick={() => handleOpenList(list.id)}
          >
            <div className="card-header">
              <h3>{list.title}</h3>

              <div
                className="menu-dots"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenMenuId(openMenuId === list.id ? null : list.id);
                }}
              >
                ⋮
              </div>

              {openMenuId === list.id && (
                <div className="menu-options" onClick={(e) => e.stopPropagation()}>
                  <span onClick={() => openEditModal(list)}>Editar Lista</span>
                  <span onClick={() => deleteList(list.id)}>Excluir Lista</span>
                </div>
              )}
            </div>

            <p>{list.ListItems?.length || 0} items • Atualizado</p>
          </div>
        ))}
      </div>

      {/* MODAL CRIAR LISTA */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>Criar Nova Lista</h2>
            <input
              type="text"
              placeholder="Nome da Lista"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
            />
            <div className="modal-buttons">
              <button className="btn-primary" onClick={handleCreateListConfirm}>
                Criar Lista
              </button>
              <button className="btn-secondary" onClick={() => setShowModal(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL EDITAR LISTA */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>Editar Lista</h2>
            <input
              type="text"
              value={editListName}
              onChange={(e) => setEditListName(e.target.value)}
            />
            <div className="modal-buttons">
              <button className="btn-primary" onClick={handleEditListConfirm}>
                Salvar
              </button>
              <button className="btn-secondary" onClick={() => setShowEditModal(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyList;
