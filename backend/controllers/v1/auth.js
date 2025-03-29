const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'Gadfa23-234234-234234234';
const JWT_EXPIRES_IN = '1h';

const login = async (req, res) => {
    const { username, password } = req.body;

    const redis = req.app.locals.redis;
    const user = await redis.hget(`login:${username}`, 'password')
    console.log("user", user)
    if (!user || user !== password) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    const role = await redis.hget(`user:${username}`, 'role')
    const token = jwt.sign({
        userId: username,
        role,
    }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    res.cookie('token', token, {
        httpOnly: true,
        secure: false,
        maxAge: 3600 * 1000,
    });

    return res.json({
        message: 'Login successful',
        token,
        role: user.role,
        redirectTo: '/dashboard',
    });
};


const authorize = (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
  
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      return res.json({ userId: decoded.userId, role: decoded.role });
    } catch (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
  };
  
const logout = (_req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
}; 

module.exports = {
    login,
    authorize,
    logout
}
