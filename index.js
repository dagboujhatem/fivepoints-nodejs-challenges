const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
// connect to database
const connect = require('./database/connect.js');

// Import Schemas
const Todo = require('./models/todoSchema');

// Create express App
const app = express();
const port = 3000;
// Common Configurations
app.use(cors())
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Routes sections
// Home Route
app.get('/', async(req,res) => {
    res.json({message: 'Welcome to my REST API.'});
});

// Get All Todos from database
app.get('/api/todos', async(req,res) => {
    const todo = await Todo.find();
    res.json(todo);
});

// Get Single Todo from by ID from database
app.get('/api/todos/:id', async(req,res) => {
    const todo = await Todo.findById(req.params.id);
    res.json(todo);
});

// Add new Todo in the database 
app.post('/api/todos', async(req,res) => {
    const todo = await Todo.create(req.body);
    res.json(todo);
});

// Update an Todo by ID in the database
app.put('/api/todos/:id', async(req,res) => {
    const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, req.body, {new: true});
    res.json(updatedTodo);
});

// Delete Todo By ID from the database
app.delete('/api/todos/:id', async(req,res) => {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({message : 'Todo deleted successfully!'});
});

// End route section

app.listen(process.env.port || port, function () {
    console.log(`Backend server start on port ${port}`);
});