const mongoose = require('mongoose');
const { Schema } = mongoose;


const mealSchema = new Schema({
    user:String,
    createDate:String,
    meals:[String],
    isToday:Boolean
});

exports.Meal = mongoose.model('Meal', mealSchema);