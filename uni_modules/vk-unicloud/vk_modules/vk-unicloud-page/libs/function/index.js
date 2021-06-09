/**
 * 通用公共函数
 */
var pubfn = {};
// 防抖
import debounce from './debounce.js'
// 限流
import throttle from './throttle.js'
// url参数
import queryParams from './queryParams.js'
// H5版本的复制
import setClipboardData from './setClipboardData.js'
// 时间
import timeUtil from './timeUtil.js'
// 树形结构转换
import treeUtil from './treeUtil.js'

/**
 * 树形结构转换
 */
pubfn.treeUtil = treeUtil;
/**
 * 时间工具类
 */
pubfn.timeUtil = timeUtil;
/**
 * 防抖函数
 */
pubfn.debounce = debounce;
/**
 * 节流函数
 */
pubfn.throttle = throttle;
/**
 * 对象转url参数
 * @param {*} data,对象
 * @param {*} isPrefix,是否自动加上"?"
 * 此函数参考uView
 * vk.pubfn.queryParams(json);
 */
pubfn.queryParams = queryParams;
/**
 * 设置剪贴板
 */
pubfn.setClipboardData = setClipboardData;

/**
 * 日期格式化
 * @params {Date || Number} date 需要格式化的时间
 * vk.pubfn.timeFormat(new Date(),"yyyy:MM:dd hh:mm:ss");
 */
pubfn.timeFormat = pubfn.timeUtil.timeFormat;
/**
 * 日期对象转换(云函数端会自动转成东八区时间)
 * @params {Date || Number} date 需要转换的时间
 * @params {Number} type 转换方式
 * type = 0 返回 2020-08-03 12:12:12
 * type = 1 返回 20200803121212
 * type = 2 返回 { YYYY, MM, DD, hh, mm, ss }
 * vk.pubfn.getFullTime(new Date());
 */
pubfn.getFullTime = pubfn.timeUtil.getFullTime;

/**
 * 获得相对当前周addWeekCount个周的起止日期
 * @params {Number} addWeekCount  默认0 (0代表本周 为-1代表上周 为1代表下周以此类推 为2代表下下周)
 * vk.pubfn.getWeekStartAndEnd(0);
 */
pubfn.getWeekStartAndEnd = pubfn.timeUtil.getWeekStartAndEnd;

/**
 * 获取时间范围
 * @params {Date} date 日期对象 可以指定时间计算节点，默认使用当前时间进行计算
 * 返回的是时间戳(防止时区问题)
 * 返回数据如下：
 {
   todayStart 今日开始时间
   todayEnd   今日结束时间
   today12End 今日上午结束时间
   monthStart 本月开始时间
   monthEnd   本月结束时间
   yearStart  本年开始时间
   yearEnd    本年结束时间
   weekStart  本周开始时间
   weekEnd    本周结束时间
   now        现在的时间点(含月年日时分秒)
   months     本年度每月的开始和结束时间 months[1] 代表1月
 }
 * vk.pubfn.getCommonTime();
 */
pubfn.getCommonTime = pubfn.timeUtil.getCommonTime;

/**
 * 获得指定年份和月份后的该月的开始时间和结束时间
 * 返回数据如下：(时间戳形式)
 {
   startTime 该月开始时间
   endTime   该月结束时间
 }
vk.pubfn.getMonthStartAndEnd({
	year:2021
	month:1
});
 */
pubfn.getMonthStartAndEnd = pubfn.timeUtil.getMonthStartAndEnd;

/**
 * Vue 全局表单验证器扩展
rules: {
  receiver_mobile:[
    { validator:vk.pubfn.validator("mobile"), message: '手机号格式错误', trigger: 'blur' }
  ],
},
 */
pubfn.validator = function (type){
	return function(rule, value, callback){
		let key = pubfn.test(value, type);
		if(typeof callback === "function"){
			if(key || !value){
				callback();
			}else{
				return callback(false);
			}
		}else{
			return callback(false);
		}
	}
};

/**
 * 检测文本是否满足指定格式
 * @params {String} str 需要检测的文本
 * @params {String} type 检测类型
 * 包含
 * mobile 手机号码
 * tel 座机
 * card 身份证
 * mobileCode 6位数字验证码
 * username 账号以字母开头，长度在6~18之间，只能包含字母、数字和下划线
 * pwd 密码长度在6~18之间，只能包含字母、数字和下划线
 * payPwd 支付密码 6位纯数字
 * postal 邮政编码
 * QQ QQ号
 * email 邮箱
 * URL 网址
 * IP IP地址
 * date 日期 2020-08-03
 * time 时间 12:12:12
 * dateTime 日期+时间 2020-08-03 12:12:12
 * number 数字
 * english 英文
 * chinese 中文
 * HTML HTML标记
 * vk.pubfn.test(str, type);
 */
pubfn.test = function (str, type){
	switch (type) {
		case 'mobile': //手机号码
			return new RegExp(/^1[3|4|5|6|7|8|9][0-9]{9}$/).test(str);
		case 'tel': //座机
			return new RegExp(/^(0\d{2,3}-\d{7,8})(-\d{1,4})?$/).test(str);
		case 'card': //身份证
			return new RegExp(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/).test(str);
		case 'mobileCode': //6位数字验证码
			return new RegExp(/^[0-9]{6}$/).test(str);
		case 'username': //账号以字母开头，长度在6~18之间，只能包含字母、数字和下划线
			return new RegExp(/^[a-zA-Z]([-_a-zA-Z0-9]{5,17})$/).test(str)
		case 'pwd': //密码长度在6~18之间，只能包含字母、数字和下划线
			return new RegExp(/^([a-zA-Z0-9_]){6,18}$/).test(str)
		case 'password': //密码长度在6~18之间，只能包含字母、数字和下划线
			return new RegExp(/^([a-zA-Z0-9_]){6,18}$/).test(str)
		case 'payPwd': //支付密码 6位纯数字
			return new RegExp(/^[0-9]{6}$/).test(str)
		case 'postal': //邮政编码
			return new RegExp(/[1-9]\d{5}(?!\d)/).test(str);
		case 'QQ': //QQ号
			return new RegExp(/^[1-9][0-9]{4,9}$/).test(str);
		case 'email': //邮箱
			return new RegExp(/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/).test(str);
		case 'money': //金额(小数点2位)
			return new RegExp(/^\d*(?:\.\d{0,2})?$/).test(str);
		case 'URL': //网址
			return new RegExp(/(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/).test(str);
		case 'IP': //IP
			return new RegExp(/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/).test(str);
		case 'date': //日期 2014-01-01
			return new RegExp(/^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/).test(str);
		case 'time': //时间 12:00:00
			return new RegExp(/^(20|21|22|23|[0-1]\d):[0-5]\d:[0-5]\d$/).test(str);
		case 'dateTime': //日期+时间 2014-01-01 12:00:00
			return new RegExp(/^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])\s+(20|21|22|23|[0-1]\d):[0-5]\d:[0-5]\d$/).test(str);
		case 'number': //数字
			return new RegExp(/^[0-9]*$/).test(str);
		case 'english': //英文
			return new RegExp(/^[a-zA-Z]+$/).test(str);
		case 'chinese': //中文
			return new RegExp(/^[\\u4E00-\\u9FA5]+$/).test(str);
		case 'lower': //小写
			return new RegExp(/^[a-z]+$/).test(str);
		case 'upper': //大写
			return new RegExp(/^[A-Z]+$/).test(str);
		case 'HTML': //HTML标记
			return new RegExp(/<("[^"]*"|'[^']*'|[^'">])*>/).test(str);
		default:
			return true;
	}
};
// 保留之前的函数名
pubfn.checkStr = pubfn.test;
/**
 * 对象属性拷贝(浅拷贝)
 * @description 将 obj2 的属性赋值给 obj1 (如果obj1中有对应的属性,则会被obj2的属性值覆盖)
 * @params {Object} 	obj1
 * @params {Object} 	obj2
 * vk.pubfn.objectAssign(obj1, obj2);
 */
