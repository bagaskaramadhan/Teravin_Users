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
    },
    remove: (req, res) => {
        const id = req.params.id
        model.remove(id)
            .then((result) => {
                Success(res, result, 'Success Delete Data')
            })
            .catch((err) => {
                Failed(res, [], err.message)
            })
    },
    update: (req, res) => {
        image.single('image')(req, res, (err) => {
            if (err) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    Failed(res, [], 'File too large')
                } else {
                    console.log(err)
                }
            } else {
                const id = req.params.id
                const body = req.body
                model.checkUserByID(id) //check to model where id already exist
                    .then((check) => {
                        const Oldimage = check[0].image
                        body.image = !req.file ? Oldimage : req.file.filename //jika tidak ada request file maka Oldimage
                        if (body.image !== Oldimage) { // jika ganti image maka masuk ke kondisi bawah
                            if (Oldimage !== 'default.png') { // jika imagenya lama bukan default
                                fs.unlink(`src/uploads/${Oldimage}`, (err) => {
                                    if (err) {
                                        Failed(res, err,)
                                    } else {
                                        model.update(id, body)
                                            .then((result) => { //gambar lama akan diganti dengan gambar baru tanpa menambah file
                                                Success(res, result, 'Success update data')
                                            })
                                            .catch((err) => {
                                                console.log(err)
                                            })
                                    }
                                })
                            } else {
                                model.update(id, body)
                                    .then((result) => {
                                        Success(res, result, 'Success update data') // new Image
                                    })
                                    .catch((err) => {
                                        console.log(err)
                                    })
                            }
                        } else {
                            model.update(id, body)
                                .then((result) => {
                                    Success(res, result, 'Success update data') //old Image
                                })
                                .catch((err) => {
                                    console.log(err)
                                })
                        }
                    })
            }
        })
    },
    checkUserByID: (req, res) => {
        const id = req.params.id
        model.checkUserByID(id)
            .then((result) => {
                const checkID = result[0]
                if (checkID) {
                    Success(res, result, 'Success Get Data By ID')
                } else {
                    NOT(res, [], 'Data Not Found')
                }
            })
            .catch((err) => {
                Failed(res, [], err.message)
            })
    }
}

module.exports = controller