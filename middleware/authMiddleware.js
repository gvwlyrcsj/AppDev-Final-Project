module.exports = (req, res, next) => {
    res.locals.userId = req.session.userId || null;
    res.locals.username = req.session.username || null;
    next();
};
