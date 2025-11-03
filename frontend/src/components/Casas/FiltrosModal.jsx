import React, { useState } from 'react';
import './FiltrosModal.css';

const FiltrosModal = ({ isOpen, onClose, onApplyFilters, filtrosIniciais }) => {
  // Garantir que filtrosIniciais tenha todas as propriedades necessárias
  const [filtros, setFiltros] = useState(() => {
    const defaults = {
      precoMin: 0,
      precoMax: 1000,
      capacidadeMin: 1,
      capacidadeMax: 10,
      quartosMin: 1,
      quartosMax: 5,
      cozinha: false,
      salaDeEstar: false,
      comodidades: [], // Garantir que comodidades existe
      localizacao: '',
      ordenarPor: 'preco-asc'
    };

    return { ...defaults, ...filtrosIniciais };
  });

  const comodidadesOptions = [
    'WIFI',
    'AR_CONDICIONADO',
    'PISCINA',
    'ESTACIONAMENTO',
    'TV',
    'COZINHA_EQUIPADA',
    'LAREIRA',
    'ACESSIBILIDADE',
    'PET_FRIENDLY',
    'VARANDA'
  ];

  const handlePrecoChange = (tipo, valor) => {
    setFiltros(prev => ({
      ...prev,
      [tipo]: parseInt(valor)
    }));
  };

  const handleCapacidadeChange = (tipo, valor) => {
    setFiltros(prev => ({
      ...prev,
      [tipo]: parseInt(valor)
    }));
  };

  const handleQuartosChange = (tipo, valor) => {
    setFiltros(prev => ({
      ...prev,
      [tipo]: parseInt(valor)
    }));
  };

  const handleComodidadeChange = (comodidade) => {
    setFiltros(prev => ({
      ...prev,
      comodidades: prev.comodidades.includes(comodidade)
        ? prev.comodidades.filter(c => c !== comodidade)
        : [...prev.comodidades, comodidade]
    }));
  };

  const handleInputChange = (campo, valor) => {
    setFiltros(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const handleApply = () => {
    onApplyFilters(filtros);
    onClose();
  };

  const handleReset = () => {
    setFiltros({
      precoMin: 0,
      precoMax: 1000,
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
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header do Modal */}
        <div className="modal-header">
          <h2 className="modal-title">Filtros</h2>
          <button className="modal-close" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className="modal-body">
          {/* Filtro de Preço */}
          <div className="filter-section">
            <h3 className="filter-title">Preço por Noite</h3>
            <div className="price-range">
              <div className="range-labels">
                <span>R$ {filtros.precoMin}</span>
                <span>R$ {filtros.precoMax}</span>
              </div>
              <div className="range-sliders">
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="50"
                  value={filtros.precoMin}
                  onChange={(e) => handlePrecoChange('precoMin', e.target.value)}
                  className="range-slider"
                />
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="50"
                  value={filtros.precoMax}
                  onChange={(e) => handlePrecoChange('precoMax', e.target.value)}
                  className="range-slider"
                />
              </div>
            </div>
          </div>

          {/* Filtro de Capacidade */}
          <div className="filter-section">
            <h3 className="filter-title">Capacidade de Hóspedes</h3>
            <div className="capacity-range">
              <div className="range-labels">
                <span>{filtros.capacidadeMin} pessoa(s)</span>
                <span>{filtros.capacidadeMax} pessoa(s)</span>
              </div>
              <div className="range-sliders">
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={filtros.capacidadeMin}
                  onChange={(e) => handleCapacidadeChange('capacidadeMin', e.target.value)}
                  className="range-slider"
                />
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={filtros.capacidadeMax}
                  onChange={(e) => handleCapacidadeChange('capacidadeMax', e.target.value)}
                  className="range-slider"
                />
              </div>
            </div>
          </div>

          {/* Filtro de Quartos */}
          <div className="filter-section">
            <h3 className="filter-title">Número de Quartos</h3>
            <div className="rooms-range">
              <div className="range-labels">
                <span>{filtros.quartosMin} quarto(s)</span>
                <span>{filtros.quartosMax} quarto(s)</span>
              </div>
              <div className="range-sliders">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={filtros.quartosMin}
                  onChange={(e) => handleQuartosChange('quartosMin', e.target.value)}
                  className="range-slider"
                />
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={filtros.quartosMax}
                  onChange={(e) => handleQuartosChange('quartosMax', e.target.value)}
                  className="range-slider"
                />
              </div>
            </div>
          </div>

          {/* Filtro de Localização */}
          <div className="filter-section">
            <h3 className="filter-title">Localização</h3>
            <input
              type="text"
              placeholder="Digite a cidade ou bairro..."
              value={filtros.localizacao || ''}
              onChange={(e) => handleInputChange('localizacao', e.target.value)}
              className="location-input"
            />
          </div>

          {/* Filtro de Comodidades */}
          <div className="filter-section">
            <h3 className="filter-title">Comodidades</h3>
            <div className="comodidades-grid">
              {comodidadesOptions.map((comodidade) => (
                <label key={comodidade} className="comodidade-checkbox">
                  <input
                    type="checkbox"
                    checked={filtros.comodidades?.includes(comodidade) || false}
                    onChange={() => handleComodidadeChange(comodidade)}
                  />
                  <span className="checkmark"></span>
                  <span className="comodidade-label">
                    {comodidade.split('_').map(word =>
                      word.charAt(0) + word.slice(1).toLowerCase()
                    ).join(' ')}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Filtro de Ordenação */}
          <div className="filter-section">
            <h3 className="filter-title">Ordenar por</h3>
            <select
              value={filtros.ordenarPor || 'preco-asc'}
              onChange={(e) => handleInputChange('ordenarPor', e.target.value)}
              className="sort-select"
            >
              <option value="preco-asc">Preço: Menor para Maior</option>
              <option value="preco-desc">Preço: Maior para Menor</option>
              <option value="capacidade-asc">Capacidade: Menor para Maior</option>
              <option value="capacidade-desc">Capacidade: Maior para Menor</option>
              <option value="quartos-asc">Quartos: Menor para Maior</option>
              <option value="quartos-desc">Quartos: Maior para Menor</option>
              <option value="avaliacao-desc">Melhor Avaliados</option>
            </select>
          </div>
        </div>

        {/* Footer do Modal */}
        <div className="modal-footer">
          <button className="btn-reset" onClick={handleReset}>
            Limpar Filtros
          </button>
          <button className="btn-apply" onClick={handleApply}>
            Aplicar Filtros
          </button>
        </div>
      </div>
    </div>
  );
};

export default FiltrosModal;