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
    role: 0, // Valor inicial para passageiro
    modeloCarro: "", // Novo campo para o modelo do carro
    placa: "", // Novo campo para a placa
  });
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const handleInput = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: name === "role" ? Number(value) : value// Transformando o campo da placa em maiúsculas
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors(Validation(values));
    const validationErrors = Validation(values);
  
    if (Object.keys(validationErrors).length === 0) {
      fetch('/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })
        .then(response => response.json())
        .then(data => {
          if (data.error) {
            console.error('Erro:', data.error);
          } else {
            console.log('Usuário cadastrado:', data);
            if (values.role === 1) {
              navigate("/motorista");  // Redireciona para dashboardm para motoristas
            } else {
              navigate("/passageiro"); // Redireciona para dashboardp para passageiros
            }
          }
        })
        .catch(error => {
          console.error('Erro ao cadastrar:', error);
        });
    }
  };
  
  return (
    <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: '#0d1b2a' }}>
      <div className="bg-white p-3 rounded w-100" style={{ maxWidth: '450px', transform: 'scale(0.9)', transformOrigin: 'center' }}>
        <form className="mx-auto" onSubmit={handleSubmit}>
          <div className="form-group mb-2">
            <label htmlFor="inputName">Nome:</label>
            <input
              type="text"
              name="name"
              className="form-control"
              id="inputName"
              placeholder="Seu Nome"
              value={values.name}
              onChange={handleInput}
            />
            {errors.name && <small className="text-danger">{errors.name}</small>}
          </div>

          <div className="form-group mb-2">
            <label htmlFor="inputEmail">Endereço de email:</label>
            <input
              type="email"
              name="email"
              className="form-control"
              id="inputEmail"
              placeholder="Coloque o seu email"
              value={values.email}
              onChange={handleInput}
            />
            {errors.email && <small className="text-danger">{errors.email}</small>}
          </div>

          <div className="form-group mb-2">
            <label htmlFor="inputPassword">Senha:</label>
            <input
              type="password"
              name="password"
              className="form-control"
              id="inputPassword"
              placeholder="Senha"
              value={values.password}
              onChange={handleInput}
            />
            {errors.password && <small className="text-danger">{errors.password}</small>}
          </div>

          <div className="form-group mb-2">
            <label htmlFor="confirmPassword">Confirme a Senha:</label>
            <input
              type="password"
              name="confirmPassword"
              className="form-control"
              id="confirmPassword"
              placeholder="Confirme a sua senha"
              value={values.confirmPassword}
              onChange={handleInput}
            />
            {errors.confirmPassword && <small className="text-danger">{errors.confirmPassword}</small>}
          </div>

          <div className="form-group mb-2">
            <label htmlFor="inputNumeroCeular">N° Celular:</label>
            <input
              type="text"
              name="celular"
              className="form-control"
              id="inputNumeroCeular"
              placeholder="Numero do seu Celular"
              value={values.celular}
              onChange={handleInput}
            />
            {errors.celular && <small className="text-danger">{errors.celular}</small>}
          </div>

          <div className="form-group mb-2">
            <label htmlFor="inputRA">RA:</label>
            <input
              type="text"
              name="ra"
              className="form-control"
              id="inputRA"
              placeholder="Seu RA"
              value={values.ra}
              onChange={handleInput}
            />
            {errors.ra && <small className="text-danger">{errors.ra}</small>}
          </div>

          <div className="form-group mb-2">
            <label htmlFor="role">Função:</label>
            <select
              name="role"
              className="form-control"
              id="role"
              value={values.role}
              onChange={handleInput}
            >
              <option value={0}>Passageiro</option>
              <option value={1}>Motorista</option>
            </select>
            {errors.role && <small className="text-danger">{errors.role}</small>}
          </div>

          {values.role === 1 && (
            <>
              <div className="form-group mb-2">
                <label htmlFor="inputModeloCarro">Modelo do Carro:</label>
                <input
                  type="text"
                  name="modeloCarro"
                  className="form-control"
                  id="inputModeloCarro"
                  placeholder="Modelo do Carro"
                  value={values.modeloCarro}
                  onChange={handleInput}
                />
              </div>
              <div className="form-group mb-2">
                <label htmlFor="inputPlaca">Placa:</label>
                <input
                  type="text"
                  name="placa"
                  className="form-control"
                  id="inputPlaca"
                  placeholder="Placa do Carro"
                  value={values.placa.toUpperCase()}
                  onChange={handleInput}
                />
                {errors.placa && <small className="text-danger">{errors.placa}</small>}
              </div>
            </>
          )}

          <button
            type="submit"
            className="btn btn-success w-100 align-items-center mb-2"
          >
            Cadastrar-se
          </button>
          <p className="text-center mb-2">
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
