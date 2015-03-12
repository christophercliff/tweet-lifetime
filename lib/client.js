var Boom = require('boom')
var BPromise = require('bluebird')
var config = require('./config')
var limit = require('./limit')
var Twitter = require('twitter')
var util = require('util')

var PERIOD = 15 * 60 * 1000 // 15 min

var client = new Twitter({
    consumer_key: config.twitterConsumerKey,
    consumer_secret: config.twitterConsumerSecret,
    access_token_key: config.twitterAccessTokenKey,
    access_token_secret: config.twitterAccessTokenSecret,
})

exports.DATE_FORMAT = 'ddd MMM DD HH:mm:ss Z YYYY'
exports.MAX_COUNT = 200

exports._create = _create
exports._get = _get
exports._remove = _remove
exports._verify = _verify
exports.create = limit(_create, { to: 15, per: PERIOD })
exports.get = limit(_get, { to: 90, per: PERIOD })
exports.remove = limit(_remove, { to: 15, per: PERIOD })
exports.verify = limit(_verify, { to: 15, per: PERIOD })

function _create(options) {
    return new BPromise(function (resolve, reject) {
        client.post('statuses/update', options, function (err, data) {
            if (err) return reject(Boom.badRequest(JSON.stringify(err)))
            return resolve(data)
        })
    })
}

function _get(options) {
    return new BPromise(function (resolve, reject) {
        client.get('statuses/user_timeline', options, function (err, data) {
            if (err) return reject(Boom.badRequest(JSON.stringify(err)))
            return resolve(data)
        })
    })
}

function _remove(id) {
    return new BPromise(function (resolve, reject) {
        var url = util.format('statuses/destroy/%s', id)
        client.post(url, function (err, data) {
            if (err) return reject(Boom.badRequest(JSON.stringify(err)))
            return resolve(data)
        })
    })
}

function _verify() {
    return new BPromise(function (resolve, reject) {
        client.get('account/verify_credentials', function (err, data) {
            if (err) return reject(Boom.badRequest(JSON.stringify(err)))
            return resolve(data)
        })
    })
}
