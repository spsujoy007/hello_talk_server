const express = require('express')
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
require('dotenv').config()
const app = express()

//port of the server
const port = process.env.PORT || 5000;

//middleware
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.6ke0m0t.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

function verifyJWT(req, res, next){
    const authHeader = req.headers.authorization;
    if(!authHeader){
        return res.status(401).send({message: "unathorized access"})
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN, function(err, decoded){
        if(err){
            return res.status(401).send({message: "unathorized access"})
        }
        req.decoded = decoded;
        next()
    })
}

async function run(){
    try{
        const coursesCollection = client.db('hello-Talk').collection('coursesCollection');
        const blogsCollection = client.db('hello-Talk').collection('blogsCollection');
        const usersCollection = client.db('hello-Talk').collection('usersCollection');
        const reviewsCollection = client.db('hello-Talk').collection('reviewCollection');


        //get courses data from mongodb
        app.get('/courses', async (req, res) => {
            const query = {};
            const result = await coursesCollection.find(query).toArray();
            res.send(result);
        });

        app.get('/course/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id)}
            const result = await coursesCollection.findOne(query);
            res.send(result);
        });

        app.get('/blogs', async (req, res) => {
            const query = {};
            const result = await blogsCollection.find(query).toArray();
            res.send(result);
        })

        app.get('/hblogs', async (req, res) => {
            const query = {};
            const result = await blogsCollection.find(query).limit(2).toArray();
            res.send(result);
        })

        app.get('/blogs/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id)};
            const result = await blogsCollection.findOne(query);
            res.send(result)
        })

        //post review in database
        app.post('/postreview', async(req, res) => {
            const review = req.body;
            const result = await reviewsCollection.insertOne(review);
            res.send(result)
        })

        //get the review api from mongodb
        app.get('/reviews', async(req, res) => {
            const query = {};
            const result = await reviewsCollection.find(query).toArray();
            res.send(result);
        })

        //get user details from signup
        app.post('/user', async (req, res) => {
            const user = req.query.userbio
            console.log(user);
        })

        // app.post('/jwt', (req, res) => {
        //     const user = req.quer;
        //     console.log(user)
        //     const token = jwt.sign(user, process.env.ACCESS_TOKEN, {expiredIn: '1h'});
        //     res.send({token});
        // })


        //authentication
        app.put('/user/:email', async (req, res) => {
            const email = req.params.email;
            console.log(email);
            const user = req.body;
            const filter = { email: email };
            const options = { upsert: true };

            const updateDoc = {
                $set: user,
            };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            const token = jwt.sign({ email: email }, process.env.ACCESS_TOKEN, { expiresIn: '1h' });
            res.send({ result, token });
        })

    }

    finally{

    }
}
run().catch(err => {
    console.error(err);
})

app.get('/', (req, res) => {
  res.send(`
    <p>
        <h1>Welcome to Hello_talk Server 🎉</h1>
        <h3>Let's do it</h3>
    </p>
  `)
})

app.listen(port, () => {
  console.log(`Hello talk app listening on port ${port}`)
})

//Export the express api
module.exports = app;