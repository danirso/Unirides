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
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleInput = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleBackTolandPage = () => {
    navigate("/");
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
            if (data.user.role === 0) {
              navigate("/passageiro");
            } else {
              navigate("/motorista");
            }
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
        position: "relative",
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

      <img
        src={`${process.env.PUBLIC_URL}/logo.png`}
        alt="UniRides logo"
        style={{
          position: "absolute",
          top: "30px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "150px",
          zIndex: 10,
          paddingTop: "20px",
        }}
      />

      <div
        className="p-4 rounded shadow-lg"
        style={{
          backgroundColor: "#343a40",
          color: "#f7f9fc",
          width: "100%",
          maxWidth: "400px",
          borderRadius: "12px",
          marginTop: "150px",
        }}
      >
        <h2 className="text-center mb-4" style={{ color: "#f7f9fc" }}>
          Sistema de Caronas
        </h2>
        <h5 className="text-center mb-3" style={{ color: "#f7f9fc" }}>
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
          <div className="mb-3" style={{ position: "relative" }}>
            <label htmlFor="password" style={{ fontWeight: "bold" }}>
              Senha
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Insira sua Senha"
              className="form-control"
              value={values.password}
              onChange={handleInput}
              style={{
                borderRadius: "8px",
                padding: "10px 40px 10px 10px",
                border: "1px solid #ccc",
                boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)",
              }}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              style={{
                position: "absolute",
                top: "50%",
                right: "10px",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  className="bi bi-eye-slash"
                  viewBox="0 0 16 16"
                >
                  <path d="M13.359 11.238C14.097 10.236 14.68 9.036 15 7.995 13.89 4.769 10.968 2.5 8 2.5c-.716 0-1.412.093-2.077.258L6.53 3.356a5.97 5.97 0 0 1 1.47-.226c2.413 0 4.717 1.655 5.753 3.978-.288.667-.72 1.297-1.278 1.818l.882.882zm-1.16 1.16l-1.231-1.23c-.335.221-.717.376-1.12.434l-.433-.433c.225-.33.381-.711.434-1.12l-.362-.362C9.474 8.12 9.256 8 9 8a1 1 0 0 0-.725.338L7.306 8.9c-.035-.052-.074-.1-.108-.15L6.032 8.222a3.973 3.973 0 0 1-.316-.386L1.646 4.254l-.708.708 12 12 .708-.708-2.354-2.354zm-8.855-2.417l-.033-.03C4.485 8.868 6.182 7.999 8 7.999s3.515.869 4.691 1.952c-.264.375-.552.732-.859 1.064L4.343 4.955z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  className="bi bi-eye"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 3c-2.39 0-4.657 1.192-6.211 3.062a8.12 8.12 0 0 0 0 5.876C3.343 13.808 5.61 15 8 15c2.39 0 4.657-1.192 6.211-3.062a8.12 8.12 0 0 0 0-5.876C12.657 4.192 10.39 3 8 3zM1.313 7.995C2.462 5.376 4.968 4 8 4c3.032 0 5.538 1.376 6.687 3.995a7.11 7.11 0 0 1 0 4.01C13.538 10.624 11.032 9.248 8 9.248c-3.032 0-5.538 1.376-6.687 3.995a7.11 7.11 0 0 1 0-4.01z" />
                  <path d="M8 5a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
                </svg>
              )}
            </button>
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
              backgroundColor: "#8fdcbc",
              color: "#fff",
              padding: "10px",
              fontWeight: "bold",
              borderRadius: "8px",
              transition: "background 0.3s",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#76ad96")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#8fdcbc")}
          >
            Login
          </button>
          <p></p>
          <Link
            to="/signup"
            className="btn w-100 text-decoration-none"
            style={{
              backgroundColor: "#D3D3D3",
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
