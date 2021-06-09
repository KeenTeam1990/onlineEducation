module.exports = {
  /**
   * 手机号登陆(手机号+手机验证码)
   * @url user/pub/loginBySms 前端调用的url参数地址
   * @description 手机号登陆(手机号+手机验证码)
	 * data 请求参数 说明
	 * @params {String} mobile 手机号
	 * @params {String} code 验证码
	 * res 返回参数说明
	 * @params {Number} code 错误码，0表示成功
	 * @params {String} msg 详细信息
	 * @params {String} token 登录成功之后返回的token信息
	 * @params {String} tokenExpired token过期时间
   */
	main: async (event) => {
		let { data = {}, util, originalParam } = event;
		let { uniID, config, pubFun, vk , db, _ } = util;
		let { uid } = data;
		let res = {};
		// 业务逻辑开始-----------------------------------------------------------
		let { mobile, code, password, inviteCode, needPermission, type } = data;
		res = await uniID.loginBySms({
			type, mobile, code, password, inviteCode, needPermission
		});
		// 修改用户昵称为:手机尾号xxxx用户
		if(res.token){
			let mobileStr = mobile.substring(7);
			await vk.baseDao.update({
				dbName:"uni-id-users",
				whereJson:{
					_id:res.uid,
					nickname:null
				},
				dataJson:{
					nickname:`手机尾号${mobileStr}用户`
				}
			});
			// 日志服务
			const loginLogService = vk.require("service/user/util/login_log");
			await loginLogService.add({
				type: "login",
				login_type: "sms",
				user_id: res.uid,
				context: originalParam.context
			},event.util);
		}
		// 业务逻辑结束-----------------------------------------------------------
		return res;
	}
}
