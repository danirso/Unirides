import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Dashboard() {
  const [usuario, setUsuario] = useState({
    name: '',
    email: '',
    celular: '',
  });

  // Estado para armazenar as caronas vindas do backend
  const [caronas, setCaronas] = useState([]);

  // Buscar caronas do backend quando o componente for montado
  useEffect(() => {
    // Recupera os dados do usuário do localStorage
    const userData = localStorage.getItem('usuario');
    if (userData) {
      setUsuario(JSON.parse(userData));  // Atualiza o estado com os dados do usuário
    }

    fetch('http://localhost:3000/api/caronas')  // URL da API
      .then((response) => response.json())      // Parseia o JSON da resposta
      .then((data) => setCaronas(data))         // Atualiza o estado com as caronas
      .catch((error) => console.error('Erro ao buscar caronas:', error));
  }, []);

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Bem-vindo, {usuario.name}!</h2>
        <Link to="/" className="btn btn-danger">
          Logout
        </Link>
      </div>

      {/* Seção do perfil do usuário */}
      <div className="mb-4">
        <p><strong>Email:</strong> {usuario.email}</p>
        <p><strong>Celular:</strong> {usuario.celular}</p>
        <Link to="/perfil" className="btn btn-primary mb-3">
          Ver Perfil Completo
        </Link>
      </div>

      {/* Seção de caronas disponíveis */}
      <div className="mb-4">
        <h3>Caronas Disponíveis</h3>
        {caronas.length > 0 ? (
          caronas.map((carona) => (
            <div key={carona.id} className="card mb-3">
              <div className="card-body">
                <h5 className="card-title">Destino: {carona.destino}</h5>
                <p className="card-text">Horário: {new Date(carona.horario).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</p>
                <p className="card-text">Motorista: {carona.motorista.nome}</p> {/* Exibe o nome do motorista */}
                <button className="btn btn-success">Solicitar Carona</button>
              </div>
            </div>
          ))
        ) : (
          <p>Não há caronas disponíveis no momento.</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;