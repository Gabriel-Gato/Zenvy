import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './NavBar.css';

const NavBar = ({ user, handleLogout }) => {
    const navigate = useNavigate();

    return (
        <header className="header">
            <nav className="nav">
                <div className="nav-logo">
                    <img src="icons8-chalé-100 1.png" alt="Zenvy Logo" className="logo-image" />
                </div>

                <div className="nav-links">
                    <Link to="/" className="nav-link">Home</Link>
                    <Link to="/casas" className="nav-link">Casas</Link>
                    <a href="mailto:camila.silva@gmail.com" className="nav-link">Contato</a>
                </div>

                <div className="nav-buttons">
                    {user ? (
                        <div className="user-info">
                            <img
                                src={user.fotoPerfil}
                                alt="Usuário"
                                className="user-avatar"
                                onClick={() => navigate(user.role === 'ROLE_ANFITRIAO' ? '/adminPanel' : '/userProfile')}
                            />
                            <span className="user-greeting">
                Olá, <span className="user-name">{user.nome}</span>
              </span>
                            <button onClick={handleLogout} className="btn-logout" title="Sair">⏻</button>
                        </div>
                    ) : (
                        <>
                            <Link to="/login" className="btn-login">Login</Link>
                            <Link to="/cadastro" className="btn-cadastrar">Cadastrar-se</Link>
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default NavBar;
