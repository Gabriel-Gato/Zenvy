import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ComodidadeModal from './ComodidadeModal';
import { getAccessToken, logout } from '../../services/AuthService/AuthService';
import './AdicionarImovel.css'; // mantém mesmo CSS

const API_BASE_URL = 'http://localhost:8080/imoveis';
const BASE_IMAGE_URL = 'http://localhost:8080/uploads/imagemImoveis/';

const EditarImovel = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [imovelData, setImovelData] = useState({
        nome: '',
        localizacao: '',
        precoPorNoite: '',
        capacidadeHospedes: '',
        quartos: '',
        descricao: '',
        cozinha: 1,
        salaDeEstar: 1,
        comodidades: [],
    });

    const [imagensExistentes, setImagensExistentes] = useState([]);
    const [novasImagens, setNovasImagens] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);


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
                    precoPorNoite: data.precoPorNoite || '',
                    capacidadeHospedes: data.capacidadeHospedes || '',
                    quartos: data.quartos || '',
                    descricao: data.descricao || '',
                    cozinha: data.cozinha || 1,
                    salaDeEstar: data.salaDeEstar || 1,
                    comodidades: data.comodidades || [],
                });

                setImagensExistentes(fotos);
            } catch (err) {
                console.error(err);
                setMessage('❌ Erro ao carregar imóvel.');
            }
        };

        fetchImovel();
    }, [id, navigate]);

    const handleChange = e => {
        const { name, value } = e.target;
        const newValue = ['precoPorNoite', 'capacidadeHospedes', 'quartos', 'cozinha', 'salaDeEstar']
            .includes(name)
            ? value.replace(/[^0-9.]/g, '')
            : value;
        setImovelData(prev => ({ ...prev, [name]: newValue }));
    };

    const handleFileChange = e => {
        let filesArray = Array.from(e.target.files);

        if (filesArray.length > 8) {
            alert("Você só pode selecionar até 8 imagens.");
            filesArray = filesArray.slice(0, 8);
        }

        setNovasImagens(filesArray);
    };

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);
    const handleSaveComodidades = array => setImovelData(prev => ({ ...prev, comodidades: array }));

    const uploadNovasImagens = async (imovelId, token) => {
        if (novasImagens.length === 0) return true;

        let sucesso = true;

        for (const [index, file] of novasImagens.entries()) {
            setMessage(`Enviando imagem ${index + 1} de ${novasImagens.length}: ${file.name}...`);
            const formData = new FormData();
            formData.append('file', file);

            try {
                const response = await fetch(`${API_BASE_URL}/uploadImagem/${imovelId}`, {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${token}` },
                    body: formData,
                });

                if (!response.ok) {
                    setMessage(prev => prev + ` ⚠️ Falha na imagem ${index + 1}`);
                    sucesso = false;
                }
            } catch (err) {
                console.error(err);
                setMessage(prev => prev + ` ⚠️ Erro de rede na imagem ${index + 1}`);
                sucesso = false;
            }
        }

        return sucesso;
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setSubmitting(true);
        setMessage('');

        const token = getAccessToken();
        if (!token) {
            logout();
            navigate('/login');
            return;
        }

        try {
            setMessage('Atualizando dados do imóvel...');
            const response = await fetch(`${API_BASE_URL}/atualizar/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(imovelData),
            });

            if (!response.ok) throw new Error(`Erro ${response.status} ao atualizar.`);

            const updated = await response.json();
            setMessage('✅ Dados atualizados! Iniciando upload de novas imagens...');

            const uploadOk = await uploadNovasImagens(updated.id, token);
            if (uploadOk) setMessage('🎉 Imóvel atualizado e todas as imagens enviadas!');
            else setMessage('⚠️ Imóvel atualizado, mas algumas imagens falharam.');

            setTimeout(() => navigate('/gerenciarCasas'), 3000);
        } catch (err) {
            console.error(err);
            setMessage('❌ Erro ao atualizar imóvel.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="CriarCasaPage">
            <h1 className="main-title">Editar Imóvel</h1>
            <form onSubmit={handleSubmit}>
                <div className="grid-layout">
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
                                {novasImagens.length === 0 ? (
                                    imagensExistentes.length === 0 ? (
                                        <>
                                            <img className="IconeUpload" src="icons8-image-100 1.png" alt="Adicionar Imagem" />
                                            <div className="UploadText">Nenhuma imagem carregada</div>
                                        </>
                                    ) : (
                                        <div className="preview-container">
                                            {imagensExistentes.slice(0, 8).map((foto, i) => (
                                                <img key={i} src={foto} alt={`Imagem ${i + 1}`} className="thumbnail" />
                                            ))}
                                            {imagensExistentes.length > 8 && (
                                                <div className="thumbnail thumbnail-overlay">
                                                    +{imagensExistentes.length - 8}
                                                </div>
                                            )}
                                        </div>
                                    )
                                ) : (
                                    <div className="preview-container">
                                        {novasImagens.slice(0, 8).map((file, i) => (
                                            <img key={i} src={URL.createObjectURL(file)} alt={`Nova ${i + 1}`} className="thumbnail" />
                                        ))}
                                        {novasImagens.length > 8 && (
                                            <div className="thumbnail thumbnail-overlay">
                                                +{novasImagens.length - 8}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </label>
                        </div>

                        <div className="comodidades-left-col">
                            <button type="button" className="btn-comodidades-large" onClick={handleOpenModal}>
                                Comodidades ({imovelData.comodidades.length})
                            </button>
                            {imovelData.comodidades.length > 0 && (
                                <p className="comodidade-count">
                                    {imovelData.comodidades.length} {imovelData.comodidades.length > 1 ? 'selecionadas' : 'selecionada'}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="coluna-direita">
                        <label className="field-label" htmlFor="nome">Nome</label>
                        <div className="input-field full-width">
                            <input type="text" name="nome" value={imovelData.nome} onChange={handleChange} placeholder="Título do anúncio" required />
                        </div>

                        <div className="row-fields">
                            <div className="field-group">
                                <label className="field-label" htmlFor="precoPorNoite">Preço da Noite</label>
                                <div className="input-field half-width">
                                    <input type="text" name="precoPorNoite" value={imovelData.precoPorNoite} onChange={handleChange} placeholder="0.00" required />
                                </div>
                            </div>

                            <div className="field-group">
                                <label className="field-label" htmlFor="localizacao">Localização</label>
                                <div className="input-field large-width">
                                    <input type="text" name="localizacao" value={imovelData.localizacao} onChange={handleChange} placeholder="Cidade, Estado, País" required />
                                </div>
                            </div>
                        </div>

                        <div className="row-fields">
                            <div className="field-group">
                                <label className="field-label" htmlFor="capacidadeHospedes">Hóspedes</label>
                                <div className="input-field half-width">
                                    <input type="number" name="capacidadeHospedes" value={imovelData.capacidadeHospedes} onChange={handleChange} placeholder="Máximo" min="1" required />
                                </div>
                            </div>

                            <div className="field-group">
                                <label className="field-label" htmlFor="quartos">Quartos</label>
                                <div className="input-field half-width">
                                    <input type="number" name="quartos" value={imovelData.quartos} onChange={handleChange} placeholder="Nº de Quartos" min="0" required />
                                </div>
                            </div>
                        </div>

                        <div className="row-fields">
                            <div className="field-group">
                                <label className="field-label" htmlFor="cozinha">Cozinhas</label>
                                <div className="input-field half-width">
                                    <input type="number" name="cozinha" value={imovelData.cozinha} onChange={handleChange} placeholder="Nº de Cozinhas" min="0" required />
                                </div>
                            </div>

                            <div className="field-group">
                                <label className="field-label" htmlFor="salaDeEstar">Salas de estar</label>
                                <div className="input-field half-width">
                                    <input type="number" name="salaDeEstar" value={imovelData.salaDeEstar} onChange={handleChange} placeholder="Nº de Salas" min="0" required />
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
                    {submitting ? 'Processando...' : 'Salvar Alterações'}
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

export default EditarImovel;
