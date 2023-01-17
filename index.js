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


// const levels = require('/data/course.json');

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
        const levelsCollcetion = client.db('hello-Talk').collection('levelsCollcetion');
        const blogsCollection = client.db('hello-Talk').collection('blogsCollection');
        const usersCollection = client.db('hello-Talk').collection('usersCollection');
        const reviewsCollection = client.db('hello-Talk').collection('reviewsCollection');
        const YquizCollection = client.db('hello-Talk').collection('YquizCollection');
        const AquizCollection = client.db('hello-Talk').collection('AquizCollection');
        const faqCollection = client.db('hello-Talk').collection('faqCollection');
        const flashcardCollection = client.db('hello-Talk').collection('flashcardCollection');


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

        //\___________________all blog apis CRUD oparation start_________________/\\
        //post blog api
        app.post('/blog', async(req, res) => {
            const blog = req.body;
            const result = await blogsCollection.insertOne(blog)
            res.send(result)
        })

        //get all blogs
        app.get('/blogs', async (req, res) => {
            const query = {};
            const result = await blogsCollection.find(query).toArray();
            res.send(result);
        })

        //two blogs api for show in home page
        app.get('/hblogs', async (req, res) => {
            const query = {};
            const result = await blogsCollection.find(query).limit(2).toArray();
            res.send(result);
        })

        //get the single blog
        app.get('/blogs/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id)};
            const result = await blogsCollection.findOne(query);
            res.send(result)
        })

        //delete blog 
        app.delete('/blogs/:id', async(req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id)}
            const result = await blogsCollection.deleteOne(query);
            res.send(result)
        })
        //\__________________________blogs end______________________________/\\

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
        });

        //get single review of indecated user
        app.get('/review', async(req, res) => {
            const reqemail = req.query.email;
            const query = {email: reqemail}
            if(reqemail){
                const result = await reviewsCollection.findOne(query);
                res.send(result)
            }
            else{
                const error = {message: "no email found"}
            }
        })

        //frequently asked question 
        app.get('/faq', async ( req, res) => {
            const query = {};
            const result = await faqCollection.find(query).toArray();
            res.send(result)
        })

        //flashcardCollection 
        app.get('/flashcard', async (req, res) => {
            const query = {}; 
            const result = await flashcardCollection.find(query).toArray();
            res.send(result)
        })

        //get quizzes api - checking age
        app.get('/quizes', async(req, res) => {
            const age = req.query.age
            const query = {};
            if(age === 'young'){
                const result = await YquizCollection.find(query).toArray();
                res.send(result)
            }
            if(age === 'adult'){   
                const result = await AquizCollection.find(query).toArray();
                res.send(result)
            }
            else{
                const result = {message: "No data found"}
                res.send(result)
            }
        })
        
        app.get('/levels', async (req, res) => {
            const query = {};
            const result = await levelsCollcetion.find(query).toArray()
            console.log(result)
            res.send(result)
        })

        app.get('/levels/:level', async (req, res) => {
            const level = req.params.level;
            const query = {level: level};
            const result = await levelsCollcetion.find(query).toArray()
            console.log(result)
            res.send(result)
        })

        app.get('/level/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await levelsCollcetion.findOne(query)
            console.log(result)
            res.send(result)
        })


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

        app.get('/users', async(req, res) => {
            const query = {};
            const result = await usersCollection.find(query).toArray();
            res.send(result) 
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