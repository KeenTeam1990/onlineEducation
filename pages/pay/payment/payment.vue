<template>
	<view>
		<view class="block">
			<view class="content">
				<view class="orderinfo">
					<view class="row">
						<view class="nominal">订单名称:</view>
						<view class="text">{{order.title}}</view>
					</view>
					<view class="row">
						<view class="nominal">订单金额:</view>
						<view class="text">{{order.total_fee/100.0}}元</view>
					</view>
				</view>
			</view>
		</view>
		<view class="block">
			<view class="title">
				选择支付方式
			</view>
			<view class="content">
				<view class="pay-list">
					<view v-for="(item,index) in payment" class="row" @tap="paytype=item.sign">
						<view class="left">
							<image :src="item.logo"></image>
						</view>
						<view class="center">
							{{item.name}}
						</view>
						<view class="right">
							<radio :checked="paytype==item.sign" color="#025BFF" />
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="pay">
			<view class="btn" @tap="doDeposit">立即支付</view>
			<view class="tis">
				点击立即支付，即代表您同意<view class="terms">
					《条款协议》
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				orderId: 0,
				order: {
					title: '',
					total_fee: 0
				},
				goods: {},
				paytype: '', //支付类型,
				payment: {}
			};
		},
		onLoad(option) {
			this.orderId = option.order_id
			this.getOrder()
		},
		methods: {
			//根据订单号查询出订单详情
			getOrder() {
				let that = this
				uni.vk.callFunction({
					url: 'client/order/kh/detail',
					title: "加载中..",
					data: {
						"_id": this.orderId
					},
					success(res) {
						that.order = res.data.order;
						that.goods = res.data.goods;
						that.payment = res.data.payment
					}
				});
			},
			doDeposit() {
				if (this.paytype == '') {
					uni.showToast({
						icon: "none",
						title: '请选择支付方式'
					});
					return
				}
				let that = this
				uni.vk.callFunction({
					url: 'client/pay/kh/pay',
					title: "支付中...",
					data: {
						"oid": this.orderId,
						"paytype": this.paytype
					},
					success(res) {
						//拉起支付
						if (res.data.platform == 'MIN-APP' && res.data.paytype == 'YunGouOS_wxPay') {
							that.YunGouOS_wxPay_minapp(res.data.params)
						} else if (res.data.platform == 'H5' && res.data.paytype == 'YunGouOS_wxPay') {
							that.YunGouOS_wxPay_h5(res.data.params)
						}

					}
				});

			},
			YunGouOS_wxPay_h5(data) {
				uni.showToast({
					icon:"loading",
					title:"准备支付ing..."
				})
				window.location.href = data
			},
			YunGouOS_wxPay_minapp(data) {
				let that = this
				wx.navigateToMiniProgram({
					appId: 'wxd9634afb01b983c0', //支付收银小程序的appid 固定值 不可修改
					path: '/pages/pay/pay', //支付页面 固定值 不可修改
					extraData: data, //携带的参数 参考API文档
					success(res) {
						//支付成功
						uni.redirectTo({
							url: '../success/success?amount=' + (that.order.total_fee / 100.0)
						});
					},
					fail(res) {
						//打开失败业务
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	.block {
		width: 94%;
		padding: 0 3% 40upx 3%;

		.title {
			width: 100%;
			font-size: 34upx;
		}

		.content {
			.orderinfo {
				width: 100%;
				border-bottom: solid 1upx #eee;

				.row {
					width: 100%;
					height: 90upx;
					display: flex;
					align-items: center;

					.nominal {
						flex-shrink: 0;
						font-size: 32upx;
						color: #7d7d7d;
					}

					.text {
						width: 70%;
						margin-left: 10upx;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
						font-size: 32upx;
					}
				}
			}

			.pay-list {
				width: 100%;
				border-bottom: solid 1upx #eee;

				.row {
					width: 100%;
					height: 120upx;
					display: flex;
					align-items: center;

					.left {
						width: 100upx;
						flex-shrink: 0;
						display: flex;
						align-items: center;

						image {
							width: 80upx;
							height: 80upx;
						}
					}

					.center {
						width: 100%;
						font-size: 30upx;
					}

					.right {
						width: 100upx;
						flex-shrink: 0;
						display: flex;
						justify-content: flex-end;
					}
				}
			}
		}
	}

	.pay {
		margin-top: 20upx;
		width: 100%;
		display: flex;
		justify-content: center;
		flex-wrap: wrap;

		.btn {
			width: 70%;
			height: 80upx;
			border-radius: 80upx;
			display: flex;
			justify-content: center;
			align-items: center;
			color: #fff;
			background-color: #025BFF;
			box-shadow: 0upx 5upx 10upx rgba(0, 0, 0, 0.2);
		}

		.tis {
			margin-top: 10upx;
			width: 100%;
			font-size: 24upx;
			display: flex;
			justify-content: center;
			align-items: baseline;
			color: #999;

			.terms {
				color: #5a9ef7;
			}
		}
	}
</style>
