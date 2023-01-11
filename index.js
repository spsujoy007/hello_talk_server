const express = require('express')
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const app = express()

//port of the server
const port = process.env.PORT || 5000;

//middleware
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.6ke0m0t.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// function verifyJWT(req, res, next){
//     const authHeader = req.headers.authorization;
//     if(!authHeader){
//         return res.status(401).send({message: "unathorized access"})
//     }
//     const token = authHeader.split(' ')[1];
//     jwt.verify(token, process.env.ACCESS_TOKEN, function(err, decoded){
//         if(err){
//             return res.status(401).send({message: "unathorized access"})
//         }
//         req.decoded = decoded;
//         next()
//     })
// }

async function run(){
    try{
        const coursesCollection = client.db('hello-Talk').collection('coursesCollection');
        const blogsCollection = client.db('hello-Talk').collection('blogsCollection');
        //get courses data from mongodb
        app.get('/courses', async (req, res) => {
            const query = {};
            const result = await coursesCollection.find(query).toArray();
            res.send(result);
        });

        app.get('/blogs', async (req, res) => {
            const query = {};
            const result = await blogsCollection.find(query).toArray();
            res.send(result);
        })

        
        // app.post('/jwt', (req, res) => {
        //     const user = req.user;
        //     const token  = jwt.sign(user, process.env.ACCESS_TOKEN, {expiredIn: '1h'});
        //     res.send({token});
        // })

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