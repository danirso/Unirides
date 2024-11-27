import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Redefinirsenha(){
    const location = useLocation();
    const email = location.state?.email;
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    if (!email) {
      navigate('/login');  // Redireciona para a página inicial ou de login, caso o email esteja ausente
    }
  
    const validatePasswordStrength = (password) => {
      const regex = /^[A-Za-z\d@$!%*?&]{8,20}$/;
      return regex.test(password);
    };
  
    const handleResetPassword = async (e) => {
      e.preventDefault();
      setErrorMessage("");  // Limpa mensagens anteriores
      setSuccessMessage("");
  
      // Valida força da senha
      if (!validatePasswordStrength(newPassword)) {
        setErrorMessage(
          "A senha deve ter pelo menos 8 caracteres"
        );
        return;
      }
  
      // Verifica se as senhas coincidem
      if (newPassword !== confirmPassword) {
        setErrorMessage("As senhas não coincidem. Tente novamente.");
        return;
      }
  
      try {
        setIsLoading(true);

        const response = await fetch(`/trocar-senha`, {  // Aqui, enviamos apenas a nova senha
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ novaSenha: newPassword, email }),  // Apenas a nova senha
        });
  
        setIsLoading(false);

        const data = await response.json();
  
        if (response.ok) {
          setSuccessMessage("Sua senha foi redefinida com sucesso!");
          setTimeout(() => {
            navigate('/login'); 
          }, 4000);
        } else {
          setErrorMessage(data.message || "Erro ao redefinir a senha.");
        }
      } catch (error) {
        setErrorMessage("Erro de conexão. Tente novamente.");
      } finally {
        setIsLoading(false); // Retorna o botão ao estado original
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
        <div style={{ textAlign: "center" }}>

          <img
            src={`${process.env.PUBLIC_URL}/logo.png`}  // Corrigido o template string
            alt="UNIRIDES"
            style={{
              position: "absolute",
              top: "30px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "120px",
              zIndex: 10,
              paddingTop: "20px",
            }}
          />
          <h2 className="text-center mb-4" style={{ color: "#f7f9fc" }}>
          Redefinir Senha
          </h2>
          <h6 className="text-center mb-3" style={{ color: "#f7f9fc" }}>
            Crie uma nova senha para sua conta.
          </h6>
        </div>

          <form onSubmit={handleResetPassword}>
            <input
              type="password"
              placeholder="Nova Senha"
              className="form-control mb-3"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
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
            <input
              type="password"
              placeholder="Confirmar Nova Senha"
              className="form-control mb-3"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
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
            
            <button
              className="btn w-100"
              style={{
                padding: "12px",
                fontSize: "16px",
                borderRadius: "8px",
                backgroundColor: isLoading ? "#6c757d" : "#007bff", // Cor desativada quando carregando
                border: "none",
                color: "#fff",
                cursor: isLoading ? "not-allowed" : "pointer", // Cursor bloqueado quando carregando
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                width: "100%", // Garante que o botão ocupe a largura total do contêiner
                marginBottom: "10px",
                transition: "background-color 0.3s ease",
              }}
              disabled={isLoading} // Desativa o botão enquanto isLoading estiver true
              
              onMouseOver={(e) => {
                if (!isLoading) e.target.style.backgroundColor = "#43A047"; // Cor ao passar o mouse
              }}
              onMouseOut={(e) => {
                if (!isLoading) e.target.style.backgroundColor = "#4CAF50"; // Cor original ao sair
              }}
            >
            {isLoading ? "Redefinindo..." : "Redefinir Senha"} {/* Texto dinâmico do botão */}
            </button>

            {errorMessage && (
              <div style={{ color: "red", marginBottom: "15px", fontWeight: "500" }}>
              {errorMessage}
            </div>
            )}

            {successMessage && (
            <div style={{ color: "green", marginBottom: "15px", fontWeight: "500" }}>
            {successMessage}
            </div>           
            )}

          </form>
          <div style={{ textAlign: "center", marginTop: "15px" }}>
          <button
            className="btn w-100 mt-2"
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
  }

export default Redefinirsenha;
