#!/usr/bin/env node

'use strict';

var childProcess = require('child_process'),
    appRoot = require('app-root-path').path;

// Get app bundle from CLI
var bundleId = process.argv.slice(2)[0];

// Run
childProcess.spawn('node', [appRoot, bundleId], {
    stdio: 'inherit'
});
