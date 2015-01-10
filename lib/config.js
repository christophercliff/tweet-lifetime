var dotenv = require('dotenv')

dotenv.load()

module.exports = {
    appName: process.env.APP_NAME,
    ignoreHashtag: process.env.IGNORE_HASHTAG || 'pin',
    maxAgeUnit: process.env.MAX_AGE_UNIT || 'days',
    maxAgeValue: parseInt((process.env.MAX_AGE_VALUE || '7'), 10),
    port: process.env.PORT || 3000,
    sentryDsn: process.env.SENTRY_DSN,
    twitterAccessTokenKey: process.env.TWITTER_ACCESS_TOKEN_KEY,
    twitterAccessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
    twitterConsumerKey: process.env.TWITTER_CONSUMER_KEY,
    twitterConsumerSecret: process.env.TWITTER_CONSUMER_SECRET,
}
