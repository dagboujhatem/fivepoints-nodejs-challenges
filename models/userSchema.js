const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName:{
        type: String,
        required: [true, 'First name is required.']
    },
    lastName:{
        type: String,
        required: [true, 'Last name is required.']
    },
    age:{
        type: Number,
        required: [true, 'Age is required.']
    },
    email:{
        type: String,
        required: [true, 'E-mail is required.']
    },
    password: {
        type: String,
        required: [true, 'Password is required.']
    },
    todos: [{ type: Schema.Types.ObjectId, ref: 'todo'}]
    },
    {
        timestamps: true,
        versionKey: false
    });

const userModel = mongoose.model('user', UserSchema);
module.exports = userModel;