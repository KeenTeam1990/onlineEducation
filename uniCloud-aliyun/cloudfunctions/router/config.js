const config = require('config');             // 全局配置信息
const uniID = require('uni-id');              // uni-id 公共模块
uniID.init(config["uni"]);                    // 初始化uni-id
const uniPay = require('uni-pay');            // uni-pay 公共模块
const db = uniCloud.database();               // 获取数据库实例
const pubFun = require('./util/pubFunction'); // 自定义公共函数
// 自定义过滤器(中间件)
const middlewareService = require('./middleware/index');
// 数据库操作中心
const daoCenter = require('./dao/index');
// 加密解密工具包
const crypto = require('crypto');
const requireFn = function(path){
	return require(path);
}
const initConfig = {
	baseDir : __dirname, // 云函数根目录地址
	requireFn,
	config,
	uniID,
	uniPay,
	db,
	pubFun,
	middlewareService,
	daoCenter,
	crypto
	// customUtil :{
	// 	mynpm1:mynpm1
	// }
};

module.exports = initConfig;
