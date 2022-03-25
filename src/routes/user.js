const express = require('express')
const User = require('../models/user')
const Auth = require('../middleware/userAuth')

const router = express.Router()

// Login route
router.post('/users/login', async(req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })    
    } catch (error) {
        res.status(400).send(error.message)
    }
    
})


//logout employee

router.post('/users/logout', Auth, async (req, res) => {
   
    try {
       req.user.tokens =  req.user.tokens.filter((token) => {
            return token.token !== req.token 
        })

        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send()
    }
})

//fetch employee details

router.get('/users/me', Auth, async(req, res) => {
    try {
        const user = await User.find({ _id: req.user._id})
        res.send({ user })
    } catch (error) {
        res.status(400).send(error.message)
    }
})

//update employee details

router.patch('/users/:id', Auth, async(req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = [ 'fullName', 'email']

    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidOperation) {
        return res.status(400).send({ error: 'invalid updates'})
    }

    try {
        const user = await User.findOne({ _id: req.params.id })
    
        if(!user){
            return res.status(404).send()
        }

        updates.forEach((update) => user[update] = req.body[update])
        await user.save()
        res.send(user)
    } catch (error) {
        res.status(400).send(error)
    }
})

//Logout All sessions

router.post('/users/logoutAll', Auth, async(req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send()        
    }
})


module.exports = router
