import { useEffect, useState } from "react";
import axios from "axios";
import personService from "./services/persons.js";
import Notification from "./components/Notification.jsx";
import "./App.css";

const Filter = (props) => {
  return (
    <div>
      filter shown with: <input onChange={props.onChange} />
    </div>
  );
};

const PersonForm = (props) => {
  const { newName, newNumber, addPerson, handleNameChange, handlePhoneChange } =
    props;

  return (
    <form onSubmit={addPerson}>
      <div>
        name: <input onChange={handleNameChange} value={newName} />
      </div>
      <div>
        number: <input onChange={handlePhoneChange} value={newNumber} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

const Persons = ({ persons, filterName, handleDelete }) => {
  return (
    <>
      {persons
        .filter((p) => p.name.toUpperCase().includes(filterName))
        .map((p) => (
          <p key={p.id}>
            {p.name} {p.number}{" "}
            <button onClick={(e) => handleDelete(e, p)}>delete</button>
          </p>
        ))}
    </>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filterName, setFilterName] = useState("");
  const [message, setMessage] = useState(null);

  useEffect(() => {
    personService.getAll().then((data) => setPersons(data));
  }, []);

  const addPerson = (e) => {
    e.preventDefault();
    const exist = persons.find((p) => p.name === newName);
    if (exist) {
      alert(`${newName} is already added to phonebook`);
    } else {
      const newObject = { name: newName, number: newNumber };
      personService.uploadPerson(newObject).then((data) => {
        setPersons(persons.concat(data));
        setMessage(`Added ${data.name}`);
        setNewName("");
        setNewNumber("");
        setTimeout(() => {
          setMessage(null);
        }, 5000);
      });
    }
  };

  const handleNameChange = (e) => {
    setNewName(e.target.value);
  };

  const handlePhoneChange = (e) => {
    setNewNumber(e.target.value);
  };

  const handleFilter = (e) => {
    setFilterName(e.target.value.toUpperCase());
  };

  const handleDelete = (e, p) => {
    e.preventDefault();
    const confirm = window.confirm(`Delete ${p.name}?`);
    if (confirm) {
      personService.deletePerson(p.id).then((deleted) => {
        setPersons(persons.filter((p) => p.id !== deleted.id));
      });
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} />
      <Filter onChange={handleFilter} />

      <h3>Add a new</h3>
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        addPerson={addPerson}
        handleNameChange={handleNameChange}
        handlePhoneChange={handlePhoneChange}
      />

      <h3>Numbers</h3>
      <Persons
        persons={persons}
        filterName={filterName}
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default App;