pubfn.objectAssign = function (obj1, obj2){
	return Object.assign(obj1, obj2);
};
/**
 * 复制一份对象-没有映射关系
 * @description 主要用于解除映射关系（不支持克隆函数）
 * @params {Object} 	obj
 * let newObj = vk.pubfn.copyObject(obj);
 */
pubfn.copyObject = function (obj){
	return JSON.parse(JSON.stringify(obj));
};
/**
 * 深度克隆一个对象-没有映射关系
 * @description 主要用于解除映射关系（支持克隆函数）
 * @params {Object} 	obj
 * let newObj = vk.pubfn.deepClone(obj);
 */
pubfn.deepClone = function (obj){
	// 对常见的“非”值，直接返回原来值
	if([null, undefined, NaN, false].includes(obj)) return obj;
	if(typeof obj !== "object" && typeof obj !== 'function') {
		//原始类型直接返回
		return obj;
	}
	let o = Object.prototype.toString.call(obj) === '[object Array]' ? [] : {};
	for(let i in obj) {
		if(obj.hasOwnProperty(i)){
			o[i] = typeof obj[i] === "object" ? pubfn.deepClone(obj[i]) : obj[i];
		}
	}
	return o;
};
/**
 * 表单自动填充数据
 * @description 主要用于表单修改时,数据库没有默认字段会报错的问题
 * @params {Object} 	defaultData 默认数据
 * @params {Object} 	itemData		当前数据
 * that.form1 = vk.pubfn.formAssign(defaultData,itemData);
 */
pubfn.formAssign = function (defaultData,itemData){
	let newDefaultData = pubfn.copyObject(defaultData);
	return pubfn.objectAssign(newDefaultData, itemData);
};


/**
 * 两个(元素为对象)的数组合并,并去除重复的数据
 * @params	{Array} 	arr1 	第一个数组(arr1和aar2没有顺序要求)
 * @params	{Array} 	aar2 	第二个数组
 * @params	{String} 	flag 	判断标识,默认用id来判断,若flag传-1,代表不去除重复数据
 * let arr = vk.pubfn.arr_concat(arr1, arr2, "_id");
 */
pubfn.arr_concat = function (arr1, arr2, flag){
	if (!flag) flag = "id";				    	// 默认用id来判断是否是同一个对象元素
	var arr3 = arr1.concat(arr2);		  	// 新旧数据合并
	var arr = [];         					    // 定义一个临时数组 存放对象
	if (flag != -1) {
		var arr_id = [];    				      // 定义一个临时数组 存放id
		for (var i in arr3) {    		  	  // 循环遍历当前数组
			// 判断当前数组下标为i的元素是否已经保存到临时数组
			// 如果已保存，则跳过，否则将此元素保存到临时数组中
			if (arr_id.indexOf(arr3[i][flag]) == -1) {
				arr_id.push(arr3[i][flag]);   // 添加id到数组
				arr.push(arr3[i]);            // 添加对象到数组
			}
		}
	} else {
		arr = arr3;
	}
	return arr;
};
/**
 * 自动根据字符串路径获取对象中的值支持.和[] , 且任意一个值为undefined时,不会报错,会直接返回undefined
 * @params	{Object} dataObj 数据源
 * @params	{String} name 支持a.b 和 a[b]
 * @params	{String} defaultValue undefined时的默认值
 * vk.pubfn.getData(dataObj, name);
 */
pubfn.getData = function (dataObj, name, defaultValue) {
	let newDataObj;
	if(pubfn.isNotNull(dataObj)){
		newDataObj = JSON.parse(JSON.stringify(dataObj));
		let k = "", d = ".", l = "[", r = "]";
		name = name.replace(/\s+/g, k) + d;
		let tstr = k;
		for (let i = 0; i < name.length; i++) {
		  let theChar = name.charAt(i);
		  if (theChar != d && theChar != l && theChar != r) {
				tstr += theChar;
		  } else if(newDataObj){
		    if (tstr != k) newDataObj = newDataObj[tstr];
		    tstr = k;
		  }
		}
	}
	if(typeof newDataObj === "undefined" && pubfn.isNotNull(defaultValue)) newDataObj = defaultValue;
	return newDataObj;
};
/**
 * 自动根据字符串路径设置对象中的值 支持.和[]
 * @params	{Object} dataObj 数据源
 * @params	{String} name 支持a.b 和 a[b]
 * @params	{String} value 值
 * vk.pubfn.setData(dataObj, name, value);
 */
