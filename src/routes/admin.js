const express = require('express')
const Admin = require('../models/admin')
const adminAuth = require('../middleware/adminAuth')
const User = require('../models/user')
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
        const token = await user.generateAuthToken()

        res.status(201).send({ user, token })
    } catch (error) {
        res.status(400).send(error)
    }

})

//login administrator account

router.post('/admin/login',  validationRules(), validate, async (req, res) => {
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


//delete user 
router.delete('/admin/users/:userId', adminAuth, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.userId })
        if(!user) {
            return res.status(400).send({message: 'User not found'})
        }
        await user.remove()
        res.send(user)
    } catch (error) {
        res.status(400).send(error)
    }
})


module.exports = router