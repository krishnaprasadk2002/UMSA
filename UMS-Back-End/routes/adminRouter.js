const express =  require('express');
const { adminLogin, addUser, logout, getUserDatas, editUser, updateUserById, getUserById } = require('../controller/adminController');
const Router = express.Router()

Router.post('/adminlogin',adminLogin)
Router.post('/addnewuser',addUser)
Router.post('/logout',logout)
Router.get('/users',getUserDatas)
Router.get('/users/:id', getUserById);
Router.put('/users/:id',updateUserById)

module.exports = Router;