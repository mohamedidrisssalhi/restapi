// server.js - Main Express Server with REST API Routes
// This file sets up the Express server, connects to MongoDB, and defines all CRUD routes for Users

// Import required dependencies
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Import User model
const User = require('./models/User');

// Load environment variables from config/.env file
dotenv.config({ path: path.join(__dirname, 'config', '.env') });

// Create Express application
const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: true }));

// Set the port from environment variables or default to 3000
const PORT = process.env.PORT || 3000;

// Database connection function
const connectDatabase = async () => {
    try {
        // Connect to MongoDB using the connection string from .env
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Database connected successfully');
    } catch (error) {
        console.error('Database connection failed:', error.message);
        console.log('Please make sure MongoDB is running or update the MONGODB_URI in config/.env');
        console.log('Server will continue without database connection for demo purposes');
    }
};

// Connect to database
connectDatabase();

// Welcome route
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to the User REST API',
        endpoints: {
            'GET /users': 'Get all users',
            'POST /users': 'Create a new user',
            'PUT /users/:id': 'Update user by ID',
            'DELETE /users/:id': 'Delete user by ID'
        }
    });
});

// =================== CRUD ROUTES ===================

// 1. GET Route - RETURN ALL USERS
app.get('/users', async (req, res) => {
    try {
        // Find all users in the database
        const users = await User.find();
        
        // Return success response with users data
        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        // Handle any errors that occur during the database operation
        console.error('Error fetching users:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching users',
            error: error.message
        });
    }
});

// 2. POST Route - ADD A NEW USER TO THE DATABASE
app.post('/users', async (req, res) => {
    try {
        // Extract user data from request body
        const { name, email, age, phone } = req.body;
        
        // Create new user instance
        const newUser = new User({
            name,
            email,
            age,
            phone
        });
        
        // Save user to database
        const savedUser = await newUser.save();
        
        // Return success response with created user
        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: savedUser
        });
    } catch (error) {
        // Handle validation errors and duplicate key errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Validation Error',
                error: error.message
            });
        }
        
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Email already exists',
                error: 'This email is already registered'
            });
        }
        
        console.error('Error creating user:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating user',
            error: error.message
        });
    }
});

// 3. PUT Route - EDIT A USER BY ID
app.put('/users/:id', async (req, res) => {
    try {
        // Extract user ID from request parameters
        const userId = req.params.id;
        
        // Extract updated data from request body
        const updateData = req.body;
        
        // Find user by ID and update with new data
        // { new: true } returns the updated document
        // { runValidators: true } runs schema validation on update
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateData,
            { 
                new: true, 
                runValidators: true 
            }
        );
        
        // Check if user was found
        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        // Return success response with updated user
        res.status(200).json({
            success: true,
            message: 'User updated successfully',
            data: updatedUser
        });
    } catch (error) {
        // Handle validation errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Validation Error',
                error: error.message
            });
        }
        
        // Handle invalid ObjectId format
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid user ID format'
            });
        }
        
        console.error('Error updating user:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating user',
            error: error.message
        });
    }
});

// 4. DELETE Route - REMOVE A USER BY ID
app.delete('/users/:id', async (req, res) => {
    try {
        // Extract user ID from request parameters
        const userId = req.params.id;
        
        // Find user by ID and delete
        const deletedUser = await User.findByIdAndDelete(userId);
        
        // Check if user was found and deleted
        if (!deletedUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        // Return success response
        res.status(200).json({
            success: true,
            message: 'User deleted successfully',
            data: deletedUser
        });
    } catch (error) {
        // Handle invalid ObjectId format
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid user ID format'
            });
        }
        
        console.error('Error deleting user:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting user',
            error: error.message
        });
    }
});

// Error handling middleware for undefined routes
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Global error handling middleware
app.use((error, req, res, next) => {
    console.error('Global error handler:', error);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`API Documentation available at http://localhost:${PORT}`);
});

// Export app for testing purposes
module.exports = app;
