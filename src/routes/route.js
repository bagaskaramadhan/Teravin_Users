const express = require('express')
const route = express.Router()
const { getAll, insert, remove } = require('../controllers/users')

route
    .get('/users/API/getAll', getAll)
    .post('/users/API/insert', insert)
    .delete('/users/API/delete/:id', remove)

module.exports = route