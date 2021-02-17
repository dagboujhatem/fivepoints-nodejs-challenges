const express = require('express');
const passport = require('passport');
const router = express.Router();
// Import Schemas
const Todo = require('../models/todoSchema');

// Get All Todos from database
router.get('/todos', passport.authenticate("bearer", { session: false }), async(req,res) => {
    const todo = await Todo.find();
    res.json(todo);
});

// Get Single Todo from by ID from database
router.get('/todos/:id', passport.authenticate("bearer", { session: false }), async(req,res) => {
    const todo = await Todo.findById(req.params.id);
    res.json(todo);
});

// Add new Todo in the database 
router.post('/todos', passport.authenticate("bearer", { session: false }), async(req,res) => {
    const todo = await Todo.create(req.body);
    res.json(todo);
});

// Update an Todo by ID in the database
router.put('/todos/:id', passport.authenticate("bearer", { session: false }), async(req,res) => {
    const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, req.body, {new: true});
    res.json(updatedTodo);
});

// Delete Todo By ID from the database
router.delete('/todos/:id', passport.authenticate("bearer", { session: false }), async(req,res) => {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({message : 'Todo deleted successfully!'});
});

// export routes
module.exports = router;