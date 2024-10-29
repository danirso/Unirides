import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState({ name: "", id: "" });
  const [caronas, setCaronas] = useState([]);
  const [minhasCaronas, setMinhasCaronas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedData, setData] = useState("");
  const [selectedMotorista, setSelectedMotorista] = useState("");
  const [selectedHorario, setSelectedHorario] = useState("");
  const [selectArCondicionado, setArCondicionado] = useState("");
  const [SelectedPartida, setSelectedPartida] = useState("");
  const [musica, setMusica] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showMinhasCaronas, setShowMinhasCaronas] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setUsuario({
        name: user.nome,
        id: user.id,
      });
      fetchMinhasCaronas(user.id);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleArCondicionadoChange = (e) => {
    setArCondicionado(e.target.value);
  };

  // Filtra as caronas com base nos filtros
  const filteredCaronas = caronas.filter((carona) => {
    const matchesDestino = searchTerm ? carona.destino.toLowerCase().includes(searchTerm.toLowerCase()) : true;
    const matchesMotorista = selectedMotorista ? carona.motorista.nome.toLowerCase().includes(selectedMotorista.toLowerCase()) : true;
    const matchesPartida = SelectedPartida ? carona.partida.toLowerCase().includes(SelectedPartida.toLowerCase()) : true;
    const matchesData = selectedData ? new Date(carona.horario).toISOString().split("T")[0] === selectedData : true;
    const matchesHorario = selectedHorario ? new Date(carona.horario).toLocaleTimeString("pt-BR", {hour: "2-digit", minute: "2-digit",}).startsWith(selectedHorario) : true;
    const matchesArCondicionado = selectArCondicionado ? carona.ar.toString() === selectArCondicionado : true;
    const matchesMusica = musica ? carona.musica.toLowerCase().includes(musica.toLowerCase()) : true;
    return (
      matchesDestino &&
      matchesMotorista &&
      matchesPartida &&
      matchesData &&
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
    const idPassageiro = usuario.id;
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
      body: JSON.stringify({ id_passageiro: usuario.id }),
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
        minHeight: "100vh",
        backgroundAttachment: "fixed",
      }}
    >
      <style>
        {`
          body, html {
            height: 100%;
            margin: 0;
            background: linear-gradient(to right, #0f2027, #203a43, #2c5364);
            background-attachment: fixed;
          }
        `}
      </style>
      <div className="container mt-3">
        <div className="row mb-4">
          <div className="col-12">
            <div className="p-4 rounded" style={{ backgroundColor: "#1f3b4d" }}>
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
        </div>
        <div className="row mb-4">
          <div className="col-12">
            <div className="p-4 rounded" style={{ backgroundColor: "#1f3b4d" }}>
              <input
                type="text"
                className="form-control form-control-lg mb-3"
                placeholder="Para onde deseja ir?"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                className="btn btn-secondary mb-2"
                onClick={() => setShowFilters(!showFilters)}>
                {showFilters ? "Ocultar Filtros" : "Mostrar Filtros"}
              </button>
              {showFilters && (
                <div className="card mb-3 shadow-sm">
                  <div className="card-body p-4 rounded" style={{ backgroundColor: "#343a40 ", color: "#f7f9fc" }}>
                    <h4 className="mb-3">Filtros</h4>
                    <div className="mb-2">
                      <label className="form-label">Local de partida:</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Digite o local de partida"
                        value={SelectedPartida}
                        onChange={(e) => setSelectedPartida(e.target.value)}
                      />
                    </div>
                    <div className="mb-2">
                      <label className="form-label">Motorista:</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Digite o motorista"
                        value={selectedMotorista}
                        onChange={(e) => setSelectedMotorista(e.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <label>Data:</label>
                      <input
                        type="date"
                        name="data"
                        value={selectedData}
                        onChange={(e) => setData(e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                        className="form-control"
                        required
                      />
                    </div>
                    <div className="mb-2">
                      <label className="form-label">Horário:</label>
                      <input
                        type="time"
                        name="horario"
                        value={selectedHorario}
                        onChange={(e) => setSelectedHorario(e.target.value)}
                        className="form-control"
                        required
                     />
                    </div>
                    <div className="mb-2">
                      <label className="form-label">Ar-condicionado:</label>
                      <select
                        className="form-select"
                        value={selectArCondicionado}
                        onChange={handleArCondicionadoChange}
                      >
                        <option value="">Selecione</option>
                        <option value="1">Ligado</option>
                        <option value="0">Desligado</option>
                      </select>
                    </div>
                    <div className="mb-2">
                      <label className="form-label">Música:</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Digite o estilo de música"
                        value={musica}
                        onChange={(e) => setMusica(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
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
                    <div className="card-body p-4 rounded" style={{ backgroundColor: "#343a40", color: "#f7f9fc" }}> 
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
                        Ar-condicionado: {carona.ar ? "Ligado" : "Desligado"}
                        <br /> 
                        Música: {carona.musica}
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
                <p>Nenhuma carona disponível corresponde a pesquisa feita.</p>
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
                  className="btn btn-secondary"
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
                        <div className="card-body p-4 rounded" style={{ backgroundColor: "#343a40", color: "#f7f9fc" }}>
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
                            <br />
                            Música: {carona.musica}
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
