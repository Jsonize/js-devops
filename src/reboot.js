Scoped.require([
    "betajs:Promise"
], function (Promise) {

    module.exports = {

        reboot: function () {
            var promise = Promise.create();
            require("child_process").exec("sudo reboot", function (error, stdout, stderr) {
                if (error) {
                    promise.asyncError({
                        result: "UnknownError",
                        error: error,
                        stdout: stdout,
                        stderr: stderr
                    });
                    return;
                }
                promise.asyncSuccess({
                    log: (stdout + stderr).trim()
                });
            });
            return promise;
        }

    };

});

