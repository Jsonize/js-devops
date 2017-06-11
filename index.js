Scoped = global.Scoped || require("betajs-scoped");
BetaJS = global.BetaJS || require('betajs');
Scoped.binding("betajs", "global:BetaJS");


module.exports = {
		
	df: require(__dirname + "/src/df.js").df,

	iwlist: require(__dirname + "/src/iwlist.js").iwlist,

	usblist: require(__dirname + "/src/usb.js").usblist,

    ifconfig: require(__dirname + "/src/ifconfig.js").ifconfig,

    dockerps: require(__dirname + "/src/dockerps.js").dockerps,

    reboot: require(__dirname + "/src/reboot.js").reboot
		
};