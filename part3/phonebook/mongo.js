const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://ale18_db_user:${password}@clustertestfullstack.rkhrhs3.mongodb.net/Phonebook?appName=ClusterTestFullStack`;

mongoose.set("strictQuery", false);

mongoose.connect(url, { family: 4 });

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Note = mongoose.model("Person", personSchema);

if (process.argv.length < 4) {
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
}
