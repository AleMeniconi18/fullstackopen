const express = require('express')
const cors = require('cors')
const app = express()
const morgan = require('morgan')
app.use(express.json())
app.use(cors())
app.use(morgan('tiny'))
app.use(express.static('dist'))
require('dotenv').config()

const Person = require('./models/person')

app.get('/info', (request, response) => {
  Person.find({}).then((persons) =>
    response.send(`<p>Phoenbook has info for ${persons.length} people</p>
  <p>${new Date()}</p>`)
  )
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then((persons) => response.json(persons))
})

app.get('/api/persons/:id', (request, response,next) => {
  Person.findById(request.params.id)
    .then((result) => {
      if(result)
        response.status(200).json(result)
      else{
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response) => {
  try {
    if (request.body.name.length === 0 || request.body.number.length === 0) {
      return response
        .status(400)
        .json({ error: 'Provide a name and a number' })
    }
    const person = new Person(request.body)

    person.save().then((result) => {
      response.json(result)
    })
  } catch {
    return response.status(400).json({ error: 'Provide a name and a number' })
  }
})

app.delete('/api/persons/:id', (request, response,next) => {
  Person.findByIdAndDelete(request.params.id)
    .then((result) => {
      if(result)
        response.status(200).json(result)
      else{
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})


const errorHandler = (error, request, response, next) => {

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

// handler of requests that result in errors
app.use(errorHandler)