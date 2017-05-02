var jsdevops = require(__dirname + "/../index.js");

jsdevops.iwlist("wlan0").success(function (result) {
    console.log(result);
});