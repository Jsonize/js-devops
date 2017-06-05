Scoped.require([
    "betajs:Promise"
], function (Promise) {

    module.exports = {

        ifconfig: function () {
            var IFConfig = require('ifconfig-linux');
            var promise = Promise.create();
            IFConfig().then(function (result, error) {
                promise.asyncCallback(error, result);
            });
            return promise;
        }

    };

});

