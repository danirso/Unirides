import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CarInfo() {
  const [carInfo, setCarInfo] = useState({
    modelo: '',
    placa: '',
    arCondicionado: 'ligado', // valor padrão
    estiloMusical: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCarInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Você pode adicionar uma lógica para salvar os dados aqui
    // Redirecionar para dashboard do motorista após salvar
    navigate('/dashboardm');
  };

  return (
    <div className="container mt-5">
      <h2>Informações do Carro</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-3">
          <label htmlFor="modelo">Modelo do Carro</label>
          <input
            type="text"
            className="form-control"
            id="modelo"
            name="modelo"
            value={carInfo.modelo}
            onChange={handleChange}
            placeholder="Digite o modelo do carro"
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="placa">Placa</label>
          <input
            type="text"
            className="form-control"
            id="placa"
            name="placa"
            value={carInfo.placa}
            onChange={handleChange}
            placeholder="Digite a placa"
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="arCondicionado">Preferência de Ar Condicionado</label>
          <select
            className="form-control"
            id="arCondicionado"
            name="arCondicionado"
            value={carInfo.arCondicionado}
            onChange={handleChange}
          >
            <option value="ligado">Ligado</option>
            <option value="desligado">Desligado</option>
          </select>
        </div>
        <div className="form-group mb-3">
          <label htmlFor="estiloMusical">Estilo Musical Preferido</label>
          <input
            type="text"
            className="form-control"
            id="estiloMusical"
            name="estiloMusical"
            value={carInfo.estiloMusical}
            onChange={handleChange}
            placeholder="Digite seu estilo musical"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Salvar Informações
        </button>
      </form>
    </div>
  );
}

export default CarInfo;
