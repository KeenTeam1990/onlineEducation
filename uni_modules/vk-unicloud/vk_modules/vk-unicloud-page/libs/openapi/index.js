/**
 * 开放API
 */
var openapi = {};
openapi.baidu = require('./baidu');
openapi.init = function(util){
	openapi.baidu.init(util);
}
// 微信小程序API
module.exports = openapi;


