import React, { useState, useEffect } from 'react';
import './GerenciarCredencial.css';

const GerenciarCredencial = () => {
    const [userData, setUserData] = useState({ nome: '', telefone: '', email: '', fotoPerfil: '' });
    const [loading, setLoading] = useState(true);


    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        carregarUsuario();
    }, []);

    const carregarUsuario = async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) return window.location.href = '/login';

        try {
            const res = await fetch('http://localhost:8080/usuarios/me', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Erro ao carregar dados do usuário');
            const data = await res.json();
            const fotoUrl = data.fotoPerfil ? `http://localhost:8080/uploads/fotosUsuarios/${data.fotoPerfil}` : '';
            setUserData({ ...data, fotoPerfil: fotoUrl });
            setLoading(false);
        } catch (error) {
            console.error(error);
            localStorage.clear();
            window.location.href = '/login';
        }
    };

    const handleInputChange = (e) => setUserData({ ...userData, [e.target.name]: e.target.value });

    const handleSaveChanges = async () => {
        const token = localStorage.getItem('accessToken');
        try {
            const res = await fetch('http://localhost:8080/usuarios/me', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ nome: userData.nome, telefone: userData.telefone, email: userData.email })
            });
            if (!res.ok) throw new Error('Erro ao salvar alterações');
            const updatedUser = await res.json();
            const fotoUrl = updatedUser.fotoPerfil ? `http://localhost:8080/uploads/fotosUsuarios/${updatedUser.fotoPerfil}` : '';
            setUserData({ ...updatedUser, fotoPerfil: fotoUrl });
            alert('Alterações salvas com sucesso!');
        } catch (error) {
            console.error(error);
            alert('Erro ao salvar alterações.');
        }
    };

    const handleChangePasswordClick = () => setShowPasswordModal(true);
    const handleCloseModal = () => {
        setShowPasswordModal(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
    };

    const handlePasswordSave = async () => {
        if (newPassword !== confirmPassword) {
            alert('As senhas não coincidem!');
            return;
        }

        const token = localStorage.getItem('accessToken');
        if (!token) {
            alert('Usuário não autenticado!');
            return;
        }

        try {
            const res = await fetch('http://localhost:8080/usuarios/me/senha', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    currentPassword: currentPassword,
                    newPassword: newPassword
                })
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Erro ao alterar senha');
            }

            alert('Senha alterada com sucesso!');
            handleCloseModal();
        } catch (error) {
            console.error(error);
            alert(`Erro ao alterar senha: ${error.message}`);
        }
    };


    const handleFotoChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const token = localStorage.getItem('accessToken');
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('http://localhost:8080/usuarios/me/foto', {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}` },
                body: formData
            });

            if (!res.ok) throw new Error('Erro ao atualizar a foto');

            const updatedUser = await res.json();
            const fotoUrl = updatedUser.fotoPerfil
                ? `http://localhost:8080/uploads/fotosUsuarios/${updatedUser.fotoPerfil}`
                : '';
            setUserData({ ...updatedUser, fotoPerfil: fotoUrl });
            alert('Foto atualizada com sucesso!');
        } catch (error) {
            console.error(error);
            alert('Erro ao atualizar a foto');
        }
    };

    if (loading) return <div>Carregando...</div>;

    return (
        <div className="gcredencial-container">
            {/* Botão Voltar */}
            <div className="gcredencial-back-btn-container">
                <button className="gcredencial-back-btn" onClick={() => window.history.back()}>Voltar</button>
            </div>

            {/* Foto de Perfil */}
            <label htmlFor="avatarInput" className="gcredencial-avatar-label">
                <div className="gcredencial-avatar">
                    {userData.fotoPerfil ?
                        <img src={userData.fotoPerfil} alt="Foto" /> :
                        <div className="gcredencial-avatar-placeholder"></div>
                    }
                </div>
            </label>
            <input
                type="file"
                id="avatarInput"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFotoChange}
            />

            {/* Seção de Informações */}
            <div className="gcredencial-info-section">
                <div className="gcredencial-input-group">
                    <label className="gcredencial-input-label">Nome</label>
                    <input className="gcredencial-input" type="text" name="nome" value={userData.nome} onChange={handleInputChange} />
                    <div className="gcredencial-input-line"></div>
                </div>
                <div className="gcredencial-input-group">
                    <label className="gcredencial-input-label">Telefone</label>
                    <input className="gcredencial-input" type="tel" name="telefone" value={userData.telefone} onChange={handleInputChange} />
                    <div className="gcredencial-input-line"></div>
                </div>
                <div className="gcredencial-input-group">
                    <label className="gcredencial-input-label">Email</label>
                    <input className="gcredencial-input" type="email" name="email" value={userData.email} onChange={handleInputChange} />
                    <div className="gcredencial-input-line"></div>
                </div>
            </div>

            {/* Botões */}
            <div className="gcredencial-buttons">
                <button className="gcredencial-save-btn" onClick={handleSaveChanges}>Salvar Alterações</button>
                <button className="gcredencial-change-pass-btn" onClick={handleChangePasswordClick}>Alterar Senha</button>
            </div>

            {/* Modal Alterar Senha */}
            {showPasswordModal && (
                <div className="gcredencial-modal-overlay">
                    <div className="gcredencial-modal-content">
                        <h2>Alterar Senha</h2>
                        <input type="password" placeholder="Senha atual" className="gcredencial-modal-input" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
                        <input type="password" placeholder="Nova senha" className="gcredencial-modal-input" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                        <input type="password" placeholder="Confirme a nova senha" className="gcredencial-modal-input" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                        <div className="gcredencial-modal-buttons">
                            <button onClick={handleCloseModal}>Cancelar</button>
                            <button onClick={handlePasswordSave}>Salvar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GerenciarCredencial;
