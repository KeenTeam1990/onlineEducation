'use strict';
module.exports = {
	/**
	 * 事务使用示例 - 两个账户之间进行转账的简易示例
	 * @url template/db_api/sys/transaction 前端调用的url参数地址
	 * data 请求参数 说明
	 * res 返回参数说明
	 * @params {Number} code 错误码，0表示成功
	 * @params {String} msg 详细信息
	 */
	main: async (event) => {
    let { data = {}, userInfo, util, originalParam } = event;
    let { customUtil, config, pubFun, vk, db, _ } = util;
    let { uid } = data;
    let res = { code : 0, msg : '' };
    // 业务逻辑开始-----------------------------------------------------------
    // 可写与数据库的交互逻辑等等
		// 开启事务
    const transaction = await vk.baseDao.startTransaction();
    try {
      let dbName = "uni-id-users";
      let money = 100;
      // 给用户001减100余额
      let update1Res = await vk.baseDao.updateById({
        db:transaction,
        dbName,
        id:"001",
        dataJson:{
          account_balance:_.inc(money * -1)
        },
      });
      // 给用户2加100余额
      let update2Res = await vk.baseDao.updateById({
        db:transaction,
        dbName,
        id:"002",
        dataJson:{
          account_balance:_.inc(money)
        },
      });
    	const endRes = await vk.baseDao.findById({
        db:transaction,
        dbName,
        id:"001"
      });
      if (endRes.account_balance < 0) {
        transaction.rollback(-100);
        return {
          code:-1,
          msg:"用户001账户余额不足",
          aaaAccount: endRes.account_balance
        }
      }else{
        // 提交事物
        await transaction.commit();
        console.log(`transaction succeeded`);
        return {
          code:0,
          msg:"转账成功",
          aaaAccount: endRes.account_balance
        }
      }
    }catch (err) {
      // 事务回滚
      await transaction.rollback();
      console.error(`transaction error`, err)
      return {
        code: -1,
        msg:"数据库写入异常,事务已回滚",
        err: {
          message:err.message,
          stack:err.stack
        }
      }
    }
    // 业务逻辑结束-----------------------------------------------------------
    return res;
  }
}
