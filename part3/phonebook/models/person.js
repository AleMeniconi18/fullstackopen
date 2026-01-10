const mongoose = require('mongoose')

const url = process.env.MONGODB_URI
mongoose.set('strictQuery', false)

mongoose.connect(url, { family: 4 })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Person', personSchema)

/* if (process.argv.length < 4) {
  Note.find({}).then((result) => {
    console.log("phonebook");
    result.forEach((person) => {
      console.log(person.name, person.number);
    });
    mongoose.connection.close();
  });
} else if (process.argv.length === 5) {
  const person = new Note({
    name: process.argv[3],
    number: process.argv[4],
  });

  person.save().then((result) => {
    console.log("person added!");
    mongoose.connection.close();
  });
} else {
  mongoose.connection.close();
} */
