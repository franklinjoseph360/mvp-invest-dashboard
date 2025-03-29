const express = require('express');
const router = express.Router();
const { authorizeUser } = require('../../middlewares/authorize');
const { login, authorize, logout } = require('../../controllers/v1/auth');

router.post('/login', login)
router.get('/authorize', authorizeUser, authorize)
router.delete('/logout', logout)

module.exports = router;