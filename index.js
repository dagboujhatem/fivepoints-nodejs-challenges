const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
// passport strategy
const passport = require('./passport/passport');
// run the cron 
const userCron = require('./common/crons/users-cron')
// connect to database
const connect = require('./database/connect.js');
// socketIO import
const http = require('http');
const socketIO = require('socket.io');
// import routes
const todoApi = require('./routes/todoApi');
const userApi = require('./routes/userApi');
const mailApi = require('./routes/mailAPI');
const fileUploadApi = require('./routes/fileUploadApi');
const authApi = require('./routes/authApi');
const chatApi = require('./routes/chatApi');

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
// socketIO configurations
const server = http.createServer(app);  
const io = socketIO(server);
io.on('connection', (socket) => {
    console.log('new connection made');
});
app.set('io', io);

// Routes sections
// Home Route
app.get('/', async(req,res) => {
    res.json({message: 'Welcome to my REST API.'});
});

app.use('/api/v1', todoApi);
app.use('/api/v1', userApi);
app.use('/api/v1', mailApi);
app.use('/api/v1', fileUploadApi);
app.use('/api/v1', authApi);
app.use('/api/v1', chatApi);

// End route section

server.listen(process.env.port || port, () => {
    console.log(`Backend server start on port ${port}`);
});