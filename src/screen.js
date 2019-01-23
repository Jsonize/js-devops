Scoped.require([
    "betajs:Promise"
], function (Promise) {

    var parseScreenOutput = function (input) {
        var lines = input.split("\n");
        var result = [];

        while (lines.length > 0) {
            while (lines.length > 0 && lines[0].indexOf("Screen ") === 0)
                lines.shift();

            if (lines.length > 0) {
                var base = lines.shift().trim().split(/[\(\)]/);
                var it = base.shift().trim().split(/\s+/);
                var port = it.shift();
                var connected = it.shift() === "connected";
                var primary = it[0] === "primary" ? !!it.shift() : false;
                var resolution = it[0] && it[0].match(/\s*\d+x\d+/) ? it.shift().split("+")[0] : undefined;
                var rotation = it.shift();
                var capabilities = base.shift();
                var size = base.shift();
                var item = {
                    port: port,
                    connected: connected,
                    primary: primary,
                    resolution: resolution,
                    width: resolution ? parseInt(resolution.split("x")[0], 10) : undefined,
                    height: resolution ? parseInt(resolution.split("x")[1], 10) : undefined,
                    rotation: rotation,
                    capabilities: capabilities,
                    size: size ? size.trim() : undefined
                };
                while (lines.length > 0 && lines[0].match(/\s*\d+x\d+/)) {
                    item.resolutions = item.resolutions || [];
                    var res = lines.shift().trim().split(/\s+/);
                    item.resolutions.push({
                        resolution: res[0],
                        width: parseInt(res[0].split("x")[0], 10),
                        height: parseInt(res[0].split("x")[1], 10),
                        hertz: parseFloat(res[1])
                    });
                }
                result.push(item);
            }
        }
        return result;
    };

    var parseScreenInput = function (input) {
        return input.trim().split("\n").map(function (line) {
            line = line.split("\t");
            return {
                name: line.shift().replace(/[^\w]+/, "").trim(),
                id: parseInt(line.shift().substring(3), 10),
                type: line.shift().replace("[","").replace("]","")
            };
        });
    };

    module.exports = {

        screen_output_detection: function (display, user) {
            display = display || 0;
            user = user || 'kiosk';
            var promise = Promise.create();
            require("child_process").exec("sudo -u " + user + " xrandr -display :" + display, function (error, stdout, stderr) {
                if (error) {
                    promise.asyncError({
                        result: "UnknownError",
                        error: error,
                        stdout: stdout,
                        stderr: stderr
                    });
                    return;
                }
                promise.asyncSuccess(parseScreenOutput(stdout));
            });
            return promise;
        },

        screen_input_detection: function (display, user) {
            display = display || 0;
            user = user || 'kiosk';
            var promise = Promise.create();
            require("child_process").exec("sudo -u " + user + " sh -c 'export DISPLAY=:" + display + " ; xinput'", function (error, stdout, stderr) {
                if (error) {
                    promise.asyncError({
                        result: "UnknownError",
                        error: error,
                        stdout: stdout,
                        stderr: stderr
                    });
                    return;
                }
                promise.asyncSuccess(parseScreenInput(stdout));
            });
            return promise;
        }

    };

});
