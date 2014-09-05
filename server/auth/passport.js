var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../models/user');
var authConfig = require('./authConfig');

module.exports = function(passport){

    console.log("configuring passport...");
    //serialize user
    passport.serializeUser(function(user, done){
        done(null, user.id);
    });

    //deserialize user
    passport.deserializeUser(function(id, done){
        User.findById(id, function(err, user){
            done(err, user);
        });
    });

    //========================================
    // Facebook Authentication
    //========================================
    passport.use(new FacebookStrategy({
        clientID: authConfig.facebookAuth.clientID,
        clientSecret: authConfig.facebookAuth.clientSecret,
        callbackURL: authConfig.facebookAuth.callbackURL,
        passReqToCallback: true
    }, 
    function(req, token, tokenSecret, profile, done){
        process.nextTick(function(){
            //check if user already exists in data base
            User.findOne({'facebook.id': profile.id}, function(err, user){
                //return error if database cannot be accessed
                if(err) return done(err);

                //if user is found
                if(user){
                    //send user along to next callback
                    return done(null, user);
                } else { //user was not found

                    //create a new user... 
                    var newUser = new User();
                    newUser.facebook.id = profile.id;
                    newUser.facebook.token = token;
                    //... and save to database
                    newUser.save(function(err){
                        if(err) throw err;

                        return done(null, newUser);
                    });

                }
            });
        });

    }));

};