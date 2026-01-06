const express = require("express");
const cors = require("cors");
const app = express();
const morgan = require("morgan");
app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/info", (request, response) => {
  response.send(`<p>Phoenbook has info for ${persons.length} people</p>
  <p>${new Date()}</p>  `);
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  console.log("ok");

  const id = request.params.id;
  const found = persons.find((p) => p.id === id);
  if (found) return response.json(found);
  else {
    response.status(404).end();
  }
});

app.post("/api/persons", (request, response) => {
  try {
    if (request.body.name.length === 0 || request.body.number.length === 0) {
      return response
        .status(400)
        .json({ error: "Provide a name and a number" });
    }
    if (persons.find((p) => p.name === request.body.name)) {
      return response.status(400).json({ error: "Name already exists" });
    }
    let newId = 0;
    do {
      newId = Math.floor(Math.random() * 1000).toString();
    } while (persons.find((p) => p.id === newId));
    const newPerson = { ...request.body, id: String(newId) };
    persons = persons.concat(newPerson);
    response.json(newPerson);
  } catch (error) {
    return response.status(400).json({ error: "Provide a name and a number" });
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const found = persons.find((p) => p.id === id);
  if (found) {
    persons = persons.filter((p) => p !== found);
    return response.status(200).json(found);
  } else {
    response.status(404).end();
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
