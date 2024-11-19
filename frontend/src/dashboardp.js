import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import io from "socket.io-client";

const socket = io("http://localhost:3001"); // Conectando ao backend na porta 3001

function Dashboard() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState({ name: "", id: "" , role:""});
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
  const [mensagem, setMensagem] = useState("");
  const [historicoMensagens, setHistoricoMensagens] = useState([]);
  const [showChat, setShowChat] = useState(false);
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
    if (user) {
      setUsuario({
        name: user.nome,
        id: user.id,
        role: user.role,
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

  const limparFiltros = () => {
    setData("");
    setSelectedHorario("");
    setArCondicionado("");
    setSelectedPartida("");
    setSelectedMotorista("");
    setMusica("");
  };
  useEffect(() => {
    fetch(`http://localhost:3000/api/caronas?userId=${usuario.id}`)
      .then((response) => response.json())
      .then((data) => setCaronas(data))
      .catch((error) => console.error("Erro ao buscar caronas:", error));
  }, [usuario.id]);

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

  const abrirChat = (caronaId) => {
    setShowChat(true);
    setChatCaronaId(caronaId);
    setIsChatMinimized(false); 
    
    socket.emit("entrarCarona", caronaId, {
      name: usuario.name,
      id: usuario.id,
      role: usuario.role,
    });
  };  
  
  const minimizarChat = () => {
    setIsChatMinimized(!isChatMinimized);
  };

  useEffect(() => {
    if (showNotificacao) {
      const timer = setTimeout(() => {
        setNovaMensagem(false); // Esconde a notificação após 3 segundos
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
      {/* Cabeçalho */}
      <div className="container mt-3">
        <div className="row mb-4">
          <div className="col-12">
            <div className="p-4 rounded" style={{ backgroundColor: "#1f3b4d" }}>
              <h2>Bem-vindo, {usuario.name}!</h2>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <Link to="/perfil-passageiro" className="btn btn-success me-2">
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
        {/* Filtros */}
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
                className="btn btn-outline-light mb-2"
                onClick={() => setShowFilters(!showFilters)}>
                {showFilters ? "Ocultar Filtros" : "Mostrar Filtros"}
              </button>
              {showFilters && (
                <div className="card mb-3 shadow-sm">
                  <div className="card-body p-4 rounded" style={{ backgroundColor: "#343a40", color: "#f7f9fc" }}>
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
                    <button
                      className="btn btn-warning"
                      onClick={limparFiltros}>
                      Limpar filtros
                    </button>
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
                        Local de Partida: {carona.partida}
                        <br />
                        Data: {new Date(carona.horario).toLocaleDateString("pt-BR")}
                        <br />
                        Horário: {new Date(carona.horario).toLocaleTimeString("pt-BR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                        <br />
                        Motorista: {carona.motorista.nome} - Nota: {carona.motorista.avaliacoes[0] ? carona.motorista.avaliacoes[0].media.toFixed(1) : "N/A"}
                        <br />
                        Vagas disponíveis: {carona.vagas_disponiveis}
                        <br />
                        Ar-condicionado: {carona.ar ? "Ligado" : "Desligado"}
                        <br />
                        Música: {carona.musica}
                      </p>
                      <button
                        className="btn btn-success me-2"
                        onClick={() => solicitarCarona(carona.id)}
                      >
                        Solicitar Carona
                      </button>
                      <button
                            className="btn btn-info me-2"
                            style={{ backgroundColor: "#add8e6", color: "#000" }}
                            onClick={() => navigate(`/detalhescaronap?id=${carona.id}`)}
                          >
                            Ver Detalhes
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
                  className="btn btn-outline-light"
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
                            Motorista: {carona.motorista.nome} - Nota: {carona.motorista.avaliacoes[0] ? carona.motorista.avaliacoes[0].media.toFixed(1) : "N/A"}
                            <br />
                            Vagas disponíveis: {carona.vagas_disponiveis}
                            <br />
                            Ar-condicionado: {carona.ar ? "Ligado" : "Desligado"}
                            <br />
                            Música: {carona.musica}
                          </p>
                          <button
                            className="btn btn-danger me-2" 
                            onClick={() => sairDaCarona(carona.id)}
                          >
                            Sair da Carona
                          </button>
                          <button
                            className="btn btn-warning me-2"
                            onClick={() => abrirChat(carona.id)}
                          >
                            Falar com o Motorista
                          </button>
                          <button
                            className="btn btn-info me-2"
                            style={{ backgroundColor: "#add8e6", color: "#000" }}
                            onClick={() => navigate(`/detalhescaronap?id=${carona.id}`)}
                          >
                            Ver Detalhes
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
                    if (e.key === "Enter" && mensagem.trim() !== "") {
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

export default Dashboard;