pubfn.setData = function (dataObj, name, value) {
	// 通过正则表达式  查找路径数据
	let dataValue;
	if(typeof value === "object"){
		dataValue = pubfn.copyObject(value);
	}else{
		dataValue = value;
	}
	let regExp = new RegExp("([\\w$]+)|\\[(:\\d)\\]","g");
	const patten = name.match(regExp);
	// 遍历路径  逐级查找  最后一级用于直接赋值
	for (let i = 0; i < patten.length - 1; i++) {
		let keyName = patten[i];
		if(typeof dataObj[keyName] !== "object") dataObj[keyName] = {};
		dataObj = dataObj[keyName];
	}
	// 最后一级
	dataObj[patten[patten.length - 1]] = dataValue;
};

/**
 * 检测参数是否为空 其中 undefined、null、{}、[]、"" 均为空值  true 空值  false 有值
 * vk.pubfn.isNull(value);
 */
pubfn.isNull = function (value) {
	let key = false;
	if(
		 typeof value == "undefined"
	|| Object.prototype.toString.call(value) == "[object Null]"
	|| JSON.stringify(value) == "{}"
	|| JSON.stringify(value) == "[]"
	|| value === ""
	|| JSON.stringify(value) === undefined
	){
		key = true;
	}
	return key;
};
/**
 * 检测参数是否不为空 结果与 vk.pubfn.isNull 相反
 * vk.pubfn.isNotNull(value);
 */
pubfn.isNotNull = function (value) {
	return !pubfn.isNull(value);
};
/**
 * 检测所有参数 - 是否至少有一个为空
 * vk.pubfn.isNullOne(value1,value2,value3);
 */
pubfn.isNullOne = function (...strS) {
	let key = false;
	for (let i = 0; i < strS.length; i++) {
		let str = strS[i];
		if(pubfn.isNull(str)){
			key = true;
			break;
		}
	}

	return key;
};
/**
 * 检测整个对象是否没有一个属性是空值,如果有空值,则返回首个是空值的属性名
 let nullKey = vk.pubfn.isNullOneByObject({ value1,value2,value3 });
 if(nullKey) return { code : -1, msg : `${nullKey}不能为空` };
 */
pubfn.isNullOneByObject = function (obj) {
	let key;
	for(let name in obj){
		let val = obj[name];
		if(pubfn.isNull(val)){
			key = name;
			break;
		}
	}
	return key;
};
/**
 * 检测所有参数 - 是否全部为空
 * vk.pubfn.isNullAll(value1,value2,value3);
 */
pubfn.isNullAll = function (...strS) {
	let key = true;
	for (let i = 0; i < strS.length; i++) {
		let str = strS[i];
		if(pubfn.isNotNull(str)){
			key = false;
			break;
		}
	}
	return key;
};

/**
 * 检测所有参数 - 是否全部都不为空
 * vk.pubfn.isNotNullAll(value1,value2,value3);
 */
pubfn.isNotNullAll = function (...strS) {
	return !pubfn.isNullOne(strS);
};
/**
 * 获取对象数组中的某一个item,根据指定的键名和键值
 * @description 主要用于在一个对象数组中快速获取 _id = 1 的对象
 * @params	{Array} list 数据源
 * @params	{String} key 键名(不可为空)
 * @params	{String} value 键值 (不可为空)
 * vk.pubfn.getListItem(list, key, value);
 */
pubfn.getListItem = function (list,key,value) {
	let item;
	for(let i=0; i<list.length; i++){
		if(pubfn.isNotNull(value) && list[i][key] === value){
			item = list[i];
			break;
		}
	}
	return item;
};
/**
 * 获取对象数组中某个元素的index,根据指定的键名和键值
 * @description 主要用于在一个对象数组中快速获取 _id = 1 的index
 * @params	{Array} list 数据源
 * @params	{String} key 键名
 * @params	{String} value 键值
 * vk.pubfn.getListIndex(list, key, value);
 */
pubfn.getListIndex = function (list,key,value) {
	let index = -1;
	for(let i=0; i<list.length; i++){
		if(pubfn.isNotNull(value) && list[i][key] === value){
			index = i;
			break;
		}
	}
	return index;
};
/**
 * 获取对象数组中某个元素的index,根据指定的键名和键值
 * @description 主要用于在一个对象数组中快速获取 _id = 1 的index
 * @params	{Array} list 数据源
 * @params	{String} key 键名
 * @params	{String} value 键值
 * vk.pubfn.getListItemIndex(list, key, value);
 */
pubfn.getListItemIndex = function (list,key,value) {
	let obj = {};
	let item;
	let index = -1;
	for(let i=0; i<list.length; i++){
		if(pubfn.isNotNull(value) && list[i][key] === value){
			index = i;
			item = list[i];
			break;
		}
	}
	obj = {
		item, index
	}
	return obj;
};
/**
 * 数组转对象 - 将对象数组转成json
 * 如[{"_id":"001","name":"name1","sex":1},{"_id":"002","name":"name2","sex":2}]
 * 转成
 * {"001",{"_id":"001","name":"name1","sex":1},"002":{"_id":"002","name":"name2","sex":2}}
 * vk.pubfn.arrayToJson(list, "_id");
 */
pubfn.arrayToJson = function (list, key) {
	let json = {};
	for(let i in list){
		let item = list[i];
		json[item[key]] = item;
	}
	return json;
};
pubfn.listToJson = pubfn.arrayToJson;

/**
 * 从数组中提取指定字段形式成为新的数组
 * 如[{"_id":"001","name":"name1","sex":1},{"_id":"002","name":"name2","sex":2}]
 * 提取_id字段转成
 * ["001","002"]
 * let idArr = vk.pubfn.arrayObjectGetArray(list, "_id");
 */
pubfn.arrayObjectGetArray = function (list, key) {
	return list.map(obj => {return obj[key]});
};

/**
 * 产生指定位数的随机数(支持任意字符,默认纯数字)
 * @params	{Number} length 数据源
 * @params	{String} str 指定的字符串中随机范围
 * vk.pubfn.random(6);
 * vk.pubfn.random(6, "abcdefghijklmnopqrstuvwxyz0123456789");
 */
pubfn.random = function (length, str) {
	let s = "";
	let list = "123456789";
	//0123456789QWERTYUIPASDFGHJKLZXCVBNM
	if(pubfn.isNotNull(str)){
		if(str == "a-z,0-9"){
			str="abcdefghijklmnopqrstuvwxyz0123456789";
		}else if(str == "A-Z,0-9"){
			str="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
		}else if(str == "a-z,A-Z,0-9" || str == "A-Z,a-z,0-9"){
			str="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
		}
		list = str;
	}
	for (let i = 0; i < length; i++) {
		let code = list[Math.floor(Math.random() * list.length)];
		s += code;
	}
	return s;
};

