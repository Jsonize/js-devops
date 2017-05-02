Scoped.require([
    "betajs:Promise"
], function (Promise) {

    module.exports = {

        df: function () {
            var NodeDF = require('node-df');
            var promise = Promise.create();
            NodeDF(promise.asyncCallbackFunc());
            return promise;
        }

    };

});

