const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

//simpleDBUser
//E8a7vjW6tNauW1il
const uri =
  "mongodb+srv://simpleDBUser:E8a7vjW6tNauW1il@cluster0.0a7phnt.mongodb.net/?appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

async function run() {
  try {
    await client.connect();

    const userDB = client.db("usersDB");
    const usersCollection = userDB.collection("users");

    // CREATE (POST)
    app.post("/users", async (req, res) => {
      const newUser = req.body;
      console.log("user info", newUser); // ক্লায়েন্ট পাঠানো ডেটা কনসোলে দেখাবে
      const result = await usersCollection.insertOne(newUser);
      res.send(result);
    });

    // READ (GET all users)
    app.get("/users", async (req, res) => {
      const cursor = usersCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // READ (GET single user by ID)
    app.get("/users/:id", async (req, res) => {
      const id = req.params.id;
      console.log("need user with id", id);
      const query = { _id: new ObjectId(id) };
      const result = await usersCollection.findOne(query);
      res.send(result);
    });

    //PATH (Server side)
    app.patch("/users/:id", async (req, res) => {
      const id = req.params.id;
      const updatedUser = req.body;
      console.log("to update", id, updatedUser);

      const query = { _id: new ObjectId(id) };
      const update = {
        $set: {
          name: updatedUser.name,
          email: updatedUser.email,
        },
      };

      const options = {};
      const result = await usersCollection.updateOne(query, update);
      res.send(result);
    });

    // DELETE
    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await usersCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port: ${port}`);
});
