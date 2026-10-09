# Async/Await, Promises & Callbacks Practice

## What You're Learning
Three ways to handle asynchronous operations in JavaScript:
1. **Callbacks** - Old way, nested & hard to read
2. **Promises** - Better, chainable with .then()
3. **Async/Await** - Best, looks like synchronous code

## Setup
```bash
npm install
npm start
```

## What to Do
1. Read the TODO comments in app.js
2. Implement each method following the hints
3. Run `npm start` and see output
4. Compare how each method handles the same task

## The API
- **URL**: https://randomuser.me/api/
- **Returns**: Random person data (name, email, image)
- **Free**: No API key needed!

## Expected Output
```
METHOD 1: CALLBACK PATTERN
User: John Doe
Email: john@example.com
Image: https://...

METHOD 2: PROMISE PATTERN
User: Sarah Smith
Email: sarah@example.com
Image: https://...

METHOD 3: ASYNC/AWAIT PATTERN
User: Mike Johnson
Email: mike@example.com
Image: https://...
```

## Key Insights
- Callbacks work but get messy with nested calls
- Promises are cleaner with .then() chaining
- Async/await is the cleanest - reads like normal code!

## Error Handling
- Callback: `callback(error)`
- Promise: `.catch(err => ...)`
- Async/Await: `try/catch` block
