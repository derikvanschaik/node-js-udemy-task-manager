const express = require('express');
const Task = require('../models/task'); 
const router = new express.Router();

router.post('/tasks', async (req, res) =>{ 
    const task = new Task(req.body); 
    try{
        await task.save();
        res.status(201).send(task); 

    }catch(e){
        res.status(400).send(error);
    }

});

router.get('/tasks', async (req, res) =>{
    try{
        const tasks = await Task.find({}); 
        res.send(tasks); 
    }catch(e){
        res.status(500).send(); 
    }
});

router.patch('/tasks/:id', async (req, res) =>{

    const requestedUpdates = Object.keys(req.body); 
    const allowedUpdates = ['description', 'completed']; 
    const valid = requestedUpdates.every( update => allowedUpdates.includes(update)); 
    if (!valid){
        return res.status(400).send({error:'Invalid updates'}); 
    }
    
    try{
        const task = await Task.findById(req.params.id);
        requestedUpdates.forEach( update => task[update] = req.body[update]); 
        task.save(); 
        
        if (!task){
            return res.status(404).send();  
        }
        res.send(task); 
    }catch(e){
        res.status(400).send(e); 
    }
});

router.delete('/tasks/:id', async (req, res) =>{
    try{
        const task = await Task.findByIdAndDelete(req.params.id); 
        if (!task){
            return res.status(404).send({notFoundError: 'Task was not found'}); 
        }
        res.send(task); 
    }catch(e){
        res.status(500).send(); 
    }
}); 

router.get('/tasks/:id', async (req, res) =>{ 
    const _id = req.params.id;
    try{
        const task = await Task.findById(_id);  
        if (!task){ 
            return res.status(404).send(); 
        }
        res.status(200).send(task); 
    }catch(e){
        console.log(e); 
        res.status(500).send(); 
    }
});

module.exports = router; 