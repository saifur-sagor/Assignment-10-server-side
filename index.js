const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 4000;

// middle ware
app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://e_learning_db:wfCqXkZE4g1x7Rq2@cluster0.ukfyacf.mongodb.net/?appName=Cluster0";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    const db = client.db("e_learning_db");
    const courseCollection = db.collection("course");

    app.get("/course", async (req, res) => {
      const result = await courseCollection.find().limit(6).toArray();
      res.send(result);
    });

    app.get("/course", async (req, res) => {
      const result = await courseCollection.find().toArray();
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Server is running now!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
