var BPromise = require('bluebird')
var config = require('./config')
var Hapi = require('hapi')
var log = require('./log')
var Runner = require('./runner')
var url = require('url')
var Wreck = require('wreck')

process.on('uncaughtException', stop)
BPromise.onPossiblyUnhandledRejection(stop)

var PATH = '/'
var URL = config.appName ? url.format({
    protocol: 'https',
    host: [
        config.appName,
        'herokuapp.com',
    ].join('.'),
    pathname: PATH,
}) : undefined

var runner = Runner.create({
    maxAgeUnit: config.maxAgeUnit,
    maxAgeValue: config.maxAgeValue,
    ignoreHashtag: config.ignoreHashtag,
})
var server = new Hapi.Server()

server.connection({
    port: config.port,
})
server.route({
    path: PATH,
    method: 'GET',
    config: {
        handler: function (request, reply) {
            return reply({
                uptime: process.uptime(),
            })
        },
    },
})
server.start(function (err) {
    if (err) return stop(err)
    dontSleep()
})
runner.start()

function stop(err) {
    return log(err).then(function () {
        server.stop(function () {
            process.exit(1)
        })
    })
}

function dontSleep() {
    if (!URL) return
    Wreck.get(URL, function (err) {
        if (err) return stop(err)
        setTimeout(dontSleep, 60e3)
    })
}
