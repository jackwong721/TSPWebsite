const https = require('https')
const path = require('path')
const mongoose = require('mongoose')
const fs = require('fs')

require('dotenv').config({path: path.join(__dirname, '.env'), debug: true})

const MONGO_URL = 'mongodb+srv://jackwong721:996633Abc@cluster0.zaycs75.mongodb.net/tsp?retryWrites=true&w=majority'

const app = require('./app')

const server = https.createServer({
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem'),
}, app)

const PORT = 443

mongoose.connection.once('open', ()=>{
    console.log('MongoDB connection ready')
})

mongoose.connection.on('error', (err)=>{
    console.error(err)
})

async function startServer(){
    await mongoose.connect(MONGO_URL)
    server.listen(PORT, ()=>{
        console.log(`Listening on port ${PORT}`)
    })
}

startServer()