/**
 * 将字符串id转化为指定位数的纯数字字符串id(会重复)
 * vk.pubfn.stringIdToNumberId(uid,8);
 */
pubfn.stringIdToNumberId = function (str, length) {
	let s = "";
	let list = "0123456789";
	for (let i = 0; i < length; i++) {
		if(str.length > i){
			let index = str[i].charCodeAt() % 10;
			s += list[index];
		}else{
			s = "0" + s;
		}
	}
	return s;
};

/**
 * 将手机号,账号等隐藏中间字段
 * @params {String} str   需要转换的字符串
 * @params {Number} first 前面显示的字符数量
 * @params {Number} last  后面显示的字符数量
 * vk.pubfn.hidden(str, first, last);
 */
pubfn.hidden = function (str, first, last) {
	let len = str.length - first - last;
	let xing = '';
	for (let i=0; i<len; i++) {
		xing += '*';
	}
	return str.substring(0,first) + xing + str.substring(str.length - last);
};
/**
 * 判断常量数组A是否至少有一个元素在常量数组B中存在(两数组有交集)
 * @params {Array} arr1 数组A
 * @params {Array} arr2 数组B
 * vk.pubfn.checkArrayIntersection(arr1, arr2);
 */
pubfn.checkArrayIntersection = function (arr1 = [], arr2 = []) {
	let checkKey = false;
	for(let i = 0; i < arr2.length; i++){
		if(arr1.indexOf(arr2[i]) > -1){
			checkKey = true;
		}
	}
	return checkKey;
};

/**
 * 检测数据源是否满足表达式规则
 * @params {Object} data 数据源
 * @params {String} expText 表达式文本
 * vk.pubfn.checkDataExpText(data, expText);
 */
pubfn.checkDataExpText = function (data={},expText) {
	expText = expText.replace(new RegExp("\\s","g"),"");
	//console.log("expText:",expText);
	let orArr = expText.split("||");
	//console.log("orArr",orArr);
	let checkKey = false;
	for(let index1=0; index1<orArr.length; index1++){
	  let orItem = orArr[index1];
		let andArr = orItem.split("&&");
		//console.log("andArr",andArr);
		let itemKey = true;
		for(let index2=0; index2<andArr.length; index2++){
		  let andItem = andArr[index2];
			//console.log("andItem",andItem);
			if(andItem.indexOf("!=")>-1){
				let andItemArr = andItem.split("!=");
				let key = andItemArr[0];
				let value = andItemArr[1];
				itemKey = data[key] != value ? true : false;
			}else{
				let andItemArr = andItem.split("=");
				let key = andItemArr[0];
				let value = andItemArr[1];
				itemKey = data[key].toString() == value ? true : false;
				//console.log("key:",key,"value:",value,"data[key]",data[key].toString(),"itemKey:",itemKey);
			}
			if(!itemKey){
				break;
			}
		}
		if(itemKey){
			checkKey = true;
			break;
		}
	}
	return checkKey;
};


/**
 * 计算运费
 *  @params {Object} freightsItem 运费模板
 {
   first_weight             Number 首重 单位KG,
   first_weight_price       Number 首重 首重价格
   continuous_weight        Number 续重 单位KG
   continuous_weight_price  Number 续重价格
   max_weight               Number 重量达到此值时,会多计算首重的价格,并少一次续重的价格 倍乘(相当于拆分多个包裹)
 }
 * @params {Number} weight 运费重量
 * vk.pubfn.calcFreights(freightsItem, weight);
 */
pubfn.calcFreights = function (freightsItem, weight) {
	let {
		first_weight,
		first_weight_price,
		continuous_weight,
		continuous_weight_price,
		max_weight = 100000000
	} = freightsItem;
	let money = 0; // 运费
	let packagesNum = 0; // 包裹数量
	let packagesSurplusWeight = max_weight; // 包裹剩余重量
	let first_weight_key = false;// 是否已减过首重
	let continuous_weight_count = 0;// 续重次数
	let logArr = [];
	let logRun = false;
	while (weight > 0){
		if(!first_weight_key){
			// 首重
			first_weight_key = true;
			packagesNum++;
			packagesSurplusWeight = max_weight; // 还原包裹剩余重量
			weight-=first_weight;
			packagesSurplusWeight-=first_weight;
		}else{
			// 续重
			continuous_weight_count++;
			weight-=continuous_weight;
			packagesSurplusWeight-=continuous_weight;
		}
		if(logRun) logArr.push({
			"总重量剩余":weight,
			"当前包裹重量剩余":packagesSurplusWeight,
			"当前第几个包裹":packagesNum,
			"续重计算次数":continuous_weight_count
		});

		if(packagesSurplusWeight <= 0){
			// 需要增加一个新的包裹
			first_weight_key = false; 	// 新包裹设置没有减过首重
		}
	}
	if(logRun) console.log(JSON.stringify(logArr));
	money = packagesNum * first_weight_price + continuous_weight_price * continuous_weight_count;
	return money;
};

/**
 * 从一个对象中取多个属性,并生成一个全新的对象
 * @params {Object} obj 对象
 * @params {Array<String>} keys 键名数组
 * vk.pubfn.getNewObject(obj, keys);
 */
pubfn.getNewObject = function(obj, keys) {
	let selectedObj = pubfn.copyObject(obj);
	let newObject = {};
	if(keys && keys.length > 0){
		for(let i in keys){
			let key = keys[i];
			if(pubfn.isNotNull(selectedObj[key])){
				newObject[key] = selectedObj[key];
			}
		}
	}else{
		newObject = selectedObj;
	}
	return newObject;
};

/**
 * 对象删除指定的字段,返回新的对象
 * @params {Object} data  操作对象
 * @params {Array<String>} deleteKeys 需要删除的键名(数组形式)
 * vk.pubfn.deleteObjectKeys(data, deleteKeys);
 */
pubfn.deleteObjectKeys = function(data, deleteKeys = []){
	var newData = {};
	if (data) {
		for(let key in data){
			if(deleteKeys.indexOf(key) == -1){
				newData[key] = data[key];
			}
		}
	}
	return newData;
}

/**
 * 数组结构转树形结构
 * @params {Array} treeData  数据源
 * @params {Object} treeProps 树结构配置
 * { id:"_id", parent_id:"parent_id", children:"children",need_field:["_id","name"],deleteParentId:true }
 * vk.pubfn.arrayToTree(treeData, treeProps);
 */
