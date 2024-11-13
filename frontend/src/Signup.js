import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Validation from "./SignupValidation";

function Signup() {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    celular: "",
    ra: "",
    role: 0, 
    modeloCarro: "", 
    placa: "",
  });

  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const handleInput = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: name === "role" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = Validation(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      fetch("/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Resposta do backend:", data);  // Verificar resposta
          if (data.error) {
            console.error("Erro:", data.error);
          } else {
            console.log("Usuário cadastrado:", data);
            if (values.role === 1) {
              navigate("/motorista");
            } else {
              navigate("/passageiro");
            }
          }
        })
        .catch((error) => {
          console.error("Erro ao cadastrar:", error);
        });
    }
  };

  // Estilo dos inputs
  const inputStyle = {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "16px",
    width: "100%",
    boxSizing: "border-box",
    marginBottom: "15px",
  };

  // Estilo do container do formulário
  const formContainerStyle = {
    maxWidth: "450px",
    width: "100%",
    boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.2)",
    margin: "0 20px",
    minHeight: "400px",  
    maxHeight: "800px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to right, #0f2027, #203a43, #2c5364)",
        padding: "20px",
      }}
    >
      <div
        className="p-4 rounded shadow-lg"
        style={{
          backgroundColor: "#343a40",
          color: "#f7f9fc",
          width: "100%",
          maxWidth: "400px",
          borderRadius: "12px",
          marginTop: "20px", 
        }}
      >
        <h3 className="text-center mb-4" style={{ color: "#f7f9fc" }}>Crie sua conta</h3>

        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Nome Completo"
              value={values.name}
              onChange={handleInput}
              style={inputStyle}
            />
            {errors.name && <small className="text-danger">{errors.name}</small>}
          </div>

          <div className="form-group mb-3">
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Email"
              value={values.email}
              onChange={handleInput}
              style={inputStyle}
            />
            {errors.email && <small className="text-danger">{errors.email}</small>}
          </div>

          <div className="form-group mb-3">
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Senha"
              value={values.password}
              onChange={handleInput}
              style={inputStyle}
            />
            {errors.password && <small className="text-danger">{errors.password}</small>}
          </div>

          <div className="form-group mb-3">
            <input
              type="password"
              name="confirmPassword"
              className="form-control"
              placeholder="Confirme a Senha"
              value={values.confirmPassword}
              onChange={handleInput}
              style={inputStyle}
            />
            {errors.confirmPassword && <small className="text-danger">{errors.confirmPassword}</small>}
          </div>

          <div className="form-group mb-3">
            <input
              type="text"
              name="celular"
              className="form-control"
              placeholder="N° Celular"
              value={values.celular}
              onChange={handleInput}
              style={inputStyle}
            />
            {errors.celular && <small className="text-danger">{errors.celular}</small>}
          </div>

          <div className="form-group mb-3">
            <input
              type="text"
              name="ra"
              className="form-control"
              placeholder="RA"
              value={values.ra}
              onChange={handleInput}
              style={inputStyle}
            />
            {errors.ra && <small className="text-danger">{errors.ra}</small>}
          </div>

          <div className="form-group mb-3">
            <select
              name="role"
              className="form-control"
              value={values.role}
              onChange={handleInput}
              style={inputStyle}
            >
              <option value={0}>Passageiro</option>
              <option value={1}>Motorista</option>
            </select>
          </div>

          {values.role === 1 && (
            <div>
              <div className="form-group mb-3">
                <input
                  type="text"
                  name="modeloCarro"
                  className="form-control"
                  placeholder="Modelo do Carro"
                  value={values.modeloCarro}
                  onChange={handleInput}
                  style={inputStyle}
                />
              </div>
              <div className="form-group mb-3">
                <input
                  type="text"
                  name="placa"
                  className="form-control"
                  placeholder="Placa do Carro"
                  value={values.placa.toUpperCase()}
                  onChange={handleInput}
                  style={inputStyle}
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary w-100 mb-3"
            style={{
              backgroundColor: "#38b000",
              border: "none",
              padding: "12px 0",
              fontWeight: "bold",
            }}
          >
            Cadastrar-se
          </button>

          <p className="text-center mb-0">
            Já possui uma conta?{" "}
            <Link to="/" className="text-primary">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;
