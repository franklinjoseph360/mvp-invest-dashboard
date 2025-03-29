const express = require('express');
const { authorizeUser } = require('../../middlewares/authorize');
const { getChatMessages, postMessages } = require('../../controllers/v1/chat');
const router = express.Router();

router.get('/:familyId/:userId/:receiverId', authorizeUser, getChatMessages);
router.post('/:familyId/:userId/:receiverId', authorizeUser, postMessages);

module.exports = router;