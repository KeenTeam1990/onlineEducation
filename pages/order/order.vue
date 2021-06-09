<template>
	<view>
		<u-toast ref="uToast" />
		<view class="empty" v-if="list.length==0">
			<image src="../../static/empty.png" mode="widthFix"></image>
			<view class="title">
				暂无成员
			</view>
		</view>
		<view class="order-item" v-for="(item,index) in list" :key="index">
			<view class="order-id">
				订单编号：{{item._id}}
			</view>
			<view class="order-goods">
				<view class="goods">
					<view class="name">
						{{item.title}}
					</view>
					<view class="price">
						¥ {{item.total_fee/100.0}}
					</view>
				</view>
			</view>
			<view class="order-pay-info">
				<view class="other-info">
					<view class="status"> {{getStatus(item.status)}}
					</view>
					<view class="time">{{item.create_time | date('yyyy-mm-dd hh:MM')}}</view>
				</view>
				<view class="total" v-if="item.status==1" @click="pay(item._id)">
					<view class="text">

					</view>
					<view class="price">
						立即支付
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	var that
	export default {
		data() {
			return {
				hasmore: true,
				pagination: {
					pageIndex: 1,
					pageSize: 15
				},
				list: []
			};
		},
		onLoad() {
			that = this
			this.getList()
		},
		onReachBottom() {
			if (!this.hasmore) {
				this.$refs.uToast.show({
					title: '没有更多了',
					icon: false
				})
				return;
			}
			this.pagination.pageIndex = this.pagination.pageIndex + 1
			this.getList();
		},
		methods: {
			getStatus(code) {
				switch (code) {
					case 1:
						return '待付款'
						break
					case 2:
						return '已付款'
						break
					case 3:
						return '退款审核中'
						break
					case -1:
						return '已取消'
						break
				}
			},
			pay(oid) {
				uni.vk.navigateTo('/pages/pay/payment/payment?order_id=' + oid)
			},
			getList() {
				uni.vk.callFunction({
					url: 'client/order/kh/list',
					data: this.pagination,
					title: '加载中...',
					success(res) {
						that.list = that.list.concat(res.rows)
						that.hasmore = res.hasMore
					}
				});
			},
		}
	}
</script>

<style lang="scss">
	.order-item {
		position: relative;
		width: 100%;
		min-height: 200rpx;
		background: #FFFFFF;
		box-shadow: 0px 4rpx 32px 0px rgba(0, 0, 0, 0.05);
		border-radius: 10rpx;
		padding: 0 20rpx;
		margin-bottom: 20rpx;

		.order-id {
			width: 100%;
			height: 100rpx;
			line-height: 100rpx;
			font-size: 26rpx;
			font-family: PingFangSC-Medium, PingFang SC;
			// font-weight: bold;
			color: #333333;
			letter-spacing: 3rpx;
			border-bottom: 1px dashed #efefef;
		}

		.order-goods {
			border-bottom: 1px dashed #efefef;

			.goods {
				position: relative;
				display: flex;
				justify-content: space-between;
				align-items: center;
				width: 100%;
				padding: 30rpx 0;

				.name {
					max-width: 600rpx;
					font-size: 30rpx;
					font-weight: bold;
					color: #333333;
					letter-spacing: 3rpx;
				}

				.price {
					font-size: 30rpx;
					font-family: PingFangSC-Medium, PingFang SC;
					font-weight: 500;
					// color: #FF9E1B;
					line-height: 32rpx;
				}
			}
		}

		.order-pay-info {
			position: relative;
			width: 100%;
			padding: 10rpx 0;

			.total {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-top: 10rpx;
				margin-bottom: 10rpx;

				.text {
					max-width: 600rpx;
					font-size: 28rpx;
					color: #333333;
					letter-spacing: 3rpx;
					font-weight: bold;
				}

				.price {
					background: #19be6b;
					font-size: 26rpx;
					height: 40rpx;
					line-height: 40rpx;
					font-family: PingFangSC-Medium, PingFang SC;
					font-weight: bold;
					// color: #ff9900;
					color: #FFFFFF;
					padding: 0 15rpx;
					border-radius: 25rpx;
				}
			}

			.other-info {
				display: flex;
				justify-content: space-between;
				align-items: center;
				font-size: 25rpx;
				color: #333333;

				.payment {
					color: #19be6b;
					width: 20%;
				}

				.status {
					width: 20%;
				}

				.time {
					text-align: right;
					width: 60%;
				}
			}
		}
	}
</style>
