Scoped.require([
    "betajs:Promise"
], function (Promise) {

    module.exports = {

        connectwifi: function (adapter, ssid, password) {
            var NodeWifi = require('node-wifi');
            var promise = Promise.create();
            NodeWifi.init({
                iface: adapter
            });
            NodeWifi.connect({
                ssid: ssid,
                password: password
            }, promise.asyncCallbackFunc());
            return promise;
        }

    };

});

