let express = require('express');
let app = express();
let User = require('./models/userModel');
let session = require('express-session');
let passport = require('passport');
let expressValidator = require('express-validator');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let LocalStrategy = require('passport-local').Strategy;
let kickermate = require('./routes/kickermate');


mongoose.connect('mongodb://localhost/quittingcaffeine');
mongoose.connection.on('connected', () => {
    console.log('DB Connected');
});

app.set('view engine','pug');
app.set('views','./views');

// Set Public Folder
app.use(express.static('public'));

// Body Parser Middleware
app.use(bodyParser.urlencoded({
    extended: true
  }));

// Cookie Parser Middleware
app.use(cookieParser());

//Express Session MIddleWare
app.use(session({
    secret:'secret',
    saveUninitialized: true,
    resave: true
}))

// Validation
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
        , root    = namespace.shift()
        , formParam = root;

      while(namespace.length) {
        formParam += '[' + namespace.shift() + ']';
      }
      return {
        param : formParam,
        msg   : msg,
        value : value
      };
    }
  }));


  //Passport Initialization
app.use(passport.initialize());
app.use(passport.session());

//Global Variables
app.use((req,res,next) => {
    res.locals.user = req.user || null;
    next();
  });


app.use('/kickermate', kickermate);


// homepage route
app.get('/', (req,res) => {
    res.render('homepage');
})

app.get('/howcaffeineworks', (req,res) => {
    res.render('howitworks.pug');
})

app.get('/whyquit', (req,res) => {
    res.render('whyquit.pug');
})


app.listen(80);