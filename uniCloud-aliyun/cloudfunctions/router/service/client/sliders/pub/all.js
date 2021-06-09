'use strict';
module.exports = {
	/**
	 * 获取sliders列表
	 * @url client/sliders/pub/all 前端调用的url参数地址
	 * data 请求参数
	 * @params {String} platform  平台标识
	 */
	main: async (event) => {
		let { data = {}, userInfo, util, originalParam } = event;
		let { customUtil, config, pubFun, vk, db, _ } = util;
		let { uid } = data;
		let res = { code : 0, msg : '' };
		// 业务逻辑开始-----------------------------------------------------------
	
		res = await vk.baseDao.select({
			dbName:"sliders",
			whereJson:{
				platform:data.platform,
				status:1,
			},
			sortArr:[{"name":"sort", "type":"desc"}],
		});

		// 业务逻辑结束-----------------------------------------------------------
		return res;
	}
}
