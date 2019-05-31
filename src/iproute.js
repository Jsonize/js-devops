Scoped.require([
    "betajs:Promise"
], function (Promise) {

    var parseIpRoute = function (input) {
        var lines = input.trim().split("\n");

        var result = {
            defaults: [],
            routes: []
        };

        while (lines.length > 0) {
            var current = lines.shift().trim().replace(/:/g,"").split(/\s/);
            var base = current.shift();
            var item = {};
            while (current.length > 0)
                item[current.shift()] = current.shift();
            if (base !== "default") {
                item.net = base;
                result.routes.push(item);
            } else
                result.defaults.push(item);
        }

        return result;
    };

    module.exports = {

        ip_routes: function () {
            var promise = Promise.create();
            require("child_process").exec("sudo ip route show", function (error, stdout, stderr) {
                if (error) {
                    promise.asyncError({
                        result: "UnknownError",
                        error: error,
                        stdout: stdout,
                        stderr: stderr
                    });
                    return;
                }
                promise.asyncSuccess(parseIpRoute(stdout));
            });
            return promise;
        }

    };

});
