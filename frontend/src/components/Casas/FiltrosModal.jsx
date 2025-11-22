import React, { useState, useEffect, useRef } from 'react';
import './FiltrosModal.css';

const FiltrosModal = ({ isOpen, onClose, onApplyFilters, filtrosIniciais }) => {
    const [filtros, setFiltros] = useState({
        precoMax: 10000,
        comodidades: [],
        ...filtrosIniciais
    });

    const modalRef = useRef();

    const comodidadesOptions = [
        'WIFI','AR_CONDICIONADO','AQUECIMENTO','TV','VENTILADOR',
        'ROUPAS_DE_CAMA','TOALHAS','FERRO_DE_PASSAR','MAQUINA_DE_LAVAR',
        'COZINHA_COMPLETA','GELADEIRA','FOGAO','MICROONDAS','CAFETEIRA',
        'PISCINA','ESTACIONAMENTO','GARAGEM_COBERTA','VARANDA','QUINTAL_JARDIM',
        'CHURRASQUEIRA','PET_FRIENDLY','BERCO','CADEIRA_BEBE','ELEVADOR','BANHEIRO_ACESSIVEL'
    ];

    useEffect(() => {
        const handleEsc = e => e.keyCode === 27 && isOpen && onClose();
        document.addEventListener('keydown', handleEsc);
        return () => document.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    const getPercent = (value, min, max) => ((value - min) / (max - max)) * 100;

    const handleSliderChange = (campo, valor) => {
        setFiltros(prev => ({ ...prev, [campo]: Number(valor) }));
    };

    const handleComodidadeChange = c => {
        setFiltros(prev => ({
            ...prev,
            comodidades: prev.comodidades.includes(c)
                ? prev.comodidades.filter(x => x !== c)
                : [...prev.comodidades, c]
        }));
    };

    const handleApply = () => {
        onApplyFilters(filtros);
        onClose();
    };


    const handleReset = () =>
        setFiltros(prev => ({
            ...prev,
            precoMax: 10000,
            comodidades: []
        }));

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()} ref={modalRef}>

                {/* Header */}
                <div className="modal-header">
                    <h2 className="modal-title">Filtros</h2>
                    <button className="modal-close" onClick={onClose}>X</button>
                </div>

                <div className="modal-body">

                    {/* Preço */}
                    <div className="filter-section">
                        <div className="section-header">
                            <h3 className="filter-title">Preço Máximo</h3>
                            <span className="value-display">R$ {filtros.precoMax}</span>
                        </div>
                        <div className="slider-container">
                            <div className="slider-track" />
                            <div className="slider-range"
                                 style={{ width: `${getPercent(filtros.precoMax, 0, 10000)}%` }} />
                            <input type="range"
                                   min="0"
                                   max="10000"
                                   step="100"
                                   value={filtros.precoMax}
                                   onChange={e => handleSliderChange('precoMax', e.target.value)} />
                        </div>
                    </div>

                    {/* Comodidades */}
                    <div className="filter-section">
                        <h3 className="filter-title">Comodidades</h3>
                        <div className="comodidades-grid">
                            {comodidadesOptions.map(c => (
                                <label key={c} className="comodidade-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={filtros.comodidades.includes(c)}
                                        onChange={() => handleComodidadeChange(c)}
                                    />
                                    <span className="custom-checkbox">
                                        <svg className="check-icon" width="14" height="14" viewBox="0 0 24 24" fill="none">
                                            <path d="M20 6L9 17L4 12"
                                                  stroke="white"
                                                  strokeWidth="3"
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round" />
                                        </svg>
                                    </span>
                                    <span className="comodidade-label">
                                        {c.split('_').map(w => w[0] + w.slice(1).toLowerCase()).join(' ')}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                </div>

                <div className="modal-footer">
                    <button className="btn btn-reset" onClick={handleReset}>Limpar Tudo</button>
                    <button className="btn btn-apply" onClick={handleApply}>Aplicar Filtros</button>
                </div>

            </div>
        </div>
    );
};

export default FiltrosModal;
