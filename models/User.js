// User.js - Mongoose User Model
// This file defines the User schema and exports the User model

const mongoose = require('mongoose');

// Define the User schema with validation
const userSchema = new mongoose.Schema({
    // User's name - required field
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters long'],
        maxlength: [50, 'Name cannot exceed 50 characters']
    },
    
    // User's email - required and unique
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    
    // User's age - optional field with validation
    age: {
        type: Number,
        min: [0, 'Age cannot be negative'],
        max: [120, 'Age seems unrealistic']
    },
    
    // User's phone number - optional field
    phone: {
        type: String,
        trim: true
    }
}, {
    // Add timestamps for created and updated dates
    timestamps: true
});

// Create and export the User model
const User = mongoose.model('User', userSchema);

module.exports = User;
