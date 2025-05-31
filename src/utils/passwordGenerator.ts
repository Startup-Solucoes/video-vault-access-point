
export const generateStrongPassword = (length: number = 12): string => {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  
  // Garantir pelo menos um caractere de cada tipo
  let password = '';
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += specialChars[Math.floor(Math.random() * specialChars.length)];
  
  // Preencher o resto da senha
  const allChars = lowercase + uppercase + numbers + specialChars;
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // Embaralhar a senha para que os caracteres obrigatórios não fiquem sempre no início
  return password.split('').sort(() => Math.random() - 0.5).join('');
};

export const validatePasswordStrength = (password: string): {
  isStrong: boolean;
  score: number;
  feedback: string[];
} => {
  const feedback: string[] = [];
  let score = 0;
  
  // Verificar comprimento
  if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push('Deve ter pelo menos 8 caracteres');
  }
  
  // Verificar letra minúscula
  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Deve conter pelo menos uma letra minúscula');
  }
  
  // Verificar letra maiúscula
  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Deve conter pelo menos uma letra maiúscula');
  }
  
  // Verificar número
  if (/\d/.test(password)) {
    score += 1;
  } else {
    feedback.push('Deve conter pelo menos um número');
  }
  
  // Verificar caractere especial
  if (/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Deve conter pelo menos um caractere especial (!@#$%^&*...)');
  }
  
  return {
    isStrong: score >= 4,
    score,
    feedback
  };
};
