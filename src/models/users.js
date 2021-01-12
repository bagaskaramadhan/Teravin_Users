const db = require('../configs/db')

const model = {

    getAll: (name, limit, offset, field, order) => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM users
            WHERE name LIKE '%${name}%'
            ORDER BY ${field} ${order}
            LIMIT ${offset}, ${limit}`
                , (err, result) => {
                    if (err) {
                        reject(new Error(err))
                    } else {
                        resolve(result)
                    }
                })
        })
    },
    insert: (data) => {
        return new Promise((resolve, reject) => {
            db.query(`INSERT INTO users (name, mobile, email, address)
            VALUES ('${data.name}','${data.mobile}','${data.email}','${data.address}')`,
                (err, result) => {
                    if (err) {
                        reject(new Error(err))
                    } else {
                        resolve(result)
                    }
                })
        })
    },
    checkUser: (email) => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM users WHERE email = '${email}'`, (err, result) => {
                if (err) {
                    reject(new Error(err))
                } else {
                    resolve(result)
                }
            })
        })
    },
    remove: (id) => {
        return new Promise((resolve, reject) => {
            db.query(`DELETE FROM users WHERE id = ?`, id, (err, result) => {
                if (err) {
                    reject(new Error(err))
                } else {
                    resolve(result)
                }
            })
        })
    }
}

module.exports = model