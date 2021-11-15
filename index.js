const express = require('express');
const app = express();
const {MongoClient} =require('mongodb');
const cors = require('cors');
const port = process.env.PORT || 5000;
require('dotenv').config();

app.use(cors());
app.use(express.json()); 


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rtjaq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
      await client.connect();
      const database = client.db("HK-Bikes");
      const bikesCollection = database.collection("Bikes");
      const reviewCollection = database.collection("Review");
      const purchaseCollection = database.collection("purchaseBike");

      app.post('/review', async(req, res) =>{
        const review = req.body;
        const result = await reviewCollection.insertOne(review);
        res.json(result)
    });

    app.get('/review', async(req, res) =>{
      const cursor = reviewCollection.find({});
      const reviews = await cursor.toArray();
      res.send(reviews);
    })

    // get api 
        app.get('/bikes', async(req, res) =>{
          const cursor = bikesCollection.find({});
          const bikes = await cursor.toArray();
          res.send(bikes);
        })
        
        // post api
        app.post('/bikes', async(req, res) =>{
            const bike = req.body;
            console.log('hiting the api',bike);
            const result = await bikesCollection.insertOne(bike);
            console.log(result);
            res.json(result)
        });
// post purchase 
        app.post('/purchaseBike', async(req, res) =>{
          purchaseCollection.insertOne(req.body).then((result) =>{
            res.send(result);
          });
          
        });
  // get purchase 
        app.get("/purchaseBike", async(req, res) => {
          const cursor = purchaseCollection.find({});
              const result = await cursor.toArray();
              res.send(result);
        });
  
        console.log('all ok');
  
        app.delete('/deleteOrder/:id', async(req, res)=>{
          console.log(req.params.id);
          const result = await bookingCollection.deleteOne({_id:ObjectId(req.params.id),
          })
          console.log(result);
        });
        
  
      
    } finally {
      // await client.close();
    }
  }
  
  run().catch(console.dir);
  
  
  
  client.connect((err) => {
    const collection = client.db("test").collection("devices");
    // perform actions on the collection object
  });
  


app.get('/', (req, res) =>{
    res.send('Running my final project')
});


app.listen(port, () =>{
    console.log('Running port', port);
})