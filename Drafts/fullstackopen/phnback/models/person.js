const mongoose = require('mongoose');
//mongo db database
const Password = process.argv[2];
const url  = process.env.MONGODB_URI;

console.log('Connecting to', url);
mongoose.set('strictQuery', false);
mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB');
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message);
  });

const personSchema = new mongoose.Schema({
    name: {
      type: String,
      minLength: 3,
      required: true,
    },
    number: String,
    });

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

const Person = mongoose.model('Person', personSchema);
module.exports = Person;