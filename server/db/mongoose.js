var mongoose = require('mongoose');

// Setup Mongoose
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');

module.exports = { mongoose };