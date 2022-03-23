const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,

    },
    password: {
        type: String,
        required: true,
        minLength: 7,
        toLowerCase: true
    }

}, {
    timestamps: true
})


const User = mongoose.model('User', userSchema)
module.exports = User