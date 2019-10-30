var jsdevops = require(__dirname + "/../index.js");

jsdevops.iwconfig().success(function (result) {
    console.log(result);
});