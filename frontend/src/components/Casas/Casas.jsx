import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import FiltrosModal from './FiltrosModal';
import './Casas.css';

const Casas = () => {
  const [searchData, setSearchData] = useState({
    local: '',
    checkIn: '',
    checkOut: '',
    hospedes: ''
  });

  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [filtrosAtivos, setFiltrosAtivos] = useState({
    comodidades: [] // Garantir que comodidades existe inicialmente
  });

  const casas = [
    {
      id: 1,
      imagem: "https://placehold.co/288x288",
      titulo: "Casa de luxo",
      preco: "R$500 por 2 noites",
      localizacao: "São Paulo",
      avaliacao: "4,98",
      estrelas: 5
    },
    {
      id: 2,
      imagem: "https://placehold.co/288x288",
      titulo: "Casa básica",
      preco: "R$200 por 2 noites",
      localizacao: "Rio de Janeiro",
      avaliacao: "4,56",
      estrelas: 4
    },
    {
      id: 3,
      imagem: "https://placehold.co/288x288",
      titulo: "Casa de luxo",
      preco: "R$500 por 2 noites",
      localizacao: "São Paulo",
      avaliacao: "4,98",
      estrelas: 5
    },
    {
      id: 4,
      imagem: "https://placehold.co/288x288",
      titulo: "Casa de luxo",
      preco: "R$500 por 2 noites",
      localizacao: "São Paulo",
      avaliacao: "4,98",
      estrelas: 5
    }
  ];

  const handleSearchChange = (e) => {
    setSearchData({
      ...searchData,
      [e.target.name]: e.target.value
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Dados da busca:', searchData);
    // Aqui você implementaria a lógica de busca
  };

  const handleOpenFilters = () => {
    setIsFiltersOpen(true);
  };

  const handleCloseFilters = () => {
    setIsFiltersOpen(false);
  };

  const handleApplyFilters = (filtros) => {
    setFiltrosAtivos(filtros);
    console.log('Filtros aplicados:', filtros);
    // Aqui você faria a requisição para o backend com os filtros
    // Exemplo: fetchCasasComFiltros(filtros);
  };

  // Função para verificar se há filtros ativos
  const hasActiveFilters = () => {
    const defaultFilters = {
      precoMin: 0,
      precoMax: 1000,
      capacidadeMin: 1,
      capacidadeMax: 10,
      quartosMin: 1,
      quartosMax: 5,
      comodidades: []
    };

    return (
      filtrosAtivos.precoMin > defaultFilters.precoMin ||
      filtrosAtivos.precoMax < defaultFilters.precoMax ||
      filtrosAtivos.capacidadeMin > defaultFilters.capacidadeMin ||
      filtrosAtivos.quartosMin > defaultFilters.quartosMin ||
      filtrosAtivos.localizacao ||
      (filtrosAtivos.comodidades && filtrosAtivos.comodidades.length > 0)
    );
  };

  return (
    <div className="casas-page">
      {/* Header/Navigation */}
      <header className="header">
        <nav className="nav">
          <div className="nav-logo">
            <img
              src="icons8-chalé-100 1.png"
              alt="Zenvy Logo"
              className="logo-image"
            />
          </div>
          <div className="nav-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/casas" className="nav-link active">Casas</Link>
            <a href="#contato" className="nav-link">Contato</a>
          </div>
          <div className="user-section">
            <div className="user-greeting">
              <span className="greeting-text">Olá!</span>
              <span className="user-name">Lucas</span>
            </div>
            <img
              src="https://placehold.co/126x126"
              alt="Usuário"
              className="user-avatar"
            />
            <button className="logout-btn">
              <svg width="41" height="41" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 30H10C8.93913 30 7.92172 29.5786 7.17157 28.8284C6.42143 28.0783 6 27.0609 6 26V10C6 8.93913 6.42143 7.92172 7.17157 7.17157C7.92172 6.42143 8.93913 6 10 6H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 26L30 17L21 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M30 17H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </nav>
      </header>

      {/* Hero Search Section */}
      <section className="search-hero">
        <div className="search-overlay"></div>
        <div className="search-container">
          <div className="search-card">
            <form className="search-form" onSubmit={handleSearch}>
              <div className="search-fields">
                {/* Local */}
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
                    <div className="input-line"></div>
                  </div>
                </div>

                <div className="field-separator"></div>

                {/* Check-in */}
                <div className="search-field">
                  <label className="field-label">Check-in</label>
                  <div className="input-wrapper">
                    <input
                      type="date"
                      name="checkIn"
                      value={searchData.checkIn}
                      onChange={handleSearchChange}
                      className="search-input"
                      placeholder="Data inicial"
                    />
                    <div className="input-line"></div>
                  </div>
                </div>

                <div className="field-separator"></div>

                {/* Check-out */}
                <div className="search-field">
                  <label className="field-label">Checkout</label>
                  <div className="input-wrapper">
                    <input
                      type="date"
                      name="checkOut"
                      value={searchData.checkOut}
                      onChange={handleSearchChange}
                      className="search-input"
                      placeholder="Data final"
                    />
                    <div className="input-line"></div>
                  </div>
                </div>

                <div className="field-separator"></div>

                {/* Número de Hóspedes */}
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
                    <div className="input-line"></div>
                  </div>
                </div>

                {/* Botão de Filtro */}
                <button
                  type="button"
                  className="filter-btn"
                  onClick={handleOpenFilters}
                >
                  <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 24H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10 17H24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7 10H27" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>

                {/* Botão de Busca */}
                <button type="submit" className="search-btn">
                  <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 21L27 27" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="white" strokeWidth="2"/>
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Indicador de Filtros Ativos */}
      {hasActiveFilters() && (
        <div className="filtros-ativos">
          <div className="container">
            <div className="filtros-tags">
              <span className="filtros-label">Filtros aplicados:</span>
              {filtrosAtivos.precoMin > 0 && (
                <span className="filtro-tag">Preço min: R$ {filtrosAtivos.precoMin}</span>
              )}
              {filtrosAtivos.precoMax < 1000 && (
                <span className="filtro-tag">Preço max: R$ {filtrosAtivos.precoMax}</span>
              )}
              {filtrosAtivos.capacidadeMin > 1 && (
                <span className="filtro-tag">Capacidade: {filtrosAtivos.capacidadeMin}+</span>
              )}
              {filtrosAtivos.quartosMin > 1 && (
                <span className="filtro-tag">Quartos: {filtrosAtivos.quartosMin}+</span>
              )}
              {filtrosAtivos.localizacao && (
                <span className="filtro-tag">Local: {filtrosAtivos.localizacao}</span>
              )}
              {filtrosAtivos.comodidades && filtrosAtivos.comodidades.length > 0 && (
                <span className="filtro-tag">
                  Comodidades: {filtrosAtivos.comodidades.length}
                </span>
              )}
              <button
                className="limpar-filtros"
                onClick={() => setFiltrosAtivos({ comodidades: [] })}
              >
                Limpar todos
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lista de Casas */}
      <section className="casas-grid">
        <div className="container">
          <div className="casas-header">
            <h2 className="casas-title">
              {casas.length} casas encontradas
              {hasActiveFilters() && ' com os filtros aplicados'}
            </h2>
          </div>
          <div className="casas-list">
            {casas.map((casa) => (
              <div key={casa.id} className="casa-card">
                <img
                  src={casa.imagem}
                  alt={casa.titulo}
                  className="casa-image"
                />
                <div className="casa-info">
                  <h3 className="casa-title">{casa.titulo}</h3>
                  <div className="casa-price">{casa.preco}</div>
                  <div className="casa-details">
                    <div className="casa-rating">
                      <div className="stars">
                        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6.5 1L8.09 4.58L12 5.14L9 7.92L9.72 12L6.5 10.08L3.28 12L4 7.92L1 5.14L4.91 4.58L6.5 1Z" fill="#FFD700" stroke="#FFD700" strokeWidth="0.5"/>
                        </svg>
                      </div>
                      <span className="rating-value">{casa.avaliacao}</span>
                    </div>
                    <div className="separator-dot"></div>
                    <div className="casa-location">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 7.5C7.82843 7.5 8.5 6.82843 8.5 6C8.5 5.17157 7.82843 4.5 7 4.5C6.17157 4.5 5.5 5.17157 5.5 6C5.5 6.82843 6.17157 7.5 7 7.5Z" stroke="currentColor" strokeWidth="1"/>
                        <path d="M11 6C11 9 7 12 7 12C7 12 3 9 3 6C3 4.93913 3.42143 3.92172 4.17157 3.17157C4.92172 2.42143 5.93913 2 7 2C8.06087 2 9.07828 2.42143 9.82843 3.17157C10.5786 3.92172 11 4.93913 11 6Z" stroke="currentColor" strokeWidth="1"/>
                      </svg>
                      <span>{casa.localizacao}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal de Filtros */}
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