<template>
	<view>
		<view class="vipcard-detail-header">
			<image class="bg" src="../../static/role/vipcard_bg_vipgrade@2x.png"></image>
			<view class="main pt20">
				<view class="flex alcenter space">
					<view class="col3 text-center">
					</view>
					<view class="col3 flex center">
						<image class="vipcard-face" :src="user.avatar==null?avatar:user.avatar"></image>
					</view>
					<view class="col3 text-center">

					</view>
				</view>

				<view class="flex center mt8">
					<view class="vipcard-level-tag ft12 cl-w8">会员类型:<text
							class="ftw600 ft12 ml4">{{isvip?'付费会员':'免费会员'}}</text>
					</view>
				</view>
			</view>
		</view>

		<view class="vipcard-detail-main">
			<view class="flex center">
				<swiper class="vipcard-swiper" previous-margin="15px" next-margin="30px" :indicator-dots="false"
					:autoplay="false">
					<swiper-item>
						<view class="swiper-item">
							<view class="card">
								<image v-if="isvip" class="bg" src="../../static/role/vipcard_bg_vipgrade02@2x.png">
								</image>
								<image v-else class="bg" src="../../static/role/vipcard_bg_vipgrade01@2x.png"></image>
								<view class="main">
									<view class="text-center ft20 ftw600 cl-main">{{isvip?'付费会员':'免费会员'}}</view>
									<view class="text-center" style="font-size: 23rpx;margin-top: 10rpx;color: #333333;"
										v-if="isvip">
										您的VIP会员将于{{role.expired_at | date}}到期
									</view>
									<view class="mt10 flex center">
										<view v-if="!isvip" class="vipcard-info" @click="this.show=true"><text
												class="ft14 ftw600 ml4 cl-main">立即升级</text></view>
										<view @click="this.show=true" v-else class="vipcard-info">
											续费VIP
										</view>
									</view>

								</view>
							</view>
						</view>
					</swiper-item>

				</swiper>
			</view>
			<view class="pd16_15">
				<view class="box noshadow pd16_15">
					<view class="ft16 ftw600 cl-main">VIP会员持有权益</view>
					<view class="flex space alcenter mt16">
						<view class="vipcard-con-box pd20_15 flex alcenter">
							<image style="width: 80rpx;height: 80rpx;"
								src="../../static/role/vipcard_icon_right02@2x.png"></image>
							<view class="ml10">
								<view class="ft14 ftw600 cl-main">专属特惠</view>
								<view class="mt6 ft12 cl-notice">免费视频</view>
							</view>
						</view>
						<view class="vipcard-con-box pd20_15 flex alcenter">
							<image style="width: 80rpx;height: 80rpx;"
								src="../../static/role/vipcard_icon_right03@2x.png"></image>
							<view class="ml10">
								<view class="ft14 ftw600 cl-main">特惠折扣</view>
								<view class="mt6 ft12 cl-notice">会员专属价</view>
							</view>
						</view>

					</view>
				</view>
			</view>

			<view class="role-box" v-if="show">
				<view class="item" :class="{ 'active' : order._id === role._id,'last' :index === roles.length-1}"
					v-for="(role,index) in roles" :key="index" @click="choice(role)">
					<view class="name">{{role.name}}({{role.expire_days}}天)</view>
					<view class="charge">￥{{role.charge/100.0}}</view>
				</view>
			</view>
		</view>
		<view class="bottom-bar" v-if="show">
			<!-- #ifdef MP -->
			<block v-if="isIos">
				<view class="ios-alert">因苹果政策原因无法购买会员</view>
			</block>
			<block v-else>
				<view class="total-charge">
					<text class="value">￥{{order.total/100.0}}</text>
				</view>
				<view class="buy-button" @click="buy">立即购买</view>
			</block>
			<!-- #endif -->
			<!-- #ifndef MP -->
			<view class="total-charge">
				<text class="value">￥{{order.total/100.0}}</text>
			</view>
			<view class="buy-button" @click="buy">立即购买</view>
			<!-- #endif -->
		</view>
	</view>
</template>

