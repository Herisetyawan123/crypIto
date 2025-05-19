const registrationForm = document.getElementById('registration-form');
const fullNameInput = document.getElementById('fullName');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const phoneInput = document.getElementById('phone');
const termsCheckbox = document.getElementById('termsAgree');
const registerButton = document.getElementById('register-btn');

const fullNameError = document.getElementById('fullName-error');
const emailError = document.getElementById('email-error');
const passwordError = document.getElementById('password-error');
const confirmPasswordError = document.getElementById('confirmPassword-error');
const phoneError = document.getElementById('phone-error');
const termsError = document.getElementById('termsAgree-error');

document.addEventListener('DOMContentLoaded', () => {
  if (registrationForm) {
    registrationForm.addEventListener('submit', handleFormSubmit);

    if (fullNameInput)
      fullNameInput.addEventListener('input', validateFullName);
    if (emailInput) emailInput.addEventListener('input', validateEmail);
    if (passwordInput)
      passwordInput.addEventListener('input', validatePassword);
    if (confirmPasswordInput)
      confirmPasswordInput.addEventListener('input', validateConfirmPassword);
    if (phoneInput) phoneInput.addEventListener('input', validatePhone);
    if (termsCheckbox) termsCheckbox.addEventListener('change', validateTerms);
  }
});

function handleFormSubmit(e) {
  e.preventDefault();

  const isFullNameValid = validateFullName();
  const isEmailValid = validateEmail();
  const isPasswordValid = validatePassword();
  const isConfirmPasswordValid = validateConfirmPassword();
  const isPhoneValid = validatePhone();
  const areTermsAccepted = validateTerms();

  if (
    isFullNameValid &&
    isEmailValid &&
    isPasswordValid &&
    isConfirmPasswordValid &&
    isPhoneValid &&
    areTermsAccepted
  ) {
    showSuccessMessage();
  } else {
    showError('Please correct the errors in the form.', registerButton);
  }
}

function validateFullName() {
  const fullName = fullNameInput.value.trim();

  fullNameError.textContent = '';

  if (fullName === '') {
    fullNameError.textContent = 'Full name is required';
    return false;
  }

  if (fullName.length < 3) {
    fullNameError.textContent = 'Full name must be at least 3 characters';
    return false;
  }

  const words = fullName.split(' ').filter((word) => word.length > 0);
  if (words.length < 2) {
    fullNameError.textContent =
      'Please enter your full name (first and last name)';
    return false;
  }

  return true;
}

function validateEmail() {
  const email = emailInput.value.trim();

  emailError.textContent = '';

  if (email === '') {
    emailError.textContent = 'Email address is required';
    return false;
  }

  if (!email.includes('@')) {
    emailError.textContent = 'Email must contain an @ symbol';
    return false;
  }

  const parts = email.split('@');
  if (parts.length !== 2 || parts[0].length === 0) {
    emailError.textContent = 'Invalid email format';
    return false;
  }

  const domainParts = parts[1].split('.');
  if (
    domainParts.length < 2 ||
    domainParts[domainParts.length - 1].length < 2
  ) {
    emailError.textContent =
      'Email must have a valid domain extension (e.g., .com, .org)';
    return false;
  }

  return true;
}

function validatePassword() {
  const password = passwordInput.value;

  passwordError.textContent = '';

  if (password === '') {
    passwordError.textContent = 'Password is required';
    return false;
  }

  if (password.length < 8) {
    passwordError.textContent = 'Password must be at least 8 characters long';
    return false;
  }

  let hasUpperCase = false;
  for (let i = 0; i < password.length; i++) {
    if (
      password[i] === password[i].toUpperCase() &&
      password[i] !== password[i].toLowerCase()
    ) {
      hasUpperCase = true;
      break;
    }
  }

  if (!hasUpperCase) {
    passwordError.textContent =
      'Password must contain at least one uppercase letter';
    return false;
  }

  let hasNumber = false;
  for (let i = 0; i < password.length; i++) {
    if (!isNaN(parseInt(password[i]))) {
      hasNumber = true;
      break;
    }
  }

  if (!hasNumber) {
    passwordError.textContent = 'Password must contain at least one number';
    return false;
  }

  return true;
}

function validateConfirmPassword() {
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;

  confirmPasswordError.textContent = '';

  if (confirmPassword === '') {
    confirmPasswordError.textContent = 'Please confirm your password';
    return false;
  }

  if (password !== confirmPassword) {
    confirmPasswordError.textContent = 'Passwords do not match';
    return false;
  }

  return true;
}

function validatePhone() {
  const phone = phoneInput.value.trim();

  phoneError.textContent = '';

  if (phone === '') {
    phoneError.textContent = 'Phone number is required';
    return false;
  }

  const digits = phone.replace(/\D/g, '');

  if (digits.length < 10) {
    phoneError.textContent = 'Phone number must have at least 10 digits';
    return false;
  }

  return true;
}

function validateTerms() {
  termsError.textContent = '';

  if (!termsCheckbox.checked) {
    termsError.textContent = 'You must agree to the Terms & Conditions';
    return false;
  }

  return true;
}

function showSuccessMessage() {
  const successOverlay = document.createElement('div');
  successOverlay.className = 'success-overlay';

  const successContent = document.createElement('div');
  successContent.className = 'success-content';

  successContent.innerHTML = `
    <h2>Registration Successful!</h2>
    <p>Thank you for creating an account with cryPIto.</p>
    <p>You can now start your cryptocurrency journey.</p>
    <a href="index.html" class="btn-primary">Go to Homepage</a>
  `;

  successOverlay.appendChild(successContent);
  document.body.appendChild(successOverlay);

  const style = document.createElement('style');
  style.textContent = `
    .success-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0,0,0,0.8);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 100;
      animation: fadeIn 0.3s;
    }
    
    .success-content {
      background-color: var(--primary);
      padding: 2rem;
      border-radius: 12px;
      text-align: center;
      max-width: 90%;
      width: 500px;
      animation: scaleIn 0.3s;
      border: 1px solid var(--accent);
    }
    
    .success-content h2 {
      color: var(--accent);
      margin-bottom: 1rem;
    }
    
    .success-content p {
      margin-bottom: 1rem;
    }
    
    .success-content .btn-primary {
      margin-top: 1rem;
      display: inline-block;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes scaleIn {
      from { transform: scale(0.9); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
  `;

  document.head.appendChild(style);
}
