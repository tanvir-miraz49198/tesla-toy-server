const express = require('express')
const app = express()
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const cors = require('cors')
const port = process.env.PORT || 5000;



// middleWare

app.use(cors())
app.use(express.json())

console.log(process.env.DB_PASS)

// mongodb drivers



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ehog8eb.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const toyDetailsCollection = client.db('teslaToy').collection('details');
  

    const toyCategoryDetails = client.db('toyCategory').collection('categoryDetails');

    const addingToys = client.db('teslaToy').collection('addedToys');

  




// toy information

    app.get('/details', async(req, res) => {
      const cursor = toyDetailsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })


  
    app.get('/categoryDetails', async(req, res) => {
      const category = toyCategoryDetails.find();
      const result = await category.toArray();
      res.send(result)
    })



  //  all added toys information post

    app.post('/addedToys', async(req, res) => {
      const toys = req.body;
      console.log(toys)
      const result = await addingToys.insertOne(toys)
      res.send(result)
    })



    // all added toys information get

    app.get('/addedToys', async(req, res) => {
      const result = await addingToys.find().toArray();
      res.send(result)
    })







    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send("hello world 11")
})


app.listen(port, () => {
  console.log('tesla car running server running')
})