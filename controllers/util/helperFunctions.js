exports.asyncMiddleware = fn =>
    (req, res, next) => {
        Promise.resolve(fn(req, res, next))
            .catch(err => {
                res.status(500).send({ message: err.message });
            });
    }