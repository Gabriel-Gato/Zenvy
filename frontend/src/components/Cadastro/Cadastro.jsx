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

    const [showSenha, setShowSenha] = useState(false);
    const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);

    const [errors, setErrors] = useState({});

    const validateField = (name, value) => {
        let newErrors = { ...errors };

        switch (name) {
            case 'nome':
                newErrors.nome = value.length < 3 ? 'O nome deve ter pelo menos 3 caracteres' : '';
                break;

            case 'email':
                newErrors.email = !/\S+@\S+\.\S+/.test(value)
                    ? 'Digite um e-mail válido'
                    : '';
                break;

            case 'telefone':
                newErrors.telefone =
                    value.length < 10 ? 'Digite um telefone válido (DDD + número)' : '';
                break;

            case 'senha':
                newErrors.senha =
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#]).{6,}$/.test(value)
                        ? ''
                        : 'A senha deve ter 6+ caracteres, incluindo maiúscula, minúscula, número e caractere especial';
                break;


            case 'confirmarSenha':
                newErrors.confirmarSenha =
                    value !== formData.senha
                        ? 'As senhas não coincidem'
                        : '';
                break;


            default:
                break;
        }

        setErrors(newErrors);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });

        validateField(name, type === 'checkbox' ? checked : value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();


        for (let key in errors) {
            if (errors[key]) {
                alert('Corrija os erros antes de continuar.');
                return;
            }
        }

        if (!formData.politicaPrivacidade || !formData.termosUsuario) {
            alert('Você deve aceitar os termos e políticas!');
            return;
        }

        const cadastroData = {
            nome: formData.nome,
            email: formData.email,
            telefone: formData.telefone,
            senha: formData.senha,
            fotoPerfil: null
        };

        try {
            const response = await fetch('http://localhost:8080/usuarios/cadastrar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(cadastroData)
            });

            if (response.ok) {
                const usuarioCadastrado = await response.json();
                alert('Cadastro realizado com sucesso! Bem-vindo(a), ' + usuarioCadastrado.nome);
                window.location.href = '/login';
            } else {
                const errorData = await response.json();
                alert('Erro ao cadastrar: ' + (errorData.message || 'Verifique os dados e tente novamente.'));
            }
        } catch (error) {
            console.error('Erro no cadastro:', error);
            alert('Erro no cadastro. Tente novamente mais tarde.');
        }
    };

    return (
        <div className="cadastro-page">
            <div className="cadastro-background">
                <div className="background-overlay"></div>
            </div>

            <div className="cadastro-container">
                <div className="cadastro-card">
                    <h1 className="cadastro-title">Cadastro</h1>

                    <form className="cadastro-form" onSubmit={handleSubmit}>
                        <div className="form-row">


                            <div className="form-column">

                                {/* Email */}
                                <div className={`form-group ${errors.email ? 'input-error' : 'input-success'}`}>
                                    <label className="form-label">Email</label>
                                    <div className="input-container">
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="form-input"
                                            placeholder="Seu email"
                                            required
                                        />
                                    </div>
                                    <div className="input-line"></div>
                                    {errors.email && <p className="error-message">{errors.email}</p>}
                                </div>

                                {/* Senha */}
                                <div className={`form-group ${errors.senha ? 'input-error' : 'input-success'}`}>
                                    <label className="form-label">Senha</label>
                                    <div className="input-container senha-container">
                                        <input
                                            type={showSenha ? 'text' : 'password'}
                                            name="senha"
                                            value={formData.senha}
                                            onChange={handleChange}
                                            className="form-input"
                                            placeholder="Sua senha"
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="toggle-senha-btn"
                                            onClick={() => setShowSenha(!showSenha)}
                                        >
                                            👁
                                        </button>
                                    </div>
                                    <div className="input-line"></div>
                                    {errors.senha && <p className="error-message">{errors.senha}</p>}
                                </div>

                                {/* Telefone */}
                                <div className={`form-group ${errors.telefone ? 'input-error' : 'input-success'}`}>
                                    <label className="form-label">Telefone</label>
                                    <div className="input-container">
                                        <input
                                            type="tel"
                                            name="telefone"
                                            value={formData.telefone}
                                            onChange={handleChange}
                                            className="form-input"
                                            placeholder="Seu telefone"
                                            required
                                        />
                                    </div>
                                    <div className="input-line"></div>
                                    {errors.telefone && <p className="error-message">{errors.telefone}</p>}
                                </div>

                            </div>


                            <div className="form-column">

                                {/* Nome */}
                                <div className={`form-group ${errors.nome ? 'input-error' : 'input-success'}`}>
                                    <label className="form-label">Nome</label>
                                    <div className="input-container">
                                        <input
                                            type="text"
                                            name="nome"
                                            value={formData.nome}
                                            onChange={handleChange}
                                            className="form-input"
                                            placeholder="Seu nome"
                                            required
                                        />
                                    </div>
                                    <div className="input-line"></div>
                                    {errors.nome && <p className="error-message">{errors.nome}</p>}
                                </div>

                                {/* Confirmar Senha */}
                                <div className={`form-group ${errors.confirmarSenha ? 'input-error' : 'input-success'}`}>
                                    <label className="form-label">Confirmar senha</label>
                                    <div className="input-container senha-container">
                                        <input
                                            type={showConfirmarSenha ? 'text' : 'password'}
                                            name="confirmarSenha"
                                            value={formData.confirmarSenha}
                                            onChange={handleChange}
                                            className="form-input"
                                            placeholder="Confirme sua senha"
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="toggle-senha-btn"
                                            onClick={() => setShowConfirmarSenha(!showConfirmarSenha)}
                                        >
                                            👁
                                        </button>
                                    </div>
                                    <div className="input-line"></div>
                                    {errors.confirmarSenha && <p className="error-message">{errors.confirmarSenha}</p>}
                                </div>

                            </div>
                        </div>

                        {/* CHECKBOXES */}
                        <div className="terms-row">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    name="politicaPrivacidade"
                                    checked={formData.politicaPrivacidade}
                                    onChange={handleChange}
                                    className="checkbox-input"
                                />
                                <span className="checkmark"></span>
                                <span className="term-text">Concordo com as Políticas de Privacidade</span>
                            </label>

                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    name="termosUsuario"
                                    checked={formData.termosUsuario}
                                    onChange={handleChange}
                                    className="checkbox-input"
                                />
                                <span className="checkmark"></span>
                                <span className="term-text">Concordo com os Termos de Usuário</span>
                            </label>
                        </div>

                        <button type="submit" className="cadastro-button">Criar</button>
                    </form>

                    <div className="login-link">
                        <p>
                            Já tem uma conta?{' '}
                            <Link to="/login" className="login-text">
                                Faça Login
                            </Link>
                        </p>
                    </div>

                    <div className="back-link">
                        <Link to="/" className="back-text">← Voltar para Home</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cadastro;
