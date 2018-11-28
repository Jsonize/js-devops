Scoped.require([
    "betajs:Objs",
    "betajs:Strings",
    "betajs:JavaScript",
    "jsonize:AbstractJsonizeTask",
    "jsonize:JsonizeTaskRegistry"
], function (Objs, Strings, JavaScript, AbstractJsonizeTask, JsonizeTaskRegistry) {

    var jsonizeModule = require(__dirname + "/index.js");

    Objs.iter(jsonizeModule, function (funcValue, funcName) {
        JsonizeTaskRegistry.register("devops-" + Strings.kebabCase(funcName), AbstractJsonizeTask.extend(null, {

            _run: function (payload) {
                return jsonizeModule[funcName].apply(jsonizeModule, JavaScript.extractFunctionParameterNames(funcValue).map(function (paramName) {
                    return payload[paramName];
                }));
            }

        }));
    });
});