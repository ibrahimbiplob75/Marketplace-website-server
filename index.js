const express=require("express");
const app=express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const dotenv = require('dotenv').config();
const cors=require("cors");
const port = process.env.PORT || 5000;


//Middleware
app.use(cors());
app.use(express.json());

//database intregration 

const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.npygsvo.mongodb.net/?retryWrites=true&w=majority`;

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
    const database=client.db("productDB").collection('product');


    //Insert into database
    app.post("/product",async(req,res)=>{
      const newProduct=req.body;
      console.log(newProduct);
      const result=await database.insertOne(newProduct);
      res.send(result);
    })
    //Get Data from database
    app.get("/product",async(req,res)=>{
        const cursor=database.find({ user_email: { $exists: false } });
        const result=await cursor.toArray();
        res.send(result);
    });

    //geting single data from database

    app.get("/product/details/:id",async(req,res)=>{
      const id=req.params.id;
      const query={_id : new ObjectId(id)};
      const result=await database.findOne(query);
      res.send(result);
    });

    app.post("/Cartproduct",async(req,res)=>{
      const CartProduct=req.body;
      console.log(CartProduct);
      const result=await database.insertOne(CartProduct);
      res.send(result);
    });
    //myCart product 
    app.get("/product/myCart",async(req,res)=>{
        const cursor = database.find({ user_email: { $exists: true } }); // Filter for documents with "Email" field
        const result = await cursor.toArray();
        res.send(result);
        
    });

    app.delete("/product/myCart/:id",async(req,res)=>{
        const id=req.params.id;
        const query={_id:new ObjectId(id)};
        const result=await database.deleteOne(query);
        res.send(result);
    });




    
    
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    
    // await client.close();
  }
}
run().catch(console.dir);



app.get("/",(req,res)=>{
    res.send("Port is connected successfully");
});

app.listen(port ,(req,res)=>{
    console.log(`The server is using on ${port} port`);
});