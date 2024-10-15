import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();

  // Estado para armazenar os dados do usuário logado
  const [usuario, setUsuario] = useState({
    name: '',
    email: '',
    celular: '',
  });

  // Estado para armazenar as caronas vindas do backend
  const [caronas, setCaronas] = useState([]);

  // Buscar o usuário logado do localStorage (ou sessionStorage)
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUsuario({
        name: user.nome,
        email: user.email,
        celular: user.celular,
      });
    } else {
      // Redirecionar para login se o usuário não estiver logado
      navigate('/login');
    }
  }, [navigate]);

  // Buscar caronas do backend quando o componente for montado
  useEffect(() => {
    fetch('http://localhost:3000/api/caronas')  // URL da API para buscar caronas disponíveis
      .then((response) => response.json())      // Parseia o JSON da resposta
      .then((data) => setCaronas(data))         // Atualiza o estado com as caronas
      .catch((error) => console.error('Erro ao buscar caronas:', error));
  }, []);

  // Função para solicitar uma carona
  const solicitarCarona = (caronaId) => {
    fetch(`http://localhost:3000/api/caronas/${caronaId}/solicitar`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id_passageiro: JSON.parse(localStorage.getItem('user')).id,
      }),
    })
      .then((response) => {
        if (response.ok) {
          alert('Carona solicitada com sucesso!');
          setCaronas(caronas.filter((carona) => carona.id !== caronaId)); // Remove a carona da lista
        } else {
          alert('Erro ao solicitar carona.');
        }
      })
      .catch((error) => console.error('Erro ao solicitar carona:', error));
  };

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
                <p className="card-text">Horário: {new Date(carona.horario).toLocaleString()}</p>
                <p className="card-text">Motorista: {carona.motorista.nome}</p> {/* Exibe o nome do motorista */}
                <button className="btn btn-success" onClick={() => solicitarCarona(carona.id)}>
                  Solicitar Carona
                </button>
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
