<template>
	<view class="container">
		<u-toast ref="uToast" />
		<view class="bg bg-color-base margin-b20"></view>

		<view class="tab vs-flex vs-row vs-align-center">
			<image class="tab-bg1" src="/static/banner-icon1.png" mode=""></image>

			<view class="vs-flex vs-row vs-align-center">
				<view class="vs-flex vs-column vs-align-center margin-r40">
					<text class="font-50 margin-b20 color-base">登录</text>
					<view class="line bg-color-base"></view>
				</view>
			</view>
		</view>

		<view class="login margin-b80">
			<view class="input vs-flex vs-row vs-align-center margin-b40">
				<image class="input-icon margin-r20" src="/static/account.png" mode=""></image>
				<input class="vs-flex-item color-base font-30" type="text" v-model="form1.username" :maxlength="11"
					placeholder="请输入您的手机号" placeholder-class="input-placeholder" />
			</view>
			<view class="input  vs-flex vs-row vs-align-center margin-b40">
				<image class="input-icon margin-r20" src="/static/password.png" mode=""></image>
				<input class="vs-flex-item color-base font-30" type="text" password v-model="form1.password"
					placeholder="请输入您的登录密码" placeholder-class="input-placeholder" />
			</view>
		</view>

		<view @click="login" class="button bg-color-base  vs-flex  vs-row vs-align-center vs-space-center margin-b20">
			<text class="color-white font-34">立即登录</text>
		</view>

		<view class=" vs-flex vs-row vs-align-center vs-space-center" style="margin-top: 40rpx;margin-bottom: 80rpx;">
			<text class="color-base font-28" @click="pageTo('../register/register')">注册账号</text>
			<text class="color-base font-28" style="width: 60rpx;text-align: center;">|</text>
			<text class="color-base font-28" @click="pageTo('../forget/forget')">忘记密码</text>
		</view>

		<!-- #ifdef MP-WEIXIN -->
		<view class="other">
			<view class=" vs-flex vs-row vs-align-center margin-b40">
				<view class="separator vs-flex-item"></view>
				<text class="color-black-3 font-28">更多登录方式</text>
				<view class="separator vs-flex-item"></view>
			</view>

			<view class="other-items  vs-flex vs-column vs-align-center vs-space-around">
				<image class="other-icon" @tap="login_weixin" src="/static/wechat.png" mode="widthFix"></image>
				<view class="tip-text">一键登陆</view>
				<!-- <image class="other-icon" src="/static/qq.png" mode=""></image>
				<image class="other-icon" src="/static/apple.png" mode=""></image> -->
			</view>
		</view>
		<!-- #endif -->
	</view>
</template>

