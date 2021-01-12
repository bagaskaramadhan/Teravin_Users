const express = require('express')
const route = express.Router()
const { getAll, insert } = require('../controllers/users')

route
    .get('/users/API/getAll', getAll)
    .post('/users/API/insert', insert)

module.exports = route