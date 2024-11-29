const jwt = require('jsonwebtoken');

const verifyToken = async (req, res, next) => {
  try {
    // Extract the token from the Authorization header
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      console.log('Authorization header is missing');
      return res.status(401).json({ message: 'Access Denied: No token provided' });
    }

    // Ensure the token starts with "Bearer "
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : null;
    if (!token) {
      console.log('Invalid Authorization header format');
      return res.status(401).json({ message: 'Access Denied: Invalid token format' });
    }

    console.log('Token received:', token);

    // Verify the token
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token verified successfully:', verified);

    // Attach the decoded token payload to the request object
    req.user = verified;

    next(); // Proceed to the next middleware
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      console.error('Token verification error: Token expired');
      return res.status(401).json({ message: 'Invalid token: Token has expired' });
    } else if (err.name === 'JsonWebTokenError') {
      console.error('Token verification error: Invalid token');
      return res.status(400).json({ message: 'Invalid token' });
    } else {
      console.error('Token verification error:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
};

module.exports = verifyToken;