<script>
	var that; // 当前页面对象
	var vk; // vk依赖
	export default {
		data() {
			// 页面数据变量
			return {
				// init请求返回的数据
				data: {

				},
				// 表单请求数据
				form1: {
					agreement: true,
					username: '',
					password: ''
				},
				scrollTop: 0,
				invite: getApp().globalData.invite
			}
		},
		onPageScroll(e) {
			that.scrollTop = e.scrollTop;
		},
		// 监听 - 页面每次【加载时】执行(如：前进)
		onLoad(options) {
			that = this;
			vk = that.vk;
			//console.log("onLoad",options);
			that.init(options);
		},
		// 监听 - 页面【首次渲染完成时】执行。注意如果渲染速度快，会在页面进入动画完成前触发
		onReady() {

		},
		// 监听 - 页面每次【显示时】执行(如：前进和返回) (页面每次出现在屏幕上都触发，包括从下级页面点返回露出当前页面)
		onShow() {


		},
		// 监听 - 页面每次【隐藏时】执行(如：返回)
		onHide() {


		},
		// 监听 - 页面下拉刷新
		onPullDownRefresh() {
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		// 监听 - 页面触底部
		onReachBottom() {

		},
		// 监听 - 窗口尺寸变化(仅限:App、微信小程序)
		onResize() {

		},
		// 监听 - 点击右上角转发时
		onShareAppMessage(options) {

		},
		// 监听 - 页面创建时
		created() {

		},
		// 函数
		methods: {
			// 页面数据初始化函数
			init(options = {}) {
				console.log("init: ", options);
			},
			pageTo(path) {
				vk.navigateTo(path);
			},
			// 账号密码登录
			login() {
				const {
					agreement,
					username,
					password
				} = that.form1;
				if (!agreement) {
					vk.toast('请阅读并同意用户服务及隐私协议', "none");
					return;
				}
				if (username.length < 4) {
					vk.toast('账号至少4位数', "none");
					return;
				}
				if (!vk.pubfn.checkStr(password, 'pwd')) {
					vk.toast('密码以字母开头，长度在6~18之间，只能包含字母、数字和下划线', "none");
					return;
				}
				// 登录操作
				var form1 = that.form1;
				vk.userCenter.login({
					data: form1,
					success: function(data) {
						console.log("data", data);
						vk.toast("登陆成功!");
						setTimeout(function() {
							// 跳转到首页,或页面返回
							that.login_success(data);
						}, 1000);
					}
				});
			},
			login_success(data) {
				// 检查是否有指定跳转的页面
				if (vk.navigate.originalPage) {
					vk.navigate.originalTo();
					return false;
				}
				// 跳转到首页,或页面返回
				var pages = getCurrentPages();
				console.log(pages.length, pages[pages.length - 1].route);
				if (pages.length > 1 &&
					pages[pages.length - 2] &&
					pages[pages.length - 2].route &&
					pages[pages.length - 2].route.indexOf('login/index') == -1
				) {
					const eventChannel = that.getOpenerEventChannel();
					eventChannel.emit('loginSuccess', {});
					vk.navigateBack();
				} else {
					// 进入首页
					vk.reLaunch("../../index/index");
				}
			},
			// 第三方登录 - 微信
			login_weixin() {
				vk.userCenter.loginByWeixin({
					data: {
						invite: this.invite
					},
					success: function(data) {
						vk.toast("登陆成功!");
						setTimeout(function() {
							// 跳转到首页,或页面返回
							that.login_success(data);
						}, 1000);
					}
				});
			}
		},
		// 过滤器
		filters: {

		},
		// 计算属性
		computed: {

		}
	}
</script>
<style lang="scss">
	.container {
		position: relative;
	}

	.tab-bg1 {
		position: absolute;
		top: -260rpx;
		right: 16rpx;
		width: 400rpx;
		height: 400rpx;
	}

	.bg {
		position: relative;
		width: 750rpx;
		height: 400rpx;
	}

	.tab {
		position: absolute;
		top: 250rpx;
		left: 20rpx;
		right: 20rpx;
		height: 150rpx;
		padding: 0 50rpx;
		background-color: #fff;
		border-top-left-radius: 20rpx;
		border-top-right-radius: 20rpx;

		&-bg {
			position: absolute;
			top: -200rpx;
			right: -50rpx;
			width: 440rpx;
			height: 285rpx;
		}
	}

	.line {
		width: 25rpx;
		height: 7rpx;
	}

	.login,
	.register {
		padding: 0 60rpx;
	}

	.input {
		width: 630rpx;
		height: 90rpx;
		padding: 0 30rpx;
		background-color: rgba(80, 100, 235, 0.1);
		border-radius: 45rpx;

		&-icon {
			width: 30rpx;
			height: 38rpx;
		}

		&-placeholder {
			color: #5064eb;
		}
	}

	.button {
		width: 630rpx;
		height: 90rpx;
		margin-left: 60rpx;
		border-radius: 45rpx;
	}

	.separator {
		height: 2rpx;
		margin: 0 30rpx;
		background-color: #f5f5f5;
	}

	.other {
		&-items {
			padding: 0 200rpx;
		}

		&-icon {
			width: 50rpx;
			height: 50rpx;
		}
	}

	.other-icon {
		width: 100rpx;
		height: 100rpx;
	}

	.tip-text {
		margin-top: 10rpx;
		letter-spacing: 2rpx;
	}
</style>
