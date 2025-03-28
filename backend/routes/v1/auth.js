const express = require('express');
const router = express.Router();

router.post('/login', (_req, res) => {
    res.send('login page')
})

router.delete('/logout', (_req, res) => {
    res.send('logout page')
})

module.exports = router;