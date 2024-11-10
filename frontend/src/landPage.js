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

  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Navbar */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', background: '#fff', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#38b000' }}>Unirides - Caronas</div>
        <div>
          <button
            onClick={() => scrollToSection('home')}
            style={{ margin: '0 1rem', background: 'none', border: 'none', color: '#333', cursor: 'pointer', fontSize: '1rem' }}
          >
            Home
          </button>
          <button
            onClick={() => scrollToSection('quem-somos')}
            style={{ margin: '0 1rem', background: 'none', border: 'none', color: '#333', cursor: 'pointer', fontSize: '1rem' }}
          >
            Quem Somos
          </button>
          <button
            onClick={() => scrollToSection('contato')}
            style={{ margin: '0 1rem', background: 'none', border: 'none', color: '#333', cursor: 'pointer', fontSize: '1rem' }}
          >
            Contato
          </button>
        </div>

         {/* Login Dropdown */}
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


      {/* Main Content */}
      <section id="home" style={{ textAlign: 'center', padding: '4rem 2rem', background: '#f0f0f0' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#38b000' }}>Bem-vindo ao Unirides</h1>
        <p style={{ fontSize: '1.25rem', color: '#555' }}>
          Conecte-se com motoristas ou passageiros para organizar suas caronas de forma prática e segura.
        </p>
      </section>

      {/* Quem Somos Section */}
      <section id="quem-somos" style={{ padding: '4rem 2rem', background: '#fff' }}>
        <h2 style={{ fontSize: '2rem', color: '#333' }}>Quem Somos</h2>
        <p style={{ fontSize: '1rem', color: '#555', lineHeight: '1.6' }}>
          No <strong>Unirides</strong>, acreditamos que cada viagem é uma oportunidade para compartilhar experiências, reduzir custos e tornar o mundo mais sustentável. Somos uma plataforma inovadora que conecta motoristas e passageiros com um objetivo comum: facilitar deslocamentos de forma prática, segura e econômica.
        </p>
        <p style={{ fontSize: '1rem', color: '#555', lineHeight: '1.6' }}>
          Nossa missão é promover um ambiente confiável e dinâmico, onde tanto motoristas quanto passageiros possam planejar suas caronas com transparência e flexibilidade. Seja para viagens diárias para o trabalho ou para trajetos de longa distância, oferecemos uma solução de mobilidade que se adapta às necessidades dos nossos usuários.
        </p>
        <p style={{ fontSize: '1rem', color: '#555', lineHeight: '1.6' }}>
          <strong>Por que escolher o Unirides - Sistema de Caronas?</strong><br />
          <ul>
            <li><strong>Segurança em Primeiro Lugar:</strong> Valorizamos sua segurança e desenvolvemos um sistema que permite que motoristas e passageiros avaliem uns aos outros, criando uma rede de confiança e credibilidade.</li>
            <li><strong>Sustentabilidade:</strong> Ao compartilhar o trajeto, você reduz sua pegada de carbono, contribuindo para um planeta mais verde e sustentável.</li>
            <li><strong>Conveniência e Economia:</strong> Evite o estresse dos transportes públicos ou os altos custos de viagens individuais. Com o Unirides, você divide despesas e viaja com conforto.</li>
          </ul>
        </p>
        <p style={{ fontSize: '1rem', color: '#555', lineHeight: '1.6' }}>
          Somos uma equipe apaixonada por inovação e bem-estar. Com o <strong>Unirides</strong>, cada usuário faz parte de uma comunidade de pessoas que acreditam em um futuro mais colaborativo e sustentável.
        </p>
      </section>

      {/* Contato Section */}
      <section id="contato" style={{ padding: '4rem 2rem', background: '#f0f0f0' }}>
        <h2 style={{ fontSize: '2rem', color: '#333' }}>Contato</h2>
        <p style={{ fontSize: '1rem', color: '#555' }}>
          Entre em contato conosco pelo email: contato@sistemadecaronas.com
        </p>
      </section>
    </div>
  );
}

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    background: '#fff',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
    flexWrap: 'wrap',
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#007bff',
  },
  navLinks: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  navButton: {
    background: 'none',
    border: 'none',
    color: '#333',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  entrarButton: {
    background: '#007bff',
    color: '#fff',
    padding: '0.5rem 1rem',
    border: 'none',
    fontSize: '1rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    borderRadius: '4px',
  },
  dropdown: {
    position: 'absolute',
    top: '2.5rem',
    right: 0,
    background: '#fff',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    overflow: 'hidden',
    zIndex: 1,
  },
  dropdownLink: {
    display: 'block',
    padding: '1rem',
    background: '#007bff',
    color: '#fff',
    textAlign: 'center',
    textDecoration: 'none',
    borderBottom: '1px solid #ccc',
  },
  sectionHome: {
    textAlign: 'center',
    padding: '4rem 2rem',
    background: '#f0f0f0',
  },
  header: {
    fontSize: '2.5rem',
    color: '#007bff',
  },
  text: {
    fontSize: '1.25rem',
    color: '#555',
  },
  mainButton: {
    margin: '1rem',
    padding: '1rem 2rem',
    background: '#007bff',
    color: '#fff',
    borderRadius: '8px',
    textDecoration: 'none',
    display: 'inline-block',
  },
  section: {
    padding: '4rem 2rem',
    background: '#fff',
  },
  sectionHeader: {
    fontSize: '2rem',
    color: '#333',
  },
  sectionText: {
    fontSize: '1rem',
    color: '#555',
    lineHeight: '1.6',
  },
  // Media Query for mobile devices
  '@media (max-width: 768px)': {
    navbar: {
      padding: '1rem',
      flexDirection: 'column',
    },
    navLinks: {
      flexDirection: 'column',
      alignItems: 'center',
      marginTop: '0.5rem',
    },
    sectionHome: {
      padding: '2rem 1rem',
    },
    header: {
      fontSize: '2rem',
    },
    text: {
      fontSize: '1rem',
    },
    mainButton: {
      padding: '0.75rem 1.5rem',
    },
    section: {
      padding: '2rem 1rem',
    },
  },
};

export default LandPage;
