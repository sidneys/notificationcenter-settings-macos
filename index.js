'use strict';


/**
 * Modules (Node)
 */
var fs = require('fs');
var path = require('path');
var childProcess = require('child_process');


/**
 * Modules (External)
 */
var sqlite = require('sqlite-sync');



/**
 * Flags (Bits in a 16bit data structure)
 */
var notificationFlags = {
    isHidden: 1 << 0,             // Show in Notification Center
    showBadge: 1 << 1,            // Show badge app icon
    playSound: 1 << 2,            // Play sound for notifications
    isBanner: 1 << 3,             // Show as banner
    isAlert: 1 << 4,              // Show as Alert
    hideInLockscreen: 1 << 12,    // Hide notifications on lock screen
    showPreview: 1 << 13,         // Show message preview
    hidePreview: 1 << 14          // Hide message preview
};

/** Get NotificationCenter database file
 */
var pathName = childProcess.spawnSync('/usr/bin/getconf', ['DARWIN_USER_DIR'], { encoding: 'utf8' }).stdout.replace(/(\r\n|\n|\r)/gm, ''),
    fileName = path.join('com.apple.notificationcenter', 'db', 'db');

// Check
if (!fs.existsSync(pathName + fileName)) {
    return console.error('Error: com.apple.notificationcenter database not found at: ' + pathName + fileName);
}


/**
 * Init SQLite DB
 */
sqlite.connect(pathName + fileName);


/** Returns a settings object for passed OSX app bundle ids.
 *
 * @param {String} bundleId - OSX Application identifier
 * @returns {Object|Boolean}
 */
var getResults = function(bundleId) {
    if (!bundleId) {
        console.error('Error: Missing Bundle identifier');
        return false;
    }

    var resultList = sqlite.run('SELECT flags from app_info where bundleid="' + bundleId + '"', null, null);
    var resultFlags = resultList[0].flags;
    var resultObject = {};

    if (resultList.length === 0) {
        return console.log('Empty result');
    }

    for (var prop in notificationFlags) {
        resultObject[prop] = Boolean(resultFlags & notificationFlags[prop]);
    }

    return resultObject;
};


/**
 * Initialize main process if called from CLI
 */
if (require.main === module) {
    var bundleId = process.argv.slice(2)[0];
    var result = getResults(bundleId);

    console.log('Notification Center settings for "' + bundleId + '":');
    console.log(JSON.stringify(result, null, 4));
}


/**
 * exports
 */
module.exports = exports = getResults;
