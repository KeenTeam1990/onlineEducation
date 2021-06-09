module.exports = {
  /**
   * 设置用户邀请码(自动生成)
   * @url user/kh/setUserInviteCode 前端调用的url参数地址
   * @description 针对未生成邀请码的用户使用此方法生成邀请码(自动生成)
   * @params {Object} data 请求参数
   * @params {String} uniIdToken 用户token
   * @params {Object} util 公共工具包
	 * data 请求参数 说明
	 * @params {String} uid  当前登录用户id,若用户已登录且token有效,则data中会带uid参数
   * (此参数是后端过滤器通过token获取并添加到data中的,是可信任的)
	 * res 返回参数说明
	 * @params {Number} code 错误码，0表示成功
	 * @params {String} msg 详细信息
	 * @params {String} myInviteCode 最终设置的邀请码
   */
	main: async (event) => {
		let { data = {},userInfo, util, originalParam } = event;
		let { uniID } = util;
		let { uid } = data;
		let res = {};
		// 业务逻辑开始-----------------------------------------------------------
		// 判断下如果已经生成,则不再重新生成
		if(userInfo.my_invite_code){
			res = {
				"code": 0,
				"msg": "无需重复设置",
				"myInviteCode": userInfo.my_invite_code
			}
		}else{
			res = await uniID.setUserInviteCode({
				uid:uid
			});
		}
		// 业务逻辑结束-----------------------------------------------------------
		return res;
	}
}