const express = require("express");
const router = new express.Router();
const ExpressError = require('../helpers/expressError');
const Company = require('../models/companies')
const {validate} = require('jsonschema')
const companySchema = require('../schemas/companySchema');


router.post('/', async (req, res ,next) =>{
    try{
        const validation = validate(req.body, companySchema)
        if(!validation.valid){
            throw new ExpressError (validation.errors.map(e=>e.stack), 400)
        }
        const result = await Company.create(req.body)        
        return res.json(result)
    }catch(err){
        return next(err)
    }
})

router.get('/', async (req, res, next) =>{
    try{
        const result = await Company.findComp(req.query)
        return res.json(result)
            
    }catch(err){
        return next(err)
    }
})

router.get('/:handle', async(req, res, next) =>{
    try{
        const result = await Company.singleComp(req.params.handle)
        return res.json(result)
    }catch(err){
        return next(err)
    }
})

router.patch('/:handle', async(req, res, next) =>{
    try{
        if('handle' in req.body){
            throw new ExpressError("Can't change the handle", 400)
        }
        const validation = validate(req.body, companySchema)
        if(!validation.valid){
            throw new ExpressError(validation.errors.map(e=>e.stack),400)

        }
        const result = await Company.updateComp(req.query.handle, req.body)
        return res.json(result)
    }catch(err){
        return next(err)
    }
})

router.delete('/:handle', async(req, res, next) =>{
    try{
        const result = await Company.deleteComp(req.params.handle)
        
        return res.json({message: `Company deleted`})
    }catch(err){
        return next(err)
    }
})

module.exports = router;