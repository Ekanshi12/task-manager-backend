export default async function handler(req, res) {
    res.status(200).json({ 
        message: 'Auth endpoint working',
        method: req.method,
        hasJwtSecret: !!process.env.JWT_SECRET,
        hasAdminToken: !!process.env.ADMIN_INVITE_TOKEN
    });
}