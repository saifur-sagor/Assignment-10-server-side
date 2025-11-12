const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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
    // six data api
    app.get("/course", async (req, res) => {
      const result = await courseCollection.find().limit(6).toArray();
      res.send(result);
    });
    // all data api
    app.get("/courses", async (req, res) => {
      const result = await courseCollection.find().toArray();
      res.send(result);
    });
    // single data api
    app.get("/courses/:id", async (req, res) => {
      const { id } = req.params;
      const cursor = { _id: new ObjectId(id) };
      const result = await courseCollection.findOne(cursor);
      res.send(result);
    });
    // course added api
    app.post("/course", async (req, res) => {
      const courseData = req.body;
      const result = await courseCollection.insertOne(courseData);
      res.send(result);
    });
    // my course get api
    app.get("/myCourse", async (req, res) => {
      const email = req.query.email;
      let query = {};
      if (email) {
        query = {
          "instructor.email": email,
        };
      }
      const cursor = courseCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // my course delete api
    app.delete("/myCourse/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await courseCollection.deleteOne(query);
      res.send(result);
    });
    // my course update api
    app.put("/myCourse/:id", async (req, res) => {
      const id = req.params.id;
      const updatedData = req.body; // frontend থেকে আসা updated তথ্য
      const objectId = { _id: new ObjectId(id) };

      const updateDoc = {
        $set: {
          title: updatedData.title,
          image: updatedData.image,
          price: updatedData.price,
          duration: updatedData.duration,
          category: updatedData.category,
          description: updatedData.description,
        },
      };

      const result = await courseCollection.updateOne(objectId, updateDoc);
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
