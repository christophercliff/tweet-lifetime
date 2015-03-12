var stop = require('./stop')

process
    .once('uncaughtException', stop)
    .once('SIGINT', stop)

require('bluebird')
    .onPossiblyUnhandledRejection(stop)

var config = require('./config')
var Runner = require('./runner')
var server = require('./server')

var runner = Runner.create({
    maxAgeUnit: config.maxAgeUnit,
    maxAgeValue: config.maxAgeValue,
    ignoreHashtag: config.ignoreHashtag,
})

server
    .once('request-error', function (server, err) { stop(err) })
    .start(function (err) {
        if (err) throw err
        runner.start()
    })
