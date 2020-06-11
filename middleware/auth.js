const jwt = require('jsonwebtoken')
const { SECRET_KEY } = require('../config')
const ExpressError = require('../expressError')

function authenticateJWT(req, res, next){
    try{
        const tokenFromBody = req.body._token;
        const payload = jwt.verify(tokenFromBody, SECRET_KEY)
        req.user = payload;
        return next()
    }catch(err){
        return next()
    }
}

function ensureLoggedIn(req, res, next){
    if(!req.user){
        const err = new ExpressError('Unauthorized', 401)
        return next(err)
    }else{
        return next()
    }
}

function ensureAdmin(req, res, next){
    if(!req.user || req.user.username != 'admin'){
        const err = new ExpressError('Unauthorized', 401)
        return next(err)
    }else{
        return next()
    }
}

module.exports = {
    authenticateJWT,
    ensureAdmin,
    ensureLoggedIn
}