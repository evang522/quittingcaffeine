let mongoose = require('mongoose');
let dbconnect = require('../db/dbconnect');
let express = require('express');
let app = express();
let router = express.Router();
let User = require('../models/userModel');
let session = require('express-session');
let passport = require('passport');
let expressValidator = require('express-validator');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let LocalStrategy = require('passport-local').Strategy;



// Main GET Route
router.get('/', (req,res) => {
    if (req.isAuthenticated()) {
        res.render('console');
        } else {
         res.render('login');
        }

});

router.get('/register', (req,res) => {
    res.render('register');
});


//Main Post route 
router.post('/register', (req,res) => {
let name = req.body.name;
let lastname = req.body.lastname;
let email = req.body.email;
let password = req.body.password;
let password2 = req.body.password2;

//Validation
req.checkBody('name', 'Name is Required').notEmpty();
req.checkBody('email', 'Email is required').notEmpty();
req.checkBody('email', 'Please enter a valid email address').isEmail();
req.checkBody('password', 'Password is required').notEmpty();
req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

let errors = req.validationErrors();


if(errors) {
    res.render('register', {
        errmessage: 'There was a validation problem with the information you entered. Please try again'
    });
} else {
    let newUser = new User({
        name:name,
        lastname:lastname,
        email:email,
        password:password,
    });

User.createUser(newUser, (err,user) => {
    if(err) throw err;
    console.log(user);
});
console.log('User is registered');
res.render('login', {
    success: 'User was Created!'
});

}
});

passport.use(new LocalStrategy(
    (email, password, done) => {
        User.getUserByEmail(email, (err,user) => {
            if(err) {
                console.log(err)
            }
            if(!user){
                return done(null,false,{message: 'Unknown User'});
            }
        User.comparePassword(password, user.password, (err, isMatch) => {
            if(err) throw err;
            if(isMatch){
                return done(null,user);
            } else {
                return done(null, false, {message: 'Invalid Password'});
            }
        });
      });
    }));
    
    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
    
      passport.deserializeUser(function(id, done) {
        User.getUserById(id, function(err, user) {
          done(err, user);
        });
      });
    
    

// app.post('/login', function(req,res,next) {
//     console.log(req.url);
//     console.log(req.body);
//     passport.authenticate('local', function (err,user,info) {
//         console.log('authentication info');
//         console.log(err);
//         console.log(user);
//         console.log(info);
//     })(req,res,next);
// });

router.post('/login',
passport.authenticate('local', {successRedirect:'/kickermate', failureRedirect:'/kickermate', failureFlash:false}),
(req, res) => {
  res.render('/');
});


router.get('/logout', (req,res) => {
    req.logout();
    res.redirect('/');
})

router.get('/logout', (req,res) => {
       req.logout();
      res.render('logout');
});



module.exports = router;