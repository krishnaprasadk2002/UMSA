
const express =  require('express')
const Router = express.Router()
const { registerUser,loginUser, logout, updateUser } = require( '../controller/userController.js');
const {protect} = require ('../middleware/authMiddleware.js')
const {upload} = require('../middleware/multerMiddleware.js')
const User = require('../models/userModel.js')



Router.post('/register', registerUser);
Router.post('/login',loginUser)
Router.post('/logout',logout)
Router.put('/data',protect,updateUser)
Router.get('/me', protect, async (req, res) => {
    res.status(200).json(req.user);
  });

  Router.post('/upload',protect,(req,res)=>{
    upload(req,res,async(error)=>{
      if(error){
        res.status(400).json({message:error})
      }else{
        if(req.file == undefined){
         res.status(400).json({message:'no image selected to upload!'})
        }else{
          try {
            const user = await User.findById(req.user._id)
            console.log(user);
            if(!user){
              res.status(404).json({message:"user not found"})
            }else{
              user.image = `/uploads/${req.file.filename}`,
              await user.save()
              res.status(200).json({message:"image uploaded successfull",file: `/uploads/${req.file.filename}`})
            }
          } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
          }
        }
      }
    })
  })


module.exports = Router;