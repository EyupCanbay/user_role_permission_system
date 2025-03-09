const { rateLimit } = require('express-rate-limit');
const RateLimitMongoStore = require('rate-limit-mongo');

const limiter = rateLimit({
    store: new RateLimitMongoStore({
        uri: process.env.DB_URI,
        CollectionName: "rateLimits",
        expireTimeMs: 15 * 60 * 1000// 15 minutes (windowMs)
    }) , // Redis, Memcached, etc. See below.
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 5, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    //standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
});


module.exports = {limiter}