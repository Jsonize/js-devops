Scoped.require([
    "betajs:Promise"
], function (Promise) {

    var parseIfConfig = function (input) {
        var lines = input.trim().split("\n");
        var result = [];

        while (lines.length > 0) {
            var current = lines.shift().trim().replace(/:/g,"").split(/\s/);
            var item = {
                id: parseInt(current.shift(), 10),
                name: current.shift(),
                capabilities: current.shift().toLowerCase().replace(/[<>]/g,"").split(",")
            };
            while (current.length > 1) {
                var key = current.shift();
                value = current.shift().toLowerCase();
                if (!isNaN(parseInt(value, 10)))
                    value = parseInt(value, 10);
                item[key] = value;
            }
            item.online = item.state === "up";
            item.type = "other";
            if (item.name.indexOf("eno") === 0)
                item.type = "lan";
            if (item.name.indexOf("wl") === 0)
                item.type = "wifi";
            if (item.name.indexOf("enx") === 0)
                item.type = "broadband";
            while (lines.length > 0 && lines[0].trim().match(/^[^\d]/)) {
                var sub = lines.shift().trim().split(/\s/);
                if (sub[0].indexOf("link/") === 0) {
                    item.linktype = sub.shift().substring(5);
                    item.mac = sub.shift();
                    item.broadcast = sub[1];
                } else if (sub[0].indexOf("inet") === 0) {
                    var iptype = sub.shift() === "inet" ? "ip4" : "ip6";
                    item[iptype + "addr"] = sub[0].split("/")[0];
                    item[iptype + "mask"] = parseInt(sub.shift().split("/")[1], 10);
                    item[iptype + "scope"] = sub.slice(1).join(" ");
                    var more = lines.shift().trim().split(/\s/);
                    item[iptype + "validlft"] = more[1];
                    item[iptype + "preferredlft"] = more[3];
                }
            }
            result.push(item);
        }

        return result;
    };

    module.exports = {

        ifconfig: function () {
            var promise = Promise.create();
            require("child_process").exec("sudo ip a", function (error, stdout, stderr) {
                if (error) {
                    promise.asyncError({
                        result: "UnknownError",
                        error: error,
                        stdout: stdout,
                        stderr: stderr
                    });
                    return;
                }
                promise.asyncSuccess(parseIfConfig(stdout));
            });
            return promise;
        }

    };

});
