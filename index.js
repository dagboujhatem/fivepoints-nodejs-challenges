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
// swaggerUi config
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
// import routes
const todoApi = require('./routes/todoApi');
const userApi = require('./routes/userApi');
const mailApi = require('./routes/mailAPI');
const fileUploadApi = require('./routes/fileUploadApi');
const authApi = require('./routes/authApi');

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
// SwaggerUi configurations
app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', function(req, res, next){
    swaggerDocument.host = req.get('host');
    req.swaggerDoc = swaggerDocument;
    next();
},swaggerUi.setup(swaggerDocument));

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

// End route section

app.listen(process.env.port || port, function () {
    console.log(`Backend server start on port ${port}`);
});