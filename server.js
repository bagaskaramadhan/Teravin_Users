const express = require('express')
const server = express()
const { PORT } = require('./src/helpers/env')
const bodyParser = require('body-parser')
const cors = require('cors')
const router = require('./src/routes/route')

server.use(cors())
server.use(bodyParser.urlencoded({ extended: false }))
server.use(bodyParser.json())
server.use('/', router)

server.listen(PORT, () => {
    console.log(`RUNNING ON PORT ${PORT}`)
})