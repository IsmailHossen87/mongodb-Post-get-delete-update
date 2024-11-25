const express = require('express');
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
const cors = require('cors');

app.use(cors())
app.use(express.json())


app.get('/',(req,res)=>{
    res.send("Simple crud is running ")
})

const uri = "mongodb+srv://ismailhosen8757:9RwC8Nd2fjnfupd1@cluster0.hg2ad.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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
    await client.connect();
    const database = client.db("usersDB");
    const userCollection = database.collection("user");
    // get data from mmongodb
    // sob gulo data ke mongodb theke niye asa hoise
    app.get('/users',async(req,res)=>{
      const cursor = userCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })

    // spacik ekta data ke read korar jonno
    // mongodb theke j kno ekta data ke niye kisy korar jonno
    app.get('/users/:id', async(req,res)=>{
      const id = req.params.id
      const query= {_id: new ObjectId(id)}
      const result = await userCollection.findOne(query) 
      res.send(result)
    })

    // data post server notun kisu add kora
    // notun kno data ke mongobd te rakhar jonno 
    app.post('/users', async(req,res)=>{
      const user = req.body;
      console.log("new user",user)
      const result = await userCollection.insertOne(user);
      res.send(result)
    })
    // delete data from database
    app.delete('/users/:id', async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await userCollection.deleteOne(query)
      res.send(result)
    })


    // mongobd te data ke update korar jonno
    app.put('/users/:id',async(req,res)=>{
      const id = req.params.id;
      const user = req.body;
   
      const filter = {_id: new ObjectId(id)}
      // update + insert
      const options = {upsert:true}
      const UpdateUser = {
        $set: {
          name : user.name,
          email : user.email
        } 
      }
      console.log(req.body)
      const result = await userCollection.updateOne(filter,UpdateUser,options)
      res.send(result)
    }) 

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen (port,()=>{
  console.log(`Simple crud is running ${port}`)
})