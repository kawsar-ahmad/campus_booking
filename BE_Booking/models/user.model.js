const mongoose = require('mongoose');
const { Schema } = mongoose;


const userSchema = new Schema({
    email: String,
    password:String,
    role:String,
    series:String,
    roll:String
});

exports.User = mongoose.model('User', userSchema);