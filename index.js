const express = require('express')
const cors = require('cors');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;

//middleware
app.use(cors())
app.use(express.json())


app.get('/', (req, res) => {
  res.send(`
    <p>
        <h1>Welcome to Hello_talk Server 🎉</h1>
        <h3>Lets do it dude</h3>
    </p>
  `)
})

app.listen(port, () => {
  console.log(`Hello talk app listening on port ${port}`)
})