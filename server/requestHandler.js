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