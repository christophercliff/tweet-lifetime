var _ = require('lodash')
var assert = require('assert')
var BPromise = require('bluebird')
var util = require('util')

module.exports = limit

function limit(fn, options) {
    assert(_.isNumber(options.to) && options.to > 0)
    assert(_.isNumber(options.per) && options.per > 0)
    var queue = Queue.create({
        limit: options.to,
        period: options.per,
    })
    return function () {
        var context = this
        var args = arguments
        return new BPromise(function (resolve) {
            queue.push(resolve)
        }).then(function () {
            return fn.apply(context, args)
        })
    }
}

function Queue(options) {
    Array.call(this)
    this.limit = options.limit
    this.period = options.period
    this.periodStartTime = new Date().getTime()
    this.count = 0
    this.isWaiting = false
}

util.inherits(Queue, Array)

_.extend(Queue.prototype, {

    process: function () {
        if (this.isWaiting) return
        var now = getNow()
        var elapsed = now - this.periodStartTime
        var hasPeriodExpired = (elapsed >= this.period)
        if (hasPeriodExpired) {
            this.count = 0
            this.periodStartTime = now
        }
        var take = this.splice(0, (this.limit - this.count))
        this.count += take.length
        take.forEach(function (resolve) { resolve() })
        var hasReachedLimit = (this.count >= this.limit)
        if (hasReachedLimit) return this.wait(this.period - elapsed)
    },

    push: function (resolve) {
        Array.prototype.push.call(this, resolve)
        this.process()
    },

    wait: function (delay) {
        this.isWaiting = true
        setTimeout(function () {
            this.isWaiting = false
            this.process()
        }.bind(this), delay)
    },

})

_.extend(Queue, {

    create: function (options) {
        return new Queue(options)
    },

})

function getNow() {
    return new Date().getTime()
}
