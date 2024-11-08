import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import io from "socket.io-client";

const socket = io("http://localhost:3001"); // Conectando ao backend na porta 3001

function Historico() {
  const [historico, setHistorico] = useState([]);
  const [user, setUser] = useState(null);
  const [avaliacoes, setAvaliacoes] = useState({});
  const [passageiroSelecionado, setPassageiroSelecionado] = useState({});
  const [mensagem, setMensagem] = useState("");
  const [historicoMensagens, setHistoricoMensagens] = useState([]);
  const [showChat, setShowChat] = useState(true);
  const [chatCaronaId, setChatCaronaId] = useState(null);
  const [isChatMinimized, setIsChatMinimized] = useState(true);
  const inputRef = useRef(null);
  const [usuario, setUsuario] = useState({
    name: "",
    id: "",
  });

  useEffect(() => {
    socket.on("mensagem", (data) => {
      setHistoricoMensagens((prev) => [...prev, data]);
    });

    return () => {
      socket.off("mensagem"); 
    };
  }, []);

  const enviarMensagem = () => {
    const mensagemData = {
      mensagem,
      usuario: usuario.name,
      usuarioId: usuario.id,
      caronaId: chatCaronaId,
    };
    socket.emit("mensagem", mensagemData);
    setMensagem(""); 
    inputRef.current.focus();
  };

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
    const endpoint = role === 0 
      ? `http://localhost:3000/api/historico/${id}/passageiro` 
      : `http://localhost:3000/api/historico/${id}/motorista`;

    fetch(endpoint)
      .then((response) => response.json())
      .then((data) => setHistorico(data))
      .catch((error) => console.error("Erro ao buscar histórico:", error));
  };

  const handleAvaliarClick = (caronaId, motoristaId) => {
    const avaliacaoInicial = {
      nota: "",
      textoAvaliativo: "",
      id_avaliado: user.role === 0 ? motoristaId : null // Define motorista automaticamente se role === 0
    };
    setAvaliacoes((prev) => ({
      ...prev,
      [caronaId]: avaliacaoInicial,
    }));
  };
  
  const handleCancelarClick = (caronaId) => {
    setAvaliacoes((prev) => ({
      ...prev,
      [caronaId]: null,
    }));
  };

  const handleNotaChange = (caronaId, nota) => {
    setAvaliacoes((prev) => ({
      ...prev,
      [caronaId]: { ...prev[caronaId], nota },
    }));
  };

  const handleTextoChange = (caronaId, textoAvaliativo) => {
    setAvaliacoes((prev) => ({
      ...prev,
      [caronaId]: { ...prev[caronaId], textoAvaliativo },
    }));
  };

  const handlePassageiroChange = (caronaId, passageiroId) => {
    setAvaliacoes((prev) => ({
      ...prev,
      [caronaId]: { ...prev[caronaId], id_avaliado: passageiroId },
    }));
  };

  const enviarAvaliacao = async (caronaId) => {
    const avaliacao = avaliacoes[caronaId];
    if (!avaliacao.nota || (user.role === 1 && !avaliacao.id_avaliado)) {
      alert("Selecione uma nota e um usuário para avaliar.");
      return;
    }

    const payload = {
      id_avaliador: user.id,
      id_avaliado: avaliacao.id_avaliado,
      id_carona: caronaId,
      nota: avaliacao.nota,
      texto_avaliativo: avaliacao.textoAvaliativo,
      role: user.role,
    };

    try {
      const response = await fetch("http://localhost:3000/api/avaliacoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        alert("Avaliação enviada com sucesso!");
        setAvaliacoes((prev) => ({ ...prev, [caronaId]: null }));
        fetchHistorico(user.id, user.role); 
      } else {
        const data = await response.json();
        alert(data.message || "Erro ao enviar avaliação.");
      }
    } catch (error) {
      console.error("Erro ao enviar avaliação:", error);
      alert("Erro ao enviar avaliação.");
    }
  };

  const abrirChat = (caronaId) => {
    setChatCaronaId(caronaId);
    setIsChatMinimized(false);
  };

  const minimizarChat = () => {
    setIsChatMinimized(!isChatMinimized);
  };

  return (
    <div className="d-flex flex-column align-items-center vh-100" style={{ background: "linear-gradient(to right, #0f2027, #203a43, #2c5364)", color: "#f7f9fc", minHeight: "100vh", backgroundAttachment: "fixed" }}>
      <style>{`body, html { height: 100%; margin: 0; background: linear-gradient(to right, #0f2027, #203a43, #2c5364); background-attachment: fixed; }`}</style>
      <div className="container mt-3">
        <div className="p-4 rounded" style={{ backgroundColor: "#1f3b4d" }}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Histórico de Caronas</h2>
            <Link to={user && user.role === 0 ? "/passageiro" : "/motorista"} className="btn btn-outline-info">Voltar</Link>
          </div>
          
          {historico.length > 0 ? (
            historico.map((carona) => (
              <div key={carona.id} className="card mb-3 shadow-sm">
                <div className="card-body p-4 rounded" style={{ backgroundColor: "#343a40", color: "#f7f9fc" }}>
                  <h5 className="card-title">
                    {user.role === 0
                      ? `Carona com ${carona.motorista.nome} em ${new Date(carona.horario).toLocaleDateString("pt-BR")}`
                      : `Carona em ${new Date(carona.horario).toLocaleDateString("pt-BR")}`}
                  </h5>
                  <p className="card-text">Destino: {carona.destino}<br />Partida: {carona.partida}<br />Horário: {new Date(carona.horario).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</p>

                  {!carona.avaliado && !avaliacoes[carona.id] && (
                    <button className="btn btn-warning mt-2" onClick={() => handleAvaliarClick(carona.id, carona.motorista.id)}>
                      Avaliar {user.role === 0 ? "Motorista" : "Passageiros"}
                    </button>
                  )}

                  {avaliacoes[carona.id] && (
                    <div className="mt-3">
                      {user.role === 1 && (
                        <div className="mb-3">
                          <label htmlFor={`passageiro-${carona.id}`} className="form-label">Selecionar Passageiro:</label>
                          <select
                            id={`passageiro-${carona.id}`}
                            className="form-select"
                            value={avaliacoes[carona.id].id_avaliado || ""}
                            onChange={(e) => handlePassageiroChange(carona.id, e.target.value)}
                          >
                            <option value="">Selecione</option>
                            {carona.passageiros.map((passageiro) => (
                              <option key={passageiro.id} value={passageiro.id}>{passageiro.nome}</option>
                            ))}
                          </select>
                        </div>
                      )}
                      <label htmlFor={`nota-${carona.id}`} className="form-label">Nota (1 a 5):</label>
                      <select
                        id={`nota-${carona.id}`}
                        className="form-select mb-3"
                        value={avaliacoes[carona.id].nota}
                        onChange={(e) => handleNotaChange(carona.id, e.target.value)}
                      >
                        <option value="">Selecione</option>
                        {[1, 2, 3, 4, 5].map(nota => (
                          <option key={nota} value={nota}>{nota}</option>
                        ))}
                      </select>
                      <label htmlFor={`texto-${carona.id}`} className="form-label">Comentário (opcional):</label>
                      <textarea
                        id={`texto-${carona.id}`}
                        className="form-control mb-3"
                        rows="3"
                        value={avaliacoes[carona.id].textoAvaliativo}
                        onChange={(e) => handleTextoChange(carona.id, e.target.value)}
                      ></textarea>
                      <div className="d-flex justify-content-between align-items-center mb-4">
                      <button className="btn btn-success" onClick={() => enviarAvaliacao(carona.id)}>
                        Enviar Avaliação
                      </button>
                      <button className="btn btn-danger" onClick={() => handleCancelarClick(carona.id)}>
                          Cancelar
                      </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p>Você não possui histórico de caronas.</p>
          )}
          {/* Componente de Chat */}
          {showChat && (
          <div
            style={{
              position: "fixed",
              bottom: "20px",
              right: "20px", 
              width: "350px",
              zIndex: 1000,
              backgroundColor: "#fff",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                backgroundColor: "#343a40",
                color: "#fff",
                padding: "10px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h5 style={{ margin: 0 }}>Chat com o Motorista</h5>
              <button
                onClick={() => setIsChatMinimized(!isChatMinimized)}
                style={{
                  padding: "5px",
                  backgroundColor: "#6c757d",
                  color: "#fff",
                  border: "none",
                  borderRadius: "3px",
                  cursor: "pointer",
                }}
              >
                {isChatMinimized ? "Expandir" : "Minimizar"}
              </button>
            </div>
            {!isChatMinimized && (
              <>
                <div
                  style={{
                    maxHeight: "400px", 
                    overflowY: "auto",
                    padding: "10px",
                    backgroundColor: "#f8f9fa",
                    color: "#000", 
                  }}
                >
                  {historicoMensagens.length > 0 ? (
                  historicoMensagens.map((msg, index) => (
                    <div
                      key={index}
                      style={{
                        marginBottom: "8px",
                        backgroundColor: msg.usuario === "Motorista" ? "#d4edda" : "#f1f1f1",
                        padding: "8px",
                        borderRadius: "5px",
                        wordBreak: "break-word",
                      }}
                    >
                      <strong>{msg.usuario === usuario.name ? "Você" : msg.usuario}:</strong> {msg.mensagem}
                    </div>
                  ))
                ) : (
                  <p style={{ color: "#ccc" }}>Nenhuma mensagem ainda.</p>
                )}
                </div>
                <div
                  style={{
                    display: "flex",
                    padding: "10px",
                    borderTop: "1px solid #ccc",
                  }}
                >
                  <input
                  ref={inputRef}
                    type="text"
                    value={mensagem}
                    onChange={(e) => setMensagem(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        enviarMensagem();
                      }
                    }}
                    placeholder="Digite sua mensagem..."
                    style={{
                      flex: 1,
                      padding: "8px",
                      marginRight: "8px",
                      border: "1px solid #ced4da",
                      borderRadius: "4px",
                    }}
                  />
                  <button
                    onClick={enviarMensagem}
                    style={{
                      padding: "8px 12px",
                      backgroundColor: "#007bff",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Enviar
                  </button>
                </div>
              </>
            )}
          </div>
        )}
        </div>
      </div>
    </div>
  );
}

export default Historico;
