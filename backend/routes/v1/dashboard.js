const express = require('express');
const router = express.Router();
const { authorizeUser } = require('../../middlewares/authorize');
const { dashboard } = require('../../controllers/v1/dashboard');

router.get('/', authorizeUser, dashboard)

module.exports = router;