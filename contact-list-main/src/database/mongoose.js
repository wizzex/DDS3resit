const mongoose = require('mongoose');

const connectionString = process.env.CONNECTION_STRING || "mongodb://root:root@localhost:27017";

mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(value => console.log('Connected to database'))
    .catch(error => console.log('Error connecting to database: ', error));