import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Detalhescaronap() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const caronaId = params.get("id");
  const [caronaDetalhes, setCaronaDetalhes] = useState(null);

  useEffect(() => {
    detalhescarona(caronaId);
  }, [caronaId]);

  const detalhescarona = (caronaId) => {
    fetch(`http://localhost:3000/api/detalhesp/${caronaId}/caronas`)
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
                    <strong>Local de Partida:</strong> {caronaDetalhes.partida}
                  </p>
                  <p style={{ color: "white" }}>
                    <strong>Destino:</strong> {caronaDetalhes.destino}
                  </p>
                  <p style={{ color: "white" }}>
                    <strong>Data:</strong> {new Date(caronaDetalhes.horario).toLocaleDateString("pt-BR")}
                  </p>
                  <p style={{ color: "white" }}>
                    <strong>Horário:{" "}</strong>
                        {new Date(caronaDetalhes.horario).toLocaleTimeString("pt-BR", {
                          hour: "2-digit",
                          minute: "2-digit",
                          timeZone: "America/Sao_Paulo",
                        })}
                  </p>
                </div>

                <div>
                    <h5 style={{ color: "white" }}>Informações do Motorista</h5>
                    <hr style={{ borderColor: "white" }} />
                    <div 
                        className="mb-3 p-3 rounded"
                        style={{ 
                        backgroundColor: "#2c3e50", 
                        color: "white" 
                        }}
                    >
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <p>
                                <strong>Nome:</strong> {caronaDetalhes.motorista.nome} - Nota:{" "}
                                {caronaDetalhes.motorista.avaliacoes[0] ? (
                                    <>
                                    {caronaDetalhes.motorista.avaliacoes[0].media.toFixed(1)} ⭐
                                    </>
                                ) : (
                                    "N/A"
                                )}
                                </p>
                                <p>
                                <strong>Avaliações recentes:</strong> 
                                </p>
                                {caronaDetalhes.motorista.avaliacoes.slice(0, 3).map((avaliacao, index) => (
                                <p key={index}>
                                    {avaliacao.texto_Avaliativo ? avaliacao.texto_Avaliativo : "Sem avaliação por texto"}
                                </p>
                                ))}
                                <p>
                                <strong>Modelo do carro:</strong> {caronaDetalhes.motorista.veiculo.modelo}
                                </p>
                                <p>
                                <strong>Placa do carro:</strong> {caronaDetalhes.motorista.veiculo.placa}
                                </p>
                            </div>
                            </div>
                    </div>
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

export default Detalhescaronap;