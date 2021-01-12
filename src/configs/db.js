const db = require('mysql2')
const { NAME, HOST, USER, PASS } = require('../helpers/env')
const connections = db.createConnection({
    host: HOST,
    user: USER,
    password: PASS,
    database: NAME
})

connections.connect((err) => {
    if (err) {
        console.log(err)
    } else {
        console.log(`CONNECT TO ${NAME}`)
    }
})

module.exports = connections