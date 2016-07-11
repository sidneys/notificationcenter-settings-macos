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

Install it

```bash
$ npm install --save notificationcenter-settings
```

Require it

```js
var ncSettings = require('notificationcenter-settings');
```

Use the **get()** callback to parse settings:

```js
ncSettings.get('com.apple.iTunes', function(err, result) {
	if (err) return err;
	console.dir(result);
};
```
Result:

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

### `get(bundleId, callback)`

Get current Notification Center settings for app using bundleId.

 - **String *bundleId* - Bundle identifier for the callback function**
 - **Function *callback* - The function to call to start Notification Center parsing**

**Returns:**  
 - *Object* with the following properties:

 - isHidden  **Show in Notification center**
 - showBadge  **Show badge app icon**
 - playSound  **Play sound for notifications**
 - isBanner  **Show as banner**
 - isAlert  **Show as alert**
 - hideInLockscreen  **Hide notifications on lock screen**
 - showPreview  **Show message preview**
 - hidePreview  **Hide message preview**
 

### `path()`

Get absolute path to Notification Center database file.  

*See also ['Getting the bundle identifier of an OS X application in a shell script'](http://superuser.com/questions/346369/getting-the-bundle-identifier-of-an-os-x-application-in-a-shell-script)*

**Returns:**  
* *String* containing the absolute path to the database file

## <a name="tests"></a>Tests

```bash
npm test
```
    
## <a name="under-the-hood"></a>Under the hood

The module parses the default Sqlite3 .db database for **com.apple.notificationcenter**.
The contained bit flags for each application identifier contain its current settings.


## <a name="author"></a>Author

 [Sidney Bofah](http://sidneys.github.io)
 
 Thanks goes to the [NCUtil](https://github.com/jacobsalmela/NCutil) project for laying out the baseline implementation in Python.

## Badge

[![badge](https://nodei.co/npm/notificationcenter-settings.png?downloads=true)](https://www.npmjs.com/package/notificationcenter-settings)
