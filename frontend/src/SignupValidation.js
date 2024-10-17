function Validation(values) {
  let errors = {};
  const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const password_pattern = /^[A-Za-z\d@$!%*?&]{1,20}$/;
  const ra_pattern = /^(0[0-9]|1[0-9]|2[0-4])\d{6}$/; // RA deve começar com números de '00' a '24' e ter 8 dígitos
  const placa_pattern = /^[a-zA-Z]{3}[0-9][A-Za-z0-9][0-9]{2}$/

  if (!values.placa) {
      errors.placa = "O numero da placa é obrigatório.";
  } else if (!placa_pattern.test(values.placa)) {
      errors.placa = "A placa não é válida.";
  }
  // Validação de email
  if (!values.email) {
    errors.email = "O email é obrigatório.";
  } else if (!email_pattern.test(values.email)) {
    errors.email = "O email não é válido.";
  }

  // Validação de senha
  if (!values.password) {
    errors.password = "A senha é obrigatória.";
  } else if (!password_pattern.test(values.password)) {
    errors.password =
      "A senha deve ter pelo menos 8 caracteres.";
  }

  // Validação de confirmação de senha
  if (!values.confirmPassword) {
    errors.confirmPassword = "Confirme sua senha.";
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = "As senhas não conferem.";
  }

  // Validação de RA
  if (!values.ra) {
    errors.ra = "O RA é obrigatório.";
  } else if (!ra_pattern.test(values.ra)) {
    errors.ra =
      "O RA deve começar com números de '00' a '24' e ter exatamente 8 dígitos.";
  }

  return errors;
}

export default Validation;
