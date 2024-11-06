import React from 'react';
import { Link } from 'react-router-dom';

function LandPage() {
  return (
    <div style={{ textAlign: 'center', padding: '2rem', background: '#f7f7f7' }}>
      <h1>Bem-vindo ao Sistema de Caronas</h1>
      <p>
        Aqui você pode se conectar com motoristas ou passageiros e organizar suas caronas de forma prática e segura.
      </p>
      <Link to="/login" style={{ margin: '1rem', padding: '1rem 2rem', background: '#38b000', color: '#fff', borderRadius: '8px', textDecoration: 'none' }}>
        Faça Login
      </Link>
      <Link to="/signup" style={{ margin: '1rem', padding: '1rem 2rem', background: '#ccc', color: '#333', borderRadius: '8px', textDecoration: 'none' }}>
        Criar Conta
      </Link>
    </div>
  );
}

export default LandPage;
