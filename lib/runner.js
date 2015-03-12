var _ = require('lodash')
var assert = require('assert')
var BPromise = require('bluebird')
var client = require('./client')
var isInteger = require('is-integer')
var moment = require('moment')
var sentry = require('./sentry')

var UNITS = [
    'years',
    'months',
    'weeks',
    'days',
    'hours',
    'minutes',
    'seconds',
]

module.exports = Self

function Self(options) {
    assert(_.isString(options.ignoreHashtag) && options.ignoreHashtag.length > 0)
    assert(_.contains(UNITS, options.maxAgeUnit))
    assert(isInteger(options.maxAgeValue) && options.maxAgeValue > 0)
    this.ignoreHashtag = options.ignoreHashtag
    this.maxAgeUnit = options.maxAgeUnit
    this.maxAgeValue = options.maxAgeValue
}

_.extend(Self.prototype, {

    getNextBatch: function () {
        var options = {
            count: client.MAX_COUNT,
            user_id: this._userId,
        }
        if (this._maxId) options.max_id = this._maxId
        return client.get(options)
            .bind(this)
            .then(function (statuses) {
                var last = _.last(statuses)
                var isLastBatch = (!last
                    || statuses.length < client.MAX_COUNT
                    || last.id === this._maxId)
                this._maxId = isLastBatch ? undefined : last.id
                return statuses
            })
    },

    hasElapsed: function (status) {
        var now = moment.utc()
        var createdAt = moment.utc(status.created_at, client.DATE_FORMAT)
        if (!createdAt.isValid()) throw new Error('`created_at` date could not be parsed')
        var diff = now.diff(createdAt, this.maxAgeUnit)
        return diff >= this.maxAgeValue
    },

    hasPinTag: function (status) {
        if (!_.isString(this.ignoreHashtag)) return false
        return _.findWhere(status.entities.hashtags, { text: this.ignoreHashtag })
    },

    next: function () {
        return this.getNextBatch()
            .then(this.processBatch)
            .bind(this)
    },

    processBatch: function (statuses) {
        var removables = _.chain(statuses)
            .filter(function (status) {
                return this.hasElapsed(status) && !this.hasPinTag(status)
            }, this)
            .map(function (status) {
                if (sentry) sentry.sendMessage('Removed status', status)
                return client.remove(status.id_str)
            })
            .value()
        return BPromise.all(removables)
    },

    start: function () {
        return this.verify().then(forever(this.next.bind(this)))
    },

    verify: function () {
        return client.verify()
            .bind(this)
            .then(function (data) {
                this._userId = data.id_str
            })
    },

})

_.extend(Self, {

    create: function (options) {
        return new Self(options)
    },

})

function forever(fn) {
    function _fn() {
        return fn().then(_fn)
    }
    return _fn()
}
