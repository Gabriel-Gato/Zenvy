import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          senha: formData.password
        })
      });

      if (!response.ok) {

          throw new Error('Email ou senha incorretos. Verifique suas credenciais.');
      }

      const data = await response.json();


      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('usuario', JSON.stringify(data.usuario));

      alert('Login realizado com sucesso!');


      if (data.usuario.role === 'ROLE_HOSPEDE') {
        navigate('/userProfile');
      } else if (data.usuario.role === 'ANFITRIAO') {

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