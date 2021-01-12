module.exports = response = {
    Success: (res, data, message) => {
        const result = {
            message: message,
            success: true,
            code: 200,
            data: data
        }
        res.json(result)
    },
    Failed: (res, data, message) => {
        const result = {
            message: message,
            success: false,
            code: 500,
            data: data
        }
        res.json(result)
    },
    NOT: (res, data, message) => {
        const result = {
            message: message,
            success: false,
            code: 404,
            data: data
        }
        res.json(result)
    }
}