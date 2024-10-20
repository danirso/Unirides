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
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Histórico de Caronas</h2>
        {user && user.role === 0 ? (
          <Link to="/passageiro" className="btn btn-danger">
            Voltar
          </Link>
        ) : (
          <Link to="/motorista" className="btn btn-danger">
            Voltar
          </Link>
        )}
      </div>
      {historico.length > 0 ? (
        historico.map((viagem) => (
          <div key={viagem.id} className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">
                {user.role === 0
                  ? `Carona com ${viagem.motorista.nome} em ${new Date(
                      viagem.horario
                    ).toLocaleDateString()}`
                  : `Carona em ${new Date(
                      viagem.horario
                    ).toLocaleDateString()}`}
              </h5>
              <p className="card-text">
                Destino: {viagem.destino}
                <br />
                Partida: {viagem.partida}
                <br />
                Horário:{" "}
                {new Date(viagem.horario).toLocaleTimeString([], {
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
  );
}

export default Historico;
