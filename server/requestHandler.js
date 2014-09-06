// Yelp Api dependencies
var authConfig = require('./auth/authConfig');
// parseurl module
var parseurl = require('parseurl');
// node url module
var url = require('url');
// node query string module
var querystring = require('querystring');


// create a yelp client to use in it's requestHandler
var yelp = require('./lib/yelp').createClient(authConfig.yelpAuth);

module.exports = function(app, passport){
     //======================================================================
    // Allow Cross Origin - HACK
    // =====================================================================

    app.all('*', function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "X-Requested-With");
      next();
    });

    console.log('configuring requestHandler...');
    //======================================================================
    // Facebook Authentication
    // =====================================================================

    app.get('/auth/facebook', passport.authenticate('facebook'));

    app.get('/auth/facebook/callback',passport.authenticate('facebook', {
        successRedirect: '/authSuccess',
        failureRedirect: '/authFailure'
    }));

    //======================================================================
    // Cafe Request
    // =====================================================================

    app.get('/cafe', function(req, res) {
        // will get latitude and longitude center coordinate from client req
        // however, yelp api also requires a location search term, the more specific the 
        // better, if the location term is too broad (i.e. a city name), then the radius_filter
        // will not work properly
        var parsedUrl = url.parse(req.url);
        console.log('querystring parsed is: ', querystring.parse(parsedUrl.query));
        var parsedQuery = querystring.parse(parsedUrl.query);

        yelp.search(
            {term: "coffee shop", 
            location: parsedQuery.address, 
            cll: parsedQuery.lat + ',' + parsedQuery.lng, 
            radius_filter: "500"}, 
            function(err, data) {
                if(err) {
                    console.log(err);
                }
                // format data to just include business name, it's location and yelp rating
                console.log('yelp data is: ', data);
                var yelpData = [];
                data['businesses'].forEach(function(value, index, array) {
                    var obj = {};
                    obj.businessName = value.name;
                    obj.location = value.location;
                    obj.rating = value.rating;
                    yelpData.push(obj);
                });
                console.log('formatted yelp data is: ', yelpData);
                res.end(JSON.stringify(yelpData));
            });

    });

    
    //======================================================================
    // Login Success
    // =====================================================================
    
    app.get('/authSuccess', isLoggedIn, function(req, res){
        console.log("User has authenticated successfully and is logged in.")
    });

    //======================================================================
    // Login Failure
    // =====================================================================
    
    app.get('/authFailure', function(req, res){
        console.log("User authentication has failed.")
    });

    //======================================================================
    // Logout
    // =====================================================================
    app.get('/logout', function(req, res){
        req.logout();
    });

    //======================================================================
    // Unkown Routes
    // =====================================================================
    app.get('/nope', function(req, res){
        console.log("nope");
    });

    app.post('/nope', function(req, res){
        console.log("nope");
    });

    app.get('/*', function(req, res){
        res.redirect('/nope'); //todo - agree on redirects with client
    });

    app.post('/*', function(req, res){
        res.redirect('/nope'); //todo - agree on redirects with client
    });

};

var isLoggedIn = function(req, res, next){
    //if user is authenticated in the session, carry on
    if(req.isAuthenticated()){
        return next();
    }

    res.redirect('nope');
};