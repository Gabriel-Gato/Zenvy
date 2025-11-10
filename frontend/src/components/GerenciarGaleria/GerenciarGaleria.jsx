import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./GerenciarGaleria.css";

const GerenciarGaleria = () => {
  const [galeria, setGaleria] = useState([]);
  const [imagemSelecionada, setImagemSelecionada] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    carregarGaleria();
  }, []);

  const token = localStorage.getItem("accessToken");

  const carregarGaleria = async () => {
    if (!token) return alert("Faça login novamente.");
    try {
      const res = await fetch("http://localhost:8080/galeria", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Erro ao carregar galeria");
      const data = await res.json();
      setGaleria(data);
    } catch (error) {
      console.error(error);
      alert("Erro ao carregar galeria");
    }
  };

  const handleUpload = async () => {
    if (!imagemSelecionada) return alert("Selecione uma imagem primeiro.");
    setLoading(true);

    try {
      const resCriar = await fetch("http://localhost:8080/galeria", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ imagem: "" }),
      });
      if (!resCriar.ok) throw new Error("Erro ao criar galeria");
      const novaGaleria = await resCriar.json();

      const formData = new FormData();
      formData.append("file", imagemSelecionada);

      const resUpload = await fetch(
        `http://localhost:8080/galeria/upload/${novaGaleria.id}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );
      if (!resUpload.ok) throw new Error("Erro ao enviar imagem");

      setImagemSelecionada(null);
      carregarGaleria();
    } catch (error) {
      console.error(error);
      alert("Erro ao enviar imagem");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Deseja realmente deletar esta imagem?")) return;

    try {
      const res = await fetch(`http://localhost:8080/galeria/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Erro ao deletar imagem");
      carregarGaleria();
    } catch (error) {
      console.error(error);
      alert("Erro ao deletar imagem");
    }
  };

  const handleReplace = async (id) => {
    const file = await new Promise((resolve) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = () => resolve(input.files[0]);
      input.click();
    });

    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(
        `http://localhost:8080/galeria/upload/${id}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );
      if (!res.ok) throw new Error("Erro ao substituir imagem");
      carregarGaleria();
    } catch (error) {
      console.error(error);
      alert("Erro ao substituir imagem");
    }
  };

  return (
    <div className="gerenciar-galeria">
      <button className="btn-voltar" onClick={() => navigate(-1)}>
        ← Voltar
      </button>

      <h2>Gerenciar Galeria</h2>

      <div className="controls">
        <label className="custom-file-upload">
          {imagemSelecionada ? imagemSelecionada.name : "Escolha uma imagem"}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImagemSelecionada(e.target.files[0])}
          />
        </label>

        <button
          className="btn-upload"
          onClick={handleUpload}
          disabled={loading}
        >
          {loading ? "Enviando..." : "Enviar Imagem"}
        </button>
      </div>

      <div className="galeria-container">
        {galeria.length === 0 && <p>Nenhuma imagem na galeria</p>}
        {galeria.map((item) => (
          <div key={item.id} className="galeria-item">
            <img
              src={`http://localhost:8080/uploads/galeria/${item.imagem}`}
              alt="Galeria"
              onClick={() => handleReplace(item.id)}
            />
            <button
              className="delete-btn"
              onClick={() => handleDelete(item.id)}
            >
              ✖
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GerenciarGaleria;
