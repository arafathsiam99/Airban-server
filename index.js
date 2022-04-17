const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const e = require("express");

const port = process.env.PORT || 8000;
const app = express();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hahq7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    //making db and Collection on database
    await client.connect();
    const database = client.db("Airban");
    const productsCollection = database.collection("products");
    const ordersCollection = database.collection("orders");
    const reviewsCollection = database.collection("reviews");
    const usersCollection = database.collection("users");

    // Add orders
    app.post("/placeorders", async (req, res) => {
      const orders = req.body;
      const result = await ordersCollection.insertOne(orders);
      res.send(result);
      // console.log(orders);
      // console.log(result);
    });

    // Add Product
    app.post("/addproduct", async (req, res) => {
      const products = req.body;
      const result = await productsCollection.insertOne(products);
      res.send(result);
      // console.log(result);
    });

    // Get Products
    app.get("/products", async (req, res) => {
      const cursor = productsCollection.find({}).limit(6);
      const products = await cursor.toArray();
      res.json(products);
    });

    // Get All Sunglasses
    app.get("/allsunglasses", async (req, res) => {
      const result = productsCollection.find({});
      const cars = await result.toArray();
      res.send(cars);
    });

    // Get Single product
    app.get("/placebooking/:id", async (req, res) => {
      const id = req.params.id;
      console.log("getting specific products", id);
      const query = { _id: ObjectId(id) };
      const result = await productsCollection.findOne(query);
      res.send(result);
      // console.log(result);
    });

    // Get my booking
    app.get("/booking/:id", async (req, res) => {
      const id = req.params.id;
      console.log("getting sp", id);
      const query = { email: id };
      console.log(query);
      const orders = ordersCollection.find(query);
      const result = await orders.toArray();
      res.send(result);
      console.log(result);
    });

    // getting all users(its should Delete)
    app.get("/users", async (req, res) => {
      const cursor = usersCollection.find({});
      const appointments = await cursor.toArray();
      res.json(appointments);
    });

    // DELETE API
    app.delete("/deleteOrders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await ordersCollection.deleteOne(query);
      res.json(result);
      // console.log(result);
    });

    // Manage All Package Api
    app.get("/allorders", async (req, res) => {
      const result = ordersCollection.find({});
      const order = await result.toArray();
      res.json(order);
    });

    // confirm package Api
    app.put("/confirmOrders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const update = "Confirm";
      const result = await ordersCollection.updateOne(query, {
        $set: {
          status: update,
        },
      });
      res.send(result);
      console.log(result);
    });

    //chacking Is admin true or not
    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      let isAdmin = false;
      if (user?.role === "admin") {
        isAdmin = true;
      }
      res.json({ admin: isAdmin });
    });

    // Adding product from admin Dashboard
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.json(result);
    });
    app.post("/products", async (req, res) => {
      const user = req.body;
      const result = await productsCollection.insertOne(user);
      res.json(result);
    });

    // Adding user those who register buy google
    app.put("/users", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const options = { upsert: true };
      const updateDoc = { $set: user };
      const result = await usersCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
    });
    app.put("/users/admin", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const updateDoc = { $set: { role: "admin" } };
      const result = await usersCollection.updateOne(filter, updateDoc);
      res.json(result);
    });
    // get reviews
    app.get("/review", async (req, res) => {
      const result = reviewsCollection.find({});
      const review = await result.toArray();
      res.send(review);
    });
    // Add Reviews
    app.post("/review", async (req, res) => {
      const reviews = req.body;
      const result = await reviewsCollection.insertOne(reviews);
      res.send(result);
    });
    // get single Review
    app.get("/review/:id", async (req, res) => {
      console.log("getting review", id);
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await reviewsCollection.findOne(query);
      res.send(result);
      console.log(result);
    });
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);
app.get("/", (req, res) => {
  console.log("Api   hit");
  res.send("Hellow Airban");
});

app.listen(port, () => {
  console.log("listening to port", port);
});

// get order by email
// app.get("/placeorders/:email", async (req, res) => {
//   const email = req.params.email;
//   const query = { email: email };
//   const cursor = orderCollection.find(query);
//   const appointments = await cursor.toArray();
//   res.json(appointments);
// });
