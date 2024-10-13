import React, { useState } from "react";
import { Link } from "react-router-dom";
import Validation from "./SignupValidation"; 

function Signup() {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    celular: "",
    ra: "",
  });

  const [errors, setErrors] = useState({});

  const handleInput = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors(Validation(values));
  };

  return (
    <div className="d-flex justify-content-center align-items-center bg-primary vh-100">
      <div className="bg-white p-3 rounded w-25">
        <form
          action=""
          className="mx-auto"
          style={{ maxWidth: "400px", marginTop: "50px" }}
          onSubmit={handleSubmit}
        >
          <div className="form-group mb-3">
            <label htmlFor="inputName">Nome</label>
            <input
              type="text"
              name="name"
              className="form-control"
              id="inputName"
              aria-describedby="nameHelp"
              placeholder="Seu Nome"
              value={values.name}
              onChange={handleInput}
            />
            {errors.name && (
              <small className="text-danger">{errors.name}</small>
            )}
          </div>
          <div className="form-group mb-3">
            <label htmlFor="inputEmail">Endereço de email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              id="inputEmail"
              aria-describedby="emailHelp"
              placeholder="Coloque o seu email"
              value={values.email}
              onChange={handleInput}
            />
            {errors.email && (
              <small className="text-danger">{errors.email}</small>
            )}
          </div>
          <div className="form-group mb-3">
            <label htmlFor="inputPassword">Senha</label>
            <input
              type="password"
              name="password"
              className="form-control"
              id="inputPassword"
              placeholder="Senha"
              value={values.password}
              onChange={handleInput}
            />
            {errors.password && (
              <small className="text-danger">{errors.password}</small>
            )}
          </div>
          <div className="form-group mb-3">
            <label htmlFor="confirmPassword">Confirme a Senha</label>
            <input
              type="password"
              name="confirmPassword"
              className="form-control"
              id="confirmPassword"
              placeholder="Confirme a sua senha"
              value={values.confirmPassword}
              onChange={handleInput}
            />
            {errors.confirmPassword && (
              <small className="text-danger">{errors.confirmPassword}</small>
            )}
          </div>
          <div className="form-group mb-3">
            <label htmlFor="inputNumeroCeular">N° Celular</label>
            <input
              type="text"
              name="celular"
              className="form-control"
              id="inputNumeroCeular"
              placeholder="Numero do seu Celular"
              value={values.celular}
              onChange={handleInput}
            />
            {errors.celular && (
              <small className="text-danger">{errors.celular}</small>
            )}
          </div>
          <div className="form-group mb-3">
            <label htmlFor="inputRA">RA</label>
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
          <button
            type="submit"
            className="btn btn-success w-100 align-items-center mb-3"
          >
            Cadastrar-se
          </button>
          <p>
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
