const express = require('express');
const router = new express.Router();
const ExpressError = require('../helpers/expressError')
const createToeken = require('../helpers/createToken')
const User = require('../models/users')
const createToken = require('../helpers/createToken')

router.post('/login', async(req, res, next) =>{
    try{
        const result = User.authenticate(req.body)
        let token = createToken(result)
        return res.json({token})
    }catch(err){
        return next(err)
    }
})



module.exports = router;