pubfn.arrayToTree = pubfn.treeUtil.arrayToTree;
/**
 * 树形结构转数组结构
 * @params {Array} treeData  数据源
 * @params {Object} treeProps 树结构配置
 * { id:"_id", parent_id:"parent_id", children:"children", deleteChildren:true }
 * vk.pubfn.treeToArray(treeData, treeProps);
 */
pubfn.treeToArray = pubfn.treeUtil.treeToArray;

/**
 * 通配符匹配
 * @params {String} text  被匹配的文本
 * @params {String} expText 通配符规则
 * vk.pubfn.wildcardTestOne(text, expText);
 */
pubfn.wildcardTestOne = function(text, expText){
	if(!expText) return false;
	let regExpText = expText.replace(new RegExp("\\*"),"(.*)");
	let startText = expText.indexOf("*") !== 0 ? "^" : "";
	let endText = expText[expText.length-1] !== "*" ? "$" : "";
	let regExp = new RegExp(startText+regExpText+endText);
	return regExp.test(text);
};
/**
 * 通配符匹配 expText支持数组
 * @params {String} text  被匹配的文本
 * @params {String | Array<String>} expText 通配符规则
 * vk.pubfn.wildcardTest(text, expText);
 */
pubfn.wildcardTest = function(text, expText){
	let matchNum = 0; // 被匹配的次数
	let regExp1 = new RegExp("\\*");
	if(typeof expText === "string"){
		// 字符串
		if(pubfn.wildcardTestOne(text, expText)){
			matchNum++;
		}
	}else if(typeof expText === "object"){
		// 数组
		for(let i=0; i<expText.length; i++){
		  let expTextItem = expText[i];
			if(pubfn.wildcardTestOne(text, expTextItem)){
				matchNum++;
			}
		}
	}
	return matchNum;
}

/**
 * 正则匹配
 * @params {String} text  被匹配的文本
 * @params {String} expText 正则表达式规则
 * vk.pubfn.regExpTestOne(text, expText);
 */
pubfn.regExpTestOne = function(text, expText){
	if(!expText) return false;
	let regExp = new RegExp(expText);
	return regExp.test(text);
};

/**
 * 正则匹配
 * @params {String} text  被匹配的文本
 * @params {String || Array<String>} wildcardExp 正则表达式规则
 * vk.pubfn.regExpTest(text, regExp);
 */
pubfn.regExpTest = function(text, expText){
	let matchNum = 0; // 被匹配的次数
	if(typeof expText === "string"){
		// 字符串
		if(pubfn.regExpTestOne(text, expText)){
			matchNum++;
		}
	}else if(typeof expText === "object"){
		// 数组
		for(let i=0; i<expText.length; i++){
		  let expTextItem = expText[i];
			if(pubfn.regExpTestOne(text, expTextItem)){
				matchNum++;
			}
		}
	}
	return matchNum;
}

/**
 * 产生订单号，不依赖数据库，高并发时性能高（理论上会重复，但概率非常非常低）
 * @params {String} prefix 前缀
 * vk.pubfn.createOrderNo();
 */
pubfn.createOrderNo = function(prefix=""){
	// 获取当前时间字符串格式如20200803093000123
	let fullTime = pubfn.getFullTime(new Date(), 1);
	fullTime = fullTime.substring(2);
	return prefix + fullTime + pubfn.random(10);
};

// 前端专属开始 -----------------------------------------------------------
/**
 * 将时间显示成1秒前、1天前
 * @description 主要用于 文章最后回复时间: 1分钟前
 * @params {String || Number} 	startTime	需要计算的时间 如文章最后回复时间
 * vk.pubfn.dateDiff(startTime);
 */
pubfn.dateDiff = function(startTime) {
	if (!startTime){
		return "";
	}
	if(typeof startTime == "number"){
		startTime = new Date(startTime);
		startTime = pubfn.getFullTime(startTime);
	}if(typeof startTime == "string"){
		startTime = startTime.replace("T", " ");
		startTime = startTime;
		startTime = new Date(startTime.replace(/-/g, "/"));//将-转化为/，使用new Date
	}
	var endTime = new Date();//获取当前时间
	var nd = 1000 * 24 * 60 * 60;//一天的毫秒数
	var nh = 1000 * 60 * 60;//一小时的毫秒数
	var nm = 1000 * 60;//一分钟的毫秒数
	var ns = 1000;//一秒钟的毫秒数long diff;try {
	var diff = endTime.getTime() - startTime.getTime();
	var day = Math.floor(diff / nd);//计算差多少天
	var hour = Math.floor(diff % nd / nh);//计算差多少小时
	var min = Math.floor(diff % nd % nh / nm);//计算差多少分钟
	var sec = Math.round(diff % nd % nh % nm / ns);//计算差多少秒//输出结果
	var showStr = "1 秒前";
	if (day > 0) {
		showStr = day + "天前";
	} else if (hour > 0) {
		showStr = hour + "小时前";
	} else if (min > 0) {
		showStr = min + "分钟前";
	} else if (sec > 0) {
		showStr = sec + "秒前";
	}
	return showStr;
}
/**
 * 将时间显示成1秒、1天
 * @description 主要用于 到期时间剩余 : 3天 这样的场景
 * @params {String || Number} endTime	需要计算的时间 如到期时间
 * vk.pubfn.dateDiff2(endTime);
 */
pubfn.dateDiff2 = function(startTime) {
	if (!startTime){
		return "";
	}
	if(typeof startTime == "number"){
		startTime = new Date(startTime);
		startTime = pubfn.getFullTime(startTime);
	}if(typeof startTime == "string"){
		startTime = startTime.replace("T", " ");
		startTime = startTime;
		startTime = new Date(startTime.replace(/-/g, "/"));//将-转化为/，使用new Date
	}
	var endTime = new Date();//获取当前时间
	var nd = 1000 * 24 * 60 * 60;//一天的毫秒数
	var nh = 1000 * 60 * 60;//一小时的毫秒数
	var nm = 1000 * 60;//一分钟的毫秒数
	var ns = 1000;//一秒钟的毫秒数long diff;try {
	var diff = startTime.getTime() - endTime.getTime();
	var day = Math.floor(diff / nd);
	var hour = Math.floor(diff % nd / nh);
	var min = Math.floor(diff % nd % nh / nm);
	var sec = Math.round(diff % nd % nh % nm / ns);
	var showStr = "1秒";
	if (day > 0) {
		showStr = day + "天";
	} else if (hour > 0) {
		showStr = hour + "小时";
	} else if (min > 0) {
		showStr = min + "分钟";
	} else if (sec > 0) {
		showStr = sec + "秒";
	}
	return showStr;
};
/**
 * 将大数字转中文
 * @description 主要用于展示浏览量等不需要非常精确显示的场景
 * 如:
 * 3210 -> 3千
 * 31210 -> 3万
 * 1523412 -> 1百万
 * 15234120 ->1千万
 * @params {Number} n 需要转换的数字
 * vk.pubfn.numStr(n);
 */
