import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const VerificacaoCodigo = ({ setShowCodeVerification, errorMessage }) => {
  const [code, setCode] = useState(""); // Para armazenar o código digitado
  const [successMessage, setSuccessMessage] = useState(""); // Mensagem de sucesso
  const [errorMessagem, setErrorMessage] = useState("");
  const navigate = useNavigate();


  const handleVerifyCode = async (e) => {
    e.preventDefault();
    // Limpa mensagens anteriores
    setSuccessMessage('');
    
    try {
      const response = await fetch('/verificar-codigo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      if (response.ok) {
        setSuccessMessage('Código verificado com sucesso!');
        // Avançar para a próxima etapa ou fechar o modal
        setShowCodeVerification(false);
      } else {
        // Caso de erro na verificação do código
        setSuccessMessage('');
        setErrorMessage('Código inválido! Tente novamente.');
      }
    } catch (error) {
      setSuccessMessage('');
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
          Verificar Código
        </h5>
        <form onSubmit={handleVerifyCode}>
          <input
            type="text"
            placeholder="Digite o código enviado"
            className="form-control mb-3"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          {errorMessagem && (
            <div style={{ color: "red", marginBottom: "10px" }}>{errorMessage}</div>
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
            Verificar Código
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

export default VerificacaoCodigo;
