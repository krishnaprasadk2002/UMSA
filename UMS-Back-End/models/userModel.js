const mongoose = require( "mongoose" )

 const userScema = new mongoose.Schema({
    name: {
        type: String,
        required: true
      },
      email: {
        type: String,
        required: true,
        unique: true
      },
      number: {
        type: String,
        required: true
      },
      password: {
        type: String,
        required: true
      },
    is_admin:{
        type:Boolean,
    },
    image:{
        type:String
    }
})

module.exports = mongoose.model('users',userScema)