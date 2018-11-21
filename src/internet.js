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
        }

    };
});