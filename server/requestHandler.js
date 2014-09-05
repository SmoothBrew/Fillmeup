// Yelp Api dependencies
var authConfig = require('./auth/authConfig');

// create a yelp client to use in it's requestHandler
var yelp = require('./lib/yelp').createClient(authConfig.yelpAuth);

module.exports = function(app, passport){
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
        yelp.search(
            {term: "coffee shop", 
            location: "1230-1298 Van Ness Avenue, San Francisco, CA 94109", 
            cll: "38.78720399, -122.4216322", 
            radius_filter: "150"}, 
            function(err, data) {
                if(err) {
                    console.log(err);
                }
                // format data to just include business name, it's location and yelp rating
                var yelpData = [];
                data['businesses'].forEach(function(value, index, array) {
                    var obj = {};
                    obj.businessName = value.name;
                    obj.location = value.location;
                    obj.rating = value.rating;
                    yelpData.push(obj);
                });
                console.log('data is: ', data);
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