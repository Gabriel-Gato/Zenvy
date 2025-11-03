import React, { useState } from 'react';
import './LandingPage.css';

const LandingPage = () => {
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

  // Imagens para o carrossel - 878x700
  const galleryImages = [
    "Rectangle 8.png",
    "Rectangle 9.png",
    "Rectangle 10.png",
    "https://placehold.co/878x700/00AAFF/white?text=Quarto+Suite",
    "https://placehold.co/878x700/00AAFF/white?text=Area+Externa"
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeFaq, setActiveFaq] = useState(null);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === galleryImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? galleryImages.length - 1 : prevIndex - 1
    );
  };

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="landing-page">
      {/* Header/Navigation */}
      <header className="header">
        <nav className="nav">
          <div className="nav-logo">
            <img
              src="icons8-chalé-100 1.png"
              alt="Zenvy Logo"
              className="logo-image"
            />
          </div>
          <div className="nav-links">
            <a href="#home" className="nav-link">Home</a>
            <a href="#casas" className="nav-link">Casas</a>
            <a href="#contato" className="nav-link">Contato</a>
          </div>
          <div className="nav-buttons">
            <button className="btn-login">Login</button>
            <button className="btn-cadastrar">Cadastra-se</button>
          </div>
        </nav>
      </header>

      {/* Hero Section - Texto à ESQUERDA */}
      <section className="hero" id="home">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-text-container">
            <h1 className="hero-title">
              Faça sua melhor<br />
              Estadia em uma<br />
              das nossas<br />
              Residencias
            </h1>
            <button className="btn-reserva">Reserve já</button>
          </div>
        </div>
      </section>

      {/* About Section */}
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
            <p>
              <strong>Olá! Sou a Camila</strong>, anfitriã apaixonada por receber pessoas de todos os cantos e tornar cada estadia uma experiência inesquecível. Amo viajar, conhecer novas culturas e acredito que a hospitalidade é uma forma de carinho.
            </p>
            <p>
              Meu espaço foi preparado com muito cuidado e atenção aos detalhes - quero que você se sinta à vontade, como se estivesse na sua própria casa. Gosto de pensar que cada hóspede leva um pedacinho das boas energias que já passaram por aqui.
            </p>
            <p>
              Quando não estou recebendo hóspedes, estou explorando novos destinos, tomando um café ao pôr do sol ou buscando ideias para deixar meu cantinho ainda mais acolhedor.
            </p>
            <p className="welcome-message">
              <strong>Seja bem-vindo(a)! 💛</strong>
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
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

      {/* Gallery Section - AGORA COM CARROSSEL */}
      <section className="gallery" id="galeria">
        <h2 className="section-title">
          <span className="title-highlight">Galeria</span>
        </h2>
        <div className="carousel-container">
          <div className="carousel">
            <button className="carousel-btn carousel-btn-prev" onClick={prevImage}>
              ‹
            </button>

            <div className="carousel-image-container">
              <img
                src={galleryImages[currentImageIndex]}
                alt={`Espaço ${currentImageIndex + 1}`}
                className="carousel-image"
              />
            </div>

            <button className="carousel-btn carousel-btn-next" onClick={nextImage}>
              ›
            </button>
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
      </section>

      {/* FAQ Section - AGORA INTERATIVO */}
      <section className="faq" id="faq">
        <h2 className="section-title">
          <span className="title-highlight">FAQ</span>
        </h2>
        <div className="faq-list">
          {faqQuestions.map((item, index) => (
            <div key={index} className="faq-item">
              <div
                className="faq-question"
                onClick={() => toggleFaq(index)}
              >
                <span>{item.question}</span>
                <button className={`faq-toggle ${activeFaq === index ? 'active' : ''}`}>
                  ▼
                </button>
              </div>
              {activeFaq === index && (
                <div className="faq-answer">
                  <p>{item.answer}</p>
                </div>
              )}
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
              <div className="contact-item">
                <span className="contact-icon">📧</span>
                <span>camila.silva@email.com</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📱</span>
                <span>(11) 98765-4321</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📞</span>
                <span>(11) 3234-5678</span>
              </div>
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
          <p>&copy; 2024 Zenvy. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;