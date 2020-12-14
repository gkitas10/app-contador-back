const errorHandler = (error, req, res, next) => {
    if (res.headersSent) {
        return next(error)
    }

    res.status(error.status)
    res.json({
        error:error.message
    })
}

module.exports = errorHandler;