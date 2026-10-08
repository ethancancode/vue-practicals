# Practical 10: Form Validation & Error Handling in Nuxt

## Setup
1. Run: `npm install`
2. Start: `npm run dev`
3. Open: http://localhost:3000

## What to Implement

### Client-Side (pages/index.vue)
1. Create reactive form data object
2. Create errors object for error messages
3. Write validation functions:
   - validateName: min 3 chars
   - validateEmail: valid email format
   - validatePassword: min 8 chars, 1 uppercase, 1 number
   - validatePhone: exactly 10 digits
4. Call validateForm() before submission
5. Display errors for each field

### Server-Side (server/api/register.post.js)
1. Validate all required fields
2. Implement same validation as client
3. Return success or error response

## Testing
- Fill form with invalid data and see errors
- Test password with insufficient criteria
- Test invalid email format
- Try 10-digit phone validation
- Submit valid form and see success message

## Key Concepts
- Client-side validation = UX feedback
- Server-side validation = Security
- Both are needed!
