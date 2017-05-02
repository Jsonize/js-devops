Scoped = global.Scoped || require("betajs-scoped");
BetaJS = global.BetaJS || require('betajs');
Scoped.binding("betajs", "global:BetaJS");


module.exports = {
		
	df: require(__dirname + "/src/df.js").df,

	iwlist: require(__dirname + "/src/iwlist.js").iwlist
		
};