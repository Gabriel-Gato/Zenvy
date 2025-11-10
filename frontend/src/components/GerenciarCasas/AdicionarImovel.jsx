import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdicionarImovel.css';
import ComodidadeModal from './ComodidadeModal';
import { getAccessToken, logout } from '../../services/AuthService/AuthService';

const API_BASE_URL = 'http://localhost:8080/imoveis';

const AdicionarImovel = () => {
    const navigate = useNavigate();

    // Estado inicial ajustado para os nomes do modelo Java
    const [imovelData, setImovelData] = useState({
        nome: '',
        localizacao: '',
        precoPorNoite: '',
        capacidadeHospedes: '',
        quartos: '',
        descricao: '',
        cozinha: 1,
        salaDeEstar: 1,
        imagem: '',
        comodidades: [],
    });

    const [imagensFiles, setImagensFiles] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const newValue = ['precoPorNoite', 'capacidadeHospedes', 'quartos', 'cozinha', 'salaDeEstar']
            .includes(name)
            ? value.replace(/[^0-9.]/g, '')
            : value;
        setImovelData((prev) => ({ ...prev, [name]: newValue }));
    };

    const handleFileChange = (e) => {
        setImagensFiles(Array.from(e.target.files));
    };

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    const handleSaveComodidades = (comodidadesArray) => {
        setImovelData((prev) => ({ ...prev, comodidades: comodidadesArray }));
    };

    const uploadMultiplasImagens = async (imovelId, token) => {
        if (imagensFiles.length === 0) return true;

        let sucesso = true;

        for (const [index, file] of imagensFiles.entries()) {
            setMessage(`Enviando imagem ${index + 1} de ${imagensFiles.length}: ${file.name}...`);

            const formData = new FormData();
            formData.append('file', file);

            try {
                const response = await fetch(`${API_BASE_URL}/uploadImagem/${imovelId}`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` },
                    body: formData,
                });

                if (!response.ok) {
                    console.error(`Falha ao fazer upload da imagem ${index + 1}.`);
                    setMessage((prev) => prev + ` ⚠️ Falha na imagem ${index + 1}.`);
                    sucesso = false;

                    if (response.status === 403 || response.status === 401) {
                        logout();
                        alert("Sua sessão expirou durante o upload. Faça login novamente.");
                        navigate('/login');
                        break;
                    }
                }
            } catch (error) {
                console.error("Erro na requisição de upload:", error);
                setMessage((prev) => prev + ` ⚠️ Erro de rede na imagem ${index + 1}.`);
                sucesso = false;
            }
        }
        return sucesso;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setMessage('');

        const token = getAccessToken();
        if (!token) {
            setMessage("Sessão expirada. Por favor, faça login.");
            logout();
            navigate('/login');
            setSubmitting(false);
            return;
        }

        let novoImovelId = null;

        try {
            setMessage("Cadastrando dados básicos do imóvel...");
            const response = await fetch(`${API_BASE_URL}/cadastrar`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(imovelData),
            });

            if (!response.ok) {
                let errorDetail = { message: "Erro desconhecido ao cadastrar." };

                if (response.status === 403 || response.status === 401) {
                    logout();
                    navigate('/login');
                    errorDetail.message = `Erro ${response.status}: Acesso Negado. Sua sessão expirou ou suas permissões não são suficientes. Redirecionando para login.`;
                } else {
                    try {
                        errorDetail = await response.json();
                    } catch (e) {
                        errorDetail.message = `Erro ${response.status}: Resposta vazia ou não JSON.`;
                    }
                }

                throw new Error(errorDetail.message);
            }

            const novoImovel = await response.json();
            novoImovelId = novoImovel.id;
            setMessage(`✅ Imóvel cadastrado! Iniciando upload das ${imagensFiles.length} imagens...`);

            const uploadOk = await uploadMultiplasImagens(novoImovelId, token);

            if (uploadOk) {
                setMessage(`🎉 Imóvel ${novoImovelId} criado e todas as imagens enviadas com sucesso!`);
            } else {
                setMessage(`⚠️ Imóvel criado, mas houve falhas no upload de algumas imagens.`);
            }

            setTimeout(() => navigate('/anfitriao/gerenciar-casas'), 3000);

        } catch (error) {
            console.error("Erro na submissão:", error);
            setMessage("❌ Erro: " + (error.message || "Ocorreu um erro desconhecido."));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="CriarCasaPage">
            <h1 className="main-title">Criar Novo Imóvel</h1>
            <form onSubmit={handleSubmit}>
                <div className="grid-layout">
                    {/* -------------------- COLUNA ESQUERDA -------------------- */}
                    <div className="coluna-esquerda">
                        <div className="upload-box">
                            <input
                                type="file"
                                id="file-upload"
                                onChange={handleFileChange}
                                accept="image/*"
                                className="hidden-file-input"
                                multiple
                            />
                            <label htmlFor="file-upload" className="upload-label">
                                {imagensFiles.length === 0 ? (
                                    <>
                                        <img
                                            className="IconeUpload"
                                            src="icons8-image-100 1.png"
                                            alt="Adicionar Imagem"
                                        />
                                        <div className="UploadText">Adicionar imagens (Mínimo 1)</div>
                                    </>
                                ) : (
                                    <div className="preview-container">
                                        <div className="preview-text">
                                            {imagensFiles.length} {imagensFiles.length > 1 ? 'imagens selecionadas' : 'imagem selecionada'}
                                        </div>
                                        <div className="thumbnails-grid">
                                            {imagensFiles.slice(0, 4).map((file, index) => (
                                                <img
                                                    key={index}
                                                    src={URL.createObjectURL(file)}
                                                    alt={`Preview ${index + 1}`}
                                                    className="thumbnail"
                                                />
                                            ))}
                                            {imagensFiles.length > 4 && (
                                                <div className="thumbnail thumbnail-overlay">
                                                    +{imagensFiles.length - 4}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </label>
                        </div>

                        <div className="comodidades-left-col">
                            <button
                                type="button"
                                className="btn-comodidades-large"
                                onClick={handleOpenModal}
                            >
                                Comodidades ({imovelData.comodidades.length})
                            </button>
                            {imovelData.comodidades.length > 0 && (
                                <p className="comodidade-count">
                                    {imovelData.comodidades.length} {imovelData.comodidades.length > 1 ? 'selecionadas' : 'selecionada'}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* -------------------- COLUNA DIREITA -------------------- */}
                    <div className="coluna-direita">

                        <label className="field-label" htmlFor="nome">Nome</label>
                        <div className="input-field full-width">
                            <input
                                type="text"
                                name="nome"
                                id="nome"
                                value={imovelData.nome}
                                onChange={handleChange}
                                placeholder="Título do anúncio"
                                required
                            />
                        </div>

                        <div className="row-fields">
                            <div className="field-group">
                                <label className="field-label" htmlFor="precoPorNoite">Preço da Noite (R$)</label>
                                <div className="input-field half-width">
                                    <input
                                        type="text"
                                        name="precoPorNoite"
                                        id="precoPorNoite"
                                        value={imovelData.precoPorNoite}
                                        onChange={handleChange}
                                        placeholder="0.00"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="field-group">
                                <label className="field-label" htmlFor="localizacao">Localização</label>
                                <div className="input-field large-width">
                                    <input
                                        type="text"
                                        name="localizacao"
                                        id="localizacao"
                                        value={imovelData.localizacao}
                                        onChange={handleChange}
                                        placeholder="Cidade, Estado, País"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="row-fields">
                            <div className="field-group">
                                <label className="field-label" htmlFor="capacidadeHospedes">Hóspedes</label>
                                <div className="input-field half-width">
                                    <input
                                        type="number"
                                        name="capacidadeHospedes"
                                        id="capacidadeHospedes"
                                        value={imovelData.capacidadeHospedes}
                                        onChange={handleChange}
                                        placeholder="Máximo"
                                        min="1"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="field-group">
                                <label className="field-label" htmlFor="quartos">Quartos</label>
                                <div className="input-field half-width">
                                    <input
                                        type="number"
                                        name="quartos"
                                        id="quartos"
                                        value={imovelData.quartos}
                                        onChange={handleChange}
                                        placeholder="Nº de Quartos"
                                        min="0"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="row-fields">
                            <div className="field-group">
                                <label className="field-label" htmlFor="cozinha">Cozinhas</label>
                                <div className="input-field half-width">
                                    <input
                                        type="number"
                                        name="cozinha"
                                        id="cozinha"
                                        value={imovelData.cozinha}
                                        onChange={handleChange}
                                        placeholder="Nº de Cozinhas"
                                        min="0"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="field-group">
                                <label className="field-label" htmlFor="salaDeEstar">Salas de estar</label>
                                <div className="input-field half-width">
                                    <input
                                        type="number"
                                        name="salaDeEstar"
                                        id="salaDeEstar"
                                        value={imovelData.salaDeEstar}
                                        onChange={handleChange}
                                        placeholder="Nº de Salas"
                                        min="0"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="descricao-section">
                    <h2 className="descricao-title">Descrição</h2>
                    <div className="input-field descricao-textarea">
                        <textarea
                            name="descricao"
                            value={imovelData.descricao}
                            onChange={handleChange}
                            placeholder="Descreva seu imóvel, comodidades únicas, regras da casa..."
                            rows="10"
                            required
                        />
                    </div>
                </div>

                {message && (
                    <p className={`feedback-message ${message.startsWith('❌') || message.startsWith('⚠️') ? 'error' : 'success'}`}>
                        {message}
                    </p>
                )}

                <button type="submit" className="btn-criar-imovel" disabled={submitting}>
                    {submitting ? 'Processando...' : 'Criar Imóvel'}
                </button>
            </form>

            <ComodidadeModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveComodidades}
                selectedComodidades={imovelData.comodidades}
            />
        </div>
    );
};

export default AdicionarImovel;
