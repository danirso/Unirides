import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Verificarcodigo(){
  const [token, setToken] = useState("");  // Para armazenar o token digitado
  const [successMessage, setSuccessMessage] = useState("");  // Mensagem de sucesso
  const [errorMessagem, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setSuccessMessage('');  // Limpa mensagens anteriores
    
    try {
      const response = await fetch('/verificar-codigo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),  // Envia o token digitado pelo usuário
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('Código verificado com sucesso!');
        navigate('/trocar-senha'); 
      } else {
        setErrorMessage(data.message || 'Código inválido ou expirado.');

      }
    } catch (error) {
      setErrorMessage('Erro de conexão. Tente novamente.');
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(8px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "linear-gradient(to right, #0f2027, #203a43, #2c5364)",
          padding: "20px",
          borderRadius: "8px",
          width: "300px",
        }}
      >
        <h5 className="text-center" style={{ color: "#fff" }}>
          Verificar Token
        </h5>
        <form onSubmit={handleVerifyCode}>
          <input
            type="text"
            placeholder="Digite o codigo recebido"
            className="form-control mb-3"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
          {errorMessagem && (
            <div style={{ color: "red", marginBottom: "10px" }}>{errorMessagem}</div>
          )}
          {successMessage && (
            <div style={{ color: "green", marginBottom: "10px" }}>{successMessage}</div>
          )}
          <button
            className="btn w-100"
            style={{
              backgroundColor: "#8fdcbc",
              color: "#fff",
              padding: "10px",
              fontWeight: "bold",
              borderRadius: "8px",
            }}
          >
            Verificar Token
          </button>
        </form>
        <button
          className="btn w-100 mt-2"
          style={{
            backgroundColor: "#e2e8ed",
            color: "#0d1b2a",
            padding: "10px",
            fontWeight: "bold",
            borderRadius: "8px",
          }}
          onClick={() => navigate('/login')} // Fechar a tela de verificação
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default Verificarcodigo;
