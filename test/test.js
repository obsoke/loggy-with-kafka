var should = require('should');

describe('addition', function() {
    it('should add 1 and 1 correctly', function(done) {
        var onePlusOne = 1 + 1;
        onePlusOne.should.equal(2);
        done();
    });
});
