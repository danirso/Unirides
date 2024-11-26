import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Redefinirsenha(){
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
  
    const validatePasswordStrength = (password) => {
      const regex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/;
      return regex.test(password);
    };
  
    const handleResetPassword = async (e) => {
      e.preventDefault();
      setErrorMessage("");  // Limpa mensagens anteriores
      setSuccessMessage("");
  
      // Valida força da senha
      if (!validatePasswordStrength(newPassword)) {
        setErrorMessage(
          "A senha deve ter pelo menos 8 caracteres, incluindo uma letra maiúscula, um número e um caractere especial."
        );
        return;
      }
  
      // Verifica se as senhas coincidem
      if (newPassword !== confirmPassword) {
        setErrorMessage("As senhas não coincidem. Tente novamente.");
        return;
      }
  
      try {
        const response = await fetch(`/trocar-senha`, {  // Aqui, enviamos apenas a nova senha
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ novaSenha: newPassword }),  // Apenas a nova senha
        });
  
        const data = await response.json();
  
        if (response.ok) {
          setSuccessMessage("Senha redefinida com sucesso!");
          setTimeout(() => {
            navigate('/login'); 
          }, 3000);
        } else {
          setErrorMessage(data.message || "Erro ao redefinir a senha.");
        }
      } catch (error) {
        setErrorMessage("Erro de conexão. Tente novamente.");
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
            Redefinir Senha
          </h5>
          <form onSubmit={handleResetPassword}>
            <input
              type="password"
              placeholder="Nova Senha"
              className="form-control mb-3"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirmar Nova Senha"
              className="form-control mb-3"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {errorMessage && (
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
              Redefinir Senha
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
            onClick={() => navigate('/login')} 
          >
            Cancelar
          </button>
        </div>
      </div>
    );
  };

export default Redefinirsenha;
