const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { body, validationResult } = require('express-validator'); // Import express-validator
const UserModel = require('./Models/User');
require("dotenv").config();
const app = express();

app.use(cors());
app.use(express.json());

const DB = process.env.DATABASE;

mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("connection start"))
  .catch((error) => console.log(error.message));

// Validation and Error Handling Middleware
const validateUserInput = [
  body('name').notEmpty().withMessage('Name is required.'),
  body('email').isEmail().withMessage('Invalid email format.'),
  body('phone').isMobilePhone().withMessage('Invalid phone number format.'),
];

// Define your routes with input validation and error handling
app.get('/', (req, res) => {
  UserModel.find()
    .then(users => res.json(users))
    .catch(err => res.status(500).json({ error: 'Error retrieving users.' }));
});

app.post('/create', validateUserInput, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  UserModel.create(req.body)
    .then(user => res.status(201).json(user))
    .catch(err => res.status(400).json({ error: 'Error creating user.' }));
});

app.put('/update/:id', validateUserInput, (req, res) => {
  const id = req.params.id;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  UserModel.findByIdAndUpdate({ _id: id }, {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
  }).then(user => res.json(user))
    .catch(err => res.status(400).json({ error: 'Error updating user.' }));
});

app.delete('/deleteuser/:id', (req, res) => {
  const id = req.params.id;
  UserModel.findByIdAndDelete({ _id: id })
    .then(response => {
      if (!response) {
        return res.status(404).json({ error: 'User not found.' });
      }
      res.status(204).end(); // Return 204 for successful delete (No content)
    })
    .catch(err => res.status(400).json({ error: 'Error deleting user.' }));
});

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Server is Running on ${port}`);
});
