module.exports = {
  /**
   * 修改用户信息
   * @url user/kh/updateUser 前端调用的url参数地址
   * @description 设置当前登录用户的昵称等用户信息
	 * data 请求参数 说明
	 * @params {String} uid  当前登录用户id,若用户已登录且token有效,则data中会带uid参数
   * (此参数是后端过滤器通过token获取并添加到data中的,是可信任的)
	 * @params {String} nickname	用户的昵称
	 * @params {String} avatar 		用户的头像
	 * @params {Number} gender 		用户的性别
	 * res 返回参数说明
	 * @params {Number} code 错误码，0表示成功
	 * @params {String} msg 详细信息
	 */
	main: async (event) => {
		let { data = {}, util, originalParam } = event;
		let { uniID } = util;
		let { uid } = data;
		let res = {};
		// 业务逻辑开始-----------------------------------------------------------
		// 允许修改的字段列表
		let updateKeys = ["nickname","avatar","gender","social_info"];
		let dataJson = {};
		for(let i in updateKeys){
			let key = updateKeys[i];
			if(data[key]) dataJson[key] = data[key];
		}
		dataJson.uid = uid;
		res = await uniID.updateUser(dataJson);
		// 业务逻辑结束-----------------------------------------------------------
		return res;
	}
}