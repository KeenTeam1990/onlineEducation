module.exports = {
  /**
   * 获取支付宝openid
   * @url user/pub/code2SessionAlipay 前端调用的url参数地址
   * @description 获取微信openid
   * data 请求参数 说明
   * @params {String} code 微信登录返回的code
	 * @params {String} platform 客户端类型：mp-weixin、app-plus，默认uni-id会自动取客户端类型，但是在云函数url化等场景无法取到客户端类型，可以使用此参数指定
   * res 返回参数说明
   * @params {Number} code 错误码，0表示成功
   * @params {String} msg 详细信息
   * @params {String} openid 用户openid
	 * @params {String} accessToken 客户端为APP时返回
	 * @params {String} expiresIn 客户端为APP时返回，accessToken 接口调用凭证超时时间，单位（秒）
	 * @params {String} refreshToken 客户端为APP时返回，用于刷新accessToken
	 * @params {String} reExpiresIn refreshToken超时时间，单位（秒）
   */
	main: async (event) => {
		let {uniID} = event.util;
		let res = {};
		// 业务逻辑开始----------------------------------------------------------- 
		// 用户登录(账号+密码)
		res = await uniID.code2SessionAlipay(event.data);
		if(res.code === 0){
			let { needCache } = data;
			if(needCache){
				await vk.globalDataCache.set(`sys-alipay-session2openid-${res.sessionKey}`, res, 60*5);
			}
		}
		// 业务逻辑结束-----------------------------------------------------------
		return res;
	}
}