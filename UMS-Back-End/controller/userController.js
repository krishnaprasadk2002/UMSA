const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const asyncHandler = require('express-async-handler')
const { generateToken } = require('../utils/generateToken');
const upload = require('../middleware/multerMiddleware');


const registerUser = asyncHandler(async (req, res) => {
    try {
        const { name, email, number, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            res.status(400);
            throw new Error('User already exists');
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            number,
            password: hashPassword,
            is_admin: false
        });

        const user = await newUser.save();


        // console.log("userData", user);
        res.status(200).json({ message: 'Registration successful', user: user });
    } catch (error) {
        res.status(500).json({ message: 'Registration failed', error: error.message });
        console.log('registration error', error);
    }
});


const loginUser = asyncHandler(async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        console.log("login Data", user);

        if (!user) {
            return res.status(401).json({ message: 'Wrong email or password' });
        }

        if (!(await bcrypt.compare(password, user.password))) {
            console.log('loginPass', user.password);
            return res.status(401).json({ message: 'Wrong email or password' });
        }

        if (user) {
            console.log("its working");
            const token = generateToken(res, user._id);
            res.status(200).json({message:'login Successful',
                token,userData:user
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
        console.log('login error', error);
    }
});

const logout = asyncHandler(async (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        expires: new Date(0),
    });
    res.status(200).json({ message: 'User logged out' });
});

const getUserData = asyncHandler(async(req,res)=>{
    try {
        const users = await User.find({})
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({message: 'Server error', error: error.message})
    }
})

const updateUser = async (req,res)=>{
    try {
        const user = await User.findById(req.user._id)
        if(!user){
            return res.status(404).json({messsage:"user not found"})
        }

        user.name = req.body.name || user.name
        user.email = req.body.email || user.email
        user.number = req.body.number || user.number

        const updatedUser = await user.save();
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

const uploadprofileImage = (req,res)=>{
    upload(req,res,async(error)=>{
        if(error){
            res.status(400).json({ message: error });
        }else{
            if(!req.file){
                res.status(400).json({ message: 'No image selected for upload!' });
            }else{
                try {
                    const user = await User.findById(req.user._id)
                    if(!user){
                        res.status(404).json({message:'User not found'})
                    }else{
                        user.image = `/uploads/${req.file.filename}`;
                        awaitvuser.save();
                        res.status(200).json({ message: 'Image uploaded successfully', file: `/uploads/${req.file.filename}` });
                    }
                } catch (error) {
                    res.status(500).json({ message: 'Server error', error: error.message });
                }
            }
        }
    })
}

module.exports = {
    registerUser,
    loginUser,
    logout,
    getUserData,
    updateUser,
    uploadprofileImage
};
