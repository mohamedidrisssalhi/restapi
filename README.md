# REST API PROJECT

REST API for user management built with Node.js, Express.js, and MongoDB using Mongoose.

## Project Structure

```
restapi/
├── config/
│   └── .env
├── models/
│   └── User.js
├── server.js
├── package.json
└── README.md
```

## Running the Server

```bash
# Start the server
npm start

# Or run directly
node server.js
```

The server will start on `http://localhost:3000`

## API Endpoints

### Base URL: `http://localhost:3000`

## Testing with Postman

**GET Request - Get all users:**
   - URL: `http://localhost:3000/users`
   - Method: GET

**POST Request - Create user:**
   - URL: `http://localhost:3000/users`
   - Method: POST
   - Headers: `Content-Type: application/json`
   - Body (raw JSON):
     ```json
     {
       "name": "Jane Doe",
       "email": "jane@example.com",
       "age": 28,
       "phone": "0987654321"
     }
     ```

**PUT Request - Update user:**
   - URL: `http://localhost:3000/users/{USER_ID}`
   - Method: PUT
   - Headers: `Content-Type: application/json`
   - Body (raw JSON):
     ```json
     {
       "name": "Jane Smith",
       "age": 29
     }
     ```

**DELETE Request - Delete user:**
   - URL: `http://localhost:3000/users/{USER_ID}`
   - Method: DELETE

## User Schema

The User model includes the following fields:

- **name** (String, required): User's full name
- **email** (String, required, unique): User's email address
- **age** (Number, optional): User's age
- **phone** (String, optional): User's phone number
- **createdAt** (Date): Automatically generated creation timestamp
- **updatedAt** (Date): Automatically generated last update timestamp

## Error Handling

The API includes comprehensive error handling for:
- Validation errors
- Duplicate email addresses
- Invalid user IDs
- Database connection issues
- Server errors

## Testing
Use Postman to test all four CRUD routes.

## Database Connection
- Uses MongoDB Atlas for cloud database storage
- Mongoose ODM for data manipulation
- Environment variables for secure configuration