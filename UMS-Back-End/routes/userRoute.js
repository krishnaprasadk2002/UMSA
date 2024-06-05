
const express =  require('express')
const Router = express.Router()
const { registerUser,loginUser, logout, updateUser } = require( '../controller/userController.js');
const {protect} = require ('../middleware/authMiddleware.js')
const multer = require('multer')
const path = require('path')
const User = require('../models/userModel.js')



Router.post('/register', registerUser);
Router.post('/login',loginUser)
Router.post('/logout',logout)
Router.put('/data',protect,updateUser)
Router.get('/me', protect, async (req, res) => {
    res.status(200).json(req.user);
  });

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.resolve(__dirname, '../uploads/'));
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });
  
  const upload = multer({ storage: storage });
  
  Router.post('/uploadImage', upload.single('image'), async (req, res) => {
    try {
      const userId = req.body.userId;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      user.image = req.file.filename;
      await user.save();
  
      return res.status(201).json({
        message: 'File uploaded and user image updated successfully',
        file: req.file
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error occurred during file upload.' });
    }
  });

module.exports = Router;