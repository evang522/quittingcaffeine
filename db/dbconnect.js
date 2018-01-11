let mongoose = require('mongoose');

// Connect to DB

mongoose.connect('mongodb://localhost/quittingcaffeine');
mongoose.connection.on('connected',() => {
    console.log('DB Connected');
});