<script>
	import util from '../../utils/util'
	export default {
		data() {
			return {
				avatar: require('../../static/member/avatra.png'),
				show : false,
				roles: null,
				user: {
					role: null,
					avatar: require('../../static/member/avatra.png'),

				},
				isvip: false,
				role: {},
				order: {
					_id: 0,
					name: '',
					total: 0
				},
				isIos: util.isIos()
			};
		},
		onShow: function() {
			this.getUser();
			this.roleList();
		},
		methods: {
			getUser() {
				let that = this
				uni.vk.callFunction({
					url: 'user/kh/getMyUserInfo',
					success(data) {
						that.user = data.userInfo
						that.isvip = data.isvip
						that.role = data.role
					}
				});
			},

			roleList() {
				let that = this
				uni.vk.callFunction({
					url: 'client/role/kh/all',
					success(data) {
						that.roles = data.rows
					}
				});
			},

			choice(data) {
				let id = data._id;
				let charge = data.charge;
				let name = data.name;

				this.order = {
					_id: id,
					name: name,
					total: charge
				}
			},

			buy() {
				if (this.order._id === 0) {
					this.$refs.uToast.show({
						title: '请选择会员',
						icon: false
					})
					return;
				}

				//先创建订单
				uni.vk.callFunction({
					url: 'client/order/kh/createRoleOrder',
					data: this.order,
					success(data) {
						//再前往支付
						uni.vk.navigateTo('/pages/pay/payment/payment?order_id=' + data.order_id)
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	@import url("@/common/css/common.css");

	.vipcard-detail-header {
		position: relative;
		height: 480rpx;
	}

	.vipcard-detail-header .bg {
		width: 100%;
		height: 480rpx;
	}

	.vipcard-detail-header .main {
		height: 480rpx;
		width: 100%;
		position: absolute;
		left: 0;
		top: 0;
	}

	.vipcard-detail-header .vipcard-num {
		font-size: 24rpx;
		font-weight: bold;
		line-height: 48rpx;
		background: linear-gradient(180deg, #F2DCA9 0%, #C79556 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.vipcard-detail-header .vipcard-face {
		width: 112rpx;
		height: 112rpx;
		border: 8rpx solid rgba(255, 255, 255, 0.9);
		border-radius: 100rpx;
		background: rgba(255, 255, 255, 0.9);
	}

	.vipcard-detail-header .vipcard-level-tag {
		height: 40rpx;
		border-radius: 20rpx;
		padding: 0 16rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		border: 2rpx solid rgba(255, 255, 255, .3)
	}

	.vipcard-detail-main {
		position: relative;
		margin-top: -212rpx;
	}

	.vipcard-swiper {
		height: 280rpx;
		width: 100%;
	}

	.vipcard-swiper .swiper-item {
		width: 100%;
		padding-left: 15px;
		/**就用PX了**/
	}

	.vipcard-swiper .swiper-item .card {
		height: 280rpx;
		width: 100%;
		position: relative;
		border-radius: 32rpx;
		overflow: hidden;
	}

	.vipcard-swiper .swiper-item .card .bg {
		width: 100%;
		height: 280rpx;
	}

	.vipcard-swiper .swiper-item .card .main {
		width: 100%;
		height: 280rpx;
		position: absolute;
		left: 0;
		top: 0;
		z-index: 2;
		padding: 72rpx;
	}

	.vipcard-swiper .swiper-item .card .main .vipcard-info {
		height: 80rpx;
		background: #FFFFFF;
		border-radius: 24rpx;
		padding: 0 20rpx;
		text-align: center;
		line-height: 80rpx;
		color: #333;
		font-size: 30rpx;
	}

	.vipcard-swiper .swiper-item .card .vip-type-tag {
		width: 104rpx;
		height: 40rpx;
		background: linear-gradient(136deg, #4E4E4E 0%, #262728 100%);
		border-radius: 0rpx 20rpx 20rpx 0rpx;
		text-align: center;
		line-height: 40rpx;
		font-size: 24rpx;
		color: #F7E3C3;
		font-weight: 500;
		position: absolute;
		z-index: 3;
		left: 0;
		top: 40rpx;
	}

	.vipcard-con-box {
		width: 300rpx;
		background: #FFFFFF;
		box-shadow: 0rpx 4rpx 32rpx 0rpx rgba(0, 0, 0, 0.04);
		border-radius: 8rpx;
	}

	.role-box {
		width: 100%;
		height: auto;
		float: left;
		box-sizing: border-box;
		padding: 20px 15px;
		display: flex;
		flex-direction: column;
		margin-top: 10px;
		background-color: white;
	}

	.role-box>.item {
		display: flex;
		flex: 1;
		box-sizing: border-box;
		padding: 30rpx;
		margin-bottom: 20rpx;
		border-radius: 5rpx;
		border: 1px solid rgba(204, 204, 204, .25);
		color: #333333;
		text-align: center;
	}

	.role-box>.item.last {
		margin-right: 0;
	}

	.role-box>.item.active {
		border: 1px solid #CEA200;
		color: #CEA200;
	}

	.role-box>.item>.name {
		flex: 1;
		height: auto;
		float: left;
		font-size: 12px;
		font-weight: 600;
		text-align: left;
	}

	.role-box>.item>.charge {
		width: 100rpx;
		height: auto;
		float: left;
		font-size: 14px;
		font-weight: 600;
		color: rgba(206, 162, 0, 1);
	}

	.role-box>.item>.days {
		width: 100%;
		height: auto;
		float: left;
		font-size: 12px;
		font-weight: 400;
		color: rgba(153, 153, 153, 1);
	}

	.bottom-bar {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 11;
		display: flex;
		width: 100%;
		height: 49px;
		background-color: white;
	}

	.bottom-bar>.ios-alert {
		flex: 1;
		text-align: center;
		font-size: 12px;
		color: #aaa;
		line-height: 49px;
	}

	.bottom-bar>.total-charge {
		flex: 1;
		box-sizing: border-box;
		padding-left: 15px;
	}

	.bottom-bar>.total-charge>.value {
		font-size: 16px;
		font-weight: 500;
		color: rgba(255, 77, 79, 1);
		line-height: 49px;
	}

	.bottom-bar>.buy-button {
		// width: 144px;
		// height: 49px;
		// background: #000;
		// color: white;
		// font-size: 14px;
		// line-height: 49px;
		// text-align: center;
		display: inline-block;
		width: 144px;
		height: 40px;
		line-height: 40px;
		margin-top: 5px;
		margin-right: 15rpx;
		// background-image: linear-gradient(to right, #FF104B, #FF785F);
		background: #FF9E1B;
		border-radius: 20px;
		text-align: center;
		font-size: 14px;
		color: white;
		letter-spacing: 2rpx;
		font-weight: bold;
	}
</style>
