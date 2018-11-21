Scoped = global.Scoped || require("betajs-scoped");
BetaJS = global.BetaJS || require('betajs');
Scoped.binding("betajs", "global:BetaJS");

module.exports = {};

BetaJS.Objs.extend(module.exports, require(__dirname + "/src/df.js"));
BetaJS.Objs.extend(module.exports, require(__dirname + "/src/iwlist.js"));
BetaJS.Objs.extend(module.exports, require(__dirname + "/src/screen.js"));
BetaJS.Objs.extend(module.exports, require(__dirname + "/src/usb.js"));
BetaJS.Objs.extend(module.exports, require(__dirname + "/src/ifconfig.js"));
BetaJS.Objs.extend(module.exports, require(__dirname + "/src/dockerps.js"));
BetaJS.Objs.extend(module.exports, require(__dirname + "/src/reboot.js"));
BetaJS.Objs.extend(module.exports, require(__dirname + "/src/wpasupplicant.js"));
BetaJS.Objs.extend(module.exports, require(__dirname + "/src/internet.js"));
