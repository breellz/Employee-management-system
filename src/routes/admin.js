const express = require('express')
const Admin = require('../models/admin')
const User = require('../models/user')
const adminAuth = require('../middleware/adminAuth')

const router = new express.Router()

//Create new administrator account 

router.post('/admin', async (req, res) => {
    try {
        const admin = new Admin(req.body)
        await admin.save()
        const token = await admin.generateAuthToken()

        res.status(201).send({ admin, token })

    } catch (error) {
        res.status(400).send(error.message)
    }
})

//create a new user account
router.post('/admin/users', adminAuth, async (req, res) => {
    try {
        const user = new User(req.body)
        user.createdBy = req.admin._id
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }
})

module.exports = router