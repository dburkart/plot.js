var should = require('should');
var Graphy = require('../lib/main');

describe('graphy', function() {
    describe('with no arguments', function() {
        it('returns an object', function() {
            var result = new Graphy();
            result.should.eql({});
        });
    });
});
