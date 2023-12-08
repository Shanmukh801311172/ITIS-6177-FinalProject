const rateLimit = require('express-rate-limit');

const generateLimiter = rateLimit({
    windowMs: 5 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        res.status(400).send("Multiple requests received. 5 seconds timeout.");
    },
});

module.exports = { generateLimiter };
