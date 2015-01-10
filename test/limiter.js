var _ = require('lodash')
var BPromise = require('bluebird')
var limit = require('../lib/limit')

var PADDING = 500
var PERIOD = 3e3

describe('limit()', function () {

    this.timeout(10e3)

    it('should limit inline calls', function (done) {

        var noop = getAsyncNoop(1e3)
        var limitedNoop = limit(noop, { to: 2, per: PERIOD })
        var resolvedCount = 0
        _.range(5).forEach(function () {
            limitedNoop().then(function () {
                resolvedCount++
            })
        })
        BPromise
            .delay(PERIOD - PADDING)
            .then(function () {
                resolvedCount.should.equal(2)
            })
            .delay(PERIOD)
            .then(function () {
                resolvedCount.should.equal(4)
            })
            .delay(PERIOD)
            .then(function () {
                resolvedCount.should.equal(5)
            })
            .then(done, done)
    })

    it('should limit series calls and resolve', function (done) {
        var noop = getAsyncNoop(1e3)
        var limitedNoop = limit(noop, { to: 2, per: PERIOD })
        var resolvedCount = 0
        BPromise.reduce(_.range(6), function () { // `reduce` is n + 1
            return limitedNoop().then(function () {
                resolvedCount++
            })
        })
        BPromise
            .delay(PERIOD - PADDING)
            .then(function () {
                resolvedCount.should.equal(2)
            })
            .delay(PERIOD)
            .then(function () {
                resolvedCount.should.equal(4)
            })
            .delay(PERIOD)
            .then(function () {
                resolvedCount.should.equal(5)
            })
            .then(done, done)
    })

    it('should limit parallel calls and resolve', function (done) {
        var noop = getAsyncNoop(1e3)
        var limitedNoop = limit(noop, { to: 2, per: PERIOD })
        var resolvedCount = 0
        BPromise.all(_.range(5).map(function () {
            return limitedNoop().then(function () {
                resolvedCount++
            })
        }))
        BPromise
            .delay(PERIOD - PADDING)
            .then(function () {
                resolvedCount.should.equal(2)
            })
            .delay(PERIOD)
            .then(function () {
                resolvedCount.should.equal(4)
            })
            .delay(PERIOD)
            .then(function () {
                resolvedCount.should.equal(5)
            })
            .then(done, done)
    })

})

function getAsyncNoop(delay) {
    return function () {
        return new BPromise(function (resolve) {
            setTimeout(function () {
                return resolve()
            }, delay)
        })
    }
}
