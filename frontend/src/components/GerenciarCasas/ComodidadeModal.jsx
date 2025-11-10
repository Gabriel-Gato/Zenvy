// ComodidadeModal.js

import React, { useState, useEffect } from 'react';
import './ComodidadeModal.css';

// Mapeamento do Enum Comodidade de Java para JavaScript
// Usaremos apenas o nome, a lógica de ícone pode ser adicionada depois
const COMODIDADES_OPCOES = [
    { value: "WIFI", nome: "Wi-Fi" },
    { value: "AR_CONDICIONADO", nome: "Ar-condicionado" },
    { value: "AQUECIMENTO", nome: "Aquecimento" },
    { value: "TV", nome: "TV" },
    { value: "VENTILADOR", nome: "Ventilador" },
    { value: "ROUPAS_DE_CAMA", nome: "Roupas de cama" },
    { value: "TOALHAS", nome: "Toalhas" },
    { value: "FERRO_DE_PASSAR", nome: "Ferro de passar" },
    { value: "MAQUINA_DE_LAVAR", nome: "Máquina de lavar" },
    { value: "COZINHA_COMPLETA", nome: "Cozinha completa" },
    { value: "GELADEIRA", nome: "Geladeira" },
    { value: "FOGAO", nome: "Fogão" },
    { value: "MICROONDAS", nome: "Micro-ondas" },
    { value: "CAFETEIRA", nome: "Cafeteira" },
    { value: "PISCINA", nome: "Piscina" },
    { value: "ESTACIONAMENTO", nome: "Estacionamento" },
    { value: "GARAGEM_COBERTA", nome: "Garagem coberta" },
    { value: "VARANDA", nome: "Varanda" },
    { value: "QUINTAL_JARDIM", nome: "Quintal / Jardim" },
    { value: "CHURRASQUEIRA", nome: "Churrasqueira" },
    { value: "PET_FRIENDLY", nome: "Pet friendly" },
    { value: "BERCO", nome: "Berço" },
    { value: "CADEIRA_BEBE", nome: "Cadeira de bebê" },
    { value: "ELEVADOR", nome: "Elevador" },
    { value: "BANHEIRO_ACESSIVEL", nome: "Banheiro acessível" },
];

const ComodidadeModal = ({ isOpen, onClose, onSave, selectedComodidades }) => {
    // Estado temporário para as comodidades dentro do modal
    const [tempSelected, setTempSelected] = useState(new Set(selectedComodidades));

    useEffect(() => {
        // Atualiza o estado temporário ao abrir o modal
        setTempSelected(new Set(selectedComodidades));
    }, [selectedComodidades]);

    if (!isOpen) return null;

    const handleCheckboxChange = (value) => {
        setTempSelected(prev => {
            const newSet = new Set(prev);
            if (newSet.has(value)) {
                newSet.delete(value);
            } else {
                newSet.add(value);
            }
            return newSet;
        });
    };

    const handleSave = () => {
        onSave(Array.from(tempSelected));
        onClose();
    };

    // Função para agrupar em colunas (melhora a visualização)
    const renderComodidades = () => {
        const numColumns = 3;
        const columns = Array.from({ length: numColumns }, () => []);

        COMODIDADES_OPCOES.forEach((comodidade, index) => {
            columns[index % numColumns].push(comodidade);
        });

        return columns.map((column, colIndex) => (
            <div key={colIndex} className="modal-column">
                {column.map((comodidade) => (
                    <div key={comodidade.value} className="comodidade-item">
                        <label>
                            <input
                                type="checkbox"
                                value={comodidade.value}
                                checked={tempSelected.has(comodidade.value)}
                                onChange={() => handleCheckboxChange(comodidade.value)}
                            />
                            {comodidade.nome}
                        </label>
                    </div>
                ))}
            </div>
        ));
    };


    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="comodidade-modal-content" onClick={e => e.stopPropagation()}>
                <h2>Selecione as Comodidades</h2>
                <div className="comodidade-grid">
                    {renderComodidades()}
                </div>
                <div className="modal-actions">
                    <button type="button" onClick={onClose} className="btn-cancel">Cancelar</button>
                    <button type="button" onClick={handleSave} className="btn-save">Salvar Comodidades</button>
                </div>
            </div>
        </div>
    );
};

export default ComodidadeModal;