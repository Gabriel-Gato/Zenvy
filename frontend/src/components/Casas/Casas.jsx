import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FiltrosModal from './FiltrosModal';
import NavBar from '../NavBar/NavBar';
import './Casas.css';

const Casas = () => {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);

    const [searchData, setSearchData] = useState({
        local: '',
        checkIn: '',
        checkOut: '',
        hospedes: ''
    });

    const [isFiltersOpen, setIsFiltersOpen] = useState(false);

    const [filtrosAtivos, setFiltrosAtivos] = useState({
        precoMin: 0,
        precoMax: 10000,
        capacidadeMin: 1,
        capacidadeMax: 10,
        quartosMin: 1,
        quartosMax: 5,
        cozinha: false,
        salaDeEstar: false,
        comodidades: [],
        localizacao: '',
        ordenarPor: 'preco-asc'
    });

    const [casas, setCasas] = useState([]);
    const [loading, setLoading] = useState(false);

    const carregarUsuario = () => {
        const token = localStorage.getItem('accessToken');
        if (!token) return setUser(null);

        fetch('http://localhost:8080/usuarios/me', {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => {
                if (!res.ok) {
                    localStorage.removeItem('accessToken');
                    throw new Error('Erro ao carregar usuário');
                }
                return res.json();
            })
            .then(data => {
                setUser({
                    ...data,
                    fotoPerfil: data.fotoPerfil
                        ? `http://localhost:8080/uploads/fotosUsuarios/${data.fotoPerfil}`
                        : 'https://placehold.co/60x60?text=User',
                });
            })
            .catch(() => {
                localStorage.removeItem('accessToken');
                setUser(null);
            });
    };

    useEffect(() => {
        carregarUsuario();
        buscarCasasComFiltros();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        setUser(null);
        navigate('/');
        window.location.reload();
    };

    const buscarCasasComFiltros = async (filtrosOverride = null) => {
        try {
            setLoading(true);
            const f = filtrosOverride ?? filtrosAtivos;

            const params = new URLSearchParams();

            const localizacaoToSend = f.localizacao || searchData.local || '';
            if (localizacaoToSend) params.append('localizacao', localizacaoToSend);

            if (f.precoMax !== undefined && f.precoMax !== null) {
                if (f.precoMax < 10000) params.append('precoMaximo', f.precoMax);
            }

            // ⚡ Alteração aqui para número de hóspedes
            const capacidadeMin = Number(searchData.hospedes);
            if (capacidadeMin && capacidadeMin > 0) {
                params.append('capacidadeMinima', capacidadeMin);
            } else if (f.capacidadeMin && f.capacidadeMin > 1) {
                params.append('capacidadeMinima', f.capacidadeMin);
            }

            if (f.quartosMin !== undefined && f.quartosMin !== null) {
                if (f.quartosMin > 1) params.append('quartosMinimos', f.quartosMin);
            }

            if (f.comodidades && Array.isArray(f.comodidades) && f.comodidades.length > 0) {
                f.comodidades.forEach(c => {
                    if (c) params.append('comodidades', c);
                });
            }

            const url = `http://localhost:8080/imoveis/filtro?${params.toString()}`;
            const res = await fetch(url);

            if (!res.ok) {
                console.error('Resposta não OK ao buscar imóveis', await res.text());
                setCasas([]);
                return;
            }

            const data = await res.json();

            const formatted = (data || []).map(item => {
                const imagem =
                    (item.fotos && item.fotos.length > 0 && item.fotos[0]) ||
                    (item.imagens && item.imagens.length > 0 && `http://localhost:8080/uploads/imagemImoveis/${item.imagens[0]}`) ||
                    'https://placehold.co/288x288';

                const nome = item.titulo || item.nome || item.nomeImovel || 'Imóvel sem título';

                const preco = item.valorDiaria ?? item.precoPorNoite ?? item.preco ?? 0;

                const local = item.localizacao || item.cidade || '';

                const avaliacao = Number(item.avaliacaoMedia) || 0;


                return {
                    id: item.id,
                    imagem,
                    nome,
                    precoPorNoite: preco,
                    localizacao: local,
                    avaliacao
                };
            });

            setCasas(formatted);
        } catch (err) {
            console.error('Erro ao buscar casas:', err);
            setCasas([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchChange = (e) => {
        setSearchData({ ...searchData, [e.target.name]: e.target.value });
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setFiltrosAtivos(prev => ({ ...prev, localizacao: searchData.local }));
        const override = { ...filtrosAtivos, localizacao: searchData.local };
        buscarCasasComFiltros(override);
    };

    const handleOpenFilters = () => setIsFiltersOpen(true);
    const handleCloseFilters = () => setIsFiltersOpen(false);

    const handleApplyFilters = (novosFiltros) => {
        const merged = {
            precoMin: novosFiltros.precoMin ?? 0,
            precoMax: novosFiltros.precoMax ?? 10000,
            capacidadeMin: novosFiltros.capacidadeMin ?? 1,
            capacidadeMax: novosFiltros.capacidadeMax ?? 10,
            quartosMin: novosFiltros.quartosMin ?? 1,
            quartosMax: novosFiltros.quartosMax ?? 5,
            cozinha: novosFiltros.cozinha ?? false,
            salaDeEstar: novosFiltros.salaDeEstar ?? false,
            comodidades: novosFiltros.comodidades ?? [],
            localizacao: novosFiltros.localizacao ?? '',
            ordenarPor: novosFiltros.ordenarPor ?? 'preco-asc'
        };

        setFiltrosAtivos(merged);
        const overrideParaBusca = { ...merged };
        buscarCasasComFiltros(overrideParaBusca);
        setIsFiltersOpen(false);
    };

    const limparTodosFiltros = () => {
        const defaults = {
            precoMin: 0,
            precoMax: 10000,
            capacidadeMin: 1,
            capacidadeMax: 10,
            quartosMin: 1,
            quartosMax: 5,
            cozinha: false,
            salaDeEstar: false,
            comodidades: [],
            localizacao: '',
            ordenarPor: 'preco-asc'
        };
        setFiltrosAtivos(defaults);
        setSearchData({ local: '', checkIn: '', checkOut: '', hospedes: '' });
        buscarCasasComFiltros(defaults);
    };

    const hasActiveFilters = () => {
        const d = {
            precoMin: 0,
            precoMax: 10000,
            capacidadeMin: 1,
            capacidadeMax: 10,
            quartosMin: 1,
            quartosMax: 5,
            comodidades: []
        };

        return (
            (filtrosAtivos.precoMin && filtrosAtivos.precoMin > d.precoMin) ||
            (filtrosAtivos.precoMax && filtrosAtivos.precoMax < d.precoMax) ||
            (filtrosAtivos.capacidadeMin && filtrosAtivos.capacidadeMin > d.capacidadeMin) ||
            (filtrosAtivos.quartosMin && filtrosAtivos.quartosMin > d.quartosMin) ||
            !!filtrosAtivos.localizacao ||
            (filtrosAtivos.comodidades && filtrosAtivos.comodidades.length > 0)
        );
    };

    return (
        <div className="casas-page">
            <NavBar user={user} handleLogout={handleLogout} />

            <section className="search-hero">
                <div className="search-overlay"></div>
                <div className="search-container">
                    <div className="search-card">
                        <form className="search-form" onSubmit={handleSearchSubmit}>
                            <div className="search-fields">
                                <div className="search-field">
                                    <label className="field-label">Onde</label>
                                    <div className="input-wrapper">
                                        <input
                                            type="text"
                                            name="local"
                                            value={searchData.local}
                                            onChange={handleSearchChange}
                                            className="search-input"
                                            placeholder="Buscar lugar"
                                        />
                                    </div>
                                </div>

                                <div className="field-separator"></div>

                                <div className="search-field">
                                    <label className="field-label">Check-in</label>
                                    <div className="input-wrapper">
                                        <input
                                            type="date"
                                            name="checkIn"
                                            value={searchData.checkIn}
                                            onChange={handleSearchChange}
                                            className="search-input"
                                        />
                                    </div>
                                </div>

                                <div className="field-separator"></div>

                                <div className="search-field">
                                    <label className="field-label">Checkout</label>
                                    <div className="input-wrapper">
                                        <input
                                            type="date"
                                            name="checkOut"
                                            value={searchData.checkOut}
                                            onChange={handleSearchChange}
                                            className="search-input"
                                        />
                                    </div>
                                </div>

                                <div className="field-separator"></div>

                                <div className="search-field">
                                    <label className="field-label">Nº Hospede</label>
                                    <div className="input-wrapper">
                                        <input
                                            type="number"
                                            name="hospedes"
                                            value={searchData.hospedes}
                                            onChange={handleSearchChange}
                                            className="search-input"
                                            placeholder="Quantidade"
                                            min="1"
                                        />
                                    </div>
                                </div>



                                <button
                                    type="button"
                                    className="search-btn"
                                    onClick={handleOpenFilters}
                                    title="Abrir filtros"
                                >
                                    {/* Ícone de filtro */}
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M3 5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M6 12H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M10 19H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </button>

                            </div>
                        </form>
                    </div>
                </div>
            </section>

            {hasActiveFilters() && (
                <div className="filtros-ativos">
                    <div className="container">
                        <div className="filtros-tags">
                            <span className="filtros-label">Filtros aplicados:</span>
                            {filtrosAtivos.precoMin > 0 && <span className="filtro-tag">Preço min: R$ {filtrosAtivos.precoMin}</span>}
                            {filtrosAtivos.precoMax < 10000 && <span className="filtro-tag">Preço max: R$ {filtrosAtivos.precoMax}</span>}
                            {filtrosAtivos.capacidadeMin > 1 && <span className="filtro-tag">Capacidade: {filtrosAtivos.capacidadeMin}+</span>}
                            {filtrosAtivos.quartosMin > 1 && <span className="filtro-tag">Quartos: {filtrosAtivos.quartosMin}+</span>}
                            {filtrosAtivos.localizacao && <span className="filtro-tag">Local: {filtrosAtivos.localizacao}</span>}
                            {filtrosAtivos.comodidades?.length > 0 && <span className="filtro-tag">Comodidades: {filtrosAtivos.comodidades.join(', ')}</span>}

                            <button className="limpar-filtros" onClick={limparTodosFiltros}>Limpar todos</button>
                        </div>
                    </div>
                </div>
            )}

            <section className="casas-grid">
                <div className="container">
                    <div className="casas-header">
                        <h2 className="casas-title">
                            {loading ? 'Buscando casas...' : `${casas.length} casas encontradas`}
                            {hasActiveFilters() && ' com os filtros aplicados'}
                        </h2>
                    </div>

                    <div className="casas-list">
                        {casas.map((casa) => (
                            <div key={casa.id} className="casa-card" onClick={() => navigate(`/casaExpandida/${casa.id}`)}
                                 style={{ cursor: 'pointer' }}>
                                <img src={casa.imagem} alt={casa.nome} className="casa-image" />
                                <div className="casa-info">
                                    <h3 className="casa-title">{casa.nome}</h3>
                                    <div className="casa-price">R${casa.precoPorNoite} por noite</div>
                                    <div className="casa-details">
                                        <div className="casa-rating">
                                            <img
                                                src="/icons8-star-50 1.png"
                                                alt="estrela"
                                                className="star-icon"
                                            />
                                            <span className="rating-value">{casa.avaliacao}</span>
                                        </div>
                                        <div className="separator-dot"></div>
                                        <div className="casa-location">
                                            <span>{casa.localizacao}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <FiltrosModal
                isOpen={isFiltersOpen}
                onClose={handleCloseFilters}
                onApplyFilters={handleApplyFilters}
                filtrosIniciais={filtrosAtivos}
            />
        </div>
    );
};

export default Casas;