pubfn.numStr = function (n){
	if(typeof n == "string"){
		n = parseFloat(n);
	}
	var str = n;
	if(n < 1000){
		str = n;
	}else if(n < 10000){
		var n1 = Math.floor(n/100);
		str = n1/10+"千"
	}else if(n < 1000000){
		var n1 = Math.floor(n/1000);
		str = n1/10+"万"
	}else if(n < 10000000){
		var n1 = Math.floor(n/1000000);
		str = n1+"百万"
	}else if(n < 100000000){
		var n1 = Math.floor(n/10000000);
		str = n1+"千万"
	}else if(n >= 100000000){
		var n1 = Math.floor(n/10000000);
		str = n1/10+"亿"
	}
	return str;
};
/**
 * 金额显示过滤器（已分为单位，将100 转成 1）
 * @params {Number} money 金额
 * vk.pubfn.priceFilter(money);
 */
pubfn.priceFilter = function (money,nullValue = ""){
	if(pubfn.isNull(money)){
		return nullValue;
	}
	if(typeof money == "string"){
		money = parseFloat(money);
	}
	return (money / 100).toFixed(2);
};
// 金额过滤器 - 只显示小数点左边
pubfn.priceLeftFilter = function (n){
	let s = "";
	if(n){
		s = pubfn.priceFilter(n).split(".")[0];
	}
	return s;
};
// 金额过滤器 - 只显示小数点右边
pubfn.priceRightFilter = function (n){
	let s = "";
	if(n){
		s = pubfn.priceFilter(n).split(".")[1];
	}
	return s;
};
/**
 * 百分比过滤器 将0.01显示成1% 1 显示成 100%
 * @params {Number} value 值
 * vk.pubfn.priceFilter(money);
 */
pubfn.percentageFilter = function (value, needShowSymbol = true, nullValue = ""){
	if(pubfn.isNull(value)){
		return nullValue;
	}
	if(typeof value == "string"){
		value = parseFloat(value);
	}
	value = parseFloat((value * 100).toFixed(2));
	if(needShowSymbol){
		value += "%";
	}
	return value;
};
/**
 * 将字符串格式的时间转为时间戳
 * @params {String} 	dateString		格式为:2020-08-08 12:12:12
 */
pubfn.toTimeLong = function (dateString){
	if(!dateString){
		return "";
	}
	dateString = dateString.substring(0, 19);
	dateString = dateString.replace(new RegExp(/-/,"g"), '/');
	let time = new Date(dateString).getTime();
	if(isNaN(time)){
		time = "";
	}
	return time;
};

/**
 * 手机端长列表分页加载数据 2.0版本
 * @params {Vue页面对象} 	that						页面数据对象this
 * @params {String} 			url							请求地址(云函数路径)
 * @params {String} 			listName				后端返回的list数组的字段名称,默认rows(二选一即可)
 * @params {String} 			listKey					后端返回的list数组的字段名称,默认rows(二选一即可)
 * @params {Object} 			data						额外数据
 * @params {function} 		dataPreprocess	数据预处理函数
 *
 * 代码示例
	vk.pubfn.getListData2({
		that : this,
		url : "template/db_api/pub/select",
		data : {
			a : 1
		},
		dataPreprocess : function(list){
			return list;
		}
	});
 */
pubfn.getListData2 = function (obj = {}){
	let { 
		that, 
		listName, 
		listKey = "rows",
		url, 
		dataPreprocess, 
		idKeyName = "_id"
	} = obj;
	if(listName) listKey = listName;
	let { vk, queryForm1 } = that;
	// 标记为请求中
	that.loading = true;
	let hasMore = true;
	if (queryForm1.pagination.pageIndex === 1) {
		that.firstLoading = true;
	}
	vk.callFunction({
		url: url,
		data: queryForm1,
		success: function(data) {
			let list = data[listKey] || [];
			// 数据预处理
			if (typeof dataPreprocess == "function") {
				list = dataPreprocess(list);
			}
			if (queryForm1.pagination.pageIndex > 1) {
				// 翻页
				if (list.length == 0) {
					// 无数据时
					hasMore = false;
					queryForm1.pagination.pageIndex--;
					list = that.data.list;
				} else {
					// 有数据时
					if (list.length < queryForm1.pagination.pageSize) {
						hasMore = false;
					}
					// 数据合并
					list = vk.pubfn.arr_concat(that.data.list, list, idKeyName);
				}
			} else if (queryForm1.pagination.pageIndex == 1) {
				// 第一页
				if (list.length < queryForm1.pagination.pageSize) {
					hasMore = false;
				}
				if (list.length == 0) {
					that.state.isEmpty = true;
				} else {
					that.state.isEmpty = false;
				}
			}
			// 如果后端返回了hasMore,则使用后端的hasMore值
			if (typeof data.hasMore !== "undefined") {
				hasMore = data.hasMore;
			}
			data = {
				total: data.total,
				list: list,
				hasMore: hasMore,
				pageIndex: data.pageIndex,
				pageSize: data.pageSize
			};
			that.state.loadmore = hasMore ? "loadmore" : "nomore"; // 更新状态
			that.data = vk.pubfn.objectAssign(that.data, data); // 更新数据
			if (typeof obj.success == "function") obj.success(data);
		},
		fail: function(err) {
			console.error(err);
			that.state.loadmore = "loadmore";
			if (queryForm1.pagination.pageIndex > 1) {
				queryForm1.pagination.pageIndex--;
			}
			if (typeof obj.fail == "function") obj.fail(data);
		},
		complete: function(res) {
			that.loading = false;
			if (queryForm1.pagination.pageIndex === 1) {
				that.state.firstLoading = false;
			}
			if (typeof obj.complete == "function") obj.complete(res);
		}
	});
};

