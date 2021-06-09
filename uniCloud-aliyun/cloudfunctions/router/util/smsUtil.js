/**
 * 发送短信工具包
 * 
 */
var Core;
try {
	Core = require('@alicloud/pop-core');
} catch (err) {}
var smsUtil = {};
/**
 * @param {Object} obj
 * @param {Object} util
 * obj - param
 * @param {Object} aliyun_params
 * @param {Object} aliyun_requestOption
 * res 返回参数说明
 * @params {Number} code 错误码，0表示成功
 * @params {String} msg 详细信息
 * 
 */
smsUtil.sendSmsByAliyun = async function(obj, util){
	let { 
		config, 
		data, 
		requestOption = {
			method: 'POST'
		}
	} = obj;
	let res = { code : 0, msg : '' };
	if(!config || JSON.stringify(config)=="{}") config = util.vk.pubfn.getData(util.config, "vk.service.sms.aliyun");
	if(!config || JSON.stringify(config)=="{}"){
		return {
			code : -1,
			msg : "阿里云短信配置错误,请检查!"
		};
	}
	if(typeof Core === "undefined"){
		return { code : -1, msg : '请先安装npm包"@alicloud/pop-core": "^1.7.9" 和 "form-data": "^3.0.0"' };
	}
	var aliyunClient = new Core(config);
	if(!data.SignName) data.SignName = config.SignName;
	if(typeof data.TemplateParam == "object") data.TemplateParam = JSON.stringify(data.TemplateParam);
	let requestRes = await aliyunClient.request('SendSms', data, requestOption);
	if(requestRes.Code != "OK"){
		return {
			code : -1,
			msg : requestRes.Message
		};
	}
	return res;
};

smsUtil.sendSmsVerifyCode = async function(obj, util){
	let { mobile, code, provider } = obj;
	let config = util.vk.pubfn.getData(util.config, "vk.service.sms."+provider);
	if(!config || JSON.stringify(config)=="{}"){
		return {
			code : -1,
			msg : "短信配置错误，请检查！"
		};
	}
	if(provider == "aliyun"){
		return await smsUtil.sendSmsByAliyun({
			config : config,
			data : {
				"PhoneNumbers": mobile,
				"TemplateCode": config.TemplateCode.verifyCode,
				"TemplateParam": {
					"code": code,
				}
			}
		}, util);
	}else{
		return {
			code : -1,
			msg : "provider错误，请检查！"
		};
	}
};

module.exports = smsUtil;
