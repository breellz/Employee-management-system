const express = require('express')
const mongoose = require('mongoose');
const ObjectID = mongoose.Types.ObjectId
const Admin = require('../models/admin')
const adminAuth = require('../middleware/adminAuth')
const User = require('../models/user')
const Transaction = require('../models/transaction')
const { validationRules, validate } = require('../middleware/validators/Login')

const router = new express.Router()

//create new administrator account
router.post('/admin', validationRules(), validate, async (req, res) => {
    const admin = new Admin(req.body)

    try {
        await admin.save()
        const token = await admin.generateAuthToken()

        res.status(201).send({ admin, token })
    } catch (error) {
        res.status(400).send(error)
    }

})

//create new users
router.post('/admin/users', validationRules(), validate, adminAuth, async (req, res) => {
    const userBody = req.body

    const user = new User({
        createdBy: req.admin._id,
        ...userBody
    })

    try {
        await user.save()

        res.status(201).send({ user })
    } catch (error) {
        res.status(400).send(error)
    }

})

//login administrator account

router.post('/admin/login', validationRules(), validate, async (req, res) => {
    try {
        const admin = await Admin.findByCredentials(req.body.email, req.body.password)
        const token = await admin.generateAuthToken()
        res.send({ admin, token })
    } catch (error) {
        res.status(400).send(error)
    }
})

//logout adminstrator account
router.post('/admin/logout', adminAuth, async (req, res) => {

    try {
        req.admin.tokens = req.admin.tokens.filter((token) => {
            return token.token !== req.token
        })

        await req.admin.save()
        res.send()
    } catch (error) {
        res.status(500).send()
    }
})

//Logout All administrator login sessions
router.post('/admin/logoutAll', adminAuth, async (req, res) => {
    try {
        req.admin.tokens = []
        await req.admin.save()
        res.send()
    } catch (error) {
        res.status(500).send()
    }
})


//fetch all users

router.get('/admin/users', adminAuth, async (req, res) => {
    try {
        const users = await User.find({})
        res.send({ users })
    } catch (error) {
        res.status(400).send()
    }
})

//update employee details

router.patch('/admin/users/:id', adminAuth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['fullName', 'email', 'walletBalance', 'role']

    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'invalid updates' })
    }

    try {
        const user = await User.findOne({ _id: req.params.id })

        if (!user) {
            return res.status(404).send()
        }

        updates.forEach((update) => user[update] = req.body[update])
        await user.save()
        res.send(user)
    } catch (error) {
        res.status(400).send(error)
    }
})

//Pay single employee
router.post('/admin/payment/users/:id', adminAuth, async (req, res) => {
    try {
        const { amount, description } = req.body
        if (!amount || typeof (amount) === 'string') {
            return res.status(400).send({ error: "Amount to be paid must be specified and of type number" })
        }
        const user = await User.findOne({ _id: req.params.id })
        if (!user) {
            return res.status(404).send({ error: 'User not found' })
        }
        req.admin.walletBalance -= amount
        user.walletBalance += amount
        await req.admin.save()
        await user.save()
        const transaction = new Transaction({
            paidTo: user._id,
            paidBy: req.admin._id,
            amount,
            description
        })
        await transaction.save()
        res.status(201).send({ user, transaction })

    } catch (error) {
        res.status(400).send(error.message)
    }
})

//pay multiple employees

router.post('/admin/payment/users', adminAuth, async (req, res) => {
    try {
        const payload = req.body
        const usersNotFound = []
        const usersWithCompletedPayments = []
        for (let i = 0; i < payload.length; i++) {
            const user = await User.findOne({ _id: new ObjectID(payload[i].userid) })
            if(!user) {
                 usersNotFound.push(payload[i].userid)
                 continue
            }
            req.admin.walletBalance -= payload[i].amount
            user.walletBalance += payload[i].amount
            await req.admin.save()
            await user.save()
            const transaction = new Transaction({
                paidTo: user._id,
                paidBy: req.admin._id,
                amount: payload[i].amount,
                description: payload[i].description
            })
            await transaction.save()
            usersWithCompletedPayments.push(user)
        }
        res.send({ usersWithCompletedPayments, usersNotFound})
    } catch (error) {
        res.status(400).send(error.message)
    }
})

//delete employee 
router.delete('/admin/users/:userId', adminAuth, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.userId })
        if (!user) {
            return res.status(400).send({ message: 'User not found' })
        }
        await user.remove()
        res.send(user)
    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }
})


module.exports = router