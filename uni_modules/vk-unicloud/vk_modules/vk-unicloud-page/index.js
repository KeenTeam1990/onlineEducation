/**
 * vk-unicloud框架客户端(前端)
 * author	VK
 */
import userCenter 				from './libs/vk-unicloud/vk-unicloud-user-center'
import callFunctionUtil 	from './libs/vk-unicloud/vk-unicloud-callFunctionUtil'
import pubfn 							from './libs/function/index'
import modal 							from './libs/function/modal'
import navigate 					from './libs/function/vk.navigate'
import localStorage 			from './libs/function/vk.localStorage'
import aliyunOSSUtil			from './libs/function/aliyunOSSUtil'
import openapi						from './libs/openapi/index'
import request						from './libs/function/vk.request'

import filters 						from './libs/function/vk.filters'
import mixin 							from './libs/mixin/mixin.js'
import initPermission			from './libs/function/permission'
import storeMixin 				from './libs/store/mixin/mixin'
import initGlobalError		from './libs/store/libs/error'
import consoleLog					from './libs/install/console.log'
import updateManager 			from './libs/function/updateManager.js'

var vk = {
	userCenter,
	callFunctionUtil,
 /**
	* 发起一个云函数请求
	*/
	callFunction : callFunctionUtil.callFunction,
	pubfn,

	alert 						: 	modal.alert,
	toast 						: 	modal.toast,
	confirm 					: 	modal.confirm,
	showActionSheet 	: 	modal.showActionSheet,
	showLoading 			: 	modal.showLoading,
	hideLoading				: 	modal.hideLoading,
	setLoading				:		modal.setLoading,

	navigate,
	// 保留当前页面,并进行页面跳转
	navigateTo				:		navigate.navigateTo,
	// 关闭当前页面,并进行页面跳转
	redirectTo				:		navigate.redirectTo,
	// 并关闭所有页面,并进行页面跳转
	reLaunch					:		navigate.reLaunch,
	// 并关闭所有非tab页面,并进行tab面跳转
	switchTab					:		navigate.switchTab,
	// 页面返回
	navigateBack			:		navigate.navigateBack,
	// 跳转到小程序
	navigateToMiniProgram : navigate.navigateToMiniProgram,
	// 本地缓存
	localStorage			:		localStorage,
	// 本地缓存
	...localStorage,
	// 阿里云oss
	aliyunOSSUtil,
	// 更新管理器
	updateManager,
	// 开放API
	openapi,
	// 请求库
	request
};
// vk实例初始化
vk.init = function(obj={}){
	let {
		Vue,      // Vue实例
		config,	  // 配置
		store,    // vuex简写法则(新版本无需传store)
	} = obj;
	if(typeof store !== "undefined"){
		// 兼容旧版本
		Vue.use(store);
	}else{
		// 新版本无需传store
		Vue.mixin(storeMixin);
		if(config.globalError){
			Vue.use(initGlobalError);
		}
	}
	// 自定义云函数路由配置
	vk.callFunctionUtil.setConfig(config);
	// 重写 console.log
	Vue.use(consoleLog);
};
// 加载拓展功能
vk.use = function(obj, util){
	for(let name in obj){
		if(obj[name] && typeof obj[name].init === "function"){
			obj[name].init(util);
		}
		vk[name] = obj[name];
	}
};

const install = Vue => {
	// 全局混入
	Vue.mixin(mixin);
	// 加载全局过滤器开始
	for(let i in filters){
		Vue.filter(i, filters[i]);
	}
	let util = { vk };
	// 将vk挂载到Vue实例
	Vue.prototype.vk = vk;
	// 将vk挂载到uni对象
	uni.vk = Vue.prototype.vk;
	// 加载插件
	vk.use({
		callFunctionUtil : vk.callFunctionUtil,
		openapi : vk.openapi
	}, util);
	initPermission(Vue);
}

export default {
	install
}
