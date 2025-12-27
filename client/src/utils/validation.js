export const validateEmail = (email) => {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  // At least 8 characters, one lowercase, one uppercase, one special character
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
  return passwordRegex.test(password);
};

export const getPasswordStrength = (password) => {
  let strength = 0;
  const checks = {
    hasLowerCase: /[a-z]/.test(password),
    hasUpperCase: /[A-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    isLongEnough: password.length >= 8,
  };

  if (checks.hasLowerCase) strength++;
  if (checks.hasUpperCase) strength++;
  if (checks.hasNumber) strength++;
  if (checks.hasSpecialChar) strength++;
  if (checks.isLongEnough) strength++;

  return {
    strength,
    checks,
    label: strength < 3 ? 'Weak' : strength < 5 ? 'Medium' : 'Strong',
  };
};

export const validatePhone = (phone) => {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone);
};
