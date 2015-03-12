var async = require('async')
var BPromise = require('bluebird')
var sentry = require('./sentry')
var server = require('./server')

module.exports = stop

function stop(err) {
    async.parallel([
        async.apply(log, err),
        server.stop.bind(server),
    ], function () {
        process.exit(1)
    })
}

function log(err, callback) {
    var isError = (err instanceof Error)
    if (isError && err.stack) console.error(err.stack)
    if (isError && sentry) return sentry.sendError(err, callback)
    return BPromise.resolve().nodeify(callback)
}
