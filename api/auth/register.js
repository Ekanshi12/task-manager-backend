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
        const { name, email, password, profileImageUrl, adminInviteToken } = req.body;

        // Check environment variables
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ message: 'JWT_SECRET not configured' });
        }

        //Check if user already exists
        const userExists = await User.findOne({ email });
        if(userExists) {
            return res.status(400).json({ message: "User already exists"});
        }

        //Determine user role: Admin if correct token is provided, otherwise Member
        let role = "member";
        if (adminInviteToken && adminInviteToken == process.env.ADMIN_INVITE_TOKEN)
        {
            role = "admin";
        }

        //Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //Create new user
        const user = await User.create({
            name, 
            email, 
            password: hashedPassword, 
            profileImageUrl, 
            role,
        });

        // Return user data with JWT
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profileImageUrl: user.profileImageUrl,
            token: generateToken(user._id),
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}