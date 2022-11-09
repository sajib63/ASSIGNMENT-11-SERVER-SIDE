const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config();
const port = process.env.PORT || 5000;



app.use(cors());
app.use(express.json());




const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.z2qhqgi.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {

    try {

        const serviceCollection = client.db('wildPhoto').collection('photos');
        const reviewCollection=client.db('wildPhoto').collection('review')
        // Read 
        app.get('/services', async (req, res) => {
            const query = {};
            const cursor = await serviceCollection.find(query);
            const service = await cursor.limit(3).toArray();
            res.send(service);
        })


        app.get('/totalServices', async (req, res) => {
            const query = {};
            const cursor = await serviceCollection.find(query);
            const service = await cursor.toArray();
            res.send(service);
        })


        app.get('/totalServices/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service);
        })



        // post review......
        app.post("/review", async (req, res) => {
            const review = req.body;
            console.log(review);
            const cursor = await reviewCollection.insertOne(review);
            res.send(cursor);
        });
        //get review........
        
        app.get("/review", async (req, res) => {
            let query = {};
            
            if (req.query.serviceID) {
              query = { serviceID: req.query.serviceID };
            }
      
            const cursor = await reviewCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
          });
      


       


    }

    finally {

    }

}
run().catch(error => {
    console.log(error);
})




app.get('/', (req, res) => {
    res.send('Hello assignment server')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})