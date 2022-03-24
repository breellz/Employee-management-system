const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const adminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate( value ) {
            if(!validator.isEmail(value)) {
                throw new Error( 'Invalid email')
            }
        }

    },

    password: {
        type: String,
        required: true,
        lowercase: true,
        minLength: 7,
        validate(value) {
            if( value.toLowerCase().includes('password')) {
                throw new Error('password musn\'t contain password')
            }
        }
    },
    isAdmin: {
        type: Boolean,
        default: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]

}, {
    timestamps: true
})

//Generate auth token
adminSchema.methods.generateAuthToken = async function () {
    const admin = this
    const token = jwt.sign({ _id: admin._id.toString()}, 'bankingapi')
    admin.tokens = admin.tokens.concat({token})
     await admin.save()
    return token
}

//login in administrator
adminSchema.statics.findByCredentials = async (email, password) => {
    const admin = await Admin.findOne({ email })
    if (!admin) {
        throw new Error('Unable to log in')
    }
    const isMatch = await bcrypt.compare(password, admin.password)
    if(!isMatch) {
        throw new Error('Unable to login')
    }

    return admin
}

//Hash plain password before saving
adminSchema.pre('save', async function(next) {
    const admin = this
    if (admin.isModified('password')) {
        admin.password = await bcrypt.hash(admin.password, 8)
    }

    next()
})
//hide private data
adminSchema.methods.toJSON = function () {
    const admin = this
    const adminObject = admin.toObject()

    delete adminObject.password
    delete adminObject.tokens

    return adminObject
}


const Admin = mongoose.model('Admin', adminSchema)
module.exports = Admin