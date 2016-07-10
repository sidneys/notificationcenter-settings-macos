'use strict';


var expect = require('chai').expect,
    appRoot = require('app-root-path').path;

var ncSettings = require(appRoot);


describe('Valid Bundle Identifier ("com.apple.iTunes")', function() {
    var settings = ncSettings('com.apple.iTunes');

    it('should return an object', function() {
        expect(settings).to.be.an('object');
    });

    it('isHidden should return an boolean', function() {
        expect(settings).to.have.property('isHidden').that.is.an('boolean');
    });

    it('showBadge should return an boolean', function() {
        expect(settings).to.have.property('showBadge').that.is.an('boolean');
    });

    it('playSound should return an boolean', function() {
        expect(settings).to.have.property('playSound').that.is.an('boolean');
    });

    it('isBanner should return an boolean', function() {
        expect(settings).to.have.property('isBanner').that.is.an('boolean');
    });

    it('isAlert should return an boolean', function() {
        expect(settings).to.have.property('isAlert').that.is.an('boolean');
    });

    it('hideInLockscreen should return an boolean', function() {
        expect(settings).to.have.property('hideInLockscreen').that.is.an('boolean');
    });

    it('showPreview should return an boolean', function() {
        expect(settings).to.have.property('showPreview').that.is.an('boolean');
    });

    it('hidePreview should return an boolean', function() {
        expect(settings).to.have.property('hidePreview').that.is.an('boolean');
    });
});


describe('Invalid Bundle Identifier ("")', function() {
    var settings = ncSettings('');

    it('should return a boolean', function() {
        expect(settings).to.be.a('boolean');
    });

    it('should return false', function() {
        expect(settings).to.equal(false);
    });
});
