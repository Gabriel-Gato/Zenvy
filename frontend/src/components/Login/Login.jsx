import React, { useState } from 'react';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Dados do login:', formData);
    // Aqui você adicionaria a lógica de autenticação
  };

  return (
    <div className="login-page">
      {/* Background com overlay */}
      <div className="login-background">
        <div className="background-overlay"></div>
      </div>

      {/* Container do formulário */}
      <div className="login-container">
        <div className="login-card">
          <h1 className="login-title">Login</h1>

          <form className="login-form" onSubmit={handleSubmit}>
            {/* Campo Email */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email</label>
              <div className="input-container">
                <div className="input-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
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

            {/* Campo Senha */}
            <div className="form-group">
              <label htmlFor="password" className="form-label">Senha</label>
              <div className="input-container">
                <div className="input-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 11H5C3.89543 11 3 11.8954 3 13V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V13C21 11.8954 20.1046 11 19 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
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

            {/* Botão Entrar */}
            <button type="submit" className="login-button">
              Entrar
            </button>
          </form>

          {/* Link para cadastro */}
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