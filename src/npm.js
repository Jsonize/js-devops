Scoped.require([
    "betajs:Promise"
], function (Promise) {

    var cmd = function (cmd) {
        var promise = Promise.create();
        require("child_process").exec(cmd, function (error, stdout, stderr) {
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
                stdout: stdout,
                stderr: stderr
            });
        });
        return promise;
    };

    module.exports = {

        npm_install: function (repo) {
            return cmd("cd " + repo + " ; npm i");
        },

        npm_update: function (repo) {
            return cmd("cd " + repo + " ; npm u");
        },

        npm_read_package: function (repo) {
            return Promise.value(JSON.parse(require('fs').readFileSync(repo + "/package.json")));
        }

    };

});
