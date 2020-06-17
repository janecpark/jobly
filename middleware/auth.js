const jwt = require('jsonwebtoken')
const { SECRET_KEY } = require('../config')
const ExpressError = require('../helpers/expressError')

function authenticateJWT(req, res, next){
    try{
        const tokenFromBody = req.body._token;
        const payload = jwt.verify(tokenFromBody, SECRET_KEY)
        res.locals.username = payload.username;
        return next()
    }catch(err){
        return next(new ExpressError("You must authenticate first", 401))
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
    try{
        const tokenStr = req.body._token
        let token = jwt.verify(tokenStr, SECRET_KEY)
        res.locals.username = token.username;
        
        if(token.is_admin){
            return next();
        }
        throw new Error();
    }catch(err){
        return next(new ExpressError("You must be an admin", 401))
    }
    
   
}

function ensureCorrectUser(req, res, next){
    try{
        const tokenFromBody = req.body._token;
        let token = jwt.verify(tokenFromBody, SECRET_KEY);
        res.locals.username = token.username;
        
        if(token.username === req.params.username){
            return next();
        };
        throw new Error();
    }catch(err){
        return next(new ExpressError("Unauthorized", 401))
    }
}

module.exports = {
    authenticateJWT,
    ensureAdmin,
    ensureLoggedIn,
    ensureCorrectUser
}