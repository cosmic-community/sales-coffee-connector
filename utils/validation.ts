interface ValidationResult {
  isValid: boolean
  error?: string
}

export function validateEmail(email: string): ValidationResult {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  
  if (!email) {
    return { isValid: false, error: 'Email is required' }
  }
  
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' }
  }
  
  return { isValid: true }
}

export function validatePassword(password: string): ValidationResult {
  if (!password) {
    return { isValid: false, error: 'Password is required' }
  }
  
  if (password.length < 6) {
    return { isValid: false, error: 'Password must be at least 6 characters long' }
  }
  
  return { isValid: true }
}

export function validateLoginForm(email: string, password: string): ValidationResult {
  const emailValidation = validateEmail(email)
  if (!emailValidation.isValid) {
    return emailValidation
  }
  
  const passwordValidation = validatePassword(password)
  if (!passwordValidation.isValid) {
    return passwordValidation
  }
  
  return { isValid: true }
}

export function validateName(name: string, fieldName: string): ValidationResult {
  if (!name || name.trim().length === 0) {
    return { isValid: false, error: `${fieldName} is required` }
  }
  
  if (name.trim().length < 2) {
    return { isValid: false, error: `${fieldName} must be at least 2 characters long` }
  }
  
  return { isValid: true }
}

export function validateSignupForm(
  email: string, 
  password: string, 
  confirmPassword: string, 
  firstName: string, 
  lastName: string
): ValidationResult {
  // Validate email
  const emailValidation = validateEmail(email)
  if (!emailValidation.isValid) {
    return emailValidation
  }

  // Validate password
  const passwordValidation = validatePassword(password)
  if (!passwordValidation.isValid) {
    return passwordValidation
  }

  // Validate password confirmation
  if (password !== confirmPassword) {
    return { isValid: false, error: 'Passwords do not match' }
  }

  // Validate first name
  const firstNameValidation = validateName(firstName, 'First name')
  if (!firstNameValidation.isValid) {
    return firstNameValidation
  }

  // Validate last name
  const lastNameValidation = validateName(lastName, 'Last name')
  if (!lastNameValidation.isValid) {
    return lastNameValidation
  }

  return { isValid: true }
}

export function validateProfileUpdate(data: any): ValidationResult {
  // Basic validation for profile updates
  if (data.email && !validateEmail(data.email).isValid) {
    return validateEmail(data.email)
  }

  if (data.first_name && !validateName(data.first_name, 'First name').isValid) {
    return validateName(data.first_name, 'First name')
  }

  if (data.last_name && !validateName(data.last_name, 'Last name').isValid) {
    return validateName(data.last_name, 'Last name')
  }

  if (data.years_in_sales && (typeof data.years_in_sales !== 'number' || data.years_in_sales < 0)) {
    return { isValid: false, error: 'Years in sales must be a positive number' }
  }

  return { isValid: true }
}