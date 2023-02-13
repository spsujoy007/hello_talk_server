const express = require("express")
const router = express.Router()
require('dotenv').config()

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.6ke0m0t.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


const communityPostsCollection = client.db('hello-Talk').collection('communityPostsCollection');
const postlikes = client.db('hello-Talk').collection('postlikes');
const postcomment = client.db('hello-Talk').collection('postcomment');
const topAuthors = client.db('hello-Talk').collection('topAuthors');
const likeOnComment = client.db('hello-Talk').collection('likeOnComment');


router.post('/addapost', async (req, res) => {
    const question = req.body;
    const result = await communityPostsCollection.insertOne(question);
    res.send(result)
});
router.get('/communityposts', async (req, res) => {
    const query = {};
    const result = await communityPostsCollection.find(query).toArray();
    res.send(result)
});

router.post('/addapost', async (req, res) => {
    const question = req.body;
    const result = await communityPostsCollection.insertOne(question);
    res.send(result)
});

router.post('/postlike', async (req, res) => {
    const likebody = req.body;
    const query = { email: likebody.email }
    const likedata = await postlikes.find(query).toArray()
    // console.log(likedata.length)
    if (likedata.length) return res.send({ k: "S" })
    const result = await postlikes.insertOne(likebody);
    res.send(result)
})

router.get('/postlike', async (req, res) => {
    const query = {}
    const communitybody = await postlikes.find(query).toArray()
    res.send(communitybody)
})
router.post('/postcomment', async (req, res) => {
    const communitybody = req.body;
    const result = await postcomment.insertOne(communitybody);
    res.send(result)
})
router.get('/comment/:id', async (req, res) => {
    const id = req.params.id
    const query = { pid: id }
    const result = await postcomment.find(query).toArray();
    res.send(result);
})

router.get('/like', async (req, res) => {
    const email = req.query.email;
    const id = req.query.id
    const query = {
        email: email,
        pid: id
    }
    const result = await postlikes.find(query).toArray()
    // console.log(result)
    res.send(result)
})

router.delete('/like/:id', async (req, res) => {
    const id = req.params.id;
    const query = { pid: id };
    console.log(query)
    // const result = await postlikes.deleteOne(query);
    // res.send(result);
});

router.post('/topAuthors', async (req, res) => {
    const topAuthor = req.body;
    // console.log(topAuthor)
    const query = {};
    const result2 = await topAuthors.deleteMany(query);
    const result = await topAuthors.insertMany(topAuthor);
    res.send(result)
})


router.get('/topAuthors', async (req, res) => {
    const query = {}
    const communitybody = await topAuthors.find(query).toArray()
    res.send(communitybody)
})

router.get('/commentcount', async (req, res) => {
    const email = req.query.email;
    const query = { email: email }
    const communitybody = await postcomment.find(query).toArray()
    res.send(communitybody)
})

router.get('/clike', async (req, res) => {
    const email = req.query.email;
    const id = req.query.id
    const query =
    {
        email: email,
        cid: id
    }
    const commentStatus = await likeOnComment.find(query).toArray()
    res.send(commentStatus)
})


router.post('/likeOnComment', async (req, res) => {
    const commentLike = req.body;
    const result = await likeOnComment.insertOne(commentLike);
    res.send(result)
})

router.delete('/Clike/:id', async (req, res) => {
    const id = req.params.id;
    const query = { cid: id };
    // console.log(query)
    const result = await likeOnComment.deleteOne(query);
    res.send(result);
});

router.delete('/Clike/:id', async (req, res) => {
    const id = req.params.id;
    const query = { cid: id };
    // console.log(query)
    const result = await likeOnComment.deleteOne(query);
    res.send(result);
});

router.delete('/deleteComment/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    // console.log(query)
    const result = await postcomment.deleteOne(query);
    res.send(result);
});











module.exports = router;