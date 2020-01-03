var jsdevops = require(__dirname + "/../index.js");

jsdevops.internetip().success(function (result) {
    console.log(result);
});