import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '' // Note que o input usa 'password', mas no body usamos 'senha'
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8080/usuarios/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }, // ⭐️ CORRIGIDO: Agora envia JSON
        body: JSON.stringify({ // ⭐️ CORRIGIDO: Converte o objeto para string JSON
          email: formData.email,
          senha: formData.password // O backend Spring espera a chave 'senha'
        })
      });

      if (!response.ok) {
          // Lança o erro para ser pego no catch
          throw new Error('Email ou senha incorretos. Verifique suas credenciais.');
      }

      const data = await response.json();

      // Salva token e usuário no localStorage
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('usuario', JSON.stringify(data.usuario));

      alert('Login realizado com sucesso!');

      // Redireciona baseado na role
      if (data.usuario.role === 'HOSPEDE') {
        navigate('/userProfile');
      } else if (data.usuario.role === 'ANFITRIAO') {
        // Redireciona para a página de gerenciamento do Anfitrião
        navigate('/anfitriao/gerenciar-casas');
      } else {
        navigate('/');
      }

    } catch (error) {
      console.error("Erro durante o login:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------------------------------
  // JSX (Renderização do Formulário)
  // -----------------------------------------------------------
  return (
    <div className="login-page">
      <div className="login-background">
        <div className="background-overlay"></div>
      </div>

      <div className="login-container">
        <div className="login-card">
          <h1 className="login-title">Login</h1>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email</label>
              <div className="input-container">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Seu email"
                  required
                />
              </div>
              <div className="input-line"></div>
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">Senha</label>
              <div className="input-container">
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Sua senha"
                  required
                />
              </div>
              <div className="input-line"></div>
            </div>

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <div className="register-link">
            <p>
              Não tem uma conta?{' '}
              <a href="/cadastro" className="register-text">
                Se Cadastre!
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;