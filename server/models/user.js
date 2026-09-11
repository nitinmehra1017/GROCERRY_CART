import mongoose from 'mongoose'

const userSchema =new mongoose.Schema({
    name:{type:String, required:true},
    email:{type:String, required:true ,unique: true},
    password :{type:String , required:true},
    cartItems :{type:Object , default:{}},

},{minimize:false});


//if user model exist then it will be exported else it will be created and exported
const User = mongoose.models.User || mongoose.model('user',userSchema);


export default User;