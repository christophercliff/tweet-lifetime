var config = require('./config')
var Hapi = require('hapi')
var Nudge = require('hapi-nudge')

var server = module.exports = new Hapi.Server()

server.connection({
    port: config.port,
})

if (config.appName) {
    server.register({
        register: Nudge,
        options: {
            protocol: 'https',
            host: [
                config.appName,
                'herokuapp.com',
            ].join('.'),
            pathname: '/uptime',
        },
    }, function (err) {
        if (err) throw err
    })
}
