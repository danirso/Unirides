import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function LandPage() {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleDropdownToggle = () => {
    setShowDropdown(!showDropdown);
  };

  const scrollToSection = (id) => {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
  };

  const inputStyle = {
    width: '100%',
    padding: '0.75rem',
    margin: '0.5rem 0',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#f7f9fc',
  };
  
  const textareaStyle = {
    width: '100%',
    padding: '0.75rem',
    margin: '0.5rem 0',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#f7f9fc',
    height: '150px',
  };
  
  const buttonStyle = {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#38b000',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    marginTop: '1rem',
  };
  
 const socialIconStyle = {
  color: '#f7f9fc',
  textDecoration: 'none',
  fontSize: '1.5rem',  
  transition: 'color 0.3s',
};
  
  socialIconStyle[':hover'] = {
    color: '#38b000',
  };  

  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
    {/* Navbar */}
    <nav style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '1rem 2rem', 
      background: '#f0f4f8', 
      boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', 
      color: '#333'
    }}>        
      {/* Logo e Links */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#38b000', marginRight: '1.5rem' }}>
          Unirides - Caronas
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={() => scrollToSection('home')}
            style={{ background: 'none', border: 'none', color: '#333', cursor: 'pointer', fontSize: '1rem' }}
          >
            Home
          </button>
          <button
            onClick={() => scrollToSection('quem-somos')}
            style={{ background: 'none', border: 'none', color: '#333', cursor: 'pointer', fontSize: '1rem' }}
          >
            Quem Somos
          </button>
          <button
            onClick={() => scrollToSection('contato')}
            style={{ background: 'none', border: 'none', color: '#333', cursor: 'pointer', fontSize: '1rem' }}
          >
            Contato
          </button>
          <button
            onClick={() => scrollToSection('localização')}
            style={{ background: 'none', border: 'none', color: '#333', cursor: 'pointer', fontSize: '1rem' }}
          >
            Localização
          </button>
        </div>
      </div>


         {/* Botão entrar de forma intuitiva */}
         <div style={{ position: 'relative' }}>
            <button
              onClick={handleDropdownToggle}
              style={{
                background: 'none',
                color: '#007bff',
                padding: '0.5rem 1rem',
                border: 'none',
                fontSize: '1rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                borderRadius: '8px',
                transition: 'transform 0.2s ease',
              }}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              Entrar {showDropdown ? "˄" : "˅"}
            </button>
            
            {showDropdown && (
              <div
                style={{
                  position: 'absolute',
                  top: '2.5rem',
                  right: 0,
                  background: '#fff',
                  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  zIndex: 1,
                }}
              >
                <Link
                  to="/login"
                  style={{
                    display: 'block',
                    padding: '1rem',
                    color: '#007bff',
                    textAlign: 'center',
                    textDecoration: 'none',
                    transition: 'transform 0.2s ease, border-bottom 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.borderBottom = '2px solid #007bff';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.borderBottom = 'none';
                  }}
                >
                  Login
                </Link>
                
                <Link
                  to="/signup"
                  style={{
                    display: 'block',
                    padding: '1rem',
                    color: '#007bff',
                    textAlign: 'center',
                    textDecoration: 'none',
                    transition: 'transform 0.2s ease, border-bottom 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.borderBottom = '2px solid #007bff';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.borderBottom = 'none';
                  }}
                >
                  Cadastro
                </Link>
              </div>
            )}
          </div>
      </nav>


      {/* Conteúdo de cada sessão */}
      <section 
      id="home" 
      style={{
        textAlign: 'center',
        padding: '4rem 2rem',
        background: 'linear-gradient(to right, #0f2027, #203a43, #2c5364)',
        color: '#f7f9fc'
      }}
    >
      <h1 style={{ fontSize: '2.5rem', color: '#38b000' }}>Bem-vindo ao Unirides</h1>
      <p style={{ fontSize: '1.25rem', color: '#f7f9fc' }}>
        Conecte-se com motoristas ou passageiros para organizar suas caronas de forma prática e segura.
      </p>

      <div className="carousel-item">
        <img src={"/carona1.png"} alt="Carona 1" style={{ width: '100%', height: 'auto' }}/>
      </div>
      <div className="carousel-item">
        <img src={"/carona2.png"} alt="Carona 2" style={{ width: '100%', height: 'auto' }}/>
      </div>
      <div className="carousel-item">
        <img src={"/carona3.png"} alt="Carona 3" style={{ width: '100%', height: 'auto' }}/>
      </div>
      </section>


      {/* Sessão de apresentação */}
      <section
        id="quem-somos"
        style={{
          padding: '4rem 2rem',
          background: 'linear-gradient(to right, #1a262f, #203a44, #2b4e64)',
          color: '#f7f9fc'
        }}
      >
        <h2 style={{ fontSize: '2rem', color: '#38b000' }}>Quem Somos</h2>
        <p style={{ fontSize: '1rem', color: '#f7f9fc', lineHeight: '1.6' }}>
          No <strong>Unirides</strong>, acreditamos que cada viagem é uma oportunidade para compartilhar experiências, reduzir custos e tornar o mundo mais sustentável. Somos uma plataforma inovadora que conecta motoristas e passageiros com um objetivo comum: facilitar deslocamentos de forma prática, segura e econômica.
        </p>
        <p style={{ fontSize: '1rem', color: '#f7f9fc', lineHeight: '1.6' }}>
          Nossa missão é promover um ambiente confiável e dinâmico, onde tanto motoristas quanto passageiros possam planejar suas caronas com transparência e flexibilidade. Seja para viagens diárias para o trabalho ou para trajetos de longa distância, oferecemos uma solução de mobilidade que se adapta às necessidades dos nossos usuários.
        </p>
        <p style={{ fontSize: '1rem', color: '#f7f9fc', lineHeight: '1.6' }}>
          <strong>Por que escolher o Unirides - Sistema de Caronas?</strong><br />
          <ul>
            <li><strong>Segurança em Primeiro Lugar:</strong> Valorizamos sua segurança e desenvolvemos um sistema que permite que motoristas e passageiros avaliem uns aos outros, criando uma rede de confiança e credibilidade.</li>
            <li><strong>Sustentabilidade:</strong> Ao compartilhar o trajeto, você reduz sua pegada de carbono, contribuindo para um planeta mais verde e sustentável.</li>
            <li><strong>Conveniência e Economia:</strong> Evite o estresse dos transportes públicos ou os altos custos de viagens individuais. Com o Unirides, você divide despesas e viaja com conforto.</li>
          </ul>
        </p>
        <p style={{ fontSize: '1rem', color: '#f7f9fc', lineHeight: '1.6' }}>
          Somos uma equipe apaixonada por inovação e bem-estar. Com o <strong>Unirides</strong>, cada usuário faz parte de uma comunidade de pessoas que acreditam em um futuro mais colaborativo e sustentável.
        </p>
      </section>

      {/* Sessão de Contato */}
      <section
          id="contato"
          style={{
            padding: '4rem 2rem',
            background: 'linear-gradient(to right, #0e1f26, #1e333e, #2a4d61)',
            color: '#f7f9fc',
          }}
        >
          <h2 style={{ fontSize: '2rem', color: '#38b000' }}>Contato</h2>
          
          <p style={{ fontSize: '1rem', color: '#f7f9fc' }}>
            Entre em contato conosco pelo email: <br />
            <strong>contato@sistemadecaronas.com</strong>
          </p>

          {/* Formulário de contato */}
          <div style={{ marginTop: '2rem' }}>
            <h3 style={{ color: '#38b000' }}>Envie uma Mensagem</h3>
            <form>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                Nome:
                <input type="text" placeholder="Seu nome" style={inputStyle} />
              </label>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                E-mail:
                <input type="email" placeholder="Seu e-mail" style={inputStyle} />
              </label>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                Mensagem:
                <textarea placeholder="Sua mensagem" style={textareaStyle} />
              </label>
              <button type="submit" style={buttonStyle}>Enviar Mensagem</button>
            </form>
          </div>

          {/* Redes sociais */}
          <div style={{ marginTop: '3rem' }}>
            <h3 style={{ color: '#38b000' }}>Siga-nos nas Redes Sociais</h3>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <a 
                href="https://www.facebook.com/puccampinas/?locale=pt_BR" 
                target="_blank" 
                style={socialIconStyle}
                onMouseEnter={(e) => e.target.style.color = '#38b000'} // fica verde se passa em cima com o mouse
                onMouseLeave={(e) => e.target.style.color = '#f7f9fc'} // Cor original ao tirar o mouse
              >
                <i className="fab fa-facebook-f"></i>
              </a>
              <a 
                href="https://www.instagram.com/puccampinas/" 
                target="_blank" 
                style={socialIconStyle}
                onMouseEnter={(e) => e.target.style.color = '#38b000'}
                onMouseLeave={(e) => e.target.style.color = '#f7f9fc'}
              >
                <i className="fab fa-instagram"></i>
              </a>
              <a 
                href="https://x.com/puccampinas" 
                target="_blank" 
                style={socialIconStyle}
                onMouseEnter={(e) => e.target.style.color = '#38b000'}
                onMouseLeave={(e) => e.target.style.color = '#f7f9fc'}
              >
                <i className="fab fa-twitter"></i>
              </a>
            </div>
          </div>
        
      </section>

      {/* Sessão de localização */}
      <section
          id="localização"
          style={{
            padding: '4rem 2rem',
            background: 'linear-gradient(to right, #0f2027, #203a43, #2c5364)',
            color: '#f7f9fc'
          }}
        >

          {/* Endereço */}
          <div style={{ marginTop: '1.5rem' }}>
            <h3 style={{ color: '#38b000' }}>Nosso Endereço</h3>
            <p>Av. Reitor Benedito José Barreto Fonseca, H15 - Parque dos Jacarandás, Campinas - SP</p>
          </div>

          {/* Mapa */}
          <div style={{ marginTop: '3rem' }}>
            <h3 style={{ color: '#38b000' }}>Encontre-nos no Mapa</h3>
            <div>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3675.060320348315!2d-47.05483758442353!3d-22.834080985049522!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94c8c423e9c92bc5%3A0xce9a7f4920d1df4b!2sAv.%20Reitor%20Benedito%20Jos%C3%A9%20Barreto%20Fonseca%2C%20H15%20-%20Parque%20dos%20Jacarand%C3%A1s%2C%20Campinas%20-%20SP!5e0!3m2!1spt-BR!2sbr!4v1697061014515!5m2!1spt-BR!2sbr"
              width="600"
              height="450"
              style={{ border: '0' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>

            </div>
          </div>

      </section>

    </div>
  );
}


export default LandPage;
