const express = require('express')
const router = new express.Router()
const ExpressError = require('../helpers/expressError')
const {validate} = require('jsonschema')
const User = require('../models/users')
const userSchema = require('../schemas/userSchema')
 

router.post('/', async (req, res, next) =>{
    try{
        const validation = validate(req.body, userSchema)
        if(!validation.valid){
            throw new ExpressError(validation.errors.map(e=>e.stack))
        }
        const result = await User.create(req.body)
        
        return res.json(result)
    }catch(err){
        return next(err)
    }
})

router.get('/', async (req, res,next) =>{
    try{
        const result = await User.getAllUser()
        return res.json({users: result})
    }catch(err){
        return next(err)
    }
})

router.get('/:username', async (req, res, next) =>{
    try{
        const result = await User.getUser(req.params.username)
        return res.json({user: result})
    }catch(err){
        return next(err)
    }
})

router.patch('/:username', async (req, res, next) =>{
    try{
        const result = await User.updateUser(req.params.username, req.body)
        return res.json({user: result})
    }catch(err){
        return next(err)
    }
})

router.delete('/:username', async (req, res, next)=>{
    try{
        
        const result = await User.deleteUser(req.params.username)
        return res.json({message: `${req.params.username} deleted`})
    }catch(err){
        return next(err)
    }
})

module.exports = router;