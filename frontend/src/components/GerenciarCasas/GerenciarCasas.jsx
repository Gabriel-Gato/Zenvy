import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './GerenciarCasas.css';


const API_BASE_URL = 'http://localhost:8080/imoveis';


const CasaCard = ({ casa, onEdit, onDelete }) => {
    return (
        <div className="CasaCardContainer">
            <img
                className="CasaImage"
                src={
                    casa.fotos && casa.fotos.length > 0
                        ? casa.fotos[0]
                        : "https://placehold.co/288x288/A3C4D0/FFFFFF"
                }
                alt={casa.nome || "Imóvel sem título"}
            />

            <div className="CasaTitulo">{casa.nome || 'Imóvel sem Título'}</div>
            <div className="CasaPreco">{`R$${casa.precoPorNoite?.toFixed(2) || '0.00'} / Noite`}</div>

            <div className="CasaDetails">
                <span className="CasaAvaliacao">{casa.avaliacaoMedia || 'S/A'}</span>
                <img className="IconeEstrela" src="icons8-star-50 1.png" alt="Estrela" />
                <div className="Separador"></div>
                <img className="IconeLocalizacao" src="icons8-location-50 1.png" alt="Localização" />
                <span className="CasaLocalizacao">{casa.localizacao || 'Local Desconhecido'}</span>
            </div>

            <div className="CasaActions">
                <button onClick={() => onEdit(casa.id)} className="EditButton" title="Editar Imóvel">
                    <img src="icons8-edit-50 1.png" alt="Editar" />
                </button>
                <button onClick={() => onDelete(casa.id)} className="DeleteButton" title="Excluir Imóvel">
                    <img src="icons8-delete-96 9.png" alt="Excluir" />
                </button>
            </div>
        </div>
    );
};



const GerenciarCasas = () => {
    const navigate = useNavigate();
    const [imoveis, setImoveis] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);


    const fetchImoveis = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        const token = localStorage.getItem('accessToken');

        if (!token) {
            setError("Autenticação necessária. Faça login como anfitrião.");
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/listar`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorDetail = await response.text();
                throw new Error(`Erro ${response.status}: Falha ao buscar imóveis. Detalhe: ${errorDetail.substring(0, 100)}...`);
            }

            const data = await response.json();
            setImoveis(data);
        } catch (err) {
            console.error("Falha no Fetch de Imóveis:", err);
            setError(err.message || "Não foi possível carregar a lista de imóveis.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchImoveis();
    }, [fetchImoveis]);

    // --- Handlers de Ação ---

    const handleAdicionarImovel = () => {
        navigate('/adicionarImovel');
    };

    const handleEdit = (id) => {
        navigate(`/editarImovel/${id}`);
    };

    const handleDelete = async (id) => {
        if (!window.confirm(`Tem certeza que deseja EXCLUIR permanentemente o imóvel ID ${id}?`)) {
            return;
        }

        const token = localStorage.getItem('accessToken');
        if (!token) {
            alert("Sessão expirada ou não autenticada.");
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/deletar/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.status !== 204) {
                const errorDetail = await response.text();
                throw new Error(`Falha ao excluir. Status: ${response.status}. Detalhe: ${errorDetail.substring(0, 100)}...`);
            }

            setImoveis(imoveis.filter(imovel => imovel.id !== id));
            alert(`Imóvel ID ${id} excluído com sucesso!`);
        } catch (err) {
            console.error("Erro ao deletar:", err);
            alert(err.message || "Erro ao tentar excluir o imóvel.");
        }
    };


    if (isLoading) {
        return (
            <div className="GerenciarCasasPage loading-state">
                <p>Carregando imóveis...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="GerenciarCasasPage error-state">
                <p className="error-message">Erro ao carregar imóveis: {error}</p>
                <button onClick={fetchImoveis} className="btn-retry">Tentar Novamente</button>
            </div>
        );
    }

    return (
        <div className="GerenciarCasasPage">

            <div className="header-admin">
                <img
                    className="Logo"
                    src="icons8-chalé-100 1.png"
                    alt="Zenvy Logo"
                    style={{ cursor: 'pointer' }}
                    onClick={() => navigate('/adminPanel')}
                />
                <h2>Gerenciar Seus Imóveis</h2>
            </div>


            <hr className="divider" />

            <div className="CasasGrid">

                {/* Card para Adicionar Novo Imóvel*/}
                <div
                    onClick={handleAdicionarImovel}
                    className="AddCasaCard"
                    title="Clique para cadastrar um novo imóvel"
                >
                    {/* Ícone de Adição */}
                    <svg
                        className="AddCasaIconSvg"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M12 4V20M4 12H20"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>

                    <div className="AddCasaText">
                        Adicionar novo imóvel
                    </div>
                </div>

                {/* Listagem dos Imóveis */}
                {imoveis.length > 0 ? (
                    imoveis.map(imovel => (
                        <CasaCard
                            key={imovel.id}
                            casa={imovel}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))
                ) : (
                    <p className="no-casas">Você ainda não possui imóveis cadastrados.</p>
                )}
            </div>
        </div>
    );
};

export default GerenciarCasas;