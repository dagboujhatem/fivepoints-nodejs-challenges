const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const todoSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Title is required.']
    },
    description: {
        type: String,
        required: [true, 'Description is required.']
    }},
    {
        timestamps: true,
        versionKey: false
    });
    
const todoModel = mongoose.model('todo', todoSchema);
module.exports = todoModel;