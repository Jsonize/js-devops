Scoped.require([
    "betajs:Promise"
], function (Promise) {

    var parseIwConfig = function (input) {
        var lines = input.trim().split("\n");
        var tokens = [];
        lines.forEach(function (line) {
            tokens = tokens.concat(line.split("  ").map(function (s) {
                return s.trim();
            }).filter(function (s) {
                return s.length > 0;
            }));
        });
        var result = {};
        tokens.forEach(function (token) {
            var splt = token.split(/[:=]/g);
            if (splt.length !== 2) {
                if (token.indexOf("wlp") === 0)
                    result.interface = token;
                else if (token.indexOf("IEEE") === 0)
                    result.protocol = token;
            } else
                result[splt[0]] = splt[1].replace(/"/g, "");
        });
        return result;
    };

    module.exports = {

        iwconfig: function (intf) {
            var promise = Promise.create();
            require("child_process").exec("sudo iwconfig" + (intf ? " " + intf : ""), function (error, stdout, stderr) {
                if (error) {
                    promise.asyncError({
                        result: "UnknownError",
                        error: error,
                        stdout: stdout,
                        stderr: stderr
                    });
                    return;
                }
                promise.asyncSuccess(parseIwConfig(stdout));
            });
            return promise;
        }

    };

});
