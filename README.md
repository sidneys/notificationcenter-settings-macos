# notificationcenter-settings-macos
[![Gitter](https://badges.gitter.im/sidneys/notificationcenter-settings-macos.svg)](https://gitter.im/sidneys/notificationcenter-settings?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge) [![issues](https://img.shields.io/github/issues/sidneys/notificationcenter-settings.svg)](https://github.com/sidneys/notificationcenter-settings-macos/issues)

---   

**Exposes a streamlined interface to the [Notification Center](https://en.wikipedia.org/wiki/Notification_Center) settings for OSX / macOS applications.**

--- 


## Contents

1. [Platforms](#platforms)
1. [Programmatic Usage](#programmatic-usage)
1. [Commandline Interface](#commandline-interface) 
1. [API](#api)
1. [Tests](#tests)
1. [Under the Hood](#under-the-hood)
1. [Author](#author)


## <a name="platforms"></a>Platforms

 - Tested on Yosemite, El-Capitan and Sierra (10.10 upward).

 
## <a name="programmatic-usage"></a>Programmatic Usage

Install the module:

```bash
$ npm install --save notificationcenter-settings
```

Require it and passing it a bundle id:

```js
var ncSettings = require('notificationcenter-settings')('com.apple.iTunes');
```

Result:

```js
console.dir(ncSettings);
```

```
{
    isHidden: false,
    showBadge: true,
    playSound: true,
    isBanner: true,
    isAlert: false,
    hideInLockscreen: false,
    showPreview: false,
    hidePreview: false
}
```


## <a name="commandline-interface"></a>Commandline Interface

Install the module globally:

```bash
npm install --global notificationcenter-settings
```

Run the provided **nc-settings** executable:

```bash
$ nc-settings com.apple.iTunes
```

Result:

```bash
Notification Center settings for "com.apple.iTunes":
{
    "isHidden": false,
    "showBadge": true,
    "playSound": true,
    "isBanner": true,
    "isAlert": false,
    "hideInLockscreen": false,
    "showPreview": false,
    "hidePreview": false
}
```


## <a name="api"></a>API


### Parameters
The module exposes itself as a function and takes a single *String* parameter.

- *bundleIdentifier* (String)  
**macOS application bundle identifier (e.g., 'com.apple.iTunes')**

See also ['Getting the bundle identifier of an OS X application in a shell script'](http://superuser.com/questions/346369/getting-the-bundle-identifier-of-an-os-x-application-in-a-shell-script)


### Result

The result has the following properties.

 - isHidden  **Show in Notification center**
 - showBadge  **Show badge app icon**
 - playSound  **Play sound for notifications**
 - isBanner  **Show as banner**
 - isAlert  **Show as alert**
 - hideInLockscreen  **Hide notifications on lock screen**
 - showPreview  **Show message preview**
 - hidePreview  **Hide message preview**


## <a name="tests"></a>Tests

```bash
npm run test
```
    
## <a name="under-the-hood"></a>Under the hood

The module parses the default Sqlite3 .db database for **com.apple.notificationcenter**.
The contained bit flags for each application identifier contain its current settings.


## <a name="author"></a>Author

 [Sidney Bofah](http://sidneys.github.io)
 
 Thanks goes to the [NCUtil](https://github.com/jacobsalmela/NCutil) project for laying out the baseline implementation in Python.

## Badge

[![badge](https://nodei.co/npm/notificationcenter-settings.png?downloads=true)](https://www.npmjs.com/package/notificationcenter-settings)
