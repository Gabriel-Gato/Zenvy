import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Cadastro.css';

const Cadastro = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    senha: '',
    confirmarSenha: '',
    politicaPrivacidade: false,
    termosUsuario: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validações básicas
    if (formData.senha !== formData.confirmarSenha) {
      alert('As senhas não coincidem!');
      return;
    }

    if (!formData.politicaPrivacidade || !formData.termosUsuario) {
      alert('Você deve aceitar os termos e políticas!');
      return;
    }

    console.log('Dados do cadastro:', formData);
    // Aqui você adicionaria a lógica de cadastro
  };

  return (
    <div className="cadastro-page">
      {/* Background */}
      <div className="cadastro-background">
        <div className="background-overlay"></div>
      </div>

      {/* Container do formulário */}
      <div className="cadastro-container">
        <div className="cadastro-card">
          <h1 className="cadastro-title">Cadastro</h1>

          <form className="cadastro-form" onSubmit={handleSubmit}>
            <div className="form-row">
              {/* Coluna Esquerda */}
              <div className="form-column">
                {/* Email */}
                <div className="form-group">
                  <label htmlFor="email" className="form-label">Email</label>
                  <div className="input-container">
                    <div className="input-icon">
                      <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 6H26C27.1 6 28 6.9 28 8V22C28 23.1 27.1 24 26 24H4C2.9 24 2 23.1 2 22V8C2 6.9 2.9 6 4 6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M28 8L15 16L2 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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

                {/* Senha */}
                <div className="form-group">
                  <label htmlFor="senha" className="form-label">Senha</label>
                  <div className="input-container">
                    <div className="input-icon">
                      <svg width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 10V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 14V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M19 22H5C3.89543 22 3 21.1046 3 20V12C3 10.8954 3.89543 10 5 10H19C20.1046 10 21 10.8954 21 12V20C21 21.1046 20.1046 22 19 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <input
                      type="password"
                      id="senha"
                      name="senha"
                      value={formData.senha}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Sua senha"
                      required
                    />
                  </div>
                  <div className="input-line"></div>
                </div>

                {/* Telefone */}
                <div className="form-group">
                  <label htmlFor="telefone" className="form-label">Telefone</label>
                  <div className="input-container">
                    <div className="input-icon">
                      <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 5H25C26.1046 5 27 5.89543 27 7V28C27 29.1046 26.1046 30 25 30H10C8.89543 30 8 29.1046 8 28V7C8 5.89543 8.89543 5 10 5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M17 25H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M8 21H27" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <input
                      type="tel"
                      id="telefone"
                      name="telefone"
                      value={formData.telefone}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Seu telefone"
                      required
                    />
                  </div>
                  <div className="input-line"></div>
                </div>
              </div>

              {/* Coluna Direita */}
              <div className="form-column">
                {/* Nome */}
                <div className="form-group">
                  <label htmlFor="nome" className="form-label">Nome</label>
                  <div className="input-container">
                    <div className="input-icon">
                      <svg width="39" height="39" viewBox="0 0 39 39" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M32.5 34.125V30.875C32.5 29.4087 31.9205 28.002 30.8876 26.9691C29.8547 25.9362 28.448 25.3566 26.9817 25.3566H12.0183C10.552 25.3566 9.14532 25.9362 8.11242 26.9691C7.07952 28.002 6.5 29.4087 6.5 30.875V34.125" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M19.5 17.875C22.9518 17.875 25.75 15.0768 25.75 11.625C25.75 8.17325 22.9518 5.375 19.5 5.375C16.0482 5.375 13.25 8.17325 13.25 11.625C13.25 15.0768 16.0482 17.875 19.5 17.875Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="nome"
                      name="nome"
                      value={formData.nome}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Seu nome completo"
                      required
                    />
                  </div>
                  <div className="input-line"></div>
                </div>

                {/* Confirmar Senha */}
                <div className="form-group">
                  <label htmlFor="confirmarSenha" className="form-label">Confirme a senha</label>
                  <div className="input-container">
                    <div className="input-icon">
                      <svg width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 10V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 14V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M19 22H5C3.89543 22 3 21.1046 3 20V12C3 10.8954 3.89543 10 5 10H19C20.1046 10 21 10.8954 21 12V20C21 21.1046 20.1046 22 19 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <input
                      type="password"
                      id="confirmarSenha"
                      name="confirmarSenha"
                      value={formData.confirmarSenha}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Confirme sua senha"
                      required
                    />
                  </div>
                  <div className="input-line"></div>
                </div>
              </div>
            </div>

            {/* Checkboxes de Termos */}
            <div className="terms-row">
              <div className="term-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="politicaPrivacidade"
                    checked={formData.politicaPrivacidade}
                    onChange={handleChange}
                    className="checkbox-input"
                  />
                  <span className="checkmark"></span>
                  <span className="term-text">
                    Concordo com as <span className="term-highlight">Politicas de Privacidade</span>
                  </span>
                </label>
              </div>

              <div className="term-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="termosUsuario"
                    checked={formData.termosUsuario}
                    onChange={handleChange}
                    className="checkbox-input"
                  />
                  <span className="checkmark"></span>
                  <span className="term-text">
                    Concordo com os <span className="term-highlight">Termos de Usuario</span>
                  </span>
                </label>
              </div>
            </div>

            {/* Botão Criar */}
            <button type="submit" className="cadastro-button">
              Criar
            </button>
          </form>

          {/* Link para Login */}
          <div className="login-link">
            <p>
              Já tem uma conta?{' '}
              <Link to="/login" className="login-text">
                Faça Login
              </Link>
            </p>
          </div>

          {/* Link para voltar */}
          <div className="back-link">
            <Link to="/" className="back-text">
              ← Voltar para Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cadastro;