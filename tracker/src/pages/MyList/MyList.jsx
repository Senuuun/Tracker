import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../../config";
import "./MyList.css";

const MyList = () => {
  const navigate = useNavigate();
  const [lists, setLists] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      alert("Faça login para ver suas listas.");
      navigate("/login");
      return;
    }

    fetch(`${API_URL}/lists`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(async (data) => {
        if (data.length === 0) {
          // Se o usuário for novo, cria listas padrão
          await Promise.all([
            fetch(`${API_URL}/lists`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ title: "Series Watched" }),
            }),
            fetch(`${API_URL}/lists`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ title: "Series I Want to See" }),
            }),
          ]);
          const resp = await fetch(`${API_URL}/lists`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const newLists = await resp.json();
          setLists(newLists);
        } else {
          setLists(data);
        }
      })
      .catch((err) => console.error("Erro ao carregar listas:", err));
  }, [token, navigate]);

  const handleCreateList = async () => {
    const name = prompt("Enter the name of your new list:");
    if (!name) return;

    const response = await fetch(`${API_URL}/lists`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title: name }),
    });

    if (response.ok) {
      const newList = await response.json();
      setLists([...lists, newList]);
    } else {
      alert("Erro ao criar lista.");
    }
  };

  const handleOpenList = (id) => {
    navigate(`/list/${id}`);
  };

  return (
    <div className="mylist-container">
      <div className="mylist-header">
        <button onClick={handleCreateList}>Create New List</button>
        <span>{lists.length} / 10 lists</span>
      </div>

      <div className="mylist-grid">
        {lists.map((list) => (
          <div
            className="mylist-card"
            key={list.id}
            onClick={() => handleOpenList(list.id)}
          >
            <h3>{list.title}</h3>
            <p>{list.items} items • Atualizado</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyList;
