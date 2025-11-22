import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Mensagens.css";

const Mensagens = () => {
    const { reservaId } = useParams();
    const navigate = useNavigate();
    const [mensagens, setMensagens] = useState([]);
    const [texto, setTexto] = useState("");
    const token = localStorage.getItem("accessToken");

    const carregarMensagens = useCallback(async () => {
        if (!reservaId || !token) return;

        try {
            const res = await fetch(
                `http://localhost:8080/mensagens/reserva/${reservaId}`,
                {
                    headers: {
                        "Accept": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!res.ok) throw new Error("Erro ao buscar mensagens");

            const data = await res.json();
            setMensagens(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Erro ao carregar mensagens:", err);
        }
    }, [reservaId, token]);

    useEffect(() => {
        carregarMensagens();
    }, [carregarMensagens]);

    const enviarMensagem = async () => {
        if (!texto.trim() || !token) return;

        try {
            const res = await fetch(
                `http://localhost:8080/mensagens/enviar/${reservaId}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ conteudo: texto }),
                }
            );

            if (!res.ok) throw new Error("Erro ao enviar mensagem");

            const novaMensagem = await res.json();
            setMensagens((prev) => [...prev, novaMensagem]);
            setTexto("");
        } catch (err) {
            console.error("Erro ao enviar mensagem:", err);
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-header">
                <button className="voltar-btn" onClick={() => navigate("/")}>
                    ← Voltar
                </button>
                <h2>Chat</h2>
            </div>

            <div className="chat-box">
                {mensagens.length === 0 ? (
                    <p className="sem-mensagens">Nenhuma mensagem ainda...</p>
                ) : (
                    mensagens.map((msg) => (
                        <div
                            key={msg.id}
                            className={`mensagem ${msg.enviadaPeloUsuario ? "minha" : "deles"}`}
                        >
                            <p className="conteudo">{msg.conteudo}</p>
                            {msg.dataEnvio && (
                                <span className="hora">
                                    {new Date(msg.dataEnvio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            )}
                        </div>
                    ))
                )}
            </div>

            <div className="chat-input-container">
                <input
                    type="text"
                    placeholder="Digite sua mensagem..."
                    value={texto}
                    onChange={(e) => setTexto(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && enviarMensagem()}
                />
                <button onClick={enviarMensagem}>Enviar</button>
            </div>
        </div>
    );
};

export default Mensagens;
