import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Validation from "./LoginValidation";

function Login() {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [backendError, setBackendError] = useState("");
  const navigate = useNavigate();

  const handleInput = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = Validation(values);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            setBackendError(data.error);
          } else {
            localStorage.setItem("user", JSON.stringify(data.user));
          }
          if (data.user.role === 0) {
            navigate("/passageiro");
          } else {
            navigate("/motorista");
          }
        })
        .catch((error) => {
          console.error("Erro ao realizar login:", error);
        });
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        background: "linear-gradient(to right, #0f2027, #203a43, #2c5364)",
      }}
    >
      {/* Adicionar a logo no canto superior esquerdo */}
      <img
        src={`${process.env.PUBLIC_URL}/logo.png`} // Caminho correto para o logo
        alt="UniRides logo"
        style={{
          position: "absolute", // Posição absoluta para manter no canto
          top: "20px", // Distância do topo
          left: "20px", // Distância da esquerda
          width: "160px", // Ajustar o tamanho conforme necessário
          zIndex: 10, // Garantir que a logo fique acima do fundo
        }}
      />
  
      <div
        className="p-4 rounded shadow-lg"
        style={{
          backgroundColor: "#f7f9fc",
          width: "100%",
          maxWidth: "400px",
          borderRadius: "12px",
        }}
      >
        <h2 className="text-center mb-4" style={{ color: "#0d1b2a" }}>
          Sistema de Caronas
        </h2>
        <h5 className="text-center mb-3" style={{ color: "#1f3b4d" }}>
          Seja bem-vindo!
        </h5>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" style={{ fontWeight: "bold" }}>
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Insira seu Email"
              className="form-control"
              value={values.email}
              onChange={handleInput}
              style={{
                borderRadius: "8px",
                padding: "10px",
                border: "1px solid #ccc",
                boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)",
              }}
            />
            {errors.email && (
              <span className="text-danger" style={{ fontSize: "0.9em" }}>
                {errors.email}
              </span>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="password" style={{ fontWeight: "bold" }}>
              Senha
            </label>
            <input
              type="password"
              name="password"
              placeholder="Insira sua Senha"
              className="form-control"
              value={values.password}
              onChange={handleInput}
              style={{
                borderRadius: "8px",
                padding: "10px",
                border: "1px solid #ccc",
                boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)",
              }}
            />
            {errors.password && (
              <span className="text-danger" style={{ fontSize: "0.9em" }}>
                {errors.password}
              </span>
            )}
          </div>
          {backendError && (
            <span className="text-danger" style={{ fontSize: "0.9em" }}>
              {backendError}
            </span>
          )}
          <button
            className="btn w-100"
            style={{
              backgroundColor: "#38b000",
              color: "#fff",
              padding: "10px",
              fontWeight: "bold",
              borderRadius: "8px",
              transition: "background 0.3s",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#2c8200")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#38b000")}
          >
            Login
          </button>
          <p></p>
          <Link
            to="/signup"
            className="btn w-100 text-decoration-none"
            style={{
              backgroundColor: "#f0f4f8",
              padding: "10px",
              fontWeight: "bold",
              borderRadius: "8px",
              color: "#0d1b2a",
              transition: "background 0.3s",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#e2e8ed")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#f0f4f8")}
          >
            Criar Conta
          </Link>
        </form>
      </div>
    </div>
  );
  
}

export default Login;
