const express = require('express')
const route = express.Router()
const { getAll, insert, remove, update } = require('../controllers/users')

route
    .get('/users/API/getAll', getAll)
    .post('/users/API/insert', insert)
    .delete('/users/API/delete/:id', remove)
    .patch('/users/API/update/:id', update)

module.exports = route