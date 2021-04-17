  const express = require('express')
  const bodyParser = require('body-parser');
  const MongoClient = require('mongodb').MongoClient;
  const fileUpload = require('express-fileupload');
  const cors = require('cors');
  const { ObjectID, ObjectId } = require('bson');
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
    const adminCollection = client.db("techSolution").collection("admin");
    const orderCollection = client.db("techSolution").collection("order");
    const reviewCollection = client.db("techSolution").collection("review");
    
  
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

      app.get('/services/:id', (req, res)=>{
         serviceCollection.find({_id:ObjectID(req.params.id)})
        .toArray((err, service)=>{
          res.send( service[0]);
        })
     }) 

       app.post('/addOrder',(req,res)=>{
        orderCollection.insertOne(req.body)
        .then(result=>{
          res.send(result.insertedCount>0)
        })
        .catch(error=>console.log(error))
      })

      app.get('/allOrders', (req, res) => {
        orderCollection.find({})
            .toArray((err, docs) => {
              console.log(docs);
                res.send(docs);
            })
    });

      app.get('/order', (req, res)=>{
        orderCollection.find({email: req.query.email})
        .toArray((err, totalOrder)=>{
          res.send( totalOrder)
        })
      })

      app.post('/addReview', (req,res)=>{
        const newReview = req.body;
        reviewCollection.insertOne({name:newReview.name, companyName:newReview.companyName, description:newReview.description})
        .then(result =>{
          res.send(result.insertedCount > 0)
        })
      })

      app.get('/review', (req, res) => {
        reviewCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    });

    app.post('/addAdmin', (req,res)=>{
      const newAdmin = req.body.email;
      adminCollection.insertOne({email:newAdmin})
      .then(result =>{
        res.send(result.insertedCount > 0)
      })
    })

    app.post('/isAdmin', (req, res)=>{
      const email = req.body.email
      adminCollection.find({email:email})
      .toArray((err, admins) => {
        res.send(admins.length > 0)
      })
     
    })
  
  
     
  
    
  });
  
  
  app.get('/', (req, res) => {
    res.send('Hello World!')
  })
  
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })