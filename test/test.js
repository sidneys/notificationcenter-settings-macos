'use strict';


var chai = require('chai'),
    expect = chai.expect,
    appRoot = require('app-root-path').path,
    ncSettings = require(appRoot);


/**
 * Flags (Bits in a 16bit data structure)
 */
let defaultSettings = {
    isHidden: false,
    showBadge: true,
    playSound: true,
    isBanner: true,
    isAlert: false,
    hideInLockscreen: false,
    showPreview: true,
    hidePreview: false
};

describe('ncSettings.get("com.apple.iTunes")', function() {
    it('validate settings object', function(done) {
        ncSettings.get('com.apple.iTunes', function(err, settings) {
            expect(settings).to.have.all.keys(defaultSettings);
            done();
        });
    });
});

describe('ncSettings.get("")', function() {
    it('respond with error', function(done) {
        ncSettings.get('', function(err, settings) {
            expect(err).to.be.an('error');
            done();
        });
    });
});

describe('ncSettings.path()', function() {
    it('respond with path', function() {
        expect(ncSettings.path()).to.be.an('string');
    });
});
