import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminPanel.css";

const sections = [
  { title: "Gerenciar Casas", icon: "7367d6bc4b832e0810602e8beb292338dcce18e5.png", route: "/gerenciarCasas" },
  { title: "Gerenciar Estadias", icon: "468f173083cce7e5d53520152d479e759a38ffbf.png", route: "/gerenciarEstadias" },
  { title: "Gerenciar Galeria", icon: "754748fce03c665a3c598f76d115a420c4d4a26e.png", route: "/gerenciarGaleria" },
  { title: "Gerenciar Credencial", icon: "471db703ee57caaef0132b3cbe547cdf304f9ca6.png", route: "/gerenciarCredencial" },
];

const AdminPanel = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch("http://localhost:8080/usuarios/me", {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Não foi possível obter os dados do usuário");

        const data = await response.json();

        if (data.role !== "ROLE_ANFITRIAO") {
          navigate("/login");
          return;
        }

        setUser(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        localStorage.clear();
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleCardClick = (route) => {
    if (route) navigate(route);
  };

  if (loading) return <div className="admin-panel">Carregando...</div>;

  return (
    <div className="admin-panel">
      <header className="admin-header">
        <div className="welcome-line">
          Bem vinda! <span className="user-name">{user.nome}</span>
        </div>
        <button className="logout-button" onClick={handleLogout} title="Sair">
          <img src="https://cdn-icons-png.flaticon.com/512/126/126467.png" alt="Sair" />
        </button>
      </header>

      <main className="admin-content">
        {sections.map((item, index) => (
          <div
            key={index}
            className="admin-card"
            onClick={() => handleCardClick(item.route)}
          >
            <img src={item.icon} alt={item.title} className="card-icon" />
            <p className="card-title">{item.title}</p>
          </div>
        ))}
      </main>

      <footer className="admin-footer">
        <button className="back-home" onClick={() => navigate("/")}>
          <img src="https://cdn-icons-png.flaticon.com/512/507/507257.png" alt="Home" />
          Voltar para Home
        </button>
      </footer>
    </div>
  );
};

export default AdminPanel;
