import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import io from "socket.io-client";

const socket = io("http://localhost:3001"); // Conectando ao backend na porta 3001

function DashboardMotorista() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState({
    name: "",
    id: "",
    role:"",
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
  const [mensagem, setMensagem] = useState("");
  const [historicoMensagens, setHistoricoMensagens] = useState([]);
  const [showChat, setShowChat] = useState(false );
  const [chatCaronaId, setChatCaronaId] = useState(null);
  const [isChatMinimized, setIsChatMinimized] = useState(true);
  const inputRef = useRef(null);
  const [novaMensagem, setNovaMensagem] = useState(null);
  const [showNotificacao, setShowNotificacao] = useState(false);
  const [MinhaMensagem,setMinhaMensagem] = useState(false);

  useEffect(() => {
    socket.on("mensagem", (data) => {
        const mensagemComNome = { ...data, usuario: data.usuario || "Desconhecido" };
        setHistoricoMensagens((prev) => [...prev, mensagemComNome]);

      if (data.usuarioId != usuario.id) {
        setNovaMensagem(true);
        setShowNotificacao(true);
      }
      else{
        setMinhaMensagem(true)
        setNovaMensagem(true);
        setShowNotificacao(true);
      }
    });
    socket.on("historicoMensagens", (mensagens) => {
        const mensagensComNomes = mensagens.map((msg) => ({
            ...msg,
            usuario: msg.autor ? msg.autor.nome : "Desconhecido",
        }));
        setHistoricoMensagens(mensagensComNomes);
    });
    return () => {
        socket.off("mensagem");
        socket.off("historicoMensagens");
    };
}, [usuario.id]);

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
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.role === 1) {
      setUsuario({
        name: user.nome,
        id: user.id,
        role: user.role,
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

 
  const abrirChat = (caronaId) => {
    setShowChat(true);
    setChatCaronaId(caronaId);
    setIsChatMinimized(false);
  
    
    socket.emit("entrarCarona", caronaId, {
      name: usuario.name,
      id: usuario.id,
      role:usuario.role,
    });
  };
  const minimizarChat = () => {
    setIsChatMinimized(!isChatMinimized);
  };

  useEffect(() => {
    if (showNotificacao) {
      const timer = setTimeout(() => {
        setNovaMensagem(false);
        setMinhaMensagem(false);
      }, 4000); 
      return () => clearTimeout(timer);
    }
  }, [showNotificacao]);

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
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <Link to="/perfil-motorista" className="btn btn-success me-2">
                        Ver Perfil Completo
                    </Link>
                    <Link to="/historico" className="btn btn-info me-2">
                        Ver Histórico
                    </Link>
                </div>
                {novaMensagem && (
                  <div 
                    style={{
                      position: "fixed", // Fixa a posição na tela
                      top: "20px",       // Distância do topo
                      right: "20px",     // Distância da borda direita
                      backgroundColor: MinhaMensagem === true? "#006aff":"#ff9800" ,
                      color: "#fff",     // Cor do texto
                      padding: "10px 15px",
                      borderRadius: "8px",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Sombra para destacar
                      fontWeight: "bold",
                      zIndex: 1000,      // Certifica-se de que a notificação estará por cima de outros elementos
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ marginRight: "10px" }}>💬 {MinhaMensagem == true?"Mensagem enviada!": "Nova mensagem recebida!"}</span>
                    <button 
                      onClick={() => setNovaMensagem(false)} // Fecha a notificação ao clicar
                      style={{
                        backgroundColor: "transparent",
                        border: "none",
                        color: "#fff",
                        fontSize: "16px",
                        cursor: "pointer",
                      }}
                    >
                      ✖
                    </button>
                  </div>
                )}
                <button className="btn btn-outline-danger" onClick={handleLogout}>
                    Logout
                </button>
              </div>
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
                        className="btn btn-danger me-2" 
                        onClick={() => cancelarCarona(carona.id)}
                      >
                        Cancelar Carona
                      </button>
                      <button
                        className="btn btn-warning"
                        onClick={() => abrirChat(carona.id)}
                      >
                        Falar com o Passageiro
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
            <h5 style={{ margin: 0 }}>Chat com o Passageiro</h5>
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
                              backgroundColor: msg.usuarioId === usuario.id ? "#d4edda" : "#f1f1f1",
                              padding: "8px",
                              borderRadius: "5px",
                              wordBreak: "break-word",
                          }}
                      >
                          <strong>{msg.usuarioId === usuario.id ? "Você" : msg.usuario}:</strong> {msg.mensagem}
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
                  onClick={() => {
                    if (mensagem.trim() !== "") { // verifica se a mensagem não está vazia
                      enviarMensagem();
                    }
                  }}
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
  );
} 

export default DashboardMotorista;