//where the mongodb connection.
const mongoose = require('mongoose');
const config = require('config'); //used for mongoURI in default.json
const db = config.get('mongoURI');

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true
    }); // returns a promise
    console.log('MongoDB Connect...');
  } catch (err) {
    console.error(err.message);
    process.exit(1); //exit process with failure
  }
};

module.exports = connectDB;
