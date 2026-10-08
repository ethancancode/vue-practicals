export default defineEventHandler(async (event) => {
  const body = await readBody(event) || {}

  const { name, email, password, phone } = body

  // 1. Check all required fields are present
  if (!name || !email || !password || !phone) {
    return {
      error: 'All fields (Name, Email, Password, Phone) are required'
    }
  }

  // 2. Server-side Name validation
  const nameRegex = /^[a-zA-Z\s]+$/
  if (typeof name !== 'string' || name.trim().length < 3) {
    return {
      error: 'Server Validation Failed: Name must be a string of at least 3 characters'
    }
  }
  if (!nameRegex.test(name.trim())) {
    return {
      error: 'Server Validation Failed: Name must contain letters only (no numbers or special characters)'
    }
  }

  // 3. Server-side Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.trim())) {
    return {
      error: 'Server Validation Failed: Invalid email format'
    }
  }

  // 4. Server-side Password validation
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/
  if (!passwordRegex.test(password)) {
    return {
      error: 'Server Validation Failed: Password must be at least 8 characters long with 1 uppercase letter and 1 number'
    }
  }

  // 5. Server-side Phone validation
  const phoneRegex = /^\d{10}$/
  if (!phoneRegex.test(phone.trim())) {
    return {
      error: 'Server Validation Failed: Phone number must be exactly 10 digits'
    }
  }

  // Success Response
  return {
    success: true,
    message: 'Registration successful! Server validation passed.'
  }
})
