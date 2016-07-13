'use strict';


/** Rebuild native modules against Electron's NodeJS
 */
require('require-rebuild')();


/**
 * @constant
 * @default
 */
const _QUERY = 'SELECT * FROM app_info';


/**
 * Modules (Node)
 */
let fs = require('fs');
let path = require('path');
let childProcess = require('child_process');


/**
 * Modules (External)
 */
let dblite = require('dblite');
let fkill = require('fkill');

/**
 * Flags (Bits in a 16bit data structure)
 */
let notificationFlags = {
    isHidden: 1 << 0,             // Show in Notification Center
    showBadge: 1 << 1,            // Show badge app icon
    playSound: 1 << 2,            // Play sound for notifications
    isBanner: 1 << 3,             // Show as banner
    isAlert: 1 << 4,              // Show as Alert
    hideInLockscreen: 1 << 12,    // Hide notifications on lock screen
    showPreview: 1 << 13,         // Show message preview
    hidePreview: 1 << 14          // Hide message preview
};


let resultFiltered,
    resultObject = {},
    resultFlags = 0,
    db;


/** Get NotificationCenter sqlite database file
 */
let getPath = function() {
    let pathName = childProcess.spawnSync('/usr/bin/getconf', ['DARWIN_USER_DIR'], { encoding: 'utf8' }).stdout.replace(/(\r\n|\n|\r)/gm, ''),
        fileName = path.join('com.apple.notificationcenter', 'db', 'db');

    return pathName + fileName;
};


// Check
if (!fs.existsSync(getPath())) {
    return console.error('Error: com.apple.notificationcenter database not found at: ' + getPath());
}


let killProcesses = function() {

    fkill(['NotificationCenter', 'usernoted'], { force: true }).then((result) => {
        console.log('Killed process', result);
    }).catch(function(e) {
        console.log(e); // "oh, no!"
    });
};


/** Returns with a callback holding the global settings object for passed OSX app bundle ids.
 *
 * @param {String} bundleid - OSX Application identifier
 * @param {Function} cb - Callback
 */
let getSettings = function(bundleid, cb) {

    let self = this;

    db = dblite(getPath());

    let callback = cb || function() {};

    if (!bundleid) {
        //console.error('Error: Missing Bundle identifier');
        return callback(new Error('Error: Missing Bundle identifier'));
    } else {
        bundleid = bundleid.trim();
    }

    // use the fields to parse back the object
    db.query(_QUERY, { app_id: Number, bundleid: String, flags: String }, function(err, rows) {

        if (err) {
            console.error('Error', err);
            return callback(err);
        }

        resultFiltered = rows.filter(function(a) { return a.bundleid === bundleid; }, self)[0];
        resultFlags = resultFiltered.flags || resultFlags;

        for (let prop in notificationFlags) {
            resultObject[prop] = Boolean(resultFlags & notificationFlags[prop]);
        }

        //console.log('resultFlags', resultFlags, 'resultFiltered', resultFiltered);
        //console.dir(resultObject)

        // Callback OK
        callback(null, resultObject);

        // Close DB
        db.close();

        // Restart Notification Center processes
        killProcesses();
    });
};


/**
 * Initialize main process if called from CLI
 */
if (require.main === module) {
    let bundleId = process.argv.slice(2)[0];

    getSettings(bundleId, function(err, result) {
        if (err) {
            return err;
        }
        console.log('Notification Center settings for "' + bundleId + '":');
        console.log(JSON.stringify(result, null, 4));
    });
}


/**
 * exports
 */
module.exports = exports = {
    get: getSettings,
    path: getPath
};
