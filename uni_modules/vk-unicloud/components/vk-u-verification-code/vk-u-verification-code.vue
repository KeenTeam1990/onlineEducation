<template>
	<view class="vk-u-verification-code">
		<!-- 验证码倒计时开始 -->
		<u-verification-code 
			ref="uCode" 
			:seconds="seconds" 
			@end="end" 
			@start="start" 
			@change="codeChange"
			:start-text="startText"
			:change-text="changeText"
			:end-text="endText"
			:keep-running="keepRunning"
			:unique-key="uniqueKey"
		></u-verification-code>
		<view @tap="sendSmsCode">{{ tips }}</view>
		<!-- 验证码倒计时结束 -->
	</view>
</template>

<script>
	export default {
		name: "vk-u-verification-code",
		props: {
			seconds: {
				type: [Number,String],
				default () {
					return 10;
				}
			},
			mobile: {
				type: String
			},
			type: {
				type: String,
				default () {
					return "login";
				}
			},
			startText:{
				type: String,
				default () {
					return "获取验证码";
				}
			},
			changeText:{
				type: String,
				default () {
					return "X秒重新获取";
				}
			},
			endText:{
				type: String,
				default () {
					return "重新获取";
				}
			},
			keepRunning:{
				type: Boolean,
				default () {
					return false;
				}
			},
			uniqueKey:{
				type: String
			},
		},
		data:function () {
			// 组件创建时,进行数据初始化
			return {
				tips:"",
			}
		},
		//组件创建时,进行数据初始化
		created:function(){
			
		},
		computed: {
			
		},
		methods: {
			// 倒计时开始
			start() {
				this.$emit("start",{
					isStart : true
				});
			},
			// 倒计时结束
			end() {
				this.$emit("end",{
					isEnd : true
				});
			},
			// 倒计时进行时
			codeChange(text) {
				this.tips = text;
				this.$emit("codeChange",text);
			},
			// 发送短信验证码
			sendSmsCode() {
				var that = this;
				var vk = getApp().globalData.vk;
				var mobile = that.mobile;
				var type = that.type;
				if(!vk.pubfn.checkStr(mobile, 'mobile')){
					vk.toast('请输入正确的手机号码',"none");
					return;
				}
				if(that.$refs.uCode.canGetCode) {
					vk.userCenter.sendSmsCode({
						needAlert:false,
						data:{
							mobile: mobile,
							type: type,
						},
						success:function(data){
							vk.toast('验证码已发送');
							that.$refs.uCode.start();
						},
						fail:function(err){
							if(err.errMsg && err.errMsg.indexOf("触发天级流控") > -1){
								vk.alert("短信发送频繁，请明日再试！");
							}else if(err.errMsg && err.errMsg.indexOf("触发小时级流控") > -1){
								vk.alert("短信发送频繁，请过1小时后再试！");
							}else if(err.errMsg && err.errMsg.indexOf("触发分钟级流控") > -1){
								vk.alert("短信发送频繁，请稍后再试！");
							}else if(err.msg){
								vk.alert(err.msg);
							}else{
								vk.alert("短信发送频繁，请稍后再试！");
							}
						}
					});
				} else {
					vk.toast('倒计时结束后再发送',"none");
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	
</style>
