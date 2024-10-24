import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState({
    name: "",
    id: "",
  });
  const [caronas, setCaronas] = useState([]);
  const [minhasCaronas, setMinhasCaronas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMotorista, setSelectedMotorista] = useState("");
  const [selectedDestino, setSelectedDestino] = useState("");
  const [selectedHorario, setSelectedHorario] = useState("");
  const [arCondicionado, setArCondicionado] = useState(false);
  const [musica, setMusica] = useState("");
  const [showFilters, setShowFilters] = useState(false); // Estado para controlar a exibição dos filtros
  const [showMinhasCaronas, setShowMinhasCaronas] = useState(true);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setUsuario({
        name: user.nome,
      });
      fetchMinhasCaronas(user.id);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  // Filtra as caronas com base nos filtros
  const filteredCaronas = caronas.filter((carona) => {
    const matchesMotorista = carona.motorista.nome.toLowerCase().includes(selectedMotorista.toLowerCase());
    const matchesDestino = carona.destino.toLowerCase().includes(selectedDestino.toLowerCase());
    const matchesHorario = selectedHorario ? new Date(carona.horario).getHours() === parseInt(selectedHorario) : true;
    const matchesArCondicionado = arCondicionado ? carona.ar === true : true;
    const matchesMusica = musica ? carona.musica.toLowerCase().includes(musica.toLowerCase()) : true;

    return (
      (matchesMotorista || matchesDestino) &&
      matchesHorario &&
      matchesArCondicionado &&
      matchesMusica
    );
  });

  useEffect(() => {
    fetch("http://localhost:3000/api/caronas")
      .then((response) => response.json())
      .then((data) => setCaronas(data))
      .catch((error) => console.error("Erro ao buscar caronas:", error));
  }, []);

  const fetchMinhasCaronas = (idPassageiro) => {
    fetch(`http://localhost:3000/api/caronas/minhas?id_passageiro=${idPassageiro}`)
      .then((response) => response.json())
      .then((data) => setMinhasCaronas(data))
      .catch((error) => console.error("Erro ao buscar minhas caronas:", error));
  };

  const solicitarCarona = (caronaId) => {
    const idPassageiro = JSON.parse(localStorage.getItem("user")).id;
    fetch(`http://localhost:3000/api/caronas/${caronaId}/solicitar`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id_passageiro: idPassageiro }),
    })
      .then((response) => {
        if (response.ok) {
          alert("Carona solicitada com sucesso!");
          setCaronas(caronas.filter((carona) => carona.id !== caronaId));
          fetchMinhasCaronas(idPassageiro);
        } else {
          alert("Erro ao solicitar carona.");
        }
      })
      .catch((error) => console.error("Erro ao solicitar carona:", error));
  };

  const sairDaCarona = (caronaId) => {
    fetch(`http://localhost:3000/api/caronas/${caronaId}/sair`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id_passageiro: JSON.parse(localStorage.getItem("user")).id }),
    })
      .then((response) => {
        if (response.ok) {
          alert("Você saiu da carona com sucesso!");
          setMinhasCaronas(minhasCaronas.filter((carona) => carona.id !== caronaId));
        } else {
          alert("Erro ao sair da carona.");
        }
      })
      .catch((error) => console.error("Erro ao sair da carona:", error));
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div
      className="d-flex flex-column align-items-center vh-100"
      style={{
        background: "linear-gradient(to right, #0f2027, #203a43, #2c5364)",
        color: "#f7f9fc",
      }}
    >
      <div className="container mt-3">
        {/* Cabeçalho */}
        <div className="row mb-4">
          <div className="col-12 p-4 rounded" style={{ backgroundColor: "#203a43" }}>
            <h2>Bem-vindo, {usuario.name}!</h2>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <Link to="/perfil-passageiro" className="btn btn-primary me-2">
                  Ver Perfil Completo
                </Link>
                <Link to="/historico" className="btn btn-info">
                  Ver Histórico
                </Link>
              </div>
              <button className="btn btn-outline-danger" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Barra de Pesquisa e Filtros */}
        <div className="row mb-4">
          <div className="col-12">
            <input
              type="text"
              className="form-control form-control-lg mb-3"
              placeholder="Pesquisar caronas disponíveis"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              className="btn btn-outline-secondary mb-2"
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? "Ocultar Filtros" : "Mostrar Filtros"}
            </button>
            {showFilters && (
              <div className="border rounded p-3 mb-4" style={{ backgroundColor: "#2c5364" }}>
                <h4 className="mb-3">Filtros</h4>
                <div className="mb-2">
                  <label className="form-label">Motorista:</label>
                  <select
                    className="form-select"
                    value={selectedMotorista}
                    onChange={(e) => setSelectedMotorista(e.target.value)}
                  >
                    <option value="">Selecione um motorista</option>
                  </select>
                </div>
                <div className="mb-2">
                  <label className="form-label">Destino:</label>
                  <select
                    className="form-select"
                    value={selectedDestino}
                    onChange={(e) => setSelectedDestino(e.target.value)}
                  >
                    <option value="">Selecione um destino</option>
                  </select>
                </div>
                <div className="mb-2">
                  <label className="form-label">Horário:</label>
                  <select
                    className="form-select"
                    value={selectedHorario}
                    onChange={(e) => setSelectedHorario(e.target.value)}
                  >
                    <option value="">Selecione uma hora</option>
                    {Array.from({ length: 24 }, (_, i) => (
                      <option key={i} value={i}>
                        {i}:00
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-check mb-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={arCondicionado}
                    onChange={(e) => setArCondicionado(e.target.checked)}
                  />
                  <label className="form-check-label">Ar-condicionado</label>
                </div>
                <div className="mb-2">
                  <label className="form-label">Música:</label>
                  <select
                    className="form-select"
                    value={musica}
                    onChange={(e) => setMusica(e.target.value)}
                  >
                    <option value="">Selecione uma preferência musical</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Caronas Disponíveis */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="p-4 rounded" style={{ backgroundColor: "#1f3b4d" }}>
              <h3>Caronas Disponíveis</h3>
              {filteredCaronas.length > 0 ? (
                filteredCaronas.map((carona) => (
                  <div key={carona.id} className="card mb-3 shadow-sm">
                    <div className="card-body">
                      <h5 className="card-title">Destino: {carona.destino}</h5>
                      <p className="card-text">
                        Partida: {carona.partida}
                        <br />
                        Horário: {new Date(carona.horario).toLocaleTimeString("pt-BR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                        <br />
                        Data: {new Date(carona.horario).toLocaleDateString("pt-BR")}
                        <br />
                        Motorista: {carona.motorista.nome}
                        <br />
                        Vagas disponíveis: {carona.vagas_disponiveis}
                        <br />
                        Ar-condicionado: {carona.ar ? "Sim" : "Não"}
                      </p>
                      <button
                        className="btn btn-success"
                        onClick={() => solicitarCarona(carona.id)}
                      >
                        Solicitar Carona
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p>Nenhuma carona disponível no momento.</p>
              )}
            </div>
          </div>
        </div>

        {/* Minhas Caronas */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="p-4 rounded" style={{ backgroundColor: "#1f3b4d" }}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3>Minhas Caronas</h3>
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => setShowMinhasCaronas(!showMinhasCaronas)}
                >
                  {showMinhasCaronas ? "Ocultar" : "Mostrar"}
                </button>
              </div>
              {showMinhasCaronas && (
                <div>
                  {minhasCaronas.length > 0 ? (
                    minhasCaronas.map((carona) => (
                      <div key={carona.id} className="card mb-3 shadow-sm">
                        <div className="card-body">
                          <h5 className="card-title">Destino: {carona.destino}</h5>
                          <p className="card-text">
                            Partida: {carona.partida}
                            <br />
                            Horário: {new Date(carona.horario).toLocaleTimeString("pt-BR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                            <br />
                            Data: {new Date(carona.horario).toLocaleDateString("pt-BR")}
                            <br />
                            Motorista: {carona.motorista.nome}
                            <br />
                            Vagas disponíveis: {carona.vagas_disponiveis}
                            <br />
                            Ar-condicionado: {carona.ar ? "Sim" : "Não"}
                          </p>
                          <button
                            className="btn btn-danger"
                            onClick={() => sairDaCarona(carona.id)}
                          >
                            Sair da Carona
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>Você não está em nenhuma carona no momento.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


export default Dashboard;
