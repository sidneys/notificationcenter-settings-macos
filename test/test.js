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

describe('ncSettings.get("")', function() {
    it('Responds with error for missing "bundle id" parameter', function(done) {
        ncSettings.get('', function(err, settings) {
            expect(err).to.be.an('error');
            done();
        });
    });
});

describe('ncSettings.get("com.apple.iTunes")', function() {
    it('Validates settings for installed app registered within Notification Center', function(done) {
        ncSettings.get('com.apple.iTunes', function(err, settings) {
            expect(settings).to.have.all.keys(defaultSettings);
            done();
        });
    });
});

describe('ncSettings.get("com.apple.Terminal")', function() {
    it('Responds with error for installed app not registered within Notification Center', function(done) {
        ncSettings.get('com.apple.Terminal', function(err, settings) {
            expect(err).to.be.an('error');
            done();
        });
    });
});

describe('ncSettings.path()', function() {
    it('Responds with absolute filepath to Notification Center database', function() {
        expect(ncSettings.path()).to.be.an('string');
    });
});
