const mongoose = require('mongoose');
const { Schema } = mongoose;


const teacherSchema = new Schema({
   name:String,
   designation:String
});

exports.ADVISOR = mongoose.model('Advisor', teacherSchema);