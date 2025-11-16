import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserProfile.css';

const UserProfile = () => {
    const navigate = useNavigate();
  const [userData, setUserData] = useState({
    nome: '',
    telefone: '',
    email: '',
    fotoPerfil: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarUsuario();
  }, []);

  const carregarUsuario = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('Faça login novamente.');
      window.location.href = '/login';
      return;
    }

    try {
      const res = await fetch('http://localhost:8080/usuarios/me', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!res.ok) throw new Error('Erro ao carregar dados do usuário');
      const data = await res.json();

      const fotoUrl = data.fotoPerfil
        ? `http://localhost:8080/uploads/fotosUsuarios/${data.fotoPerfil}`
        : '';

      setUserData({ ...data, fotoPerfil: fotoUrl });
      setLoading(false);
    } catch (error) {
      console.error(error);
      alert('Erro ao carregar perfil. Faça login novamente.');
      localStorage.clear();
      window.location.href = '/login';
    }
  };

  const handleInputChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSaveChanges = async () => {
    const token = localStorage.getItem('accessToken');
    try {
      const res = await fetch('http://localhost:8080/usuarios/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          nome: userData.nome,
          telefone: userData.telefone,
          email: userData.email
        })
      });
      if (!res.ok) throw new Error('Erro ao salvar alterações');
      const updatedUser = await res.json();
      const fotoUrl = updatedUser.fotoPerfil
        ? `http://localhost:8080/uploads/fotosUsuarios/${updatedUser.fotoPerfil}`
        : '';
      setUserData({ ...updatedUser, fotoPerfil: fotoUrl });
      alert('Alterações salvas com sucesso!');
    } catch (error) {
      console.error(error);
      alert('Erro ao salvar alterações.');
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Selecione apenas imagens.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('A imagem deve ter no máximo 5MB.');
      return;
    }

    const token = localStorage.getItem('accessToken');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('http://localhost:8080/usuarios/me/foto', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      if (!res.ok) throw new Error('Erro ao fazer upload da foto');

      const updatedUser = await res.json();
      const fotoUrl = updatedUser.fotoPerfil
        ? `http://localhost:8080/uploads/fotosUsuarios/${updatedUser.fotoPerfil}`
        : '';
      setUserData({ ...updatedUser, fotoPerfil: fotoUrl });
      alert('Foto atualizada com sucesso!');
    } catch (error) {
      console.error(error);
      alert('Erro ao fazer upload da foto.');
    }
  };

  const handleChangePassword = () => {
    window.location.href = '/alterar-senha';
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Tem certeza que deseja apagar sua conta?')) return;

    const token = localStorage.getItem('accessToken');
    try {
      const res = await fetch('http://localhost:8080/usuarios/me', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Erro ao apagar conta');
      alert('Conta apagada com sucesso!');
      localStorage.clear();
      window.location.href = '/';
    } catch (error) {
      console.error(error);
      alert('Erro ao apagar conta.');
    }
  };

  const handleStatusEstadia = () => {
      navigate('/statusEstadia');
  };

  if (loading) return <div className="user-profile">Carregando...</div>;

  return (
    <div className="user-profile">
      {/* Botão Voltar */}
      <button className="back-button" onClick={() => window.location.href = '/'}>
        Voltar
      </button>

      {/* Foto de perfil */}
      <label htmlFor="avatarInput" className="profile-picture-label">
        <div className="profile-picture">
          {userData.fotoPerfil ? (
            <img src={userData.fotoPerfil} alt="Foto" className="profile-image" />
          ) : (
            <div className="ellipse-background"></div>
          )}
        </div>
      </label>
      <input
        type="file"
        id="avatarInput"
        accept="image/*"
        onChange={handleAvatarChange}
        style={{ display: 'none' }}
      />

      <button className="stay-status-btn" onClick={handleStatusEstadia}>
        Status Estadia
      </button>

      <button className="change-password-btn" onClick={handleChangePassword}>
        Alterar Senha
      </button>

      <div className="user-info-section">
        <div className="input-group">
          <label className="input-label">Nome</label>
          <input
            type="text"
            name="nome"
            value={userData.nome}
            onChange={handleInputChange}
            className="user-input"
          />
          <div className="input-line"></div>
        </div>

        <div className="input-group">
          <label className="input-label">Telefone</label>
          <input
            type="tel"
            name="telefone"
            value={userData.telefone}
            onChange={handleInputChange}
            className="user-input"
          />
          <div className="input-line"></div>
        </div>

        <div className="input-group">
          <label className="input-label">Email</label>
          <input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleInputChange}
            className="user-input"
          />
          <div className="input-line"></div>
        </div>
      </div>

      <div className="action-buttons-container">
        <button className="action-button delete-account-btn" onClick={handleDeleteAccount}>
          Apagar Conta
        </button>
        <button className="action-button save-changes-btn" onClick={handleSaveChanges}>
          Salvar Alterações
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
