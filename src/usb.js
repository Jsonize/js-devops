Scoped.require([
    "betajs:Promise"
], function (Promise) {

    var lsLister = function (target) {
        var promise = Promise.create();
        require("child_process").exec("ls " + target, function (error, stdout, stderr) {
            if (error) {
                promise.asyncError({
                    result: "UnknownError",
                    error: error,
                    stdout: stdout,
                    stderr: stderr
                });
                return;
            }
            promise.asyncSuccess((stdout + stderr).trim().split("\n").filter(function (item) {
                return item.length > 0;
            }));
        });
        return promise;
    };

    var parseLSUSB = function (input) {
        return input.trim().split("\n").map(function (line) {
            line = line.trim().split(/\s/);
            return {
                bus: parseInt(line[1], 10),
                device: parseInt(line[3], 10),
                id: line[5],
                name: line.slice(6).join(" ")
            };
        });
    };

    module.exports = {

        usblist: function () {
            return lsLister("/dev/ttyUSB*");
        },

        acmlist: function () {
            return lsLister("/dev/ttyACM*");
        },

        ttylist: function () {
            return lsLister("/dev/tty*");
        },

        devlist: function () {
            return lsLister("/dev");
        },

        lsusb: function () {
            var promise = Promise.create();
            require("child_process").exec("sudo lsusb", function (error, stdout, stderr) {
                if (error) {
                    promise.asyncError({
                        result: "UnknownError",
                        error: error,
                        stdout: stdout,
                        stderr: stderr
                    });
                    return;
                }
                promise.asyncSuccess(parseLSUSB(stdout));
            });
            return promise;
        }

    };

});