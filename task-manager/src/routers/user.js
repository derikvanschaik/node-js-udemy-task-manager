const express = require('express');
const User = require('../models/user'); 
const router = new express.Router(); 

router.post('/users', async (req, res) =>{
    const user = new User(req.body); 
    try{
        await user.save();
        res.status(201).send(user); 
    }catch (e){
        res.status(400).send(e);
    }
});

router.post('/users/login', async (req, res) =>{
    try{
        const email = req.body.email; 
        const password = req.body.password; 
        const user = await User.findByCredentials(email, password); 
        res.send(user);

    }catch(e){
        console.log("didnt work obvisou"); 
        res.status(404).send(e); 
    }
}); 

router.get('/users', async (req, res) =>{
    // finds all the users (gets all users)
    try{
        const users = await User.find({}); 
        res.send(users); 
    }catch (e){
        res.status(500).send(); 

    }
}); 

router.get('/users/:id', async (req, res) =>{ 
    const _id = req.params.id;

    try{
        const user = await User.findById(_id);
        if (!user){
            return res.status(404).send(); 
        }
        res.status(200).send(user); 

    }catch(e){
        res.status(500).send(); 

    }
}); 
router.patch('/users/:id', async (req, res) =>{

    const requestedUpdates = Object.keys(req.body); 
    const allowedUpdates = ['name', 'password', 'email', 'age'];
    const valid = requestedUpdates.every( update => allowedUpdates.includes(update)); 
    if (!valid){
        return res.status(400).send({error:'Invalid updates'}); 
    }

    try{
        const user = await User.findById(req.params.id); 
        requestedUpdates.forEach( (update) => user[update] = req.body[update]); 
        user.save(); 

        if (!user){
            return res.status(404).send();  
        }
        res.send(user); 
    }catch(e){
        res.status(400).send(e); 
    }
});

router.delete('/users/:id', async (req, res) =>{
    try{
        const user = await User.findByIdAndDelete(req.params.id); 
        if (!user){
            return res.status(404).send({notFoundError: 'User was not found'}); 
        }
        res.send(user); 
    }catch(e){
        res.status(400).send(); 
    }
}); 
module.exports = router;