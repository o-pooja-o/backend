const router = require('express').Router();
const verify = require('../apis/middleware/verify')
router.get('/', verify, function (req, res) {
    res.json({ welcomeNote: "Hello", date: Date.now() });
})

module.exports = router; 