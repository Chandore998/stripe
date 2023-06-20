const express = require("express")
const bodyParser  = require("body-parser")
const cors = require('cors')
const app = express()
const path = require("path")
const stripeRouter = require("./src/routers/index")
app.use(cors({ origin: 'http://localhost:3000' }));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/api/v1", stripeRouter);


const port = 4000
app.listen(port , (err) =>{
    console.log(`Runing on ${port}`)
})