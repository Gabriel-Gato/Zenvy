import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  const [user, setUser] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeFaq, setActiveFaq] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    carregarUsuario();
    carregarGaleria();
  }, []);

  // Carrega dados do usuário
  const carregarUsuario = () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    fetch('http://localhost:8080/usuarios/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error('Erro ao carregar usuário');
        return res.json();
      })
      .then(data => {
        setUser({
          ...data,
          fotoPerfil: data.fotoPerfil
            ? `http://localhost:8080/uploads/fotosUsuarios/${data.fotoPerfil}`
            : 'https://placehold.co/60x60?text=User',
        });
      })
      .catch(() => localStorage.removeItem('usuario'));
  };

  // Carrega imagens da galeria
  const carregarGaleria = () => {
    fetch('http://localhost:8080/galeria')
      .then(res => {
        if (!res.ok) throw new Error('Erro ao carregar galeria');
        return res.json();
      })
      .then(data => {
        const urls = data.map(img => `http://localhost:8080/uploads/galeria/${img.imagem}`);
        setGalleryImages(urls);
      })
      .catch(err => console.error(err));
  };

  const handleLogout = () => {
    localStorage.removeItem('usuario');
    setUser(null);
    navigate('/');
  };

  const nextImage = () => {
    setCurrentImageIndex(prev => (prev === galleryImages.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setCurrentImageIndex(prev => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  };

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  // FAQ e features
  const faqQuestions = [
    {
      question: "Como faço para reservar a hospedagem?",
      answer: "Você pode reservar diretamente pelo nosso site, escolhendo as datas desejadas e preenchendo o formulário de reserva. Também aceitamos reservas por WhatsApp."
    },
    {
      question: "Qual é o horário de check-in e check-out?",
      answer: "O check-in é a partir das 14h e o check-out até às 12h. Podemos flexibilizar esses horários mediante disponibilidade."
    },
    {
      question: "Posso levar animais de estimação?",
      answer: "Sim! Aceitamos animais de estimação de pequeno e médio porte com uma taxa adicional de limpeza. Pedimos apenas que sigam nossas regras de convivência."
    },
    {
      question: "O imóvel é limpo diariamente?",
      answer: "A limpeza completa é feita antes de cada hospedagem. Durante estadias longas, oferecemos serviço de limpeza semanal mediante solicitação."
    },
    {
      question: "O que devo fazer no check-out?",
      answer: "No check-out, pedimos que deixe as chaves no local combinado, descarte o lixo nos containers apropriados e nos informe qualquer dano ou problema ocorrido durante a estadia."
    }
  ];

  const features = [
    {
      icon: "🛏️",
      title: "Conforto Garantido",
      description: "Cada cantinho foi preparado com carinho para que você se sinta acolhido desde o primeiro momento - roupas de cama macias, ambiente limpo e tudo o que você precisa para relaxar."
    },
    {
      icon: "💬",
      title: "Suporte Dedicado",
      description: "Estou sempre disponível para ajudar no que for preciso, seja com dicas locais, dúvidas ou recomendações de passeios. Sua experiência é minha prioridade!"
    },
    {
      icon: "📍",
      title: "Localização Privilegiada",
      description: "Aqui você vive como um morador local - perto dos melhores pontos da cidade, com toda a tranquilidade e praticidade que sua viagem merece."
    }
  ];

  return (
    <div className="landing-page">
      {/* Header */}
      <header className="header">
        <nav className="nav">
          <div className="nav-logo">
            <img src="icons8-chalé-100 1.png" alt="Zenvy Logo" className="logo-image" />
          </div>

          <div className="nav-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/casas" className="nav-link">Casas</Link>
            <Link to="/contato" className="nav-link">Contato</Link>
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

      {/* Hero */}
      <section className="hero" id="home">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-text-container">
            <h1 className="hero-title">
              Faça sua melhor<br />
              Estadia em uma<br />
              das nossas<br />
              Residências
            </h1>
            <button className="btn-reserva">Reserve já</button>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="about" id="sobre">
        <h2 className="section-title">
          <span className="title-text">Sobre</span>
          <span className="title-highlight"> Mim</span>
        </h2>
        <div className="about-content">
          <div className="about-image">
            <img src="Rectangle 7.png" alt="Camila - Anfitriã" />
          </div>
          <div className="about-text">
            <p><strong>Olá! Sou a Camila</strong>, anfitriã apaixonada por receber pessoas de todos os cantos e tornar cada estadia uma experiência inesquecível. Amo viajar, conhecer novas culturas e acredito que a hospitalidade é uma forma de carinho.</p>
            <p>Meu espaço foi preparado com muito cuidado e atenção aos detalhes - quero que você se sinta à vontade, como se estivesse na sua própria casa. Gosto de pensar que cada hóspede leva um pedacinho das boas energias que já passaram por aqui.</p>
            <p>Quando não estou recebendo hóspedes, estou explorando novos destinos, tomando um café ao pôr do sol ou buscando ideias para deixar meu cantinho ainda mais acolhedor.</p>
            <p className="welcome-message"><strong>Seja bem-vindo(a)! 💛</strong></p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features" id="porque-escolher">
        <h2 className="section-title">
          <span className="title-text">Por que me </span>
          <span className="title-highlight">Escolher?</span>
        </h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Gallery Dinâmica */}
      <section className="gallery" id="galeria">
        <h2 className="section-title"><span className="title-highlight">Galeria</span></h2>
        {galleryImages.length === 0 ? (
          <p>Nenhuma imagem na galeria.</p>
        ) : (
          <div className="carousel-container">
            <div className="carousel">
              <button className="carousel-btn carousel-btn-prev" onClick={prevImage}>‹</button>
              <div className="carousel-image-container">
                <img
                  src={galleryImages[currentImageIndex]}
                  alt={`Espaço ${currentImageIndex + 1}`}
                  className="carousel-image"
                />
              </div>
              <button className="carousel-btn carousel-btn-next" onClick={nextImage}>›</button>
            </div>
            <div className="carousel-indicators">
              {galleryImages.map((_, index) => (
                <button
                  key={index}
                  className={`carousel-indicator ${index === currentImageIndex ? 'active' : ''}`}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* FAQ */}
      <section className="faq" id="faq">
        <h2 className="section-title"><span className="title-highlight">FAQ</span></h2>
        <div className="faq-list">
          {faqQuestions.map((item, index) => (
            <div key={index} className="faq-item">
              <div className="faq-question" onClick={() => toggleFaq(index)}>
                <span>{item.question}</span>
                <button className={`faq-toggle ${activeFaq === index ? 'active' : ''}`}>▼</button>
              </div>
              {activeFaq === index && <div className="faq-answer"><p>{item.answer}</p></div>}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Contato</h3>
            <div className="contact-info">
              <div className="contact-item"><span className="contact-icon">📧</span><span>camila.silva@email.com</span></div>
              <div className="contact-item"><span className="contact-icon">📱</span><span>(11) 98765-4321</span></div>
              <div className="contact-item"><span className="contact-icon">📞</span><span>(11) 3234-5678</span></div>
            </div>
          </div>
          <div className="footer-section">
            <h3>Redes Sociais</h3>
            <div className="social-links">
              <a href="#" className="social-link">LinkedIn</a>
              <a href="#" className="social-link">Twitter</a>
              <a href="#" className="social-link">Instagram</a>
            </div>
          </div>
          <div className="footer-section">
            <h3>Legal</h3>
            <div className="legal-links">
              <a href="#" className="legal-link">Termos de aceite</a>
              <a href="#" className="legal-link">Política de privacidade</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 Zenvy. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
