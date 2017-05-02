Scoped.require([
    "betajs:Promise"
], function (Promise) {

    module.exports = {

        iwlist: function (adapter) {
            var IWList = require('iwlist');
            var promise = Promise.create();
            IWList(adapter).scan(promise.asyncCallbackFunc());
            return promise;
        }

    };

});

