const admin_protect = require('../middleware/adminAuthMiddleWare')

const express =  require('express');
const { adminLogin, addUser, logout, getUserDatas, updateUserById, getUserById, DeleteUserById, searchUser } = require('../controller/adminController');
const Router = express.Router()

Router.post('/adminlogin',adminLogin)
Router.post('/addnewuser',addUser)
Router.post('/logout',logout)
Router.get('/users',getUserDatas)
Router.get('/users/:id', getUserById);
Router.put('/users/:id',updateUserById)
Router.delete('/deleteuser/:id',DeleteUserById)
Router.get('/searchusers', searchUser);

module.exports = Router;