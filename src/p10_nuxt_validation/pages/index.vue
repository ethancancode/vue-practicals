<template>
  <div class="container">
    <div class="form-box">
      <h1>Registration Form</h1>
      <p class="subtitle">Complete the form below. All fields are required.</p>
      
      <form @submit.prevent="handleSubmit">
        
        <!-- Name Field -->
        <div class="form-group">
          <label for="name">Full Name</label>
          <input 
            id="name"
            v-model="formData.name"
            type="text"
            placeholder="Enter your full name"
            :class="{ 'input-error': errors.name }"
          />
          <span v-if="errors.name" class="error">{{ errors.name }}</span>
        </div>

        <!-- Email Field -->
        <div class="form-group">
          <label for="email">Email</label>
          <input 
            id="email"
            v-model="formData.email"
            type="email"
            placeholder="example@email.com"
            :class="{ 'input-error': errors.email }"
          />
          <span v-if="errors.email" class="error">{{ errors.email }}</span>
        </div>

        <!-- Password Field -->
        <div class="form-group">
          <label for="password">Password</label>
          <input 
            id="password"
            v-model="formData.password"
            type="password"
            placeholder="Min 8 characters, 1 number, 1 uppercase"
            :class="{ 'input-error': errors.password }"
          />
          <span v-if="errors.password" class="error">{{ errors.password }}</span>
        </div>

        <!-- Phone Field -->
        <div class="form-group">
          <label for="phone">Phone</label>
          <input 
            id="phone"
            v-model="formData.phone"
            type="tel"
            placeholder="10 digit number"
            :class="{ 'input-error': errors.phone }"
          />
          <span v-if="errors.phone" class="error">{{ errors.phone }}</span>
        </div>

        <!-- Submit Button -->
        <button type="submit" class="submit-btn" :disabled="submitting">
          {{ submitting ? 'Submitting...' : 'Submit' }}
        </button>
      </form>

      <!-- Success Message -->
      <div v-if="successMessage" class="success">✓ {{ successMessage }}</div>
      
      <!-- API Error Message -->
      <div v-if="apiError" class="api-error">✕ {{ apiError }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

definePageMeta({
  layout: false
})

const formData = ref({
  name: '',
  email: '',
  password: '',
  phone: ''
})

const errors = ref({})
const submitting = ref(false)
const successMessage = ref('')
const apiError = ref('')

// Validation regex patterns
const nameRegex = /^[a-zA-Z\s]+$/
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/
const phoneRegex = /^\d{10}$/

// Validation Functions
const validateName = (name) => {
  if (typeof name !== 'string' || !name.trim()) return 'Full Name is required'
  if (name.trim().length < 3) return 'Name must be at least 3 characters long'
  if (!nameRegex.test(name.trim())) return 'Name must contain letters only (no numbers or special characters)'
  return ''
}

const validateEmail = (email) => {
  if (!email || !email.trim()) return 'Email address is required'
  if (!emailRegex.test(email.trim())) return 'Please enter a valid email address'
  return ''
}

const validatePassword = (password) => {
  if (!password) return 'Password is required'
  if (password.length < 8) return 'Password must be at least 8 characters long'
  if (!passwordRegex.test(password)) return 'Password must contain at least 1 number and 1 uppercase letter'
  return ''
}

const validatePhone = (phone) => {
  if (!phone || !phone.trim()) return 'Phone number is required'
  if (!phoneRegex.test(phone.trim())) return 'Phone number must be exactly 10 digits'
  return ''
}

const validateForm = () => {
  const newErrors = {}

  const nameErr = validateName(formData.value.name)
  if (nameErr) newErrors.name = nameErr

  const emailErr = validateEmail(formData.value.email)
  if (emailErr) newErrors.email = emailErr

  const passErr = validatePassword(formData.value.password)
  if (passErr) newErrors.password = passErr

  const phoneErr = validatePhone(formData.value.phone)
  if (phoneErr) newErrors.phone = phoneErr

  errors.value = newErrors
  return Object.keys(newErrors).length === 0
}

const handleSubmit = async () => {
  successMessage.value = ''
  apiError.value = ''

  // 1. Client-Side Validation
  const isValid = validateForm()
  if (!isValid) return

  submitting.value = true

  try {
    // 2. Server-Side Validation API Call
    const response = await $fetch('/api/register', {
      method: 'POST',
      body: formData.value
    })

    if (response.error) {
      apiError.value = response.error
    } else {
      successMessage.value = response.message || 'Form submitted successfully!'
      formData.value = { name: '', email: '', password: '', phone: '' }
      errors.value = {}
    }
  } catch (err) {
    apiError.value = err.data?.message || err.data?.error || 'Server error occurred during submission.'
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.form-box {
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.2);
  max-width: 420px;
  width: 100%;
}

h1 {
  text-align: center;
  color: #333;
  margin: 0 0 10px 0;
  font-size: 24px;
}

.subtitle {
  text-align: center;
  color: #666;
  font-size: 14px;
  margin-bottom: 25px;
}

.form-group {
  margin-bottom: 18px;
}

label {
  display: block;
  margin-bottom: 6px;
  color: #333;
  font-weight: 500;
  font-size: 14px;
}

input {
  width: 100%;
  padding: 11px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  box-sizing: border-box;
  transition: border-color 0.3s;
}

input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 5px rgba(102, 126, 234, 0.2);
}

input.input-error {
  border-color: #dc3545;
  background-color: #fff8f8;
}

.error {
  display: block;
  color: #dc3545;
  font-size: 12px;
  margin-top: 5px;
  font-weight: bold;
}

.submit-btn {
  width: 100%;
  padding: 12px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 10px;
  transition: background 0.3s;
}

.submit-btn:hover {
  background: #5568d3;
}

.submit-btn:disabled {
  background: #a5b4fc;
  cursor: not-allowed;
}

.success {
  margin-top: 20px;
  padding: 15px;
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
  border-radius: 5px;
  text-align: center;
  font-weight: 500;
}

.api-error {
  margin-top: 20px;
  padding: 15px;
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  border-radius: 5px;
  text-align: center;
  font-weight: 500;
}
</style>
