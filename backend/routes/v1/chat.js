const express = require('express');
const { authorizeUser } = require('../../middlewares/authorize');
const { getChatMessages, postMessages } = require('../../controllers/v1/chat');
const router = express.Router();

router.get('/:familyId/:userId/', authorizeUser, getChatMessages);
router.post('/:familyId/:userId/', authorizeUser, postMessages);

module.exports = router;