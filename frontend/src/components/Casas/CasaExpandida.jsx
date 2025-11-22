import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { getAccessToken, logout } from '../../services/AuthService/AuthService';
import './CasaExpandida.css';

const API_BASE_URL = 'http://localhost:8080/imoveis';
const RESERVA_URL = 'http://localhost:8080/reservas/criar';
const RESERVAS_POR_IMOVEL_URL = 'http://localhost:8080/reservas/listarPorImovel';
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

    const [avaliacoes, setAvaliacoes] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [startDate, setStartDate] = useState(() => {
        const d = new Date();
        d.setHours(0,0,0,0);
        return d;
    });
    const [endDate, setEndDate] = useState(() => {
        const d = new Date();
        d.setDate(d.getDate() + 1);
        d.setHours(0,0,0,0);
        return d;
    });
    const [totalPrice, setTotalPrice] = useState(0);
    const [paymentModalOpen, setPaymentModalOpen] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('credit');

    // datas ocupadas (intervalos { checkin: Date, checkout: Date })
    const [datasOcupadas, setDatasOcupadas] = useState([]);

    // Busca reservas do imóvel para bloquear datas
    const fetchDatasReservadas = async () => {
        try {
            const token = getAccessToken();
            const res = await fetch(`${RESERVAS_POR_IMOVEL_URL}/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!res.ok) {
                console.error('Erro ao buscar reservas:', res.status);
                setDatasOcupadas([]);
                return;
            }

            const data = await res.json();

            // transforma strings do DTO em Date (zeroando horas)
            const intervalos = (data || []).map(r => {
                const checkin = new Date(r.dataCheckin);
                checkin.setHours(0,0,0,0);
                const checkout = new Date(r.dataCheckout);
                checkout.setHours(0,0,0,0);
                return { checkin, checkout };
            });

            setDatasOcupadas(intervalos);
        } catch (err) {
            console.error('Erro ao carregar datas ocupadas:', err);
        }
    };

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
                    typeof foto === 'string' && foto.startsWith('http') ? foto : BASE_IMAGE_URL + foto
                );

                setImovelData({
                    nome: data.nome || '',
                    localizacao: data.localizacao || '',
                    precoPorNoite: data.precoPorNoite || 0,
                    capacidadeHospedes: data.capacidadeHospedes || '',
                    quartos: data.quartos || '',
                    cozinha: data.cozinha ?? 1,
                    salaDeEstar: data.salaDeEstar ?? 1,
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
        fetchDatasReservadas();
    }, [id, navigate]);

    // Buscar avaliações
    useEffect(() => {
        const fetchAvaliacoes = async () => {
            try {
                const token = getAccessToken();
                if (!token) {
                    logout();
                    navigate('/login');
                    return;
                }

                const response = await fetch(`http://localhost:8080/avaliacao/imovel/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error(`Erro ao buscar avaliações: ${response.status}`);
                }

                const data = await response.json();
                setAvaliacoes(data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchAvaliacoes();
    }, [id, navigate]);

    // Atualiza preço total (garante que nights >= 1)
    useEffect(() => {
        if (!imovelData.precoPorNoite) {
            setTotalPrice(0);
            return;
        }
        const nights = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
        setTotalPrice(nights * imovelData.precoPorNoite);
    }, [startDate, endDate, imovelData.precoPorNoite]);

    // Carrossel
    const nextImage = () => {
        if (!imovelData.fotos || imovelData.fotos.length === 0) return;
        setCurrentIndex((prev) => (prev + 1) % imovelData.fotos.length);
    };
    const prevImage = () => {
        if (!imovelData.fotos || imovelData.fotos.length === 0) return;
        setCurrentIndex((prev) => (prev - 1 + imovelData.fotos.length) % imovelData.fotos.length);
    };


    const isDateBlocked = (date) => {
        if (!date) return false;
        const d = new Date(date);
        d.setHours(0,0,0,0);
        return datasOcupadas.some(intervalo => {
            return d >= intervalo.checkin && d <= intervalo.checkout;
        });
    };

    // Função de pagamento / reserva
    const handlePayment = async () => {
        const token = getAccessToken();
        if (!token) {
            logout();
            navigate('/login');
            return;
        }

        let conflict = false;
        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            const dt = new Date(d);
            dt.setHours(0,0,0,0);
            if (isDateBlocked(dt)) {
                conflict = true;
                break;
            }
        }

        if (conflict) {
            alert('O período selecionado contém dias já reservados. Escolha outro intervalo.');
            fetchDatasReservadas();
            return;
        }

        const reservaBody = {
            dataCheckin: startDate.toISOString().split('T')[0],
            dataCheckout: endDate.toISOString().split('T')[0],
            valorTotal: totalPrice,
        };

        try {
            const response = await fetch(`${RESERVA_URL}/${imovelData.id}`, {
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

            await fetchDatasReservadas();

            navigate('/statusEstadia');

        } catch (err) {
            console.error(err);
            alert('Erro ao realizar reserva: ' + err.message);
        }
    };

    return (
        <div className="casa-expandida-container">
            {/* Carrossel */}
            <div className="carousel">
                {imovelData.fotos && imovelData.fotos.length > 0 && (
                    <>
                        <img
                            className="carousel-image"
                            src={imovelData.fotos[currentIndex]}
                            alt={`Imagem ${currentIndex + 1}`}
                        />
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

                    <hr className="section-divider" />

                    {/* Avaliações */}
                    <div className="avaliacoes-section">
                        <h2>Avaliações</h2>
                        {avaliacoes.length === 0 && <p>Sem avaliações ainda.</p>}
                        {avaliacoes.map((avaliacao, index) => (
                            <div key={index} className="avaliacao-card">
                                <div className="avaliacao-header">
                                    <div className="usuario-nome">{avaliacao.nomeUsuario}</div>
                                    <div className="nota">
                                        <div className="estrelas">
                                            {"★".repeat(avaliacao.nota) + "☆".repeat(5 - avaliacao.nota)}
                                        </div>
                                        <span>{avaliacao.nota}/5</span>
                                    </div>
                                </div>
                                <p>{avaliacao.comentario}</p>
                            </div>
                        ))}

                    </div>
                </div>

                <div className="reserva-right">
                    <div className="reserva-card">
                        <div className="reserva-price">R${imovelData.precoPorNoite}</div>
                        <div className="reserva-duration">por noite</div>

                        <div className="date-selection">
                            <label>Check-in</label>
                            <DatePicker
                                selected={startDate}
                                onChange={(date) => {
                                    if (!date) return;
                                    const d = new Date(date);
                                    d.setHours(0,0,0,0);

                                    if (isDateBlocked(d)) {
                                        alert('Data ocupada. Escolha outra data.');
                                        return;
                                    }

                                    if (d >= endDate) setEndDate(new Date(d.getTime() + 24 * 60 * 60 * 1000));
                                    setStartDate(d);
                                }}
                                selectsStart
                                startDate={startDate}
                                endDate={endDate}
                                minDate={new Date()}
                                filterDate={(date) => !isDateBlocked(date)}
                                dateFormat="dd/MM/yyyy"
                            />
                            <label>Check-out</label>
                            <DatePicker
                                selected={endDate}
                                onChange={(date) => {
                                    if (!date) return;
                                    const d = new Date(date);
                                    d.setHours(0,0,0,0);

                                    if (isDateBlocked(d)) {
                                        alert('Data ocupada. Escolha outra data.');
                                        return;
                                    }

                                    if (d <= startDate) setEndDate(new Date(startDate.getTime() + 24 * 60 * 60 * 1000));
                                    else setEndDate(d);
                                }}
                                selectsEnd
                                startDate={startDate}
                                endDate={endDate}
                                minDate={new Date(startDate.getTime() + 24 * 60 * 60 * 1000)}
                                filterDate={(date) => !isDateBlocked(date)}
                                dateFormat="dd/MM/yyyy"
                            />
                        </div>

                        <div className="total-price">Total: R${totalPrice}</div>
                        <button className="reserva-button" onClick={() => setPaymentModalOpen(true)}>Reservar</button>

                        <hr className="section-divider" />

                        {imovelData.comodidades && imovelData.comodidades.length > 0 && (
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
