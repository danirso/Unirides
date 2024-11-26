import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Verificarcodigo(){
  const location = useLocation();

  const email = location.state?.email;  // Recupera o email do state

  console.log("Email recebido:", email);

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
        
        body: JSON.stringify({ email, token }),  // Envia o token digitado pelo usuário
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
        background: "linear-gradient(to right, #0f2027, #203a43, #2c5364)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: "#343a40",
          padding: "40px 30px",
          borderRadius: "12px",
          width: "500px",
          boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)",
          animation: "fadeIn 1s ease-in-out",
        }}
      >
        <h5 className="text-center mb-4" style={{ color: "#f7f9fc" }}>
          Verificação de Código
        </h5>
        <form onSubmit={handleVerifyCode}>
          <input
            type="text"
            placeholder="Digite o código recebido"
            className="form-control mb-3"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            style={{
              padding: "15px",
              fontSize: "16px",
              borderRadius: "8px",
              border: "1px solid #ddd",
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
              width: "100%",
              marginBottom: "10px",
            }}
          />
          {errorMessagem && (
            <div style={{ color: "red", marginBottom: "15px", fontWeight: "500" }}>
              {errorMessagem}
            </div>
          )}
          {successMessage && (
            <div style={{ color: "green", marginBottom: "15px", fontWeight: "500" }}>
              {successMessage}
            </div>
          )}
          <button
            className="btn w-100"
            style={{
              padding: "12px",
              fontSize: "16px",
              borderRadius: "8px",
              backgroundColor: "#007bff",
              border: "none",
              color: "#fff",
              cursor: "pointer",
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
              transition: "background-color 0.3s ease",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#43A047")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}
          >
            Verificar Código
          </button>
        </form>
        <div style={{ textAlign: "center", marginTop: "15px" }}>
          <button
            className="btn w-100"
            style={{
              backgroundColor: "#fff",
              color: "#0d1b2a",
              padding: "12px",
              fontWeight: "bold",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onClick={() => navigate('/login')}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#f4f4f4")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#fff")}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
  
};

export default Verificarcodigo;
