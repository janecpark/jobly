const express = require('express');
const router = new express.Router();
const Job = require('../models/jobs')
const {validate} = require('jsonschema')
const jobSchema = require('../schemas/jobSchema')


router.get('/', async(req, res, next)=>{
    try{
        const result = await Job.findJob(req.query)
        return res.json(result)
    }catch(err){
        return next(err)
    }
})

router.post('/', async(req, res, next)=>{
    try{
        const validation = validate(req.body, jobSchema)
        if(!validation.valid){
            throw new Error(validation.errors.map(e=>e.stack))
        }
        const result = await Job.postJob(req.body)
        return res.json(result)
    }catch(err){
        return next(err)
    }
})

router.get('/:id', async(req, res, next)=>{
    try{
        const result = await Job.findSingleJob(req.params.id)
        return res.json(result);
    }catch(err){
        return next(err)
    }
})

router.patch('/:id', async(req, res, next)=>{
    try{
        const result = await Job.updateJob(req.params.id, req.body)
        return res.json(result)
    }catch(err){
        return next(err)
    }
})

router.delete('/:id', async(req, res, next)=>{
    try{
        const result = await Job.deleteJob(req.params.id)
        return res.json({message: 'Job deleted'})
    }catch(err){
        return next(err)
    }
})

module.exports = router;