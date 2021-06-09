<template>
	<view>
		<view class="icon">
			<image src="/static/success.png"></image>
		</view>
		<view class="tis">
			订单支付成功
		</view>
		<view class="pay-amount">
			支付金额:{{amount}}元
		</view>
		<view class="back">
			<view class="btn" @tap="toUser">个人中心</view>
		</view>
	</view>
</template>

<script>
	let app = getApp()
	export default {
		data() {
			return {
				amount: 0
			};
		},
		onLoad(e) {
			this.amount = parseFloat(e.amount).toFixed(2);
		},
		onShow: function() {
			//支付完成返回，开始处理数据
			if (app.globalData.payStatus != null && app.globalData.payStatus != undefined) {
				let orderno = app.globalData.orderNo;
				console.log('接收到返回支付结果', app.globalData.payStatus);
				console.log('订单号', orderno);
				//处理您自己的业务
			}
		},
		methods: {
			toUser() {
				uni.switchTab({
					url: '/pages/member/member'
				});
			}
		},
	}
</script>

<style lang="scss">
	view {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
	}

	.icon {
		width: 100%;
		margin-top: 10vw;

		image {
			width: 25vw;
			height: 25vw;
		}
	}

	.tis {
		width: 100%;
		margin-top: 20upx;
		font-size: 48upx;
	}

	.pay-amount {
		width: 100%;
		margin-top: 10upx;
		font-size: 32upx;
	}

	.back {
		position: absolute;
		width: 100%;
		bottom: 80upx;

		.btn {
			padding: 0 50upx;
			height: 70upx;
			border: solid 2upx #025BFF;
			color: #025BFF;
			align-items: center;
			border-radius: 10upx;
			font-size: 34upx;
		}
	}
</style>
