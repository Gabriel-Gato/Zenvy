import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAccessToken, logout } from '../../services/AuthService/AuthService';
import './Avaliacao.css';

const API_BASE_URL = 'http://localhost:8080/avaliacao';
const USUARIO_ME_URL = 'http://localhost:8080/usuarios/me';

const Avaliacao = () => {
    const { id: reservaId } = useParams();
    const navigate = useNavigate();
    const token = getAccessToken();
    const [nota, setNota] = useState(0);
    const [comentario, setComentario] = useState('');
    const [loading, setLoading] = useState(false);
    const [usuario, setUsuario] = useState(null);


    useEffect(() => {
        if (!token) {
            logout();
            navigate('/login');
            return;
        }

        const fetchUsuario = async () => {
            try {
                const res = await fetch(USUARIO_ME_URL, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!res.ok) throw new Error('Erro ao buscar usuário logado');
                const data = await res.json();
                setUsuario(data);
            } catch (err) {
                console.error(err);
                alert('Erro ao obter dados do usuário. Faça login novamente.');
                logout();
                navigate('/login');
            }
        };

        fetchUsuario();
    }, [token, navigate]);

    const handleEnviar = async () => {
        if (!usuario) {
            alert('Usuário não carregado ainda.');
            return;
        }

        if (nota === 0) {
            alert('Selecione uma nota para a avaliação.');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/imovel/${reservaId}/autor/${usuario.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ nota, comentario })
            });

            if (!res.ok) throw new Error(`Erro ao enviar avaliação: ${res.status}`);
            alert('Avaliação enviada com sucesso!');
            navigate('/statusEstadia');
        } catch (err) {
            console.error(err);
            alert('Erro ao enviar avaliação.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="avaliacao-container">
            <h1>Avaliar Estadia</h1>

            <div className="avaliacao-nota">
                <p>Nota:</p>
                <div className="estrelas">
                    {[1, 2, 3, 4, 5].map((valor) => (
                        <span
                            key={valor}
                            className={`estrela ${valor <= nota ? 'ativa' : ''}`}
                            onClick={() => setNota(valor)}
                        >
                            ★
                        </span>
                    ))}
                </div>
            </div>

            <div className="avaliacao-comentario">
                <p>Comentário:</p>
                <textarea
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                    placeholder="Escreva sua avaliação..."
                    rows={5}
                />
            </div>

            <button
                className="avaliacao-enviar-btn"
                onClick={handleEnviar}
                disabled={loading || !usuario}
            >
                {loading ? 'Enviando...' : 'Enviar Avaliação'}
            </button>

        </div>
    );
};

export default Avaliacao;
