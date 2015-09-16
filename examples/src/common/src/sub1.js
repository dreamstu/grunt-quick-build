var $ = require('zepto');
var test = require('test');
var sub2 = require('./sub2.js');
require.async('./sub3.tpl',function(tpl){
	console.log('done!');
});
module.exports = {};