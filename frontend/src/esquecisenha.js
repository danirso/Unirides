import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function EsqueciSenha() {  
  const [emaillocal, setEmailLocal] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [email, setEmail] = useState(""); 
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSendEmail = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (!isValidEmail(emaillocal)) {
      setErrorMessage('Por favor, insira um email válido.');
      return;
  }

    try {
      setIsLoading(true);
      // Fazendo a requisição para o backend com fetch
      const response = await fetch('http://localhost:3000/recuperar-senha', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: emaillocal }),
      });
  
      setIsLoading(false);
      // Verifica se a requisição foi bem-sucedida
      if (response.ok) {
          const data = await response.json();
          setSuccessMessage('E-mail enviado com sucesso! Verifique sua caixa de entrada.');
          setEmail(emaillocal);  // Armazenando o email no componente pai
          setTimeout(() => navigate('/verificar-codigo',  { state: { email: emaillocal }}), 4000);
      } else {
          // Caso a resposta do servidor não seja de sucesso, exibe a mensagem de erro
          const errorData = await response.json();
          setErrorMessage(errorData.message || 'Ocorreu um erro. Tente novamente mais tarde.');
      }
  } catch (error) {
      // Erros de conexão ou outros imprevistos
      setErrorMessage('Erro de conexão. Tente novamente.');
  } finally {
  setIsLoading(false); // Retorna o botão ao estado original
}
};

  const handleBackTolandPage = () => {
    navigate("/");
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
      <button
        className="btn me-2"
        onClick={handleBackTolandPage}
        style={{
          backgroundColor: "#8fdcbc",
          position: "absolute",
          top: "20px",
          right: "20px",
          zIndex: 10,
        }}
      >
        Voltar
      </button>

      <div
        style={{
          backgroundColor: "#343a40",
          padding: "40px 30px",
          borderRadius: "12px",
          width: "500px",
          boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)",
          animation: "fadeIn 1s ease-in-out",
          position: "relative",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <img
            src={`${process.env.PUBLIC_URL}/logo.png`}  // Corrigido o template string
            alt="UNIRIDES"
            style={{
              width: "140px",
              zIndex: 10,
              marginBottom: "20px",
            }}
          />
          <h2 className="text-center mb-4" style={{ color: "#f7f9fc" }}>
            Recuperar senha
          </h2>
          <h6 className="text-center mb-3" style={{ color: "#f7f9fc" }}>
            Insira seu email para receber seu código de validação!
          </h6>
        </div>
        <form onSubmit={handleSendEmail}>
          <input
            type="email"
            placeholder="Digite seu email"
            className="form-control mb-3"
            value={emaillocal}
            onChange={(e) => setEmailLocal(e.target.value)}
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
            {isLoading ? "Enviando..." : "Enviar Email"} {/* Texto dinâmico do botão */}
            </button>

            {/* Mensagem de sucesso */}
            {successMessage && (
              <div style={{ color: "green", marginBottom: "15px", fontWeight: "500" }}>
                {successMessage}
              </div>
            )}
            
            {/* Mensagem de erro */}
            {errorMessage && (
              <div style={{ color: "red", marginBottom: "15px", fontWeight: "500" }}>
                {errorMessage}
              </div>
            )}

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
}

export default EsqueciSenha;