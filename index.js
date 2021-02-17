const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
// run the cron 
const userCron = require('./common/crons/users-cron')
// connect to database
const connect = require('./database/connect.js');
// import routes
const todoApi = require('./routes/todoApi');
const userApi = require('./routes/userApi');
const mailApi = require('./routes/mailAPI');
const fileUploadApi = require('./routes/fileUploadApi');

// Create express App
const app = express();
const port = 3000;
// Common Configurations
app.use(cors())
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// Use this line to GET ALL UPLOADED IMAGES
app.use('/api/v1/uploads', express.static(path.join(__dirname, '/uploads')));

// Routes sections
// Home Route
app.get('/', async(req,res) => {
    res.json({message: 'Welcome to my REST API.'});
});

app.use('/api/v1', todoApi);
app.use('/api/v1', userApi);
app.use('/api/v1', mailApi);
app.use('/api/v1', fileUploadApi);

// End route section

app.listen(process.env.port || port, function () {
    console.log(`Backend server start on port ${port}`);
});