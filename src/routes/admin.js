const express = require('express')
const Admin = require('../models/admin')

const router = new express.Router()

//Create new admin 

router.post('/admin', async(req, res) => {
    try {
        const admin = new Admin(req.body)
        await admin.save()
        const token = await admin.generateAuthToken()
        
        res.status(201).send({ admin, token})

    } catch (error) {
        res.status(400).send(error.message)
    }
})

module.exports =router