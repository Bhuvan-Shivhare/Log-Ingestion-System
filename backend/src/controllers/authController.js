const User = require('../models/User');
const asyncWrapper = require('../utils/asyncWrapper');
const jwt = require('jsonwebtoken');

// Generate JWT Helper
const generateToken = (user) => {
    return jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.TOKEN_EXPIRY }
    );
};

// @desc    Register user
// @route   POST /auth/register
// @access  Public
exports.register = asyncWrapper(async (req, res) => {
    const { name, email, password, role } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Create user
    // Role will default to 'viewer' if not provided
    // If role is provided, ensure it is valid via Mongoose validation or handle here
    const user = await User.create({
        name,
        email,
        password,
        role // Optional, defaults to viewer
    });

    const token = generateToken(user);

    res.status(201).json({
        success: true,
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
});

// @desc    Login user
// @route   POST /auth/login
// @access  Public
exports.login = asyncWrapper(async (req, res) => {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Please provide an email and password' });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(user);

    res.status(200).json({
        success: true,
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
});
