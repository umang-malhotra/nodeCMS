const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const config = require('./config/database.js');
const bodyParser = require('body-parser');
const session = require('express-session');
const expressValidator = require('express-validator');

// connect to db
mongoose.connect(config.database);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Connected to Mongodb');
})

// init app
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// set public folder
app.use(express.static(path.join(__dirname, 'public')));

// set global errors variable
app.locals.errors = null;

// body-parser middleware
//
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// express session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));

// Express Validator Middleware
app.use(expressValidator({
    errorFormatter: function (param, msg, value) {
        var namespace = param.split('.')
            , root = namespace.shift()
            , formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

// Express messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});


// set routes
const pages = require('./routes/pages');
const adminPages = require('./routes/admin_pages.js');

app.use('/', pages);
app.use('/admin/pages', adminPages);

//start the server
var port = 3000;
app.listen(port, function () {
    console.log('server started on port ' + port);
});