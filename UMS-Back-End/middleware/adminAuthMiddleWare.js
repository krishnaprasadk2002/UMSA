const jwt = require('jsonwebtoken')
const User = require('../models/userModel')


const adminProtect = async (req, res, next) => {
    try {
      const admin_token = req.headers.authorization.split(' ')[1];
      if (!admin_token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
      }
  
      const decoded = jwt.verify(admin_token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select('-password');
  
      if (!req.user || !req.user.is_admin) {
        return res.status(403).json({ message: 'Not authorized as admin' });
      }
  
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  };

module.exports = {adminProtect}