"use strict";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var jwt = require('jwt-simple');

//Requiring Registration email dependencies
var api_key = process.env.api_key;
var domain = process.env.domain;
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});

var User;

var userSchema = Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true }
})

userSchema.methods.token = (user) => {
  var payload = {
    username: user.username,
    _id: user._id
  };
  console.log(payload)
  var token = jwt.encode(payload, process.env.JWT_SECRET) 
  return token 
}

userSchema.statics.authenticate = (inputUser, cb) => {
  User.findOne({username: inputUser.username}, (err, dbUser) => {
    if (err || !dbUser) return cb(err || 'Incorrect Username or Password.');
    if( jwt.encode(inputUser.password, process.env.JWT_SECRET) === dbUser.password){
      dbUser.password = null
      cb(null, dbUser);
    }
  });
};

userSchema.statics.register = function(user, cb) {
  var username = user.username; 
  var email = user.email
  console.log(email)
  var password = jwt.encode(user.password, process.env.JWT_SECRET);
  User.find({$or : [{username: username}, {email: user.email}] }, function(err, user){
    console.log(user)
    if(err || user[0]) return cb(err || `Username already taken. Sorry.: ${user} this guy`);
    var newUser = new User;
    newUser.username = username;
    newUser.password = password;
    newUser.email = email
    console.log(newUser)
    newUser.save(function(err, savedUser){
      console.log('Saved user: ', savedUser)
      savedUser.password = null;
      
      // Send out registration email:
      
      var data = {
        from: `Better Barterin' <postmaster@bitchinBartering.net>`,
        to: savedUser.email,
        subject: `Welcome To Better Barterin' ${savedUser.username}!`,
        text: `Welcome to Better Barterin' ${savedUser.username}, We're glad to have you!!`
      }

      mailgun.messages().send(data, function (error, body) {
        if(error) console.log(error);
        console.log(body);
      })

      cb(err, savedUser)
    })
  })
}

User = mongoose.model('User', userSchema)

module.exports = User;
