import React, { useState, useEffect, useRef } from "react";
import { useBeforeUnload, useNavigate } from "react-router-dom";
import Validation from "./PerfilValidations";
import io from "socket.io-client";

const socket = io("http://localhost:3001"); // Conectando ao backend na porta 3001

function PerfilMotorista() {
  const [usuario, setUsuario] = useState({
    nome: "",
    email: "",
    celular: "",
    ra: "",
  });
  const [carInfo, setCarInfo] = useState({
    modelo: "",
    placa: "",
  });
  const [editing, setEditing] = useState(false);
  const [initialUsuario, setInitialUsuario] = useState({});
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [mensagem, setMensagem] = useState("");
  const [historicoMensagens, setHistoricoMensagens] = useState([]);
  const [showChat, setShowChat] = useState(false);
  const [chatCaronaId, setChatCaronaId] = useState(null);
  const [isChatMinimized, setIsChatMinimized] = useState(true);
  const inputRef = useRef(null);

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
    if (user && user.id) {
      fetch(`/api/usuario/${user.id}`)
        .then((response) => response.json())
        .then((data) => setUsuario(data))
        .catch((error) => {
          console.error("Erro ao carregar os dados do usuário:", error);
          alert("Não foi possível carregar os dados do usuário.");
        });
  
      fetch(`/api/carInfo/${user.id}`)
        .then((response) => response.json())
        .then((data) => setCarInfo(data))
        .catch((error) => {
          console.error("Erro ao carregar as informações do carro:", error);
          alert("Não foi possível carregar os dados do carro.");
        });
    }
  }, []);
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsuario((prevUsuario) => ({ ...prevUsuario, [name]: value })); // Atualiza corretamente o estado do formulário
  };

  const handleCarChange = (e) => {
    const { name, value } = e.target;
    setCarInfo((prevCarInfo) => ({ ...prevCarInfo, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const combinedValues = {...usuario,...carInfo};
    const validationErrors = Validation(combinedValues);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      // Atualizar dados do usuário
      const usuarioResponse = await fetch(`/api/usuario/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuario)
      });
  
      // Atualizar informações do carro
      const carInfoResponse = await fetch(`/api/carInfo/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(carInfo)
      });
    
    if(usuarioResponse.ok && carInfoResponse.ok){
      alert("Informações atualizadas com sucesso!");
      setEditing(false);
      localStorage.setItem("user", JSON.stringify({ ...user, ...usuario, carro: carInfo }));
    } else{
      throw new Error("erro ao atualizar dados.");
    }
    
   } catch (error) {
      console.error("Erro ao atualizar as informações do usuário:", error);
      alert("Erro ao atualizar as informações. Tente novamente mais tarde.");
    }
  };
  
  const handleBackToDashboard = () => {
    navigate("/motorista");
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
      <div className="container mt-3">
        <div className="card shadow-sm p-4 rounded" style={{ backgroundColor: "#1f3b4d" }}>
          <div className="card-header d-flex justify-content-between align-items-center" style={{ backgroundColor: "#1f3b4d" }}>
            <h3 className="mb-0" style={{ color: "white" }}>Área do {user.nome}</h3>
          </div>
          <div className="card-body">
            {editing ? (
              <form onSubmit={handleSubmit}>
                {/* Campos de edição */}
                <div className="row mb-3">
                  <div className="col-md-4">
                    <strong style={{ color: "white" }}>Nome:</strong>
                  </div>
                  <div className="col-md-8">
                    <input
                      type="text"
                      className="form-control"
                      name="nome"
                      value={usuario.nome}
                      onChange={handleChange}
                      style={{ backgroundColor: "white", color: "black" }}
                    />
                    {errors.nome && (
                      <small className="text-danger">{errors.nome}</small>
                    )}
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-4">
                    <strong style={{ color: "white" }}>Email:</strong>
                  </div>
                  <div className="col-md-8">
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={usuario.email}
                      onChange={handleChange}
                      style={{ backgroundColor: "white", color: "black" }}
                    />
                    {errors.email && (
                      <small className="text-danger">{errors.email}</small>
                    )}
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-4">
                    <strong style={{ color: "white" }}>Celular:</strong>
                  </div>
                  <div className="col-md-8">
                    <input
                      type="text"
                      className="form-control"
                      name="celular"
                      value={usuario.celular}
                      onChange={handleChange}
                      style={{ backgroundColor: "white", color: "black" }}
                    />
                    {errors.celular && (
                      <small className="text-danger">{errors.celular}</small>
                    )}
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-4">
                    <strong style={{ color: "white" }}>RA:</strong>
                  </div>
                  <div className="col-md-8">
                    <input
                      type="text"
                      className="form-control"
                      name="ra"
                      value={usuario.ra}
                      onChange={handleChange}
                      style={{ backgroundColor: "white", color: "black" }}
                    />
                    {errors.ra && (
                      <small className="text-danger">{errors.ra}</small>
                    )}
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-4">
                    <strong style={{ color: "white" }}>Modelo do Carro:</strong>
                  </div>
                  <div className="col-md-8">
                  <input
                    type="text"
                    className="form-control"
                    name="modelo"
                    value={carInfo.modelo}
                    onChange={handleCarChange}
                    style={{ backgroundColor: "white", color: "black" }}
                  />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-4">
                    <strong style={{ color: "white" }}>Placa do Carro:</strong>
                  </div>
                  <div className="col-md-8">
                  <input
                    type="text"
                    className="form-control"
                    name="placa"
                    value={carInfo.placa.toUpperCase()}
                    onChange={handleCarChange}
                    style={{ backgroundColor: "white", color: "black" }}
                  />
                  {errors.placa && (
                    <small className="text-danger">{errors.placa}</small>
                  )}
                  </div>
                </div>
                <div className="d-flex justify-content-between">
                  <button type="submit" className="btn btn-success me-2">
                    Atualizar
                  </button>
                  <button type="button" className="btn btn-outline-danger" onClick={() => setEditing(false)}>
                    Cancelar
                  </button>
                </div>
              </form>
            ) : (
              <div>
                {/* Exibição dos dados */}
                <p style={{ color: "white" }}><strong>Nome:</strong> {usuario.nome}</p>
                <p style={{ color: "white" }}><strong>Email:</strong> {usuario.email}</p>
                <p style={{ color: "white" }}><strong>Celular:</strong> {usuario.celular}</p>
                <p style={{ color: "white" }}><strong>RA:</strong> {usuario.ra}</p>
                <p style={{ color: "white" }}><strong>Modelo do Carro:</strong> {carInfo.modelo}</p>
                <p style={{ color: "white" }}><strong>Placa do Carro:</strong> {carInfo.placa}</p>
                <div className="d-flex justify-content-between">
                  <button className="btn btn-warning" onClick={() => setEditing(true)}>
                    Editar Informações
                  </button>
                  <button className="btn btn-outline-info" onClick={handleBackToDashboard}>
                    Voltar
                  </button>
                </div>
              </div>
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
    </div>
  );
}

export default PerfilMotorista;
