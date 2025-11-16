import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { getAccessToken, logout } from '../../services/AuthService/AuthService';
import './CasaExpandida.css';

const API_BASE_URL = 'http://localhost:8080/imoveis';
const RESERVA_URL = 'http://localhost:8080/reservas/criar';
const USUARIO_ME_URL = 'http://localhost:8080/usuarios/me';
const BASE_IMAGE_URL = 'http://localhost:8080/uploads/imagemImoveis/';

const CasaExpandida = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [imovelData, setImovelData] = useState({
        nome: '',
        localizacao: '',
        precoPorNoite: 0,
        capacidadeHospedes: '',
        quartos: '',
        cozinha: 1,
        salaDeEstar: 1,
        descricao: '',
        comodidades: [],
        fotos: [],
    });

    const [currentIndex, setCurrentIndex] = useState(0);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date(Date.now() + 24 * 60 * 60 * 1000));
    const [totalPrice, setTotalPrice] = useState(0);
    const [paymentModalOpen, setPaymentModalOpen] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('credit');

    // Buscar dados do imóvel
    useEffect(() => {
        const fetchImovel = async () => {
            const token = getAccessToken();
            if (!token) {
                logout();
                navigate('/login');
                return;
            }
            try {
                const response = await fetch(`${API_BASE_URL}/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!response.ok) throw new Error(`Erro ao buscar imóvel: ${response.status}`);
                const data = await response.json();

                const fotos = (data.fotos || data.imagens || []).map(foto =>
                    foto.startsWith('http') ? foto : BASE_IMAGE_URL + foto
                );

                setImovelData({
                    nome: data.nome || '',
                    localizacao: data.localizacao || '',
                    precoPorNoite: data.precoPorNoite || 0,
                    capacidadeHospedes: data.capacidadeHospedes || '',
                    quartos: data.quartos || '',
                    cozinha: data.cozinha || 1,
                    salaDeEstar: data.salaDeEstar || 1,
                    descricao: data.descricao || '',
                    comodidades: data.comodidades || [],
                    fotos,
                    id: data.id
                });
            } catch (err) {
                console.error(err);
            }
        };
        fetchImovel();
    }, [id, navigate]);

    // Atualiza preço total
    useEffect(() => {
        const nights = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        setTotalPrice(nights * imovelData.precoPorNoite);
    }, [startDate, endDate, imovelData.precoPorNoite]);

    const nextImage = () => setCurrentIndex((prev) => (prev + 1) % imovelData.fotos.length);
    const prevImage = () => setCurrentIndex((prev) => (prev - 1 + imovelData.fotos.length) % imovelData.fotos.length);

    // Busca ID do usuário logado
    const fetchUsuarioLogado = async () => {
        const token = getAccessToken();
        if (!token) {
            logout();
            navigate('/login');
            return null;
        }
        try {
            const response = await fetch(USUARIO_ME_URL, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Erro ao obter usuário logado');
            const usuario = await response.json();
            return usuario.id;
        } catch (err) {
            console.error(err);
            logout();
            navigate('/login');
            return null;
        }
    };

    // Função de pagamento / reserva
    const handlePayment = async () => {
        const hospedeId = await fetchUsuarioLogado();
        if (!hospedeId) return;

        const reservaBody = {
            dataCheckin: startDate.toISOString().split('T')[0],
            dataCheckout: endDate.toISOString().split('T')[0],
            valorTotal: totalPrice,
        };

        try {
            const token = getAccessToken();
            const response = await fetch(`${RESERVA_URL}/${imovelData.id}/${hospedeId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(reservaBody)
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(`Erro ao criar reserva: ${response.status} ${text}`);
            }

            alert('Reserva realizada com sucesso!');
            setPaymentModalOpen(false);
        } catch (err) {
            console.error(err);
            alert('Erro ao realizar reserva: ' + err.message);
        }
    };

    return (
        <div className="casa-expandida-container">
            {/* Carrossel */}
            <div className="carousel">
                {imovelData.fotos.length > 0 && (
                    <>
                        <img className="carousel-image" src={imovelData.fotos[currentIndex]} alt={`Imagem ${currentIndex + 1}`} />
                        <button className="carousel-btn left" onClick={prevImage}>‹</button>
                        <button className="carousel-btn right" onClick={nextImage}>›</button>
                    </>
                )}
            </div>

            <div className="main-content">
                <div className="info-left">
                    <h1 className="title">{imovelData.nome}</h1>
                    <div className="location">{imovelData.localizacao}</div>

                    <div className="detalhes-centralizados">
                        <div className="detalhe-item">{imovelData.capacidadeHospedes} hóspedes</div>
                        <div className="detalhe-item">{imovelData.quartos} quartos</div>
                        <div className="detalhe-item">{imovelData.cozinha} cozinhas</div>
                        <div className="detalhe-item">{imovelData.salaDeEstar} salas de estar</div>
                    </div>

                    <hr className="section-divider" />

                    <div className="descricao-section">
                        <h2>Descrição</h2>
                        <p>{imovelData.descricao}</p>
                    </div>
                </div>

                <div className="reserva-right">
                    <div className="reserva-card">
                        <div className="reserva-price">R${imovelData.precoPorNoite}</div>
                        <div className="reserva-duration">por noite</div>

                        {/* Datas */}
                        <div className="date-selection">
                            <label>Check-in</label>
                            <DatePicker
                                selected={startDate}
                                onChange={(date) => {
                                    if (date >= endDate) setEndDate(new Date(date.getTime() + 24 * 60 * 60 * 1000));
                                    setStartDate(date);
                                }}
                                selectsStart
                                startDate={startDate}
                                endDate={endDate}
                                minDate={new Date()}
                                dateFormat="dd/MM/yyyy"
                            />
                            <label>Check-out</label>
                            <DatePicker
                                selected={endDate}
                                onChange={(date) => {
                                    if (date <= startDate) setEndDate(new Date(startDate.getTime() + 24 * 60 * 60 * 1000));
                                    else setEndDate(date);
                                }}
                                selectsEnd
                                startDate={startDate}
                                endDate={endDate}
                                minDate={new Date(startDate.getTime() + 24 * 60 * 60 * 1000)}
                                dateFormat="dd/MM/yyyy"
                            />
                        </div>

                        <div className="total-price">Total: R${totalPrice}</div>
                        <button className="reserva-button" onClick={() => setPaymentModalOpen(true)}>Reservar</button>

                        <hr className="section-divider" />

                        {imovelData.comodidades.length > 0 && (
                            <div className="comodidades-section">
                                <h2>Comodidades</h2>
                                <div className="comodidades-grid">
                                    {imovelData.comodidades.map((item, i) => (
                                        <div key={i} className="comodidade-card">{item}</div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal de pagamento */}
            {paymentModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-card">
                        <h2>Pagamento</h2>
                        <div className="payment-methods">
                            <button className={paymentMethod === 'credit' ? 'active' : ''} onClick={() => setPaymentMethod('credit')}>Cartão de Crédito</button>
                            <button className={paymentMethod === 'debit' ? 'active' : ''} onClick={() => setPaymentMethod('debit')}>Cartão de Débito</button>
                            <button className={paymentMethod === 'paypal' ? 'active' : ''} onClick={() => setPaymentMethod('paypal')}>PayPal</button>
                        </div>

                        {paymentMethod !== 'paypal' && (
                            <div className="card-inputs">
                                <input type="text" placeholder="Número do cartão" />
                                <input type="text" placeholder="Nome no cartão" />
                                <div className="card-row">
                                    <input type="text" placeholder="MM/AA" />
                                    <input type="text" placeholder="CVC" />
                                </div>
                            </div>
                        )}

                        <div className="modal-buttons">
                            <button onClick={() => setPaymentModalOpen(false)}>Cancelar</button>
                            <button onClick={handlePayment}>Pagar R${totalPrice}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CasaExpandida;
