import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState({
    name: '',
    email: '',
    celular: '',
  });
  const [caronas, setCaronas] = useState([]);
  const [minhasCaronas, setMinhasCaronas] = useState([]); // Caronas do passageiro

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUsuario({
        name: user.nome,
        email: user.email,
        celular: user.celular,
      });
      fetchMinhasCaronas(user.id); // Buscar caronas do passageiro
    } else {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    fetch('http://localhost:3000/api/caronas')
      .then((response) => response.json())
      .then((data) => setCaronas(data))
      .catch((error) => console.error('Erro ao buscar caronas:', error));
  }, []);

  // Função para buscar caronas do passageiro
  const fetchMinhasCaronas = (idPassageiro) => {
    fetch(`http://localhost:3000/api/caronas/minhas?id_passageiro=${idPassageiro}`)
      .then((response) => response.json())
      .then((data) => setMinhasCaronas(data))
      .catch((error) => console.error('Erro ao buscar minhas caronas:', error));
  };

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
          setCaronas(caronas.filter((carona) => carona.id !== caronaId));
          fetchMinhasCaronas(usuario.id); // Atualizar caronas do passageiro
        } else {
          alert('Erro ao solicitar carona.');
        }
      })
      .catch((error) => console.error('Erro ao solicitar carona:', error));
  };

  // Função para sair de uma carona
  const sairDaCarona = (caronaId) => {
    fetch(`http://localhost:3000/api/caronas/${caronaId}/sair`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id_passageiro: null, // Define o id_passageiro como null para remover o passageiro
      }),
    })
      .then((response) => {
        if (response.ok) {
          alert('Você saiu da carona com sucesso!');
          setMinhasCaronas(minhasCaronas.filter((carona) => carona.id !== caronaId));
        } else {
          alert('Erro ao sair da carona.');
        }
      })
      .catch((error) => console.error('Erro ao sair da carona:', error));
  };
  

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Bem-vindo, {usuario.name}!</h2>
        <Link to="/" className="btn btn-danger" onClick={handleLogout}>
          Logout
        </Link>
      </div>

      <div className="mb-4">
        <p><strong>Email:</strong> {usuario.email}</p>
        <p><strong>Celular:</strong> {usuario.celular}</p>
        <Link to="/perfil" className="btn btn-primary mb-3">Ver Perfil Completo</Link>
      </div>

      <div className="mb-4">
        <h3>Caronas Disponíveis</h3>
        {caronas.length > 0 ? (
          caronas.map((carona) => (
            <div key={carona.id} className="card mb-3">
              <div className="card-body">
                <h5 className="card-title">Destino: {carona.destino}</h5>
                <p className="card-text">Horário: {new Date(carona.horario).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'})}</p>
                <p className="card-text">Motorista: {carona.motorista.nome}</p>
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

      <div className="mb-4">
        <h3>Minhas Caronas</h3>
        {minhasCaronas.length > 0 ? (
          minhasCaronas.map((carona) => (
            <div key={carona.id} className="card mb-3">
              <div className="card-body">
                <h5 className="card-title">Destino: {carona.destino}</h5>
                <p className="card-text">Horário: {new Date(carona.horario).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'})}</p>
                <p className="card-text">Motorista: {carona.motorista.nome}</p>
                <button className="btn btn-danger" onClick={() => sairDaCarona(carona.id)}>
                  Sair da Carona
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>Você não está em nenhuma carona no momento.</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
