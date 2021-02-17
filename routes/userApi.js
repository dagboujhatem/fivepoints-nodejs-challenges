const express = require('express');
const User = require('../models/userSchema');
const router = express.Router();

// Get all Users
router.get('/users', async(req, res) => {
    const users = await User.find();
    res.json(users); 
});

// Get User by id 
router.get('/users/:id', async (req, res) => {
    const userDetails = await User.findById(req.params.id).populate('todos');
    res.json(userDetails);
});

// Add new User
router.post('/users', async (req, res) => {
    const createdUser = await User.create(req.body);
    res.json(createdUser);
});

// Update a User by ID
router.put('/users/:id', async (req, res) => {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {new: true});
    res.json(updatedUser);
});

// Delete User by ID
router.delete('/users/:id', async (req, res) => {
    await User.findByIdAndRemove(req.params.id);
    res.json({message : 'User deleted successfully!'});
});

// Affecter un ID de Todo dans User (OneToMany Relation)
router.post('/users/affecte-todo-to-user/:idUser/:idTodo', async(req, res) => {
    const updatedUser = await User.findByIdAndUpdate(req.params.idUser, { $push: { todos: req.params.idTodo }}, {new : true});
    res.json(updatedUser);
});

// Enlever un Todo existant dans le tableau todos d'un User
router.delete('/users/enlever-todo-from-user/:idUser/:idTodo', async(req, res) => {
    const updatedUser = await User.findByIdAndUpdate(req.params.idUser, { $pull: { todos: req.params.idTodo }}, {new : true});
    res.json(updatedUser);
});

//  Others REST APIs (Advanced level)
/*
*   $gt ==>  greeter than 
*   $lt ==> lower than 
*   $gte ==>  greeter than or equal
*   $lte ==> lower than or equal
*/

// Get all Users => supérieur à age
router.get('/users/age-gt/:age', async(req, res) => {
    const users = await User.find({ age: { $gt: req.params.age}});
    res.json(users); 
});

// Get all Users => inférieur à age
router.get('/users/age-lt/:age', async(req, res) => {
    const users = await User.find({ age: { $lt: req.params.age}});
    res.json(users); 
});

// Get all Users ( entre les age1 et age2 )
router.get('/users/age-entre/:age1/:age2', async(req, res) => {
    const users = await User.find({ age: { $gt: req.params.age1, $lt: req.params.age2}});
    res.json(users); 
});

// Get the first User by email
router.get('/users/get-user-by-email/:email', async(req, res) => {
    const user = await User.findOne({ email: req.params.email});
    res.json(user); 
});

module.exports = router;