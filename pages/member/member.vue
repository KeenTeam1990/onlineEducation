<template>
	<view>
		<u-toast ref="uToast" />
		<view class="nav">
			<u-navbar :is-back="false" title=" " :background="background" :border-bottom="false" :is-fixed="false">
				<view class="nav-slot-wrap-title">
					我的
				</view>
			</u-navbar>
			<image src="../../static/member/top_bg@2x.png" mode="widthFix" class="top-bg-img"></image>
		</view>
		<view class="top-bg">
			<image src="../../static/member/top_bg@2x.png" mode="widthFix" class="top-bg-img"></image>
		</view>
		<view class="page-content">
			<view class="user-info" @click="editInfo()" v-if="hasLogin">
				<u-avatar :src="user.avatar==null?avatar:user.avatar" :size="108"></u-avatar>
				<view class="u-flex" style="flex-direction: column;align-items: flex-start;justify-content: center;">
					<view class="u-flex">
						<text class="nick-name">{{user.nickname}}</text>
						<image src="../../static/member/member0@2x.png" mode="widthFix" class="edit-info"></image>
					</view>
					<view class="u-flex" style="color: #FFFFFF;margin-left: 32rpx;margin-top: 10rpx;" @click="openRole">
						<u-icon name="level" color="#FFFFFF" size="28"></u-icon> {{isvip ? '付费会员' : '免费会员'}}
					</view>
				</view>
			</view>
			<view class="user-info" @click="goPage('/pages/login/index/index')" v-else>
				<u-avatar :src="user.avatar" :size="108"></u-avatar>
				<view class="u-flex" style="flex-direction: column;align-items: flex-start;justify-content: center;">
					<view class="u-flex">
						<text class="nick-name">{{user.nickname}}</text>
					</view>
				</view>
			</view>
			<!-- #ifdef H5 -->
			<view style="height: 40rpx;width: 100%;"> </view>
			<!-- #endif -->
			<view class="quickly-tool">
				<u-grid :col="5" :border="false" @click="quicklyTool">
					<u-grid-item index="courses">
						<u-icon name="https://qmxq.oss-cn-hangzhou.aliyuncs.com/user-image-unship.png" :size="64">
						</u-icon>
						<view class="grid-text">课程</view>
					</u-grid-item>
					<u-grid-item index="orders">
						<u-icon name="https://qmxq.oss-cn-hangzhou.aliyuncs.com/user-image-evaluation.png" :size="64">
						</u-icon>
						<view class="grid-text">订单</view>
					</u-grid-item>
					<u-grid-item index="delivery">
						<u-icon name="https://qmxq.oss-cn-hangzhou.aliyuncs.com/user-image-unreceipt.png" :size="64">
						</u-icon>
						<view class="grid-text">配送</view>
					</u-grid-item>
					<u-grid-item index="wallet">
						<u-icon name="https://qmxq.oss-cn-hangzhou.aliyuncs.com/user-image-unpaid.png" :size="64">
						</u-icon>
						<view class="grid-text">钱包</view>
					</u-grid-item>
					<u-grid-item index="team">
						<u-icon name="https://qmxq.oss-cn-hangzhou.aliyuncs.com/user-image-aftersale.png" :size="64">
						</u-icon>
						<view class="grid-text">团队</view>
					</u-grid-item>
				</u-grid>
			</view>

			<view class="invite" @click="goPage('/pages/team/team')">
				<image class="hongbao" src="../../static/hongbao.png" mode="widthFix"></image>
				<view class="invite-text">
					<text class="text1">邀请好友赚积分</text>
					<text class="text2">精品好礼等你来兑换！</text>
				</view>
				<view class="invite-btn">
					立即邀请
				</view>
			</view>

			<view class="cell">
				<view class="cell-item" @click="goPage('/pages/member/role')">
					<image src="../../static/member/member4@2x.png" mode="widthFix"></image>
					<text class="cell-title">我的会员</text>
				</view>
				<view class="cell-item" @click="goPage('/pages/universal/universal?tag=about_us')">
					<image src="../../static/member/member7@2x.png" mode="widthFix"></image>
					<text class="cell-title">关于我们</text>
				</view>
				<view class="cell-item" @click="goPage('/pages/member/setting')">
					<image src="../../static/member/member4.png" mode="widthFix"></image>
					<text class="cell-title">应用设置</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	const app = getApp()
	import util from '../../utils/util.js'
	export default {
		data() {
			return {
				avatar: require('../../static/member/avatra.png'),
				user: {
					avatar: require('../../static/member/avatra.png'),
					nickname: "未登录",
					_id: null
				},
				isvip: false,
				role: {},
				background: "rgba(0,0,0,0)",
				hasLogin: false,
				toolsNav: {
					courses: "/pages/member/courses",
					orders: "/pages/order/order",
					delivery: "",
					wallet: "/pages/wallet/wallet",
					team: "/pages/team/team",
				}
			}
		},
		onLoad() {
			//
		},
		onShow() {
			if (this.user._id == null && uni.vk.callFunctionUtil.checkToken()) {
				this.getUserInfo()
				this.hasLogin = true
			}

			if (!uni.vk.callFunctionUtil.checkToken()) {
				this.user = {
					avatar: require('../../static/member/avatra.png'),
					nickname: "点击登录",
					_id: null
				}
				this.hasLogin = false
			}
		},
		onShareAppMessage() {

		},
		methods: {
			quicklyTool(tag) {
				if (this.toolsNav[tag] == "") {
					uni.showToast({
						icon: "none",
						title: "暂未上线~"
					})
					return
				}
				uni.vk.navigateTo(this.toolsNav[tag])
			},
			goPage(page) {
				uni.vk.navigateTo(page)
			},
			editInfo() {
				uni.vk.navigateTo('/pages/member/editInfo')
			},
			getUserInfo() {
				let that = this
				uni.vk.callFunction({
					url: 'user/kh/getMyUserInfo',
					success(data) {
						that.user = data.userInfo
						that.isvip = data.isvip
						that.role = data.role
						getApp().globalData.userInfo = data.userInfo
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	.nav {
		position: sticky;
		top: 0;
		z-index: 999;
		width: 100%;
		background: #104EFF;
		overflow: hidden;

		.nav-slot-wrap-message {
			position: absolute;
			width: 44rpx;
			height: 44rpx;
			right: 40rpx;
			overflow: hidden;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.top-bg-img {
			position: absolute;
			left: 0;
			top: -8rpx;
			width: 750rpx;
			height: 434rpx;
			z-index: -1;
		}
	}


	.top-bg {
		position: absolute;
		width: 750rpx;
		z-index: 1;
		left: 0;
		height: 430rpx;
		// background: #104EFF;
		border-radius: 0 0 10% 10%;
		top: 0;

		.top-bg-img {
			position: absolute;
			left: 0;
			top: -8rpx;
			width: 750rpx;
			height: 434rpx;
			z-index: -1;
		}
	}

	.box-bg-img {
		position: absolute;
		left: 0;
		top: 0;
		width: 702rpx;
		height: 343rpx;
		z-index: 10;
		border-radius: 24px;
	}

	.page-content {
		position: relative;
		z-index: 99;
		width: 750rpx;
		padding: 24rpx;
		background: rgba(0, 0, 0, 0);
		margin-top: 0;

		.user-info {
			padding: 20rpx;
			width: 100%;
			height: 110rpx;
			display: flex;
			justify-content: flex-start;
			align-items: center;

			.nick-name {
				font-size: 34rpx;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 500;
				color: #FFFFFF;
				margin: 0 22rpx 0 32rpx;
			}

			.edit-info {
				width: 40rpx;
				height: 40rpx;
			}
		}

		.course-calendar {
			position: relative;
			width: 702rpx;
			min-height: 338rpx;
			background: #FFFFFF;
			box-shadow: 0px 4rpx 32px 0px rgba(0, 0, 0, 0.05);
			border-radius: 48rpx;
			margin-top: 20rpx;
			padding: 32rpx;

			.calendar {
				position: relative;
				width: 100%;
				margin-top: 20rpx;

				.curriculum-box {
					position: relative;
					width: 100%;
					// padding: 0 20rpx;

					.row {
						display: flex;
						justify-content: space-between;
						align-items: center;
						font-size: 26rpx;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						line-height: 40rpx;
						height: 40rpx;

						// .circle {
						// 	width: 20rpx;
						// 	height: 20rpx;
						// 	border-radius: 10rpx;
						// 	border: 1px solid #104EFF;
						// 	margin-right: 10rpx;
						// }

						.title {
							width: 700rpx;
						}

						.date {
							width: 200rpx;
						}
					}
				}

				.empty-box {
					width: 100%;

					.empty-tip {
						display: block;
						width: 262rpx;
						height: 182rpx;
						margin: 0 auto;
					}

					.empty-tip-text {
						display: block;
						width: 100%;
						text-align: center;
						margin: 0 auto;
						font-size: 26rpx;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #9696A0;
						line-height: 36rpx;
					}
				}

			}
		}

		.button-groups {
			position: relative;
			width: 702rpx;
			min-height: 674rpx;
			background: #FFFFFF;
			box-shadow: 0px 4px 32px 0px rgba(0, 0, 0, 0.05);
			border-radius: 24px;
			margin-top: 20rpx;
			padding: 10rpx 32rpx;
		}
	}

	.u-order-desc {
		color: rgb(150, 150, 150);
		font-size: 28rpx;
		margin-bottom: 6rpx;
	}

	.u-order-time {
		color: rgb(200, 200, 200);
		font-size: 26rpx;
	}

	.invite {
		width: 700rpx;
		margin: 0 auto;
		background: #F9F9F9;
		height: 200rpx;
		border-radius: 20rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 30rpx;
		margin-top: 20rpx;

		.hongbao {
			width: 180rpx;
		}

		.invite-btn {
			width: 180rpx;
			height: 60rpx;
			line-height: 60rpx;
			border-radius: 10rpx;
			text-align: center;
			background: #2C334D;
			color: #FFFFFF;
			font-size: 28rpx;
			font-weight: bold;
			letter-spacing: 5rpx;
		}

		.invite-text {
			width: 230rpx;

			.text1 {
				font-size: 30rpx;
				font-weight: bold;
				display: block;
				color: #2C334D;
			}

			.text2 {
				font-size: 22rpx;
				display: block;
				color: #BCC0CF;
				margin-top: 10rpx;
			}
		}
	}

	.cell {
		width: 100%;
		height: auto;
		margin-top: 20rpx;

		.cell-item {
			position: relative;
			display: flex;
			flex: 1;
			justify-content: left;
			align-items: center;
			padding: 0 30rpx;
			height: 100rpx;
			// border-bottom: dashed 1rpx #E4E7ED;

			&::after {
				content: " ";
				height: 15rpx;
				width: 15rpx;
				border-width: 3rpx 3rpx 0 0;
				border-color: #6E6E6E;
				border-style: solid;
				transform: rotate(45deg);
				position: absolute;
				top: 43rpx;
				right: 50rpx;

			}

			image {
				width: 65rpx;
				height: 65rpx;
				margin-right: 30rpx;
			}

			.cell-title {
				color: #333;
				font-size: 30rpx;
				letter-spacing: 4rpx;
				font-weight: 500;
				line-height: 100rpx;
			}
		}
	}

	.quickly-tool {
		margin-top: 20rpx;
		height: 160rpx;
		background: #fff;
		border-radius: 8px;
		position: relative;
		box-shadow: 0px 5px 5px #efefef;
		overflow: hidden;
	}

	.grid-text {
		font-size: 12px;
		font-family: PingFang SC;
		font-weight: 500;
		color: #222;
		margin-top: 4px;
	}
</style>
