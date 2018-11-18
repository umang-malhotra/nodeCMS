const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const config = require('./config/database.js');

// connect to db
mongoose.connect(config.database);
const db = mongoose.connection;
db.on('error',console.error.bind(console,'connection error:'));
db.once('open',function(){
    console.log('Connected to Mongodb');
})

// init app
var app = express();

// view engine setup
app.set('views',path.join(__dirname,'views'));
app.set('view engine', 'ejs');

// set public folder
app.use(express.static(path.join(__dirname,'public')));

// set routes
const pages = require('./routes/pages');
const adminPages = require('./routes/admin_pages.js');

app.use('/',pages);
app.use('/admin/pages',adminPages);

//start the server
var port = 3000;
app.listen(port,function(){
    console.log('server started on port '+port);
});