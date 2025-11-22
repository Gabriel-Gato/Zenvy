import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserProfile.css';

const UserProfile = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({ nome: '', telefone: '', email: '', fotoPerfil: '' });
    const [loading, setLoading] = useState(true);

    // Estado do modal de senha
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => { carregarUsuario(); }, []);

    const carregarUsuario = async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) return window.location.href = '/login';

        try {
            const res = await fetch('http://localhost:8080/usuarios/me', {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
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
        } catch (error) { console.error(error); alert('Erro ao salvar alterações.'); }
    };

    const handleChangePasswordClick = () => setShowPasswordModal(true);
    const handleCloseModal = () => {
        setShowPasswordModal(false);
        setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
    };

    const handlePasswordSave = async () => {
        if (newPassword !== confirmPassword) {
            alert('As senhas não coincidem!');
            return;
        }
        const token = localStorage.getItem('accessToken');
        try {
            const res = await fetch('http://localhost:8080/usuarios/me/senha', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ currentPassword, newPassword })
            });
            if (!res.ok) throw new Error('Erro ao alterar senha');
            alert('Senha alterada com sucesso!');
            handleCloseModal();
        } catch (error) { console.error(error); alert('Erro ao alterar senha.'); }
    };

    // Nova função para upload de foto
    const handleFotoChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const token = localStorage.getItem('accessToken');
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('http://localhost:8080/usuarios/me/foto', {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`
                },
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

    if (loading) return <div className="user-profile">Carregando...</div>;

    return (
        <div className="user-profile">
            <button className="back-button" onClick={() => window.location.href = '/'}>Voltar</button>

            <label htmlFor="avatarInput" className="profile-picture-label">
                <div className="profile-picture">
                    {userData.fotoPerfil ?
                        <img src={userData.fotoPerfil} alt="Foto" className="profile-image" /> :
                        <div className="ellipse-background"></div>
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

            <button className="stay-status-btn" onClick={() => navigate('/statusEstadia')}>Status Estadia</button>
            <button className="change-password-btn" onClick={handleChangePasswordClick}>Alterar Senha</button>

            <div className="user-info-section">
                <div className="input-group">
                    <label className="input-label">Nome</label>
                    <input type="text" name="nome" value={userData.nome} onChange={handleInputChange} className="user-input"/>
                    <div className="input-line"></div>
                </div>
                <div className="input-group">
                    <label className="input-label">Telefone</label>
                    <input type="tel" name="telefone" value={userData.telefone} onChange={handleInputChange} className="user-input"/>
                    <div className="input-line"></div>
                </div>
                <div className="input-group">
                    <label className="input-label">Email</label>
                    <input type="email" name="email" value={userData.email} onChange={handleInputChange} className="user-input"/>
                    <div className="input-line"></div>
                </div>
            </div>

            <div className="action-buttons-container">
                <button className="action-button delete-account-btn" onClick={async () => {
                    if (!window.confirm('Tem certeza que deseja apagar sua conta?')) return;
                    const token = localStorage.getItem('accessToken');
                    try { await fetch('http://localhost:8080/usuarios/me', { method:'DELETE', headers:{Authorization:`Bearer ${token}`}}); alert('Conta apagada!'); localStorage.clear(); window.location.href='/'; }
                    catch(e){console.error(e); alert('Erro ao apagar conta');}
                }}>Apagar Conta</button>
                <button className="action-button save-changes-btn" onClick={handleSaveChanges}>Salvar Alterações</button>
            </div>

            {showPasswordModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Alterar Senha</h2>
                        <input type="password" placeholder="Senha atual" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
                        <input type="password" placeholder="Nova senha" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                        <input type="password" placeholder="Confirme a nova senha" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                        <div className="modal-buttons">
                            <button onClick={handlePasswordSave}>Salvar</button>
                            <button onClick={handleCloseModal}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserProfile;
