module.exports = {
    ensureAuthenticated: function(req, res, next) {
        if(req.isAuthenticated()){
            return next();
        }
        res.send('Not authenticated')
    },

    forwardAuthenticated: function(req, res, next) {
        if(!req.isAuthenticated()){
            return next()
        }
        res.redirect('/dashboard')
    }
}