import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAccessToken, logout } from '../../services/AuthService/AuthService';
import { jwtDecode } from 'jwt-decode'; // ✅ Import correto
import './GerenciarEstadias.css';
import ChatButton from '../../components/ChatButton/ChatButton';

const API_BASE_URL = 'http://localhost:8080/reservas';
const BASE_IMAGE_URL = 'http://localhost:8080/uploads/imagemImoveis/';
const BASE_USUARIO_IMAGE_URL = 'http://localhost:8080/uploads/fotosUsuarios/';
const DEFAULT_USER_IMAGE = '/default-user.png'; // Imagem padrão na pasta public

const GerenciarEstadias = () => {
    const navigate = useNavigate();
    const [reservas, setReservas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAnfitriao, setIsAnfitriao] = useState(false);

    const token = getAccessToken();

    const fetchReservas = async () => {
        if (!token) {
            logout();
            navigate('/login');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/listar`, {
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
        if (token) {
            const decoded = jwtDecode(token);
            const roles = decoded.roles || decoded.authorities || [];
            setIsAnfitriao(roles.includes('ROLE_ANFITRIAO'));
        }
        fetchReservas();
    }, [token]);

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

    const handleConfirmar = async (reservaId) => {
        try {
            const res = await fetch(`${API_BASE_URL}/confirmar/${reservaId}`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error(`Erro ao confirmar reserva: ${res.status}`);
            alert('Reserva confirmada!');
            fetchReservas();
        } catch (err) {
            console.error(err);
            alert('Erro ao confirmar reserva.');
        }
    };

    const handleApagar = async (reservaId) => {
        if (!window.confirm('Deseja apagar esta reserva?')) return;

        try {
            const res = await fetch(`${API_BASE_URL}/deletar/${reservaId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error(`Erro ao apagar reserva: ${res.status}`);
            alert('Reserva apagada com sucesso!');
            fetchReservas();
        } catch (err) {
            console.error(err);
            alert('Erro ao apagar reserva.');
        }
    };

    const handleChat = (reservaId) => {
        navigate(`/mensagens/${reservaId}`);
    };

    if (loading) return <div className="gerenciar-estadias-container">Carregando...</div>;

    return (
        <div className="gerenciar-estadias-container">
            <h1>Gerenciar Estadias</h1>
            <button
                className="btn-voltar"
                onClick={() => navigate(-1)}
            >
                ← Voltar
            </button>
            {reservas.length === 0 && <p>Nenhuma reserva encontrada.</p>}
            {reservas.map((reserva) => (
                <div key={reserva.id} className="reserva-card">
                    <div className="reserva-info">
                        {/* Imóvel */}
                        <img
                            src={reserva.imovel.imagens?.length > 0 ? BASE_IMAGE_URL + reserva.imovel.imagens[0] : ''}
                            alt={reserva.imovel.nome}
                            className="reserva-image"
                        />
                        <div className="reserva-detalhes">
                            <h2>{reserva.imovel.nome}</h2>
                            <p><strong>Localização:</strong> {reserva.imovel.localizacao}</p>
                            <p><strong>Check-in:</strong> {new Date(reserva.dataCheckin).toLocaleDateString()}</p>
                            <p><strong>Check-out:</strong> {new Date(reserva.dataCheckout).toLocaleDateString()}</p>
                            <p><strong>Status:</strong> {reserva.status}</p>
                            <p><strong>Valor total:</strong> R${reserva.valorTotal}</p>
                        </div>

                        {/* Hóspede */}
                        <div className="hospede-detalhes">
                            <img
                                src={reserva.hospede?.foto || DEFAULT_USER_IMAGE}
                                alt={reserva.hospede?.nome || 'Hóspede'}
                                className="hospede-image"
                            />
                            <p><strong>Hóspede:</strong> {reserva.hospede?.nome}</p>
                            <p><strong>Email:</strong> {reserva.hospede?.email}</p>
                            <p><strong>Telefone:</strong> {reserva.hospede?.telefone || 'Não informado'}</p>
                        </div>
                    </div>

                    <div className="reserva-actions">
                        <ChatButton reservaId={reserva.id} />

                        {/* Botão Confirmar */}
                        {isAnfitriao && reserva.status === 'SOLICITADA' && (
                            <button onClick={() => handleConfirmar(reserva.id)}>Confirmar</button>
                        )}

                        {/* Botão Cancelar */}
                        {(reserva.status === 'SOLICITADA' || reserva.status === 'CONFIRMADA') && (
                            <button onClick={() => handleCancelar(reserva.id)}>Cancelar</button>
                        )}

                        {/* Botão Apagar */}
                        <button onClick={() => handleApagar(reserva.id)} className="apagar-button">Apagar</button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default GerenciarEstadias;