/**
 * 手机端长列表分页加载数据
 * @params {Vue页面对象} 	that						页面数据对象this
 * @params {String} 			url							请求地址(云函数路径)
 * @params {String} 			listName				后端返回的list数组的字段名称,默认rows
 * @params {String} 			listKey					后端返回的list数组的字段名称,默认rows
 * @params {Object} 			data						额外数据
 * @params {function} 		dataPreprocess	数据预处理函数
 *
 * 代码示例
	vk.pubfn.getListData({
		that : this,
		url : "template/db_api/pub/select",
		listKey : "rows",
		data : {
			a : 1
		},
		dataPreprocess : function(list){
			return list;
		}
	});
 */
pubfn.getListData = function (obj = {}){
	var { 
		that, 
		listName, 
		listKey = "rows", 
		url, 
		dataPreprocess, 
		loading 
	} = obj;
	if(listName) listKey = listName;
	var { form1 = {}, data = {} } = that;
	var { pageKey = true } = data;
	var vk = that.vk;
	if(!form1.pageIndex) form1.pageIndex = 1;
	if(!form1.pageSize) form1.pageSize = 20;
	var addTime = form1.addTime;
	var endTime = form1.endTime;
	if(endTime) endTime+=" 23:59:59";
	if(!pageKey && form1.pageIndex > 1){
		form1.pageIndex--;
		return false;
	}
	
	if(addTime) form1.addTimeLong = pubfn.toTimeLong(addTime);
	if(endTime) form1.endTimeLong = pubfn.toTimeLong(endTime);
	if(obj.data && JSON.stringify(obj.data) != "{}"){
		pubfn.objectAssign(form1,obj.data);
	}
	let title = obj.title;
	if(typeof obj.title == "undefined" && !loading){
		title = form1.pageIndex == 1 ? "请求中..." : "";
	}
	vk.callFunction({
		url: url,
		data: form1,
		title: title,
		loading:loading,
		success : function(data){
			var list = data[listKey] || [];
			// 数据预处理
			if(typeof dataPreprocess == "function"){
				list = dataPreprocess(list);
			}
			if(form1.pageIndex > 1){
				// 翻页
				if(list.length == 0){
					// 无数据时
					pageKey = false;
					form1.pageIndex--;
					list = that.data.list;
				}else{
					// 有数据时
					if(list.length < form1.pageSize){
						pageKey = false;
					}
					let oldList = that.data.list;
					// 数据合并
					list = pubfn.arr_concat(oldList,list,"_id");
				}
			}else if(form1.pageIndex == 1){
				if(list.length < form1.pageSize){
					pageKey = false;
				}
			}
			//console.log(pageKey,list.length,form1.pageSize);
			data = {
				total : data.total,
				list : list,
				pageKey : pageKey,
				loadmore : pageKey ? "loadmore" : "nomore" // 更新状态
			};
			that.data = pubfn.objectAssign(that.data,data);// 更新数据
			if(typeof obj.success == "function") obj.success(data);
		},
		fail : function(err){
			console.error(err);
			if(form1.pageIndex > 1){form1.pageIndex--;}
			if(typeof obj.fail == "function") obj.fail(data);
		},
		complete : function(res){
			if(typeof obj.complete == "function") obj.complete(res);
		},
	});
};

/**
 * 动态组件数据获取
 * @description 主要用于动态组件的数据获取
 * @params {Vue页面对象} that 页面数据对象this
 * @params {String}     ids  动态数据组件的ID
 *
 * 代码示例
 * 如:放置一个动态数据的 公告组件 和 一个轮播图组件
 * view  核心:自定义组件接收一个 Object 类型的属性 datas
  <vk-u-notice-bar :datas='componentsDynamic["notice-bar-01"]'></vk-u-notice-bar>
  <vk-u-swiper :datas='componentsDynamic["index-swiper-01"]' :custom-datas='{
    "height":600,
  }'></vk-u-swiper>
  在页面数据变量中新增 componentsDynamic
  data() {
    return {
      // 动态组件数据集合
      componentsDynamic:{}
    }
  }
  在页面初始化方法中执行下面的函数
  this.vk.pubfn.getComponentsDynamicData({
    that : this,
    ids : ["notice-bar-01","index-swiper-01"]
  });
 */
pubfn.getComponentsDynamicData = function (obj = {}){
	var {
		that,
		keyName = "componentsDynamic",
		title,
		url = "plugs/components_dynamic/client/pub/getComponentsDynamicData",
		ids
	} = obj;
	var vk = that.vk;
	let form1 = {
		ids : ids
	};
	if(obj.data && JSON.stringify(obj.data) != "{}"){
		pubfn.objectAssign(form1, obj.data);
	}
	// 读取缓存开始-----------------------------------------------------------
	let cacheKey = "pub-componentsDynamic";
	let cacheData = uni.getStorageSync(cacheKey) || {};
	let cacheDataKey = JSON.stringify(ids);
	if(cacheData[cacheDataKey]){
		// 渲染本地数据
		that[keyName] = cacheData[cacheDataKey];
	}
	// 读取缓存结束-----------------------------------------------------------
	vk.callFunction({
		url: url,
		data: form1,
		title: title,
		success : function(data){
			if(JSON.stringify(cacheData[cacheDataKey]) !== JSON.stringify(data.componentsDynamic)){
				// 渲染服务器数据
				that[keyName] = data.componentsDynamic;
				// 同时将组件数据进行缓存
				cacheData[cacheDataKey] = data.componentsDynamic;
				uni.setStorageSync(cacheKey, cacheData);
			}
			if(typeof obj.success == "function") obj.success(data);
		},
		fail : function(err){
			console.error(err);
			if(typeof obj.fail == "function") obj.fail(data);
		},
		complete : function(){
			if(typeof obj.complete == "function") obj.complete(data);
		},
	});
};

/**
 * 将../../ 形式的页面相对路径 转成 页面绝对路径
 * @params {String} url 需要转换的url
 * vk.pubfn.getPageFullPath(url);
 */
