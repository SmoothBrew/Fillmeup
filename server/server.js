// set up ======================================================================
var express = require('express');
var app = express();
var port = process.env.PORT || 8000;
var mongoose = require('mongoose');
var passport = require('passport');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

// set up database ============================================
mongoose.connect('mongodb://localhost/fillmeupDev');

// set up passport ============================================
require('./auth/passport')(passport);

// set up logging =============================================
app.use(morgan('dev')); // log every request to the console

// set up session and helpers==================================
app.use(cookieParser()); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'whatAFineCupOfJoe' }));
app.use(passport.initialize());
app.use(passport.session());

// routes =====================================================
require('./requestHandler')(app, passport);

// launch =====================================================
app.listen(port);
console.log('Server running and listening to port ' + port);
