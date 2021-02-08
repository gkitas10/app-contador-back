const errorHandler = (error, req, res, next) => {
    if (res.headersSent) {
        return next(error)
    }

    console.log(error);
    console.log(error.message);
    res.status(error.status)
    res.json({
        error:error.message
    })
}

module.exports = errorHandler;