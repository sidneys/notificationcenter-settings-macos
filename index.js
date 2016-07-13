'use strict';


/** Rebuild native modules against Electron's NodeJS
 */
require('require-rebuild')();


/**
 * @constant
 * @default
 */
const _QUERY = 'SELECT * FROM app_info',
    _FLAGS = {
        isHidden: 1 << 0,             // Show in Notification Center
        showBadge: 1 << 1,            // Show badge app icon
        playSound: 1 << 2,            // Play sound for notifications
        isBanner: 1 << 3,             // Show as banner
        isAlert: 1 << 4,              // Show as Alert
        hideInLockscreen: 1 << 12,    // Hide notifications on lock screen
        showPreview: 1 << 13,         // Show message preview
        hidePreview: 1 << 14          // Hide message preview
    };


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


let resultList,
    resultFlags = 0,
    resultObject = {},
    settingsObject = {},
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
        return callback(new Error('Missing app bundle id.'));
    } else {
        bundleid = bundleid.trim();
    }

    // use the fields to parse back the object
    db.query(_QUERY, { app_id: Number, bundleid: String, flags: String }, function(err, rows) {

        if (err) {
            return callback(err);
        }

        resultList = rows.filter(function(a) {
            return a['bundleid'] === bundleid;
        }, self);
        
        resultObject = resultList[0];
        
        if (resultObject === null || typeof resultObject !== 'object' || !(resultObject['flags'])) {
            return callback(new Error('No notification settings found for "' + bundleid + '".'));
        }

        resultFlags = resultObject['flags'];

        for (let prop in _FLAGS) {
            settingsObject[prop] = Boolean(resultFlags & _FLAGS[prop]);
        }

        // Callback
        callback(null, settingsObject);

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
