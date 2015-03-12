var config = require('./config')
var Sentry = require('sentry-client')

module.exports = (config.sentryDsn) ? Sentry.create({ dsn: config.sentryDsn }) : undefined
