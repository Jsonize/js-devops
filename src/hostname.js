Scoped.require([
    "betajs:Promise"
], function (Promise) {

    module.exports = {

        hostname: function () {
            var promise = Promise.create();
            require("child_process").exec("hostname", function (error, stdout, stderr) {
                if (error) {
                    promise.asyncError({
                        result: "UnknownError",
                        error: error,
                        stdout: stdout,
                        stderr: stderr
                    });
                    return;
                }
                promise.asyncSuccess(stdout.trim());
            });
            return promise;
        }

    };

});