pubfn.getPageFullPath = function(url) {
	let fullPath = url;
	if(fullPath.indexOf("/") !== 0){
		if(fullPath.indexOf("./") === 0){
			fullPath = "."+fullPath;
		}
		let urlSplit = fullPath.split("../");
		// 向上目录级数,0:根目录 1:向上1级
		let level = urlSplit.length;
		// 尾部路径
		let urlEnd = urlSplit[level-1];
		// 获取当前页面的页面全路径
		let pages = getCurrentPages();
		let currentPage = pages[pages.length - 1];
		let currentPagePath = currentPage.route;
		// 分割成目录,最后一段是页面名称
		let urlArr = currentPagePath.split("/");
		let urlSplicing = "";
		// 开始拼接
		for (let i = 0; i < urlArr.length-level; i++) {
			urlSplicing += urlArr[i]+"/";
		}
		// 完整页面路径
		fullPath = urlSplicing + urlEnd;
		if(fullPath.indexOf("/") != 0){
			fullPath = "/"+fullPath;
		}
	}
	return fullPath;
};
/**
 * 获取平台信息
 * let platform = vk.pubfn.getPlatform();
 */
pubfn.getPlatform = function() {
	let platform;
	// #ifdef APP-PLUS || APP-NVUE || APP-PLUS-NVUE
	platform = "app-plus";
	// #endif
	// #ifdef H5
	platform = "h5";
	// #endif
	// #ifdef MP-WEIXIN
	platform = "mp-weixin";
	// #endif
	// #ifdef MP-ALIPAY
	platform = "mp-alipay";
	// #endif
	// #ifdef MP-BAIDU
	platform = "mp-baidu";
	// #endif
	// #ifdef MP-TOUTIAO
	platform = "mp-toutiao";
	// #endif
	// #ifdef MP-QQ
	platform = "mp-qq";
	// #endif
	// #ifdef MP-360
	platform = "mp-360";
	// #endif
	return platform;
};
/**
 * 获取当前页面实例
 * 返回数据
 * fullPath 当前打开页面的完整路径(带页面参数)
 * options  当前打开页面的参数
 * route    当前打开页面的路径(不含参数)
 * $vm      当前打开页面的vue实例
 * vk.pubfn.getCurrentPage();
 */
pubfn.getCurrentPage = function() {
	let res = {};
	let pages = getCurrentPages();
	let page = pages[pages.length - 1];
	res.fullPath = page.$page.fullPath;
	res.options = page.options;
	res.route = page.route;
	res.$vm = page.$vm;
	return res;
};
/**
 * 获取当前页面路由
 * vk.pubfn.getCurrentPageRoute();
 */
pubfn.getCurrentPageRoute = function() {
	let pages = getCurrentPages();
	let page = pages[pages.length - 1];
	return page.route;
};
/**
 * 文件转base64
vk.pubfn.fileToBase64({
	file:res.tempFiles[0],
	success:function(base64){

	}
});
 */
pubfn.fileToBase64 = function(obj={}) {
	let { file } = obj;
	return new Promise(function(resolve, reject) {
		// #ifdef H5
		let reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = function(res){
			let base64 = this.result;
			if(base64.indexOf(";base64,") == -1){
				base64 = "data:image/jpeg;base64," + base64;
			}
			if(obj.success) obj.success(base64);
			if(obj.complete) obj.complete(base64);
			resolve(base64);
		};
		reader.onerror = function(err){
			if(obj.fail) obj.fail(err);
			if(obj.complete) obj.complete(err);
			reject(err);
		};
		// #endif
		// #ifndef H5
		uni.getFileSystemManager().readFile({
			filePath:file.path,
			encoding:"base64",
			success:function(res){
				let base64 = res.data;
				if(base64.indexOf(";base64,") == -1){
					base64 = "data:image/jpeg;base64," + base64;
				}
				if(obj.success) obj.success(base64);
				resolve(base64);
			},
			fail:function(err){
				if(obj.fail) obj.fail(err);
				reject(err);
			},
			complete:obj.complete
		});
		// let base64 = uni.getFileSystemManager().readFileSync(file.path, 'base64');
		// if(obj.success) obj.success(base64);
		// if(obj.complete) obj.complete(base64);
		// resolve(base64);
		// #endif
	});
};

/**
 * base64转文件
vk.pubfn.base64ToFile({
	base64:base64,
	success:function(file){

	}
});
 */
pubfn.base64ToFile = function(obj={}) {
	let { 
		base64="",
		filePath =  new Date().getTime() + '.png'
	} = obj;
	let index = base64.indexOf("base64,");
	let base64Data = base64;
	if(index>-1){
		base64Data = base64.substring(base64.indexOf("base64,")+7);
	}
	let savePath;
	return new Promise(function(resolve, reject) {
		// #ifndef H5
		savePath = wx.env.USER_DATA_PATH + '/' +  filePath;
		let fs = uni.getFileSystemManager();
		fs.writeFile({
			filePath:savePath,
			data: base64Data,
			encoding:"base64",
			success:function(res){
				let file = {
					path : savePath,
					lastModifiedDate :  new Date(),
					name : filePath
				};
				if(obj.success) obj.success(file);
				resolve(file);
			},
			fail:function(res){
				if(obj.fail) obj.fail(res);
				reject(res);
			},
			complete:obj.complete
		});
		// #endif
		// #ifdef H5
		savePath = filePath;
		let blob = pubfn.base64toBlob(base64);
		let file = pubfn.blobToFile(blob, savePath);
		if(obj.success) obj.success(file);
		if(obj.complete) obj.complete(file);
		resolve(file);
		// #endif
	});
};
/**
 * 将base64转换为blob （H5独有）
 vk.pubfn.base64toBlob(base64);
 */
pubfn.base64toBlob = function(base64) {
	let arr = base64.split(',');
	let	mime = arr[0].match(/:(.*?);/)[1];
	let	bstr = atob(arr[1]);
	let	n = bstr.length;
	let	u8arr = new Uint8Array(n);
	while (n--) {
		u8arr[n] = bstr.charCodeAt(n);
	}
	return new Blob([u8arr], { type: mime });
};
/**
 * //将blob转换为file
 vk.pubfn.blobToFile(base64);
 */
pubfn.blobToFile = function(blob, fileName) {
	blob.lastModifiedDate = new Date();
	blob.name = fileName;
	blob.path = URL.createObjectURL(blob);
	return blob;
};

/**
 * 小程序订阅消息 前端无需再写 #ifdef MP-WEIXIN
 vk.pubfn.requestSubscribeMessage({
	 tmplIds: ['NcspDBQpH6CGHos3mMADrrQpEv2gHmtfOPa5KTLs92E']
 });
 */
pubfn.requestSubscribeMessage = function(obj) {
	// #ifdef MP-WEIXIN
	return uni.requestSubscribeMessage(obj);
	// #endif
};

// 前端专属结束 -----------------------------------------------------------
module.exports = pubfn;
