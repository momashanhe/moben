const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/test');

mongoose.connection.on('error', err => console.log('error: ' + err));
mongoose.connection.on('open', () => console.log('open'));
mongoose.connection.on('close', () => console.log('close'));

module.exports = mongoose;
