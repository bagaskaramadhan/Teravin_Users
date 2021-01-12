const model = require('../models/users')
const { Success, Failed } = require('../helpers/response')

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
        const data = req.body
        if (!data.name || !data.mobile || !data.email || !data.address) {
            Failed(res, [], 'cannot empty')
        } else {
            model.checkUser(data.email)
                .then((result) => {
                    if (result.length === 0) {
                        const sendData = {
                            name: data.name,
                            mobile: data.mobile,
                            email: data.email,
                            address: data.address
                        }
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
}

module.exports = controller