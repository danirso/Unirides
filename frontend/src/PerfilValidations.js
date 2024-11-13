function Validation(values) {
  let errors = {};
  const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const celular_pattern = /^[0-9]{10,11}$/;
  const ra_pattern = /^(0[0-9]|1[0-9]|2[0-4])\d{6}$/;

  if (!values.nome) {
    errors.nome = "O nome é obrigatório.";
  }

  if (!values.email) {
    errors.email = "O email é obrigatório.";
  } else if (!email_pattern.test(values.email)) {
    errors.email = "O email não é válido.";
  }

  if (!values.celular) {
    errors.celular = "O número de celular é obrigatório.";
  } else if (!celular_pattern.test(values.celular)) {
    errors.celular = "Número de celular inválido.";
  }

  if (!values.ra) {
    errors.ra = "O RA é obrigatório.";
  } else if (!ra_pattern.test(values.ra)) {
    errors.ra =
      "O RA deve começar com números de '00' a '24' e ter exatamente 8 dígitos.";
  }

  return errors;
}

export default Validation;
