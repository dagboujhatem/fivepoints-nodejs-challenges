const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
// connect to database
const connect = require('./database/connect.js');
// import routes
const todoApi = require('./routes/todoApi');
const userApi = require('./routes/userApi');
const mailApi = require('./routes/mailAPI');

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

app.use('/api/v1', todoApi);
app.use('/api/v1', userApi);
app.use('/api/v1', mailApi);

// End route section

app.listen(process.env.port || port, function () {
    console.log(`Backend server start on port ${port}`);
});