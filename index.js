const express = require('express')
const app = express()
const cors = require('cors')
const jwt = require('jsonwebtoken')
require('dotenv').config();
const port = process.env.PORT || 5000;



app.use(cors());
app.use(express.json());




const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.z2qhqgi.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({ message: 'unauthorized access' })
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (error, decoded) {
        if (error) {
            return res.status(401).send({ message: 'unauthorized access' })
        }
        req.decoded = decoded;
        next();

    })


}




async function run() {

    try {

        const serviceCollection = client.db('wildPhoto').collection('photos');
        const reviewCollection = client.db('wildPhoto').collection('review')
        // Read 
        app.get('/services',  async (req, res) => {
           
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


        app.get('/myReview',verifyJWT, async (req, res) => {
            const decoded=user.decoded;
            
            if(decoded.email !== req.query.email){
                res.send({message: 'unauthorized access'})
            }
            let query = {};
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }

            const cursor = reviewCollection.find(query);
            const review = await cursor.toArray();
            res.send(review)
        })


        //   delete 

        app.delete('/delete/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await reviewCollection.deleteOne(query);
            res.send(result)
        })

        app.get('/review/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await reviewCollection.findOne(query);
            res.send(service);
        })


        // update 

        app.put('/review/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const user = req.body;
            const option = { upsert: true };

            const updateUser = {
                $set: {
                    message: user.message
                }
            }

            const updateReview = await reviewCollection.updateOne(filter, updateUser, option)

            res.send(updateReview)
        })


        // post service....
        app.post("/service", async (req, res) => {
            const product = req.body;
            const result = await serviceCollection.insertOne(product);
            res.send(result);
        });


        // JWT 

        app.post('/jwt', (req, res) => {
            const user = req.body;

            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' })

            res.send({ token })
        })




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