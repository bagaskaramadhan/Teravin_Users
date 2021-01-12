const model = require('../models/users')
const { Success, Failed } = require('../helpers/response')
const image = require('../helpers/upload')
const fs = require('fs')

const controller = {

    getAll: (req, res) => {
        const field = !req.query.field ? 'id' : req.query.field
        const order = !req.query.order ? 'ASC' : req.query.order
        const name = !req.query.name ? "" : req.query.name
        const limit = !req.query.limit ? 5 : parseInt(req.query.limit)
        const page = !req.query.page ? 1 : parseInt(req.query.page)
        const offset = page === 1 ? 0 : (page - 1) * limit
        model.getAll(name, limit, offset, field, order)
            .then((result) => {
                Success(res, result, 'Success Get All')
            })
            .catch((err) => {
                Failed(res, [], err.message)
            })
    },
    insert: (req, res) => {
        image.single('image')(req, res, (err) => {
            if (err) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    Failed(res, [], 'File too large')
                } else {
                    console.log(err)
                }
            } else {
                const body = req.body
                if (!body.name || !body.mobile || !body.email || !body.address) {
                    Failed(res, [], 'cannot empty')
                } else {
                    model.checkUser(body.email)
                .then((result) => {
                    if (result.length === 0) {
                        const sendData = {
                            name: body.name,
                            mobile: body.mobile,
                            email: body.email,
                            address: body.address
                        }
                        body.image = !req.file ? 'default.png' : req.file.filename
                        model.insert(sendData)
                            .then((result) => {
                                Success(res, result, 'Success insert data')
                            })
                            .catch((err) => {
                                Failed(res, [], err.message)
                            })
                    } else {
                        Failed(res, [], 'Email has been taken')
                    }
                })
                .catch((err) => {
                    Failed(res, [], err.message)
                })
                }
            }
        })
    }
}

module.exports = controller