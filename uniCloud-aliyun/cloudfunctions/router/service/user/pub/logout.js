module.exports = {
  /**
   * 用户退出登录
   * @url user/pub/logout 前端调用的url参数地址
   * @description 用户退出登录
	 * res 返回参数说明
	 * @params {Number} code 错误码，0表示成功
	 * @params {String} msg 详细信息
	 */
	main: async (event) => {
		let {uniID} = event.util;
		let res = {};
		// 业务逻辑开始----------------------------------------------------------- 
		if(event.uniIdToken){
			res = await uniID.logout(event.uniIdToken);
		}else{
			res.code = 0;
			res.msg = "未登录";
		}
		// 业务逻辑结束-----------------------------------------------------------
		return res;
	}
}