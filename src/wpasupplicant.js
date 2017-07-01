Scoped.require([
    "betajs:Promise"
], function (Promise) {

    var parser = function (content) {
        var lines = [];
        var networks = [];
        var currentNetwork = null;
        content.split("\n").forEach(function (line) {
            if (/\s*network\s*=\s*{/.test(line))
                currentNetwork = {};
            else if (line.trim() === "}") {
                networks.push(currentNetwork);
                currentNetwork = null;
            } else if (currentNetwork) {
                var i = line.indexOf("=");
                if (i >= 0) {
                    key = line.substring(0, i).trim();
                    value = line.substring(i+1).trim();
                    currentNetwork[key] = JSON.parse(value);
                }
            } else if (line.trim())
                lines.push(line.trim());
        });
        return {
            lines: lines,
            networks: networks
        };
    };
    var formatter = function (parsed) {
        return parsed.lines.concat(parsed.networks.map(function (network) {
            var result = ["", "network={"];
            for (var key in network)
                result.push("  " + key + "=" + JSON.stringify(network[key]));
            result.push("}");
            return result.join("\n");
        })).join("\n");
    };
    var removeNetwork = function (parsed, ssid) {
        return {
            lines: parsed.lines,
            networks: parsed.networks.filter(function (network) {
                return network.ssid !== ssid;
            })
        };
    };

    module.exports = {

        addwifi: function (ssid, password) {
            var FS = require('fs')
            var promise = Promise.create();
            var lines = [
                'network={',
                'ssid="' + ssid + '"',
                'psk="' + password +'"',
                'priority=10',
                '}'
            ]
            FS.appendFile('/etc/wpa_supplicant/wpa_supplicant.conf', "\n" + lines.join("\n") + "\n", promise.asyncCallbackFunc());
            return promise;
        },

        removewifi: function (ssid) {
            var FS = require('fs')
            var promise = Promise.create();
            var content = FS.readFileSync('/etc/wpa_supplicant/wpa_supplicant.conf');
            var parsed = parser(content);
            var removed = removeNetwork(parsed, ssid);
            var updated = formatter(removed);
            FS.writeFile('/etc/wpa_supplicant/wpa_supplicant.conf', updated, promise.asyncCallbackFunc());
            return promise;
        },

        wifidatabase: function () {
            var FS = require('fs')
            var promise = Promise.create();
            var content = FS.readFileSync('/etc/wpa_supplicant/wpa_supplicant.conf');
            var parsed = parser(content);
            promise.asyncSuccess(parsed.networks);
            return promise;
        }

    };

});

