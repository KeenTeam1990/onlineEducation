/**
 * unicloud-user-center 接口类（uni-id封装）
 * author	VK
 */
import callFunctionUtil from './vk-unicloud-callFunctionUtil.js'
var { callFunction, config, saveToken, deleteToken } = callFunctionUtil;

export default {
	/**
	 * 用户注册(用户名+密码)
	 * data 请求参数 说明
	 * @params {String} username 用户名
	 * @params {String} password 密码
	 * res 返回参数说明
	 * @params {Number} code 错误码，0表示成功
	 * @params {String} msg 详细信息
	 * @params {String} token 注册完成自动登录之后返回的token信息
	 * @params {String} tokenExpired token过期时间
	 */
	register(obj = {}){
		if(!obj.loading && !obj.title) obj.title = "注册中...";
		return callFunction({
			...obj,
			url: 'user/pub/register'
		});
	},
	/**
	 * 用户登陆(用户名+密码)
	 * data 请求参数 说明
	 * @params {String} username 用户名
	 * @params {String} password 密码
	 * res 返回参数说明
	 * @params {Number} code 错误码，0表示成功
	 * @params {String} msg 详细信息
	 * @params {String} token 注册完成自动登录之后返回的token信息
	 * @params {String} tokenExpired token过期时间
	 */
	login(obj = {}) {
		if(!obj.loading && !obj.title) obj.title = "登录中...";
		return callFunction({
			...obj,
			url: 'user/pub/login'
		});
	},
	/**
	 * 登出(退出)
	 * 若你使用了vuex，vuex内的数据需要你自己删除（通过回调函数删除，而不是写在此处）
	 */
	logout(obj = {}) {
		if(!obj.loading && !obj.title) obj.title = "请求中...";
		return callFunction({
			...obj,
			url: 'user/pub/logout',
			success(res){
				deleteToken();
				if(typeof obj.success == "function") obj.success(res);
			}
		});
	},
	/**
	 * 修改密码
	 * @description 修改成功后，需要重新登录获取新的token
	 * data 请求参数 说明
	 * @params {String} oldPassword 旧密码
	 * @params {String} newPassword 新密码
	 * @params {String} password_confirmation 确认新密码
	 * res 返回参数说明
	 * @params {Number} code 错误码，0表示成功
	 * @params {String} msg 详细信息
	 */
	updatePwd(obj = {}) {
		if(!obj.loading && !obj.title) obj.title = "请求中...";
		return callFunction({
			...obj,
			url: 'user/kh/updatePwd',
		});
	},
	/**
	 * 重置密码
	 */
	resetPwd(obj) {
		if(!obj.loading && !obj.title) obj.title = "请求中...";
		return callFunction({
			...obj,
			url: 'user/kh/resetPwd',
		});
	},
	/**
	 * 设置头像
	 * data 请求参数 说明
	 * @params {String} avatar 头像地址
	 * res 返回参数说明
	 * @params {Number} code 错误码，0表示成功
	 * @params {String} msg 详细信息
	 */
	setAvatar(obj = {}) {
		if(!obj.loading && !obj.title) obj.title = "请求中...";
		//obj.isRequest = true;
		return callFunction({
			...obj,
			url: 'user/kh/setAvatar',
		});
	},
	/**
	 * 设置昵称等用户展示的个人信息
	 * data 请求参数 说明
	 * @params {String} nickname 昵称
	 * res 返回参数说明
	 * @params {Number} code 错误码，0表示成功
	 * @params {String} msg 详细信息
	 */
	updateUser(obj = {}) {
		if(!obj.loading && !obj.title) obj.title = "请求中...";
		callFunction({
			...obj,
			url: 'user/kh/updateUser'
		});
	},
	/**
	 * 获取用户最新信息
	 * res 返回参数说明
	 * @params {Number} code 错误码，0表示成功
	 * @params {String} msg 错误信息
	 * @params {Object} userInfo 用户信息
	 */
	getCurrentUserInfo(obj = {}) {
		if(!obj.loading && !obj.title) obj.title = "请求中...";
		return callFunction({
			...obj,
			url: 'user/kh/getMyUserInfo',
		});
	},
	/**
	 * token校验
	 */
	checkToken(obj = {}){
		if(!obj.loading && !obj.title) obj.title = "请求中...";
		return callFunction({
			...obj,
			url: 'user/pub/checkToken',
		});
	},
	/**
	 * 绑定手机号
	 * data 请求参数 说明
	 * @params {String} mobile 手机号
	 * res 返回参数说明
	 * @params {Number} code 错误码，0表示成功
	 * @params {String} msg 详细信息
	 */
	bindMobile(obj = {}) {
		if(!obj.loading && !obj.title) obj.title = "请求中...";
		return callFunction({
			...obj,
			url: 'user/kh/bindMobile',
		});
	},
	/**
	 * 解绑手机号
	 */
	unbindMobile(obj = {}) {
		if(!obj.loading && !obj.title) obj.title = "请求中...";
		return callFunction({
			...obj,
			url: 'user/kh/unbindMobile',
		});
	},
	/**
	 * 手机号登陆(手机号+手机验证码)
	 * data 请求参数 说明
	 * @params {String} mobile 手机号
	 * @params {String} code 验证码
	 * res 返回参数说明
	 * @params {Number} code 错误码，0表示成功
	 * @params {String} msg 详细信息
	 * @params {String} token 注册完成自动登录之后返回的token信息
	 * @params {String} tokenExpired token过期时间
	 */
	loginBySms(obj = {}) {
		if(!obj.loading && !obj.title) obj.title = "登录中...";
		return callFunction({
			...obj,
			url: 'user/pub/loginBySms'
		});
	},
	/**
	 * 发送手机号验证码
	 */
	sendSmsCode(obj = {}) {
		if(!obj.loading && !obj.title) obj.title = "请求中...";
		return callFunction({
			...obj,
			url: 'user/pub/sendSmsCode',
		});
	},
	/**
	 * APP端 手机一键登录
	 */
	loginByUniverify(obj = {}) {
		//if(!obj.loading && !obj.title) obj.title = "登录中...";
		if(typeof obj.needAlert === "undefined") obj.needAlert = true;
		// #ifdef APP-PLUS
		uni.login({
			provider: 'univerify',
			univerifyStyle: obj.univerifyStyle,
			success(res){
				let dataJson = Object.assign(obj.data, res.authResult);
				callFunction({
					...obj,
					data:dataJson,
					url: 'user/pub/loginByUniverify',
				});
			},
			fail:obj.fail,
			complete:obj.complete,
		});
		// #endif
		// #ifndef APP-PLUS
		uni.vk.toast("请在APP中使用本机号码一键登录","none");
		// #endif
	},

	/**
	 * 绑定邮箱
	 * data 请求参数 说明
	 * @params {String} email 邮箱
	 * @params {String} code  邮箱收到的验证码
	 * res 返回参数说明
	 * @params {Number} code 错误码，0表示成功
	 * @params {String} msg 详细信息
	 */
	bindEmail(obj = {}) {
		if(!obj.loading && !obj.title) obj.title = "请求中...";
		return callFunction({
			...obj,
			url: 'user/kh/bindEmail',
		});
	},
	/**
	 * 解绑邮箱
	 */
	unbindEmail(obj = {}) {
		if(!obj.loading && !obj.title) obj.title = "请求中...";
		return callFunction({
			...obj,
			url: 'user/kh/unbindEmail',
		});
	},
	/**
	 * 邮箱登陆(邮箱+邮箱验证码)
	 * data 请求参数 说明
	 * @params {String} email 邮箱
	 * @params {String} code  邮箱收到的验证码
	 * res 返回参数说明
	 * @params {Number} code 错误码，0表示成功
	 * @params {String} msg 详细信息
	 * @params {String} token 注册完成自动登录之后返回的token信息
	 * @params {String} tokenExpired token过期时间
	 */
	loginByEmail(obj = {}) {
		if(!obj.loading && !obj.title) obj.title = "登录中...";
		return callFunction({
			...obj,
			url: 'user/pub/loginByEmail'
		});
	},
	/**
	 * 发送邮件验证码
	 */
	sendEmailCode(obj = {}) {
		if(!obj.loading && !obj.title) obj.title = "请求中...";
		return callFunction({
			...obj,
			url: 'user/pub/sendEmailCode',
		});
	},
	/**
	 * 设置验证码
	 */
	setVerifyCode(obj = {}) {
		if(!obj.loading && !obj.title) obj.title = "请求中...";
		return callFunction({
			...obj,
			url: 'user/sys/setVerifyCode',
		});
	},
	/**
	 * 微信登陆获取用户code
	 */
	getWeixinCode() {
		return new Promise((resolve, reject) => {
			// #ifdef MP-WEIXIN
			uni.login({
				provider: 'weixin',
				success(res) {
					resolve(res.code)
				},
				fail(err) {
					reject(new Error('微信登录失败'))
				}
			})
			// #endif
			// #ifdef APP-PLUS
			plus.oauth.getServices((services) => {
				let weixinAuthService = services.find((service) => {
					return service.id === 'weixin';
				});
				if (weixinAuthService) {
					weixinAuthService.authorize(function(res) {
						resolve(res.code);
					}, function(err) {
						console.log(err);
						reject(new Error('微信登录失败'));
					});
				}
			});
			// #endif
		})
	},
	// 微信登陆
	loginByWeixin(obj = {}) {
		let that = this;
		if(!obj.loading && !obj.title) obj.title = "登录中...";
		let { data={} } = obj;
		that.getWeixinCode().then((code) => {
			callFunction({
				...obj,
				url: 'user/pub/loginByWeixin',
				data:{
					...data,
					code:code
				}
			});
		});
	},
	/**
	 * 获取微信openid
	 */
	code2SessionWeixin(obj = {}) {
		let that = this;
		if(!obj.loading && typeof obj.title === "undefined") obj.title = "请求中...";
		let { data={} } = obj;
		that.getWeixinCode().then((code) => {
			callFunction({
				...obj,
				url: 'user/pub/code2SessionWeixin',
				data:{
					...data,
					code:code
				}
			});
		});
	},
	/**
	 * 绑定微信
	 */
	bindWeixin(obj = {}) {
		let that = this;
		if(!obj.loading && !obj.title) obj.title = "请求中...";
		let { data={} } = obj;
		that.getWeixinCode().then((code) => {
			callFunction({
				...obj,
				url: 'user/kh/bindWeixin',
				data:{
					...data,
					code:code
				}
			});
		});
	},
	/**
	 * 解绑微信
	 */
	unbindWeixin(obj = {}) {
		if(!obj.loading && !obj.title) obj.title = "请求中...";
		return callFunction({
			...obj,
			url: 'user/kh/unbindWeixin',
		});
	},
	/**
	 * 获取微信绑定的手机号(后面会支持支付宝)
	 */
	getPhoneNumber(obj = {}) {
		if(!obj.loading && !obj.title) obj.title = "请求中...";
		return callFunction({
			...obj,
			url: 'user/pub/getPhoneNumber'
		});
	},
	/**
	 * 通过微信小程序绑定的手机号登录
	 */
	loginByWeixinPhoneNumber(obj = {}) {
		if(!obj.loading && !obj.title) obj.title = "登录中...";
		return callFunction({
			...obj,
			url: 'user/pub/loginByWeixinPhoneNumber'
		});
	},
	/**
	 * 生成微信小程序码
	 */
	getWeixinMPqrcode(obj = {}) {
		if(!obj.loading && !obj.title) obj.title = "生成中...";
		return callFunction({
			...obj,
			url: 'user/kh/getWeixinMPqrcode',
		});
	},
	/**
	 * 生成微信小程序scheme码
	 */
	getWeixinMPscheme(obj = {}) {
		if(!obj.loading && !obj.title) obj.title = "生成中...";
		return callFunction({
			...obj,
			url: 'user/kh/getWeixinMPscheme',
		});
	},
	/**
	 * 获取支付宝code
	 */
	getAlipayCode(){
		return new Promise((resolve, reject) => {
			uni.login({
				provider: 'alipay',
				success(res) {
					resolve(res.code);
				},
				fail(err) {
					reject(new Error('支付宝登录失败'));
				}
			})
		})
	},
	/**
	 * 支付宝登陆
	 */
	loginByAlipay(obj = {}) {
		let that = this;
		if(!obj.loading && !obj.title) obj.title = "登录中...";
		let { data={} } = obj;
		that.getAlipayCode().then((code) => {
			callFunction({
				...obj,
				url: 'user/pub/loginByAlipay',
				data:{
					...data,
					code:code
				}
			});
		});
	},
	/**
	 * 获取支付宝openid
	 */
	code2SessionAlipay(obj = {}) {
		let that = this;
		if(!obj.loading && !obj.title) obj.title = "请求中...";
		let { data={} } = obj;
		that.getAlipayCode().then((code) => {
			callFunction({
				...obj,
				url: 'user/pub/code2SessionAlipay',
				data:{
					...data,
					code:code
				}
			});
		});
	},
	/**
	 * 绑定支付宝
	 */
	bindAlipay(obj = {}) {
		let that = this;
		if(!obj.loading && !obj.title) obj.title = "请求中...";
		let { data={} } = obj;
		that.getAlipayCode().then((code) => {
			callFunction({
				...obj,
				url: 'user/kh/bindAlipay',
				data:{
					...data,
					code:code
				}
			});
		});
	},
	/**
	 * 解绑支付宝
	 */
	unbindAlipay(obj = {}) {
		if(!obj.loading && !obj.title) obj.title = "请求中...";
		return callFunction({
			...obj,
			url: 'user/kh/unbindAlipay',
		});
	},
	/**
	 * 密码加密测试(暂不用)
	 */
	encryptPwd(obj = {}) {
		if(!obj.loading && !obj.title) obj.title = "请求中...";
		return callFunction({
			...obj,
			url: 'user/pub/encryptPwd',
		});
	},
	// 1.1.2新增
	/**
	 * 设置用户邀请码(自动生成)
	 */
	setUserInviteCode(obj = {}) {
		if(!obj.loading && !obj.title) obj.title = "请求中...";
		return callFunction({
			...obj,
			url: 'user/kh/setUserInviteCode',
		});
	},
	/**
	 * 用户接受邀请
	 */
	acceptInvite(obj = {}) {
		if(!obj.loading && !obj.title) obj.title = "请求中...";
		return callFunction({
			...obj,
			url: 'user/kh/acceptInvite',
		});
	},
	/**
	 * 获取接受邀请的用户清单
	 */
	getInvitedUser(obj = {}) {
		if(!obj.loading && !obj.title) obj.title = "请求中...";
		return callFunction({
			...obj,
			url: 'user/kh/getInvitedUser',
		});
	},
	/**
	 * 根据手机验证码重置账号密码
	 */
	resetPasswordByMobile(obj = {}) {
		if(!obj.loading && !obj.title) obj.title = "请求中...";
		return callFunction({
			...obj,
			url: 'user/pub/resetPasswordByMobile',
		});
	},
	/**
	 * 获取菜单
	 */
	getMenu(obj = {}) {
		return callFunction({
			...obj,
			url: 'user/kh/getMenu'
		});
	},
	/**
	 * 添加文件上传记录
	 */
	addUploadRecord(obj = {}) {
		return callFunction({
			...obj,
			url: 'user/kh/addUploadRecord'
		});
	}
};
