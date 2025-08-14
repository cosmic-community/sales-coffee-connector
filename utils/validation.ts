export interface ValidationResult {
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

export function validateName(name: string, fieldName: string): ValidationResult {
  if (!name || name.trim().length === 0) {
    return { isValid: false, error: `${fieldName} is required` }
  }
  if (name.trim().length < 2) {
    return { isValid: false, error: `${fieldName} must be at least 2 characters long` }
  }
  return { isValid: true }
}

export function validateProfileUpdate(data: any): ValidationResult {
  // Email validation (if provided)
  if (data.email) {
    const emailResult = validateEmail(data.email)
    if (!emailResult.isValid) {
      return emailResult
    }
  }

  // Name validation (if provided)
  if (data.first_name !== undefined) {
    const firstNameResult = validateName(data.first_name, 'First name')
    if (!firstNameResult.isValid) {
      return firstNameResult
    }
  }

  if (data.last_name !== undefined) {
    const lastNameResult = validateName(data.last_name, 'Last name')
    if (!lastNameResult.isValid) {
      return lastNameResult
    }
  }

  // Company name validation (if provided)
  if (data.company_name !== undefined && (!data.company_name || data.company_name.trim().length === 0)) {
    return { isValid: false, error: 'Company name is required' }
  }

  // Job title validation (if provided)
  if (data.job_title !== undefined && (!data.job_title || data.job_title.trim().length === 0)) {
    return { isValid: false, error: 'Job title is required' }
  }

  // Years in sales validation (if provided)
  if (data.years_in_sales !== undefined) {
    const years = Number(data.years_in_sales)
    if (isNaN(years) || years < 0 || years > 50) {
      return { isValid: false, error: 'Years in sales must be a valid number between 0 and 50' }
    }
  }

  // LinkedIn URL validation (if provided)
  if (data.linkedin_url && data.linkedin_url.trim()) {
    const linkedInRegex = /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/
    if (!linkedInRegex.test(data.linkedin_url)) {
      return { isValid: false, error: 'Please enter a valid LinkedIn profile URL' }
    }
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
  // Email validation
  const emailResult = validateEmail(email)
  if (!emailResult.isValid) {
    return emailResult
  }

  // Password validation
  const passwordResult = validatePassword(password)
  if (!passwordResult.isValid) {
    return passwordResult
  }

  // Confirm password validation
  if (password !== confirmPassword) {
    return { isValid: false, error: 'Passwords do not match' }
  }

  // First name validation
  const firstNameResult = validateName(firstName, 'First name')
  if (!firstNameResult.isValid) {
    return firstNameResult
  }

  // Last name validation
  const lastNameResult = validateName(lastName, 'Last name')
  if (!lastNameResult.isValid) {
    return lastNameResult
  }

  return { isValid: true }
}

export function validateLoginForm(email: string, password: string): ValidationResult {
  // Email validation
  const emailResult = validateEmail(email)
  if (!emailResult.isValid) {
    return emailResult
  }

  // Password validation (basic check for login)
  if (!password || password.trim().length === 0) {
    return { isValid: false, error: 'Password is required' }
  }

  return { isValid: true }
}