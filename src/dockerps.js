Scoped.require([
    "betajs:Promise"
], function (Promise) {

    module.exports = {

        dockerps: function () {
            var DockerPS = require('docker-ps');
            var promise = Promise.create();
            DockerPS(promise.asyncCallbackFunc());
            return promise;
        }

    };

});

