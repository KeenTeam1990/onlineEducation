module.exports = {
	/**
	 * 登录日志
	 */
	 add: async (event,util) => {
		let { uniID, config, pubFun, vk , db, _ } = util;
		let res = { code : 0, msg : '' };
		// 业务逻辑开始-----------------------------------------------------------
		let {
			type, login_type, user_id,
			ip, ua, os, platform, context
		} = event;
		if(context){
			ip = context.CLIENTIP;
			ua = context.CLIENTUA;
			os = context.OS;
			platform = context.PLATFORM;
		}
		if(vk.pubfn.getData(config, "vk.service.log.login.status")){
			// 增加登录日志
			try {
				await vk.baseDao.add({
					dbName:"uni-id-log",
					dataJson:{
						type, login_type, user_id,
						ip, ua, os, platform
					}
				});
			}catch(err){
				console.log("日志写入错误");
			}
		}else{
			console.log("已关闭登录日志");
		}
		// 业务逻辑结束-----------------------------------------------------------
		return res;
	}
}
