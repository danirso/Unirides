import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Validation from "./LoginValidation";

function Login() {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [backendError, setBackendError] = useState(""); // Estado para erros do backend
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
      // Enviar os dados para o backend
      fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            // Mostrar erro do backend
            setBackendError(data.error);
          } else {
            console.log('Login bem-sucedido:', data);
            localStorage.setItem('user', JSON.stringify(data.user)); // Armazena os dados do usuário no localStorage
          }
          if (data.user.role == 0) {
            navigate('/passageiro');
          }
          else{
             navigate('/motorista');
          } 
        })
        .catch((error) => {
          console.error('Erro ao realizar login:', error);
        });
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100" style={{backgroundColor:'#0d1b2a'}}>
      <div className="bg-white p-3 rounded w-25">
      <h2 className="text-center mb-4">Sistema de Caronas</h2>
      <h5 className="text-center mb-4">Seja bem-vindo!</h5>
      <h6 className="text-center mb-4">Faça o login ou crie uma conta!</h6>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email">
              <strong>Email</strong>
            </label>
            <input
              type="email"
              name="email"
              placeholder="Insira seu Email"
              className="form-control rounded-0"
              value={values.email}
              onChange={handleInput}
            />
            {errors.email && <span className="text-danger">{errors.email}</span>}
          </div>
          <div className="mb-3">
            <label htmlFor="password">
              <strong>Senha</strong>
            </label>
            <input
              type="password"
              name="password"
              placeholder="Insira sua Senha"
              className="form-control rounded-0"
              value={values.password}
              onChange={handleInput}
            />
            {errors.password && (
              <span className="text-danger">{errors.password}</span>
            )}
          </div>
          {backendError && <span className="text-danger">{backendError}</span>} {/* Erro do backend */}
          <button className="btn btn-success w-100 rounded-0">Login</button>
          <p></p>
          <Link
            to="/signup"
            className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none"
          >
            Criar Conta
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Login;
