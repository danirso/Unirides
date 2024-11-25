import React, { useState } from "react";  // Importando useState
import { useNavigate } from "react-router-dom";

const RecuperacaoSenha = ({ setShowRecovery, setShowCodeVerification }) => {
    const [email, setEmail] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate();


    const handleSendEmail = async (e) => {
        e.preventDefault();
      
        // Limpa mensagens anteriores
        setSuccessMessage('');
        setErrorMessage('');
      
        try {
          const response = await fetch('/recuperar-senha', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
          });
      
          const data = await response.json();
      
          if (response.ok) {
            setSuccessMessage('Código enviado para o e-mail!');
            setShowRecovery(false);  // Para avançar para a próxima etapa
            setShowCodeVerification(true);
          } else {
            // Verifica se o erro é de "e-mail não encontrado"
            if (data.error === 'E-mail não encontrado.') {
              setErrorMessage('E-mail não encontrado! Verifique novamente.');
            } else {
              setErrorMessage('Ocorreu um erro. Tente novamente mais tarde.');
            }
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
          Recuperar Senha
        </h5>
        <form onSubmit={handleSendEmail}>
          <input
            type="email"
            placeholder="Digite seu email"
            className="form-control mb-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {successMessage && (
            <div style={{ color: "green", marginBottom: "10px" }}>{successMessage}</div>
          )}
          {errorMessage && (
            <div style={{ color: "red", marginBottom: "10px" }}>{errorMessage}</div>
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
            Enviar Código
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
          onClick={() => navigate('/login')} // Fechar a tela de recuperação
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default RecuperacaoSenha;
