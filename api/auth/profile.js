const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

export default async function handler(req, res) {
    try {
        // Handle different HTTP methods
        if (req.method === 'GET') {
            // Get profile logic
            // You'll need to implement JWT verification here
            const user = await User.findById(req.user.id).select("-password");
            if(!user)
            {
                return res.status(404).json({ message: "User not found"});
            }
            res.json(user);
        } else if (req.method === 'PUT') {
            // Update profile logic
            const user = await User.findById(req.user.id);
            
            if(!user)
            {
                return res.status(404).json({message: "User not found."});
            }
    
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
    
            if(req.body.password)
            {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(req.body.password, salt);
            }
    
            const updatedUser = await user.save();
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                token: generateToken(updatedUser._id),
            });
        } else {
            return res.status(405).json({ message: 'Method not allowed' });
        }
    } catch (error) {
        console.error('Profile error:', error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}