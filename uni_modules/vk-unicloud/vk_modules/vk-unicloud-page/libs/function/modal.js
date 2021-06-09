/**
 * 函数 - 弹窗
 */
export default {
	/**
	vk.alert("内容");
	vk.alert("内容","提示","好的",function(){

	});
	 */
	alert:function (a,b,c,d) {
		var self = this;
		//var config = getApp().globalData.config;
		let title = "提示";
		if(!a) a = " ";
	  let nr = a;
	  let btnName = "确定";
	  let fn;
		if (typeof d === 'function'){
			title = b;
			btnName = c;
			fn = d;
		} else if (typeof c === 'function') {
			title = b;
			fn = c;
		} else if (typeof b === 'function') {
			fn = b;
		} else if (b != undefined) {
			title = b;
			if (c != undefined){
				btnName = c;
			}
		}
		if (typeof nr === 'number'){
			nr = nr+"";
		} else if (typeof nr === 'object') {
			nr = JSON.stringify(nr)
		}
		uni.showModal({
			title: title,
			content: nr,
			showCancel: false,
			confirmText: btnName,
			//confirmColor: config.color.color_main,
			success: function () {
				if (typeof fn === 'function'){
					fn();
				}
			}
		});
	},
	/**
	vk.confirm("内容","提示","确定","取消",function(res){
		if(res.confirm){

		}
	});
	 */
	confirm:function (a, b, c,d,e) {
		//var config = getApp().globalData.config;
		let title = "提示";
		let nr = a;
		let btnName = "确定";
		let btnName2 = "取消";
		let fn;
		if (typeof e === 'function') {
			title = b;
			btnName = c;
			btnName2 = d;
			fn = e;
		} else if (typeof d === 'function') {
			title = b;
			btnName = c;
			fn = d;
		} else if (typeof c === 'function') {
			title = b;
			fn = c;
		} else if (typeof b === 'function') {
		    fn = b;
		} else if (b!=undefined) {
			title = b;
			if (c != undefined) {
				btnName = c;
			}
		}
		var dataJson = {
			title: title,
			content: nr,
			showCancel: true,
			confirmText: btnName,
			cancelText: btnName2,
			//confirmColor: config.color.color_main,
			cancelColor: "#999",
			success: function (res) {
				if (typeof fn === 'function') {
					fn(res);
				}
			},
			fail: function (res) {
				console.log(res);
			}
		};
		uni.showModal(dataJson);
	},
	toast:function(a, b, c, d, e){
		let title = a+"";
		let icon = "none";
		let image = "";
		let mask = false;
		let duration = 1500;
		let fn;
		if (typeof e === 'function') {
			mask = c;
			duration = d;
			fn = e;
		} else if (d) {
			if(typeof d === 'function'){
				fn = d;
			}else if(typeof d === 'number'){
				duration = d;
			}else if(typeof d === 'boolean'){
				mask = d;
			}
			if(typeof c === 'function'){
				fn = c;
			}else if(typeof c === 'number'){
				duration = c;
			}else if(typeof c === 'boolean'){
				mask = c;
			}
		} else if (c) {
			if(typeof c === 'function'){
				fn = c;
			}else if(typeof c === 'number'){
				duration = c;
			}else if(typeof c === 'boolean'){
				mask = c;
			}
		} else if (typeof b === 'function') {
		  fn = b;
		}
		if (b != undefined && typeof b !== 'function') {
			if (b == "ok") b = "success";
			if (b == "success" || b == "loading" || b == "none"){
				icon = b;
			}else{
				image = b;
			}
		}
		uni.showToast({
			title: title,
			icon: icon,
			image: image,
			mask: mask,
			duration: duration,
			success: function (res) {
				if (typeof fn === 'function') {
					fn(res);
				}
			}
		});
	},
	/**
	 * 操作菜单
	 vk.showActionSheet({
	 	title:"",
	 	list:["位置","@好友"],
	 	color:"rgb(0, 0, 0)",
	 	success:function(res){
	 		if(res.index==0){

	 		}else if(res.index==1){

	 		}
	 	}
	 });
	 */
	showActionSheet:function(object){
		var vk = getApp().globalData.vk;
		var title = object.title;
		var list = object.list;
		var color = object.color || "#000000";
		var success = object.success;
		var fail = object.fail;
		var complete = object.complete;
		uni.showActionSheet({
		  itemList: list,
			itemColor: color,
		  success: function (res) {
				var index = res.tapIndex;
				var text = list[index];
				var g = {index,text};
				console.log(g);
				if(typeof success == "function") success(g);
			},
			fail: function (res) {
				console.log(res);
				if(typeof fail == "function") fail(res);
			},
			complete: function (res) {
				if(typeof complete == "function") complete(res);
			}
		});
	},
	showLoading:function(obj){
		if(typeof obj == "string"){
			let title = obj;
			obj = {
				title : title,
				mask : true
			};
		}
		uni.showLoading(obj);
	},
	hideLoading:function(){
		uni.hideLoading();
	},
	// 设置当前页面的loading变量的值
	setLoading:function(loading = true){
		var pages = getCurrentPages();
		var page = pages[pages.length - 1];
		var that = page.$vm;
		that.loading = loading;
	},
}
