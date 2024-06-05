const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const { generateToken } = require('../utils/generateToken');

const adminLogin = async (req, res) => {
  try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
          res.status(401).json({ message: "User not found" });
          return;
      }
      if (!user.is_admin) {
          res.status(403).json({ message: "User is not an admin" });
          return;
      }
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
          res.status(401).json({ message: "Incorrect password" });
          return;
      }
      const token = generateToken(res, user._id, true); 
      res.status(200).json({ email: user.email, token });
  } catch (error) {
      res.status(500).json({ message: "Server error" });
  }
};

const addUser = asyncHandler(async (req, res) => {
  try {
    const { name, email, number, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      number,
      password: hashPassword,
      is_admin: false
    });

    await newUser.save();
    res.status(201).json({ message: 'User added successfully', user: newUser });

  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ message: 'Server error', error });
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

const getUserDatas = asyncHandler(async (req, res) => {
  try {
    const user = await User.find({})
    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
})

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const updateUserById = async (req, res) => {
  try {
    const { name, email, number } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, number },
      { new: true, runValidators: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const DeleteUserById =  async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByIdAndDelete(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
   
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const searchUser = async (req, res) => {
  try {
    const { query } = req.query;
    const regex = new RegExp(query, 'i');
    const users = await User.find({
      $or: [
        { name: regex },
        { email: regex },
        { number: regex }
      ]
    });
    res.status(200).json(users);
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


module.exports = {
  adminLogin,
  addUser,
  logout,
  getUserDatas,
  getUserById,
  updateUserById,
  DeleteUserById,
  searchUser

}