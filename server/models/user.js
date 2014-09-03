var mongoose = require('mongoose');

//User schema - only holds Facebook credentials for now
//in the future will be able to hold 'checkin points', 'ratings', etc
var userSchema = mongoose.Schema({
    facebook: {
        id: String,
        token: String,
    }
});

module.exports = mongoose.model('User', userSchema);

