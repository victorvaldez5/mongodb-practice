var mongoose = require('mongoose');

// Setup Mongoose
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI);

module.exports = { mongoose };