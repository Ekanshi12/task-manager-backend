const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (userId) => {
    return jwt.sign({ id: userId}, process.env.JWT_SECRET, { expiresIn: "30d"});
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        // Check environment variables
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ message: 'JWT_SECRET not configured' });
        }

        const { email, password} = req.body;
        
        const user = await User.findOne({email});
        if(!user)
        {
            return res.status(401).json({ message: "Invalid email or password"});
        }

        //Compare Password
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch)
        {
            return res.status(401).json({ message: "Invalid email or password"});
        }

        //Return user data with JWT
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profileImageUrl: user.profileImageUrl,
            token: generateToken(user._id)
        });
        
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}