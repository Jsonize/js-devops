
Scoped.require([
    "betajs:Promise"
], function (Promise) {

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
                    var entry = line.match(/^\s+([^\s].*[^\s])\s\s+([^\s].*[^\s])\s+\/\s+([^\s].*[^\s])\s+\/\s+([^\s].*[^\s])\s+\/\s+([^\s].*[^\s])\s*$/);
                    if (!entry) {
                        lines.unshift(line);
                        break;
                    }
                    result[entry[1]] = {
                        rx: entry[2],
                        tx: entry[3],
                        total: entry[4],
                        estimated: entry[5]
                    };
                }
                output[base[1]] = result;
            }
        }

        return output;
    };

    module.exports = {

        ifconfig: function () {
            var promise = Promise.create();
            require("child_process").exec("sudo vnstat", function (error, stdout, stderr) {
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
            return promise;
        }

    };

});
