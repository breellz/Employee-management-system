const mongoose = require('mongoose')
const ObjectID = mongoose.Schema.Types.ObjectId

const transactionSchema = new mongoose.Schema({
        paidTo: {
            type: ObjectID,
            ref: 'User',
            required: true
        }, 
        paidBy : {
            type: ObjectID,
            ref: 'Admin',
            required: true

        },
        amount: {
            type: Number,
            required: true,
            min: 0
        },
        description: {
            type: String,
        }

}, {
    timestamps: true
})

const Transaction = mongoose.model('transaction', transactionSchema)
module.exports = Transaction