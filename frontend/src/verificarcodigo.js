import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Verificarcodigo(){
  const location = useLocation();

  const email = location.state?.email;  // Recupera o email do state

  console.log("Email recebido:", email);

  const [token, setToken] = useState("");  // Para armazenar o token digitado
  const [successMessage, setSuccessMessage] = useState("");  // Mensagem de sucesso
  const [errorMessagem, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setSuccessMessage('');  // Limpa mensagens anteriores
    
    try {
      setIsLoading(true);

      const response = await fetch('/verificar-codigo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        
        body: JSON.stringify({ email, token }),  // Envia o token digitado pelo usuário
      });

      setIsLoading(false);

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('Código verificado com sucesso!');
        setTimeout(() => navigate('/trocar-senha', { state: { email } }), 4000);  
      } else {
        setErrorMessage(data.message || 'Código inválido ou expirado.');

      }
    } catch (error) {
      setErrorMessage('Erro de conexão. Tente novamente.');
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
          textAlign: "center",
        }}
      >

      <img
            src={`${process.env.PUBLIC_URL}/logo.png`}  // Corrigido o template string
            alt="Logo"
            style={{
              position: "absolute",
              top: "30px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "140px",
              zIndex: 10,
              paddingTop: "20px",
            }}      />
        <h2 className="text-center mb-4" style={{ color: "#f7f9fc"}}>
          Verificação de Código
        </h2>
        <h6 className="text-center mb-3" style={{ color: "#f7f9fc" }}>
        Insira o código que você recebeu no seu e-mail.
       </h6>

        <form onSubmit={handleVerifyCode}>
          <input
            type="text"
            placeholder="Digite o código recebido"
            className="form-control mb-3"
            value={token}
            onChange={(e) => setToken(e.target.value)}
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
            type="submit"
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
            {isLoading ? "Verificando..." : "Verificar Código"} {/* Texto dinâmico do botão */}
            </button>

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

        </form>
        <div style={{ textAlign: "center", marginTop: "15px" }} >
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
