import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Validation from "./SignupValidation";

function Signup() {
  const [values, setValues] = useState({
    nome: "",
    email: "",
    password: "",
    confirmPassword: "",
    celular: "",
    ra: "",
    role: 0, // Valor inicial para passageiro
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(""); // Estado para mensagens
  const navigate = useNavigate(); // Hook para redirecionamento

  const handleInput = (e) => {
    const { name, value } = e.target; // Mudança aqui
    setValues((prev) => ({
      ...prev,
      [name]: name === "role" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validação dos campos
    const validationErrors = Validation(values);
    setErrors(validationErrors);

    // Se não houver erros, prosseguir com o cadastro
    if (Object.keys(validationErrors).length === 0) {
      try {
        // Enviando os dados para o backend
        const response = await fetch("/api/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        // Verifica se a resposta é válida
        if (!response.ok) {
          throw new Error("Falha no cadastro"); // Lança um erro caso a resposta não seja 'ok'
        }

        const data = await response.json();
        console.log("Usuário cadastrado:", data);

        // Exibe mensagem de sucesso e redireciona
        setMessage("Cadastro realizado com sucesso!");
        navigate("/passageiro"); // Redireciona para a página de passageiro
      } catch (error) {
        console.error("Erro ao cadastrar:", error);
        setMessage("Erro ao realizar cadastro. Tente novamente.");
      }
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center bg-primary vh-100">
      <div className="bg-white p-3 rounded w-25">
      <h2 className="text-center mb-4">CADASTRO !</h2>

        <form
          className="mx-auto"
          style={{ maxWidth: "400px", marginTop: "50px" }}
          onSubmit={handleSubmit}
        >
          <div className="form-group mb-3">
            <label htmlFor="inputNome">Nome</label>
            <input
              type="text"
              name="nome"
              className="form-control"
              id="inputNome"
              placeholder="Seu Nome"
              value={values.nome}
              onChange={handleInput}
            />
            {errors.nome && (
              <small className="text-danger">{errors.nome}</small>
            )}
          </div>

          <div className="form-group mb-3">
            <label htmlFor="inputEmail">Endereço de email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              id="inputEmail"
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

          <div className="form-group mb-3">
            <label htmlFor="role">Função</label>
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
            {errors.role && (
              <small className="text-danger">{errors.role}</small>
            )}
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