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

        npm_install: function (repo, nosudo) {
            return cmd("cd " + repo + " ; " + (nosudo ? "" : "sudo") + " npm i --unsafe-perm");
        },

        npm_update: function (repo, nosudo) {
            return cmd("cd " + repo + " ; " + (nosudo ? "" : "sudo") + " npm update --unsafe-perm");
        },

        npm_read_package: function (repo) {
            return Promise.value(JSON.parse(require('fs').readFileSync(repo + "/package.json")));
        }

    };

});
