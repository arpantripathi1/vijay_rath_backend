// routes/dataRoutes.js
const express = require('express');
const {fetchEmailsAndContacts} = require('../controllers/dataController');

const router = express.Router();

router.get('/data', fetchEmailsAndContacts);

module.exports = router;