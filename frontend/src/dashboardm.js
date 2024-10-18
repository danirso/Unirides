import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function DashboardMotorista() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState({
    name: '',
    id: ''
  });
  const [caronas, setCaronas] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [novaCarona, setNovaCarona] = useState({
    partida: '',
    destino: '',
    horario: '',
    vagas: 1,
    ar: 'desligado',
    musica: ''
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.role === 1) { // Certifique-se de que o usuário é um motorista
      setUsuario({
        name: user.nome,
        id: user.id,
      });
      fetchCaronasMotorista(user.id);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  // Função para buscar as caronas oferecidas pelo motorista
  const fetchCaronasMotorista = (idMotorista) => {
    fetch(`http://localhost:3000/api/motorista/${idMotorista}/caronas`)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.error(data.error);
        } else {
          setCaronas(data); // Definindo as caronas no estado
        }
      })
      .catch((error) => console.error('Erro ao buscar caronas do motorista:', error));
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNovaCarona(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui você pode enviar a nova carona para a API
    console.log('Nova Carona:', novaCarona);
    // Resetar o formulário após enviar
    setNovaCarona({
      partida: '',
      destino: '',
      horario: '',
      vagas: 1,
      ar: 'desligado',
      musica: ''
    });
    setMostrarFormulario(false);
  };

  const handleCancel = () => {
    setMostrarFormulario(false);
    setNovaCarona({
      partida: '',
      destino: '',
      horario: '',
      vagas: 1,
      ar: 'desligado',
      musica: ''
    });
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
        <Link to="/perfil" className="btn btn-primary mb-3">Ver Perfil Completo</Link>
      </div>

      <div className="mb-4">
        <h3>Caronas que você está oferecendo</h3>
        {caronas.length > 0 ? (
          caronas.map((carona) => (
            <div key={carona.id} className="card mb-3">
              <div className="card-body">
                <h5 className="card-title">Destino: {carona.destino}</h5>
                <p className="card-text">Partida: {carona.partida}</p>
                <p className="card-text">Horário: {new Date(carona.horario).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                <p className="card-text">Vagas disponíveis: {carona.vagas_disponiveis}/{carona.vagas}</p>
                <p className="card-text">Ar-condicionado: {carona.ar ? 'Sim' : 'Não'}</p>
                <p className="card-text">Música: {carona.musica}</p>
              </div>
            </div>
          ))
        ) : (
          <p>Você não está oferecendo nenhuma carona no momento.</p>
        )}
      </div>

      <div className="mb-4">
        {!mostrarFormulario && (
          <button className="btn btn-success" onClick={() => setMostrarFormulario(true)}>
            Criar Carona
          </button>
        )}
        {mostrarFormulario && (
          <div className="border p-3 mt-3">
            <form onSubmit={handleSubmit}>
              <div className="mb-2">
                <label>Local de Partida:</label>
                <input type="text" name="partida" value={novaCarona.partida} onChange={handleChange} className="form-control" required />
              </div>
              <div className="mb-2">
                <label>Local de Destino:</label>
                <input type="text" name="destino" value={novaCarona.destino} onChange={handleChange} className="form-control" required />
              </div>
              <div className="mb-2">
                <label>Horário (dd/mm/yyyy):</label>
                <input
                  type="text"
                  name="horario"
                  value={novaCarona.horario}
                  onChange={handleChange}
                  placeholder="dd/mm/yyyy"
                  className="form-control"
                  required
                />
              </div>
              <div className="mb-2">
                <label>Vagas:</label>
                <input type="number" name="vagas" value={novaCarona.vagas} onChange={handleChange} min="1" className="form-control" required />
              </div>
              <div className="mb-2">
                <label>Ar-condicionado:</label>
                <select name="ar" value={novaCarona.ar} onChange={handleChange} className="form-control">
                  <option value="desligado">Desligado</option>
                  <option value="ligado">Ligado</option>
                </select>
              </div>
              <div className="mb-2">
                <label>Música:</label>
                <input type="text" name="musica" value={novaCarona.musica} onChange={handleChange} className="form-control" />
              </div>
              <button type="submit" className="btn btn-primary">Criar</button>
              <button type="button" className="btn btn-danger ms-2" onClick={handleCancel}>Cancelar</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardMotorista;
