const express = require('express')
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const app = express()
require('dotenv').config();

const port = process.env.PORT ||  5000;

app.use(cors())
app.use(bodyParser.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2xoju.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const appointmentCollection = client.db("techSolution").collection("services");

  
});

app.get('/', (req, res) => {
    res.send('Hello World!')
  })
                                                                                                                                                                                                                                                          
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })
