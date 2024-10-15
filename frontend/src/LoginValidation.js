function Validation(values) {
  let errors = {};
  const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const password_pattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

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
      "A senha deve ter pelo menos 8 caracteres, uma letra maiúscula, uma minúscula, um número e um caractere especial.";
  }

  return errors;
}

export default Validation;