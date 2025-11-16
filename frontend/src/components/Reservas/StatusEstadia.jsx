import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './StatusEstadia.css';

const API_BASE_URL = 'http://localhost:8080/reservas';
const BASE_IMAGE_URL = 'http://localhost:8080/uploads/imagemImoveis/';

const StatusEstadia = () => {
    const navigate = useNavigate();
    const [reservas, setReservas] = useState([]);
    const [loading, setLoading] = useState(true);

    // Substitua esse ID pelo usuário logado ou um parâmetro dinâmico
    const hospedeId = 2;

    const fetchReservas = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/listarPorHospede/${hospedeId}`);
            if (!res.ok) throw new Error('Erro ao buscar reservas');
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
            });
            if (!res.ok) throw new Error('Erro ao cancelar reserva');
            alert('Estadia cancelada!');
            fetchReservas();
        } catch (err) {
            console.error(err);
            alert('Erro ao cancelar estadia.');
        }
    };

    const handleConcluir = async (reservaId) => {
        try {
            const res = await fetch(`${API_BASE_URL}/atualizar/${reservaId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'CONCLUIDA' }),
            });
            if (!res.ok) throw new Error('Erro ao concluir reserva');
            alert('Estadia concluída!');
            fetchReservas();
        } catch (err) {
            console.error(err);
            alert('Erro ao concluir estadia.');
        }
    };

    const handleChat = (imovelId) => {
        navigate(`/chat/${imovelId}`);
    };

    if (loading) return <div className="status-estadia-container">Carregando...</div>;

    return (
        <div className="status-estadia-container">
            <h1>Minhas Estadias</h1>
            {reservas.length === 0 && <p>Nenhuma estadia encontrada.</p>}
            {reservas.map((reserva) => (
                <div key={reserva.id} className="reserva-card">
                    <div className="reserva-info">
                        <img
                            src={reserva.imovel.fotos?.length > 0 ? BASE_IMAGE_URL + reserva.imovel.fotos[0] : ''}
                            alt={reserva.imovel.nome}
                            className="reserva-image"
                        />
                        <div className="reserva-detalhes">
                            <h2>{reserva.imovel.nome}</h2>
                            <p>{reserva.imovel.localizacao}</p>
                            <p>Check-in: {new Date(reserva.dataCheckin).toLocaleDateString()}</p>
                            <p>Check-out: {new Date(reserva.dataCheckout).toLocaleDateString()}</p>
                            <p>Status: {reserva.status}</p>
                            <p>Valor total: R${reserva.valorTotal}</p>
                        </div>
                    </div>
                    <div className="reserva-actions">
                        <button onClick={() => handleChat(reserva.imovel.id)}>Chat</button>
                        {reserva.status === 'CONFIRMADA' && (
                            <>
                                <button onClick={() => handleCancelar(reserva.id)}>Cancelar</button>
                                <button onClick={() => handleConcluir(reserva.id)}>Concluir</button>
                            </>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default StatusEstadia;
