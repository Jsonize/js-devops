Scoped.require([
    "betajs:Promise"
], function (Promise) {

    var cmd = function (cmd) {
        var promise = Promise.create();
        require("child_process").exec(cmd, function (error, stdout, stderr) {
            if (error) {
                promise.asyncError({
                    result: "UnknownError",
                    error: error,
                    stdout: stdout,
                    stderr: stderr
                });
                return;
            }
            promise.asyncSuccess({
                stdout: stdout,
                stderr: stderr
            });
        });
        return promise;
    };

    var parseGitLog = function (input) {
        result = [];

        var lines = input.trim().split("\n");

        var entry;

        while (lines.length > 0) {
            var current = lines.shift();
            if (current.indexOf("commit ") === 0) {
                current = current.trim().split(" ");
                current.shift();
                entry = {
                    commit: current.shift()
                };
                current = current.join(" ").replace(" -> ", "->").replace("(","").replace(")","").split(",");
                while (current.length > 0) {
                    var br = current.shift().trim();
                    if (br.indexOf("->") > 0) {
                        br = br.split("->");
                        entry.pointer = br[0];
                        entry.reference = br[1];
                    } else if (br.length > 0) {
                        entry.branches = entry.branches || [];
                        entry.branches.push(br);
                    }
                }
                result.push(entry);
            } else if (current.indexOf("Author: ") === 0) {
                current = current.substring(7).trim().replace(">", "").split("<");
                entry.author = current[0].trim() || undefined;
                entry.email = current[1] ? current[1].trim() : undefined;
            } else if (current.indexOf("Date: ") === 0) {
                current = current.substring(5).trim();
                entry.date = new Date(current);
            } else {
                current = current.trim();
                if (current.length > 0) {
                    entry.lines = entry.lines || [];
                    entry.lines.push(current);
                }
            }
        }
        return result;
    };

    module.exports = {

        git_log: function (repo) {
            return cmd("cd " + repo + " ; git log").mapSuccess(function (result) {
                return parseGitLog(result.stdout);
            });
        },

        git_fetch: function (repo, origin) {
            return cmd("cd " + repo + " ; git fetch " + (origin || "origin"));
        },

        git_checkout: function (repo, branch) {
            return cmd("cd " + repo + " ; git checkout " + (branch || "."));
        },

        git_pull: function (repo, branch) {
            return cmd("cd " + repo + " ; git pull " + (branch || "origin master"));
        }

    };

});
