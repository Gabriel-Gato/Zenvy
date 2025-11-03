import React, { useState, useRef, useEffect } from 'react';
import './FiltrosModal.css';

const FiltrosModal = ({ isOpen, onClose, onApplyFilters, filtrosIniciais }) => {
  const [filtros, setFiltros] = useState(() => {
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
    return { ...defaults, ...filtrosIniciais };
  });

  const modalRef = useRef();

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

  // Fechar modal ao pressionar ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.keyCode === 27 && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  const handlePrecoChange = (tipo, valor) => {
    const numValor = parseInt(valor);
    setFiltros(prev => {
      const newFiltros = { ...prev, [tipo]: numValor };
      // Garantir que min não seja maior que max
      if (tipo === 'precoMin' && numValor > prev.precoMax) {
        newFiltros.precoMax = numValor;
      } else if (tipo === 'precoMax' && numValor < prev.precoMin) {
        newFiltros.precoMin = numValor;
      }
      return newFiltros;
    });
  };

  const handleCapacidadeChange = (tipo, valor) => {
    const numValor = parseInt(valor);
    setFiltros(prev => {
      const newFiltros = { ...prev, [tipo]: numValor };
      if (tipo === 'capacidadeMin' && numValor > prev.capacidadeMax) {
        newFiltros.capacidadeMax = numValor;
      } else if (tipo === 'capacidadeMax' && numValor < prev.capacidadeMin) {
        newFiltros.capacidadeMin = numValor;
      }
      return newFiltros;
    });
  };

  const handleQuartosChange = (tipo, valor) => {
    const numValor = parseInt(valor);
    setFiltros(prev => {
      const newFiltros = { ...prev, [tipo]: numValor };
      if (tipo === 'quartosMin' && numValor > prev.quartosMax) {
        newFiltros.quartosMax = numValor;
      } else if (tipo === 'quartosMax' && numValor < prev.quartosMin) {
        newFiltros.quartosMin = numValor;
      }
      return newFiltros;
    });
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
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} ref={modalRef}>
        {/* Header do Modal */}
        <div className="modal-header">
          <div className="header-content">
            <svg className="filter-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M4 21V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M4 10V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M12 21V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M12 8V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M20 21V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M20 12V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M1 14H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M9 8H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M17 16H23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <h2 className="modal-title">Filtros e Ordenação</h2>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Fechar">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className="modal-body">
          {/* Filtro de Preço */}
          <div className="filter-section">
            <div className="section-header">
              <h3 className="filter-title">Faixa de Preço</h3>
              <span className="price-display">R$ {filtros.precoMin.toLocaleString()} - R$ {filtros.precoMax.toLocaleString()}</span>
            </div>
            <div className="range-container">
              <div className="range-track">
                <div
                  className="range-progress"
                  style={{
                    left: `${(filtros.precoMin / 10000) * 100}%`,
                    width: `${((filtros.precoMax - filtros.precoMin) / 10000) * 100}%`
                  }}
                />
              </div>
              <input
                type="range"
                min="0"
                max="10000"
                step="100"
                value={filtros.precoMin}
                onChange={(e) => handlePrecoChange('precoMin', e.target.value)}
                className="range-input min-thumb"
              />
              <input
                type="range"
                min="0"
                max="10000"
                step="100"
                value={filtros.precoMax}
                onChange={(e) => handlePrecoChange('precoMax', e.target.value)}
                className="range-input max-thumb"
              />
            </div>
          </div>

          {/* Filtro de Capacidade */}
          <div className="filter-section">
            <div className="section-header">
              <h3 className="filter-title">Número de Hóspedes</h3>
              <span className="value-display">{filtros.capacidadeMin} - {filtros.capacidadeMax} pessoas</span>
            </div>
            <div className="range-container">
              <div className="range-track">
                <div
                  className="range-progress"
                  style={{
                    left: `${((filtros.capacidadeMin - 1) / 19) * 100}%`,
                    width: `${((filtros.capacidadeMax - filtros.capacidadeMin) / 19) * 100}%`
                  }}
                />
              </div>
              <input
                type="range"
                min="1"
                max="20"
                value={filtros.capacidadeMin}
                onChange={(e) => handleCapacidadeChange('capacidadeMin', e.target.value)}
                className="range-input min-thumb"
              />
              <input
                type="range"
                min="1"
                max="20"
                value={filtros.capacidadeMax}
                onChange={(e) => handleCapacidadeChange('capacidadeMax', e.target.value)}
                className="range-input max-thumb"
              />
            </div>
          </div>

          {/* Filtro de Quartos */}
          <div className="filter-section">
            <div className="section-header">
              <h3 className="filter-title">Quantidade de Quartos</h3>
              <span className="value-display">{filtros.quartosMin} - {filtros.quartosMax} quartos</span>
            </div>
            <div className="range-container">
              <div className="range-track">
                <div
                  className="range-progress"
                  style={{
                    left: `${((filtros.quartosMin - 1) / 9) * 100}%`,
                    width: `${((filtros.quartosMax - filtros.quartosMin) / 9) * 100}%`
                  }}
                />
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={filtros.quartosMin}
                onChange={(e) => handleQuartosChange('quartosMin', e.target.value)}
                className="range-input min-thumb"
              />
              <input
                type="range"
                min="1"
                max="10"
                value={filtros.quartosMax}
                onChange={(e) => handleQuartosChange('quartosMax', e.target.value)}
                className="range-input max-thumb"
              />
            </div>
          </div>

          {/* Filtro de Localização */}
          <div className="filter-section">
            <h3 className="filter-title">Localização</h3>
            <div className="input-with-icon">
              <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 11.5C13.3807 11.5 14.5 10.3807 14.5 9C14.5 7.61929 13.3807 6.5 12 6.5C10.6193 6.5 9.5 7.61929 9.5 9C9.5 10.3807 10.6193 11.5 12 11.5Z" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <input
                type="text"
                placeholder="Digite a cidade ou bairro..."
                value={filtros.localizacao || ''}
                onChange={(e) => handleInputChange('localizacao', e.target.value)}
                className="location-input"
              />
            </div>
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
                  <span className="custom-checkbox">
                    <svg className="check-icon" width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
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
            <div className="select-wrapper">
              <svg className="select-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
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
        </div>

        {/* Footer do Modal */}
        <div className="modal-footer">
          <button className="btn btn-reset" onClick={handleReset}>
            <svg className="btn-icon" width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M14 22C14 22 21 15 21 8C21 6.93913 20.5786 5.92172 19.8284 5.17157C19.0783 4.42143 18.0609 4 17 4C16.3259 4 15.6822 4.16875 15.1167 4.46907M10 2C10 2 3 9 3 16C3 17.0609 3.42143 18.0783 4.17157 18.8284C4.92172 19.5786 5.93913 20 7 20C7.67407 20 8.31783 19.8312 8.88327 19.5309" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M17 4L14 7L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7 20L10 17L7 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Limpar Tudo
          </button>
          <button className="btn btn-apply" onClick={handleApply}>
            <svg className="btn-icon" width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Aplicar Filtros
          </button>
        </div>
      </div>
    </div>
  );
};

export default FiltrosModal;