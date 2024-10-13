import React from "react";
import { Link } from "react-router-dom";

function Signup() {
  return (
    <div className="d-flex justify-content-center align-items-center bg-primary vh-100">
      <div className="bg-white p-3 rounded w-25">
        <form
          className="mx-auto"
          style={{ maxWidth: "400px", marginTop: "50px" }}
        >
          <div className="form-group mb-3">
            <label htmlFor="inputEmail">Endereço de email</label>
            <input
              type="email"
              className="form-control"
              id="inputEmail"
              aria-describedby="emailHelp"
              placeholder="Coloque o seu email"
            />
            <small id="emailHelp" className="form-text text-muted">
              Nunca compartilharemos seu email com ninguém.
            </small>
          </div>
          <div className="form-group mb-3">
            <label htmlFor="inputPassword">Senha</label>
            <input
              type="password"
              className="form-control"
              id="inputPassword"
              placeholder="Senha"
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="inputPassword">Confirme a Senha</label>
            <input
              type="password"
              className="form-control"
              id="inputPassword"
              placeholder="Confirme a sua senha"
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="inputNumeroCeular">N° Celular</label>
            <input
              type="numeroCelular"
              className="form-control"
              id="inputNumeroCeular"
              placeholder="Numero do seu Celular"
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="inputRA">RA</label>
            <input
              type="RA"
              className="form-control"
              id="inputRA"
              placeholder="Seu RA"
            />
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
