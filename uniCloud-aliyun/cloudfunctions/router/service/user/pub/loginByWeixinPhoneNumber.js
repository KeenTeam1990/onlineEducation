module.exports = {
  /**
   * 用户登录(微信手机号授权)
   * @url user/pub/loginByWeixinPhoneNumber 前端调用的url参数地址
   * @description 用户登录(微信授权)
	 * data 请求参数 说明
	 * @params {String} encryptedData
	 * @params {String} iv
	 * @params {String} sessionKey
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
		let { 
			nickname, 
			avatar, 
			gender,
			inviteCode,
			encryptedData,
			iv,
			sessionKey
		} = data;
		// 微信登录(未绑定任何账号时,会新建账号)
		res = await vk.openapi.weixin.decrypt.getPhoneNumber(data);
		if(res.code === 0){
			let {
				mobile
			} = res;
			let code = vk.pubfn.random(6);
			// 指定操作类型，可选值为login、register，不传此参数时表现为手机号已注册则登录，手机号未注册则进行注册
			let type;
			// 通过手机号登录
			await uniID.setVerifyCode({ mobile, code, expiresIn:60, type:"login" });
			res = await uniID.loginBySms({ mobile, code, type, inviteCode });
			if(res.token){
				if(res.type === "register"){
					let wx_openid;
					let wx_unionid;
					let cacheKey = `sys-weixin-session2openid-${sessionKey}`;
					let openidCache = await vk.globalDataCache.get(cacheKey);
					if(vk.pubfn.isNotNull(openidCache)){
						wx_openid = {};
						wx_openid["mp-weixin"] = openidCache.openid;
						wx_unionid = openidCache.unionid;
						await vk.globalDataCache.del(cacheKey);
					}
					let mobileStr = mobile.substring(7);
					await vk.baseDao.updateById({
						dbName:"uni-id-users",
						id:res.uid,
						dataJson:{
							nickname:nickname || `手机尾号${mobileStr}用户`,
							avatar,
							gender,
							wx_openid,
							wx_unionid
						}
					});
				}
				// 日志服务
				const loginLogService = vk.require("service/user/util/login_log");
				await loginLogService.add({
					type: res.type,
					login_type: "weixinPhoneNumber",
					user_id: res.uid,
					context: originalParam.context
				}, util);
			}
		}
		// 业务逻辑结束-----------------------------------------------------------
		return res;
	}
}
