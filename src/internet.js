Scoped.require([
    "betajs:Promise"
], function (Promise) {

    module.exports = {

        internet_connectivity: function (url) {
            var promise = Promise.create();
            require('https').get(url, function () {
                promise.asyncSuccess(true);
            }).on("error", function (err) {
                promise.asyncError({
                    result: err.message
                });
            });
            return promise;
        },

        internetip: function () {
            var promise = Promise.create();
            require('http').get("http://ifconfig.me", function (result) {
                var data = "";
                result.on("data", function (chunk) {
                    data += chunk;
                }).on("end", function () {
                    promise.asyncSuccess(data.trim());
                });
            }).on("error", function (err) {
                promise.asyncError({
                    result: err.message
                });
            });
            return promise;
        }

    };
});