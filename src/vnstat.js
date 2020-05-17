
Scoped.require([
    "betajs:Promise"
], function (Promise) {

    var parseMetric = function (metric) {
        var metrics = {
            "B": 0.001 * 0.001,
            "KiB": 0.001,
            "MiB": 1,
            "GiB": 1000,
            "TiB": 1000 * 1000
        };
        return metrics[metric] || 0;
    };

    var parseTraffic = function (traffic) {
        traffic = (traffic || "").match(/^([^\s]+)\s([^\s]+)/);
        return traffic ? parseFloat(traffic[1]) * parseMetric(traffic[2]) : null;
    };

    var parseVnstat = function (input) {
        var lines = input.trim().split("\n");
        var output = {};

        while (lines.length > 1) {
            var line = lines.shift();
            var base = line.match(/^\s(\w+):$/);
            if (base) {
                var result = {};
                while (lines.length > 0) {
                    line = lines.shift();
                    var entry = line.match(/^\s+([^\s].*[^\s])\s\s+([^\s].*[^\s])\s+\/\s+([^\s].*[^\s])\s+\/\s+([^\s].*[^\s])\s+\/\s+([^\s].*[^\s])\s*$/) || line.match(/^\s+([^\s].*[^\s])\s\s+([^\s].*[^\s])\s+\/\s+([^\s].*[^\s])\s+\/\s+([^\s].*[^\s])\s*$/);
                    if (!entry) {
                        lines.unshift(line);
                        break;
                    }
                    result[entry[1]] = {
                        rx: parseTraffic(entry[2]),
                        tx: parseTraffic(entry[3]),
                        total: parseTraffic(entry[4]),
                        estimated: parseTraffic(entry[5])
                    };
                }
                output[base[1]] = result;
            }
        }

        return output;
    };

    module.exports = {

        vnstat: function () {
            var promise = Promise.create();
            var CP = require("child_process");
            CP.exec("sudo vnstat -s", function (error, stdout, stderr) {
                if (error || (stdout + "").indexOf("Error") >= 0) {
                    CP.exec("sudo vnstat", function (error, stdout, stderr) {
                        if (error) {
                            promise.asyncError({
                                result: "UnknownError",
                                error: error,
                                stdout: stdout,
                                stderr: stderr
                            });
                            return;
                        }
                        promise.asyncSuccess(parseVnstat(stdout));
                    });
                    return;
                }
                promise.asyncSuccess(parseVnstat(stdout));
            });
            return promise;
        }

    };

});
