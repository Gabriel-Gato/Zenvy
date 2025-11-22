import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAccessToken, logout } from '../../services/AuthService/AuthService';
import ChatButton from '../../components/ChatButton/ChatButton';
import './StatusEstadia.css';

const API_BASE_URL = 'http://localhost:8080/reservas';
const BASE_IMAGE_URL = 'http://localhost:8080/uploads/imagemImoveis/';

const StatusEstadia = () => {
    const navigate = useNavigate();
    const [reservas, setReservas] = useState([]);
    const [loading, setLoading] = useState(true);

    const token = getAccessToken();

    const fetchReservas = async () => {
        if (!token) {
            logout();
            navigate('/login');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/minhas`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!res.ok) throw new Error(`Erro ao buscar reservas: ${res.status}`);

            const data = await res.json();
            setReservas(data);
        } catch (err) {
            console.error(err);
            alert('Erro ao carregar reservas.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReservas();
    }, []);

    const handleCancelar = async (reservaId) => {
        if (!window.confirm('Deseja cancelar esta estadia?')) return;

        try {
            const res = await fetch(`${API_BASE_URL}/cancelar/${reservaId}`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!res.ok) throw new Error(`Erro ao cancelar reserva: ${res.status}`);
            alert('Estadia cancelada!');
            fetchReservas();
        } catch (err) {
            console.error(err);
            alert('Erro ao cancelar estadia.');
        }
    };

    const handleConcluir = async (reserva) => {
        try {
            const res = await fetch(`${API_BASE_URL}/atualizar/${reserva.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: 'CONCLUIDA' })
            });

            if (!res.ok) throw new Error(`Erro ao concluir reserva: ${res.status}`);
            alert('Estadia concluída!');


            navigate(`/avaliacao/${reserva.imovel.id}`);

        } catch (err) {
            console.error(err);
            alert('Erro ao concluir estadia.');
        }
    };

    const handleChat = (reservaId) => {
        navigate(`/mensagens/${reservaId}`);
    };


    if (loading) return <div className="status-estadia-container">Carregando...</div>;

    return (
        <div className="status-estadia-container">
            <button
                className="btn-voltar"
                onClick={() => navigate('/userProfile')}
            >
                ← Voltar
            </button>
            <h1>Minhas Estadias</h1>

            {reservas.length === 0 && <p>Nenhuma estadia encontrada.</p>}

            {reservas.map((reserva) => (
                <div key={reserva.id} className="reserva-card">
                    <div className="reserva-info">
                        <img
                            src={
                                reserva.imovel.imagens?.length > 0
                                    ? BASE_IMAGE_URL + reserva.imovel.imagens[0]
                                    : ''
                            }
                            alt={reserva.imovel.nome}
                            className="reserva-image"
                        />

                        <div className="reserva-detalhes">
                            <h2>{reserva.imovel.nome}</h2>
                            <p><b>{reserva.imovel.localizacao}</b></p>
                            <p><b>Check-in:</b> {new Date(reserva.dataCheckin).toLocaleDateString()}</p>
                            <p><b>Check-out:</b> {new Date(reserva.dataCheckout).toLocaleDateString()}</p>
                            <p><b>Status:</b> {reserva.status}</p>
                            <p><b>Valor total:</b> R${reserva.valorTotal}</p>
                        </div>
                    </div>

                    <div className="reserva-actions">
                        <ChatButton reservaId={reserva.id} />

                        {(reserva.status === 'SOLICITADA' || reserva.status === 'CONFIRMADA') && (
                            <>
                                <button onClick={() => handleCancelar(reserva.id)}>Cancelar</button>
                                <button onClick={() => handleConcluir(reserva)}>Concluir</button>
                            </>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default StatusEstadia;
