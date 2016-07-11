'use strict';



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

/** Get NotificationCenter database file
 */
let pathName = childProcess.spawnSync('/usr/bin/getconf', ['DARWIN_USER_DIR'], { encoding: 'utf8' }).stdout.replace(/(\r\n|\n|\r)/gm, ''),
    fileName = path.join('com.apple.notificationcenter', 'db', 'db'),
    db;

// Check
if (!fs.existsSync(pathName + fileName)) {
    return console.error('Error: com.apple.notificationcenter database not found at: ' + pathName + fileName);
}


let killProcesses = function() {

    fkill(['NotificationCenter', 'usernoted'], { force: true }).then((result) => {
        console.log('Killed process', result);
    }).catch(function(e) {
        console.log(e); // "oh, no!"
    });
};


/** Returns a settings object for passed OSX app bundle ids.
 *
 * @param {String} bundleid - OSX Application identifier
 * @param {String} cb - Callback
 */
let getResults = function(bundleid, cb) {

    db = dblite(pathName + fileName);

    let callback = cb || function() {};

    if (!bundleid) {
        console.error('Error: Missing Bundle identifier');
        return false;
    } else {
        bundleid = bundleid.trim();
    }

    let resultObject = {},
        resultFlags = 0;

    // use the fields to parse back the object
    db.query(_QUERY, { app_id: Number, bundleid: String, flags: String }, function(err, rows) {

        if (err) {
            console.error('Error', err);
            return false;
        }

        resultFlags = (rows.filter(function(a) { return a.bundleid === bundleid; })[0]).flags || resultFlags;

        for (let prop in notificationFlags) {
            resultObject[prop] = Boolean(resultFlags & notificationFlags[prop]);
        }

        // Close DB
        db.close();

        // Restart Notification Center processes
        killProcesses();

        // Callback
        callback(resultObject);

        // Return
        return resultObject;
    });
};


/**
 * Initialize main process if called from CLI
 */
if (require.main === module) {
    let bundleId = process.argv.slice(2)[0];

    getResults(bundleId, function(result) {
        console.log('Notification Center settings for "' + bundleId + '":');
        console.log(JSON.stringify(result, null, 4));
    });
}


/**
 * exports
 */
module.exports = exports = getResults;
