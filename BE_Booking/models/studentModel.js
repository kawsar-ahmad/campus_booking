const mongoose = require('mongoose');
const { Schema } = mongoose;


const studentSchema = new Schema({
   roll:String,
   series:String,
   email:String
});

exports.STUDENT = mongoose.model('Student', studentSchema);