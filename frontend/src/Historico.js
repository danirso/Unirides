import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Historico() {
  const [historico, setHistorico] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem("user"));
    if (loggedUser) {
      setUser(loggedUser);
      fetchHistorico(loggedUser.id, loggedUser.role);
    } else {
      alert("Usuário não está logado.");
    }
  }, []);

  const fetchHistorico = (id, role) => {
    console.log("ID do usuario:", id); // Verificar se o ID está correto
    if (role === 0) {
      fetch(`http://localhost:3000/api/historico/${id}/passageiro`)
        .then((response) => response.json())
        .then((data) => {
          console.log("Dados recebidos do histórico:", data); // Log para verificar os dados
          setHistorico(data);
        })
        .catch((error) => console.error("Erro ao buscar histórico:", error));
    } else {
      fetch(`http://localhost:3000/api/historico/${id}/motorista`)
        .then((response) => response.json())
        .then((data) => {
          console.log("Dados recebidos do histórico:", data); // Log para verificar os dados
          setHistorico(data);
        })
        .catch((error) => console.error("Erro ao buscar histórico:", error));
    }
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
              <h2>Histórico de Caronas</h2>
              <div className="d-flex justify-content-between align-items-center">
                <Link to={user && user.role === 0 ? "/passageiro" : "/motorista"} className="btn btn-danger">
                  Voltar
                </Link>
              </div>
            </div>
          </div>
        </div>
        {/* Lista de Caronas */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="p-4 rounded" style={{ backgroundColor: "#1f3b4d" }}>
              {historico.length > 0 ? (
                historico.map((viagem) => (
                  <div key={viagem.id} className="card mb-3 shadow-sm" style={{ border: "none" }}>
                    <div className="card-body p-4 rounded" style={{ backgroundColor: "#343a40", color: "#f7f9fc" }}>
                      <h5 className="card-title">
                        {user.role === 0
                          ? `Carona com ${viagem.motorista.nome} em ${new Date(viagem.horario).toLocaleDateString("pt-BR")}`
                          : `Carona em ${new Date(viagem.horario).toLocaleDateString("pt-BR")}`}
                      </h5>
                      <p className="card-text">
                        Destino: {viagem.destino}
                        <br />
                        Partida: {viagem.partida}
                        <br />
                        Horário:{" "}
                        {new Date(viagem.horario).toLocaleTimeString("pt-BR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p>Você não possui histórico de caronas.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
}

export default Historico;
