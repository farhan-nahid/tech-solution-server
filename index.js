  const express = require('express')
  const bodyParser = require('body-parser');
  const MongoClient = require('mongodb').MongoClient;
  const fileUpload = require('express-fileupload');
  const cors = require('cors');
  const app = express()
  require('dotenv').config();
  
  const port = process.env.PORT ||  5000;
  
  app.use(cors())
  app.use(bodyParser.json())
  app.use(express.static('doctors'));
  app.use(fileUpload());
  
  
  const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2xoju.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
  
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  client.connect(err => {
    const serviceCollection = client.db("techSolution").collection("services");
  
      app.post('/addAService', (req, res) =>{
        const textArea = req.body.textArea
        const name = req.body.name
        const price = req.body.price
        const file = req.files.myFile
        const newImg = file.data;
          const encImg = newImg.toString('base64');
  
          var image = {
              contentType: file.mimetype,
              size: file.size,
              img: Buffer.from(encImg, 'base64')
          };
  
          serviceCollection.insertOne({ name, textArea, image , price})
              .then(result => {
                  res.send(result.insertedCount > 0);
              })
      })

      app.get('/services', (req, res) => {
        serviceCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    });
  
  
     
  
    
  });
  
  
  app.get('/', (req, res) => {
    res.send('Hello World!')
  })
  
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })