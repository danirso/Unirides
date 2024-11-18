import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Detalhescaronam() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const caronaId = params.get("id");
  const [caronaDetalhes, setCaronaDetalhes] = useState(null);

  useEffect(() => {
    detalhescarona(caronaId);
  }, [caronaId]);

  const detalhescarona = (caronaId) => {
    fetch(`http://localhost:3000/api/detalhes/${caronaId}/caronas`)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.error(data.error);
        } else {
          setCaronaDetalhes(data);
        }
      })
      .catch((error) =>
        console.error("Erro ao buscar detalhes da carona", error)
      );
  };

  const handleBackToDashboard = () => {
    navigate("/passageiro");
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
      <div className="container mt-3">
        <div
          className="card shadow-sm p-4 rounded"
          style={{ backgroundColor: "#1f3b4d" }}
        >
          <div
            className="card-header d-flex justify-content-between align-items-center"
            style={{ backgroundColor: "#1f3b4d" }}
          >
            <h3 className="mb-0" style={{ color: "white" }}>
              Detalhes da Carona
            </h3>
          </div>
          <div className="card-body">
            {caronaDetalhes ? (
              <>
                <div className="mb-4">
                  <h5 style={{ color: "white" }}>Informações da Carona</h5>
                  <hr style={{ borderColor: "white" }} />
                  <p style={{ color: "white" }}>
                    <strong>ID da Carona:</strong> {caronaId}
                  </p>
                  <p style={{ color: "white" }}>
                    <strong>Motorista:</strong> {caronaDetalhes.motoristaNome}
                  </p>
                  <p style={{ color: "white" }}>
                    <strong>Local de Partida:</strong> {caronaDetalhes.localPartida}
                  </p>
                  <p style={{ color: "white" }}>
                    <strong>Destino:</strong> {caronaDetalhes.destino}
                  </p>
                  <p style={{ color: "white" }}>
                    <strong>Horário:</strong> {caronaDetalhes.horario}
                  </p>
                </div>

                <div>
                  <h5 style={{ color: "white" }}>Passageiros</h5>
                  <hr style={{ borderColor: "white" }} />
                  {caronaDetalhes.passageiros && caronaDetalhes.passageiros.length > 0 ? (
                    caronaDetalhes.passageiros.map((passageiro, index) => (
                      <div 
                        key={index} 
                        className="mb-3 p-3 rounded"
                        style={{ 
                          backgroundColor: "#2c3e50", 
                          color: "white" 
                        }}
                      >
                        <div className="d-flex justify-content-between align-items-center">
                          <strong>{passageiro.nome}</strong>
                          <span>
                            Nota: {passageiro.nota ? `${passageiro.nota}/5` : 'Sem nota'}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p style={{ color: "white" }}>Nenhum passageiro cadastrado</p>
                  )}
                </div>

                <div className="mt-4 d-flex justify-content-end">
                  <button
                    className="btn btn-outline-info"
                    onClick={handleBackToDashboard}
                  >
                    Voltar
                  </button>
                </div>
              </>
            ) : (
              <p style={{ color: "white" }}>Carregando detalhes da carona...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Detalhescaronam;