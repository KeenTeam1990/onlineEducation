<script>
	import config from '@/app.config.js'
	export default {
		methods: {

		},
		// 监听 - 页面404
		onPageNotFound: function(e) {
			uni.redirectTo({
				url: config.error.url
			})
		},
		onLaunch: function() {
			if (config.debug) console.log('App Launch')
			let that = this;

			// #ifdef MP
			let platform = "MIN-APP"
			// #endif

			// #ifdef APP-PLUS
			let platform = "APP"
			// #endif

			// #ifdef H5
			let platform = "H5"
			// #endif

			uni.vk.callFunctionUtil.updateRequestGlobalParam({
				"platform": {
					regExp: "^client/",
					data: {
						platform: platform
					}
				}
			});
			//获取个人资料
			if (uni.vk.callFunctionUtil.checkToken()) {
				uni.vk.callFunction({
					url: 'user/kh/getMyUserInfo',
					success(data) {
						getApp().globalData.userInfo = data.userInfo
					}
				});
			}
		},
		onShow: function(options) {
			if (options == null || options == '') {
				return;
			}
			this.globalData.invite = options.query.invite

			if (options.referrerInfo == null || options.referrerInfo == '') {
				return;
			}
			//跳转回商户小程序参数示例：{"code": 0,"data":{"orderNo":"123456"},"msg": "支付成功"}
			let extraData = options.referrerInfo.extraData;
			if (extraData) {
				//不管成功失败 先把支付结果赋值
				this.globalData.payStatus = extraData.code == 0 ? true : false;
				if (extraData.code != 0) {
					wx.showToast({
						title: extraData.msg, //错误提示
						icon: 'none',
						duration: 3000
					});
					return;
				}
				//支付成功
				this.globalData.orderNo = extraData.data.orderNo;
			}
		},
		onHide: function() {
			if (config.debug) console.log('App Hide')
		},
		globalData: {
			payStatus: -1,
			orderNo: '',
			searchText: '',
			userInfo: {},
			invite: ''
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "uview-ui/index.scss";

	.nav-slot-wrap-title {
		font-size: 44rpx;
		font-weight: bold;
		color: #FFFFFF;
		font-family: PingFangSC-Medium, PingFang SC;
		margin-left: 24rpx;
		letter-spacing: 7rpx;
	}

	.nav-slot-wrap-title-black {
		color: #333333;
	}

	.empty {
		width: 100%;
		text-align: center;

		.title {
			color: #9e9e9e;
			letter-spacing: 3rpx;
		}
	}
</style>
