var _ = require('lodash')
var BPromise = require('bluebird')
var client = require('../lib/client')
var Runner = require('../lib/runner')

describe('Runner.create()', function () {

    it('should create a runner', function () {
        var runner = Runner.create({
            maxAgeValue: 1,
            maxAgeUnit: 'seconds',
            ignoreHashtag: 'pin',
        })
        runner.maxAgeValue.should.equal(1)
        runner.maxAgeUnit.should.equal('seconds')
        runner.ignoreHashtag.should.equal('pin')
    })

})

describe('runner.start()', function () {

    var userId

    this.timeout(60e3)

    before(function (done) {
        teardown().then(function (_userId) {
            userId = _userId
            return done(null)
        }, done)
    })

    after(function (done) {
        teardown().finally(done)
    })

    it('should run', function (done) {
        var delay = 5e3
        var statuses = []
        var ignoreHashtag = 'pin'
        var runner = Runner.create({
            ignoreHashtag: ignoreHashtag,
            maxAgeUnit: 'seconds',
            maxAgeValue: 20,
        })
        client
            .create({ status: new Date().getTime().toString() })
            .then(function (status) {
                statuses.push(status)
            })
            .delay(delay)
            .then(function () {
                return client.create({ status: ['#', ignoreHashtag].join('') })
            })
            .then(function (status) {
                statuses.push(status)
            })
            .delay(delay)
            .then(function () {
                return client.create({ status: new Date().getTime().toString() })
            })
            .then(function (status) {
                statuses.push(status)
            })
            .delay(delay)
            .then(runner.start.bind(runner))
            .then(function () {
                return client.get({ user_id: userId })
            })
            .then(function (_statuses) {
                _.chain(statuses).pluck('id_str').sort().rest(0).value()
                    .should.eql(_.chain(_statuses).pluck('id_str').sort().value())
            })
            .delay(delay)
            .then(function () {
                return client.get({ user_id: userId })
            })
            .then(function (_statuses) {
                _.chain(statuses).pluck('id_str').sort().rest(1).value()
                    .should.eql(_.chain(_statuses).pluck('id_str').sort().value())
            })
            .delay(delay)
            .then(function () {
                return client.get({
                    user_id: userId,
                })
            })
            .then(function (_statuses) {
                _.chain(statuses).pluck('id_str').sort().rest(1).value()
                    .should.eql(_.chain(_statuses).pluck('id_str').sort().value())
            })
            .delay(delay)
            .then(function () {
                return client.get({ user_id: userId })
            })
            .then(function (_statuses) {
                _.chain(statuses).pluck('id_str').sort().rest(1).first().value()
                    .should.eql(_.chain(_statuses).pluck('id_str').sort().first().value())
            })
            .then(function () {
                return done(null)
            }, done)
    })

})

function teardown() {
    var userId
    return client
        .verify()
        .then(function (data) {
            userId = data.id_str
        })
        .then(function () {
            var options = {
                count: 200,
                user_id: userId,
            }
            return client.get(options)
        })
        .then(function (statuses) {
            var tasks = _.map(statuses, function (status) {
                return client.remove(status.id_str)
            })
            return BPromise.all(tasks)
        })
        .then(function () {
            return userId
        })
}
