var express = require('express');
var path = require('path');

// init app
var app = express();

// view engine setup
app.set('views',path.join(__dirname,'views'));
app.set('view engine', 'ejs');

// set public folder
app.use(express.static(path.join(__dirname,'public')));

app.get('/',function(req,res){
    res.send('app working');
});

//start the server
var port = 3000;
app.listen(port,function(){
    console.log('server started on port '+port);
});