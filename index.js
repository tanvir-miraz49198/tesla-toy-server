const express = require('express')
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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

    const addingToys = client.db('teslaToy').collection('addedToys');

    const customersReviews = client.db('teslaToy').collection('customers');






    // toy information

    app.get('/details', async (req, res) => {
      let query = {};
      if (req.query?.category) {
        query = { category: req.query.category }
      }
      const result = await toyDetailsCollection.find(query).toArray();
      res.send(result)
    })


    app.get('/details/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await toyDetailsCollection.findOne(query);
      res.send(result)
    })




    // customers information

    app.get('/customers', async (req, res) => {
      const cursor = customersReviews.find();
      const result = await cursor.toArray();
      res.send(result);
    })




    //  all added toys information post

    app.post('/addedToys', async (req, res) => {
      const toys = req.body;
      console.log(toys)
      const result = await addingToys.insertOne(toys)
      res.send(result)
    })



    // all added toys information get category(email)

    app.get('/addedToys', async (req, res) => {
      let query = {};
      if (req.query?.email) {
        query = { email: req.query.email }
      }
      const result = await addingToys.find(query).toArray();
      res.send(result)
    })


    // delete

    app.delete('/addedToys/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await addingToys.deleteOne(query);
      res.send(result)
    })


    // find as id

    app.get('/addedToys/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await addingToys.findOne(query);
      res.send(result)
    })


    // update one

    app.put('/addedToys/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const options = { upsert: true };
      const updatedToy = req.body;
      const toy = {
        $set: {
          sellerName: updatedToy.sellerName,
          ToyName: updatedToy.ToyName,
          email: updatedToy.email,
          PhotoUrl: updatedToy.PhotoUrl,
          price: updatedToy.price,
          quantity: updatedToy.quantity,
          subCategory: updatedToy.subCategory
        }
      }
      const result = await addingToys.updateOne(query, toy, options)
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