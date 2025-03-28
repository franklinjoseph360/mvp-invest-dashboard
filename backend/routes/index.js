const authRoutes = require('./v1/auth');

module.exports = function initRoutes(app) {
    app.use('/api/v1/auth', authRoutes);
}