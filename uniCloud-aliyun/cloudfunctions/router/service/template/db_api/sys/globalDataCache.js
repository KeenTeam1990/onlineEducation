module.exports = {
	/**
	 * 缓存API演示
	 * @url template/db_api/sys/globalDataCache 前端调用的url参数地址
	 * data 请求参数 说明
	 * res 返回参数说明
	 * @params {Number} code 错误码，0表示成功
	 * @params {String} msg 详细信息
	 */
	main: async (event) => {
		let { data = {}, userInfo, util, originalParam } = event;
		let { uniID, config, pubFun, vk , db, _ } = util;
		let { uid } = data;
		let res = { code : 0, msg : 'ok' };
		// 业务逻辑开始-----------------------------------------------------------
		let { mode, key, value, second } = data;
		if(mode === "get"){
			// 获取缓存
			res = await vk.globalDataCache.get(key);
		}else if(mode === "set"){
			// 设置缓存
			res = await vk.globalDataCache.set({
				key:key,
				value:value,
				second:second
			});
		}else if(mode === "del"){
			// 删除缓存
			res = await vk.globalDataCache.del(key);
		}else if(mode === "clear"){
			// 清空缓存
			res = await vk.globalDataCache.clear(key);
		}else if(mode === "list"){
			// 缓存列表
			res = await vk.globalDataCache.list({
				pageIndex:1,
				pageSize:100,
				whereJson:{

				}
			});
		}else if(mode === "count"){
			// 缓存数量
			res = await vk.globalDataCache.count();
		}
		// 业务逻辑结束-----------------------------------------------------------
		return res;
	}
}
