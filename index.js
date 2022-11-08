const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config();
const port = process.env.PORT || 5000;



app.use(cors());
app.use(express.json());




const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.z2qhqgi.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){

    try{

        const serviceCollection=client.db('wildPhoto').collection('photos');

        app.get('/services', async(req, res)=>{
            const query={};

            const cursor=await serviceCollection.find(query);
            const service= await cursor.toArray();
            
            res.send(service);
        })

    }

    finally{

    }

}
run().catch(error=>{
    console.log(error);
})




app.get('/', (req, res) => {
  res.send('Hello assignment server')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})