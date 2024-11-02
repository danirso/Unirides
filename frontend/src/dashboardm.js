import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function DashboardMotorista() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState({
    name: "",
    id: "",
  });
  const [caronas, setCaronas] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [novaCarona, setNovaCarona] = useState({
    partida: "",
    destino: "",
    data: "",
    horario: "",
    vagas: 1,
    ar: 0,
    musica: "",
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.role === 1) {
      setUsuario({
        name: user.nome,
        id: user.id,
      });
      fetchCaronasMotorista(user.id);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const fetchCaronasMotorista = (idMotorista) => {
    fetch(`http://localhost:3000/api/motorista/${idMotorista}/caronas`)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.error(data.error);
        } else {
          setCaronas(data);
        }
      })
      .catch((error) =>
        console.error("Erro ao buscar caronas do motorista:", error)
      );
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNovaCarona((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataHoraCompleta = `${novaCarona.data}T${novaCarona.horario}:00`;
    const caronaData = {
      ...novaCarona,
      horario: new Date(dataHoraCompleta).toISOString(),
    };
    fetch(`http://localhost:3000/api/motorista/${usuario.id}/caronas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(caronaData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.error(data.error);
        } else {
          fetchCaronasMotorista(usuario.id);
          setMostrarFormulario(false);
          setNovaCarona({
            partida: "",
            destino: "",
            data: "",
            horario: "",
            vagas: 1,
            ar: 0,
            musica: "",
          });
        }
      })
      .catch((error) => console.error("Erro ao criar carona:", error));
  };

  const cancelarCarona = (caronaId) => {
    fetch(`http://localhost:3000/api/caronas/${caronaId}/cancelar`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          alert("Carona cancelada!");
          setCaronas(caronas.filter((carona) => carona.id !== caronaId));
        } else {
          alert("Erro ao cancelar a carona");
        }
      })
      .catch((error) => console.error("Erro em cancelar a carona:", error));
  };

  const handleCancel = () => {
    setMostrarFormulario(false);
    setNovaCarona({
      partida: "",
      destino: "",
      data: "",
      horario: "",
      vagas: 1,
      ar: 0, 
      musica: "",
    });
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
        {/* Cabeçalho */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="p-4 rounded" style={{ backgroundColor: "#1f3b4d" }}>
              <h2>Bem-vindo, {usuario.name}!</h2>
              <div className="d-flex justify-content-between align-items-center">
                <div className="mb-4">
                  <Link to="/perfil-motorista" className="btn btn-primary me-2">
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
        {/* Caronas Oferecidas */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="p-4 rounded" style={{ backgroundColor: "#1f3b4d" }}>
              <h3>Caronas que você está oferecendo</h3>
              {caronas.length > 0 ? (
                caronas.map((carona) => (
                  <div key={carona.id} className="card mb-3 shadow-sm">
                    <div className="card-body p-4 rounded" style={{ backgroundColor: "#343a40", color: "#f7f9fc" }}>
                      <h5 className="card-title">Destino: {carona.destino}</h5>
                      <p className="card-text">
                        Local de partida: {carona.partida}
                        <br />
                        Data: {new Date(carona.horario).toLocaleDateString("pt-BR")}
                        <br />
                        Horário:{" "}
                        {new Date(carona.horario).toLocaleTimeString("pt-BR", {
                          hour: "2-digit",
                          minute: "2-digit",
                          timeZone: "America/Sao_Paulo",
                        })}
                        <br />
                        Vagas disponíveis: {carona.vagas_disponiveis}/{carona.vagas}
                        <br />
                        Ar-condicionado: {carona.ar ? "Ligado" : "Desligado"}
                        <br />
                        Música: {carona.musica}
                      </p>
                      <button
                        className="btn btn-danger"
                        onClick={() => cancelarCarona(carona.id)}
                      >
                        Cancelar Carona
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p>Você não está oferecendo nenhuma carona no momento.</p>
              )}
            </div>
          </div>
        </div>
        {/* Criar Carona */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="p-4 rounded" style={{ backgroundColor: "#1f3b4d" }}>
            <h3>Criar Carona</h3>
              {!mostrarFormulario && (
                <button
                  className="btn btn-success"
                  onClick={() => setMostrarFormulario(true)}
                >
                  Criar
                </button>
              )}
              {mostrarFormulario && (
              <div className="card mb-3 shadow-sm">
                <div className="card-body p-4 rounded" style={{ backgroundColor: "#343a40", color: "#f7f9fc" }}>
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label>Local de Partida:</label>
                      <input
                        type="text"
                        name="partida"
                        value={novaCarona.partida}
                        onChange={handleChange}
                        className="form-control"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label>Local de Destino:</label>
                      <input
                        type="text"
                        name="destino"
                        value={novaCarona.destino}
                        onChange={handleChange}
                        className="form-control"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label>Data:</label>
                      <input
                        type="date"
                        name="data"
                        value={novaCarona.data}
                        onChange={handleChange}
                        min={new Date().toISOString().split("T")[0]}
                        className="form-control"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label>Horário:</label>
                      <input
                        type="time"
                        name="horario"
                        value={novaCarona.horario}
                        onChange={handleChange}
                        className="form-control"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label>Vagas:</label>
                      <input
                        type="number"
                        name="vagas"
                        value={novaCarona.vagas}
                        onChange={handleChange}
                        min="1"
                        className="form-control"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label>Ar-condicionado:</label>
                      <select
                        name="ar"
                        value={novaCarona.ar}
                        onChange={handleChange}
                        className="form-control"
                      >
                        <option value="0">Desligado</option>
                        <option value="1">Ligado</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label>Música:</label>
                      <input
                        type="text"
                        name="musica"
                        value={novaCarona.musica}
                        onChange={handleChange}
                        className="form-control"
                      />
                    </div>
                    <button type="submit" className="btn btn-primary">
                      Criar
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger ms-2"
                      onClick={handleCancel}
                    >
                      Cancelar
                    </button>
                  </form>
                </div>
              </div>
            )}
            </div>
          </div>
        </div>

      </div>
    </div>   
  );
} 

export default DashboardMotorista;
