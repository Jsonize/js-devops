Scoped.require([
    "betajs:Promise"
], function (Promise) {

    module.exports = {

        usblist: function () {
            var promise = Promise.create();
            require("child_process").exec("ls /dev/ttyUSB*", function (error, stdout, stderr) {
                if (error) {
                    promise.asyncError({
                        result: "UnknownError",
                        error: error,
                        stdout: stdout,
                        stderr: stderr
                    });
                    return;
                }
                promise.asyncSuccess((stdout + stderr).trim().split(" ").filter(function (item) {
                    return item.length > 0;
                }));
            });
            return promise;
        }

    };

});

