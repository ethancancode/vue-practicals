# Practical 8: MongoDB CRUD Operations

## Setup
1. Install dependencies: `npm install`
2. Create `.env` file from `.env.example` and add your MongoDB URI
3. Run server: `npm run dev`

## MongoDB Setup (if using local)
```
mongod  # Start MongoDB service
mongo   # Connect to MongoDB
use crud_db  # Switch to database
```

## API Endpoints to Test
- POST /api/items - Create item
- GET /api/items - Get all items
- GET /api/items/:id - Get single item
- PUT /api/items/:id - Update item
- DELETE /api/items/:id - Delete item

## Test Example
```bash
curl -X POST http://localhost:5000/api/items \
  -H "Content-Type: application/json" \
  -d '{"name":"Sample","description":"Test item"}'
```
