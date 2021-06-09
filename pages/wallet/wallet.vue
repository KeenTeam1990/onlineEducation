<template>
	<view class="container">
		<u-toast ref="uToast" />
		<!-- 可用积分 begin -->
		<view class="integrals-section">
			<view class="integrals">
				<view class="title">可用积分</view>
				<view class="value">{{detail.balance}}</view>
			</view>
			<view class="tip">
				说明：100积分=1元
			</view>
		</view>
		<view class="integrals-mall">
			<view class="navbar">
				<view class="item active">积分明细</view>
			</view>
			<view class="list-box">
				<view class="item" v-for="(item,index) in list" :key="index">
					<view class="left">
						<view :class="item.opt_type">+</view> {{item.balance}}
					</view>
					<view class="right">
						<view class="desc">
							{{item.remark}}
						</view>
						<view class="time">
							{{item.timestamp | date('yyyy-mm-dd hh:MM:ss')}}
						</view>
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
				detail: {
					balance: 0
				},
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
			this.getWallet()
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
			getWallet() {
				uni.vk.callFunction({
					url: 'client/wallet/kh/wallet',
					success(data) {
						that.detail = data.data
					}
				});
			},
			getList() {
				uni.vk.callFunction({
					url: 'client/wallet/kh/list',
					data: this.pagination,
					title: '加载中...',
					success(res) {
						that.list = that.list.concat(res.rows)
						that.hasmore = res.hasMore
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #F8F8F8;
	}

	.integrals-section {
		position: relative;
		background: url('@/static/wallet/me_img_banner_mall.png') no-repeat;
		background-size: 100% 100%;
		width: 100%;
		height: 291rpx;
		padding: 30rpx 40rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 10rpx;

		.tip {
			position: absolute;
			left: 40rpx;
			bottom: 40rpx;
			font-size: 28rpx;
			color: #666;
		}

		.integrals {
			display: flex;
			flex-direction: column;
			align-items: center;
			font-size: 28rpx;
			color: #666;

			.value {
				font-family: 'neutra';
				font-size: 72rpx;
				margin-top: 10rpx;
			}
		}

		.menu {
			display: flex;
			align-items: center;
			font-size: 26rpx;

			.divider {
				height: 20rpx;
				width: 1rpx;
				background-color: #343434;
				margin: 0 30rpx;
			}
		}
	}

	.integrals-mall {
		.navbar {
			position: sticky;
			background-color: #ffffff;
			top: 0;
			z-index: 10;
			border-bottom: 1rpx solid rgba(#c8c7cc, 0.3);
			font-size: 26rpx;
			color: #999;
			height: 110rpx;
			display: flex;
			align-items: stretch;

			.item {
				padding: 0 30rpx;
				position: relative;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				font-size: 24rpx;

				&.active {
					color: #DBA871;
					font-size: 26rpx;

					&:after {
						content: ' ';
						height: 4rpx;
						background-color: #DBA871;
						width: 100rpx;
						margin-top: 10rpx;
					}
				}
			}
		}
	}

	.list-box {
		position: relative;
		width: 100%;
		background: #FFFFFF;
		padding: 0 20rpx;

		.item {
			display: flex;
			height: 100rpx;
			border-bottom: 1rpx dashed #efefef;

			.left {
				width: 150rpx;
				height: 100%;
				line-height: 100rpx;
				font-size: 30rpx;
				color: #666;

				.inc {
					display: inline-block;
					color: #19be6b;
					font-size: 40rpx;
					margin-right: 10rpx;
				}

				.dec {
					display: inline-block;
					color: #fa3534;
					font-size: 40rpx;
					margin-right: 10rpx;
				}
			}

			.right {
				flex: 1;
				position: relative;

				.desc {
					height: 50rpx;
					line-height: 50rpx;
					width: 100%;
					font-size: 26rpx;
					color: #333333;
				}

				.time {
					height: 50rpx;
					line-height: 50rpx;
					width: 100%;
					font-size: 26rpx;
					color: #666666;
				}
			}
		}
	}
</style>
