module.exports = {
  /**
   * 解绑邮箱
   * @url user/kh/unbindMobile 前端调用的url参数地址
   * @description 当前登录用户解绑手机号
	 * data 请求参数 说明
	 * @params {String} mobile 手机号
	 * res 返回参数说明
	 * @params {Number} code 错误码，0表示成功
	 * @params {String} msg 详细信息
   */
	main: async (event) => {
		let { data = {}, userInfo, util } = event;
		let { uniID, vk } = util;
		let res = { code : 0, msg : '' };
		// 业务逻辑开始-----------------------------------------------------------
		if(vk.pubfn.isNullAll(userInfo.wx_openid, userInfo.username)){
			return { code : -1, msg : '为了您的账号安全，请绑定微信或设置用户名后再解绑手机号！' };
		}
		// 解绑
		res = await uniID.unbindMobile(data);
		// 业务逻辑结束-----------------------------------------------------------
		return res;
	}
}
