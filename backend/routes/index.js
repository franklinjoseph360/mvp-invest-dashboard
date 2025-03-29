const authRoutes = require('./v1/auth');
const dashboardRoutes = require('./v1/dashboard');

module.exports = function initRoutes(app) {
    app.use('/api/v1/auth', authRoutes);
    app.use('/api/v1/dashboard', dashboardRoutes);
}