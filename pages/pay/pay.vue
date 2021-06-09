<template>
	<view>
		<view class="goods" v-for="(goodsItem,index_g) in goods">
			<view class="name">
				{{goodsItem.goods_name}} * {{goodsItem.num}}
			</view>
			<view class="charge">
				¥ {{goodsItem.goods_charge/100}}
			</view>
		</view>
		<view class="stat">
			<view class="item">
				<view class="name">原价</view>
				<view class="value">￥{{order.total_fee/100}}</view>
			</view>
			<view class="item">
				<view class="name">优惠码抵扣</view>
				<view class="value">-￥{{promo_code_charge}}</view>
			</view>
			<view class="item">
				<view class="name">总计</view>
				<view class="value">￥{{order.total_fee/100 - promo_code_charge}}</view>
			</view>
		</view>

		<view class="bottom-bar">
			<view class="total">
				<text>￥{{order.total_fee/100}}</text>
			</view>
			<view class="buttons">
				<text class="pay" @click="paySubmit">确认支付</text>
			</view>
		</view>
	</view>
</template>

<script>
	import util from '../../utils/util'
	export default {
		data() {
			return {
				orderId: 0,
				order: {
					total_fee: 0
				},
				goods: {},
				promo_code_charge: 0,
				payParameter: null
			};
		},
		onLoad(option) {
			this.orderId = option.order_id
			this.getGoods()
		},
		methods: {
			//根据订单号查询出订单详情
			getGoods() {
				let that = this
				uni.vk.callFunction({
					url: 'client/order/kh/detail',
					title: "加载中..",
					data: {
						"_id": this.orderId
					},
					success(res) {
						that.order = res.data.order;
						that.goods = res.data.goods.data;
					}
				});
			},
			paySubmit() {
				let orderData = this.order
				if (orderData.status_text === '已支付') {
					// 这种情况是优惠码全部抵扣
					uni.showToast({
						icon: 'none',
						title: '支付成功',
					})
					setTimeout(() => {
						// 返回上一页
						uni.navigateBack({
							delta: 0,
						})
					}, 500);
					return
				}

				// #ifdef MP-WEIXIN
				//取消支付后重新拉起支付
				if (this.payParameter != null) {
					this.requestPayment(this.payParameter)
					return
				}

				//新支付
				order.pay(orderData.order_id).then(res => {
					this.payParameter = res
					this.requestPayment(res)
				}).catch(e => {
					uni.showToast({
						icon: 'none',
						title: '错误：' + e,
					})
				})
				// #endif
			},
			requestPayment(res) {
				uni.requestPayment({
					provider: 'wxpay',
					nonceStr: res.nonceStr,
					package: res.package,
					paySign: res.paySign,
					timeStamp: res.timeStamp,
					signType: res.signType,
					success: (res) => {
						console.log('支付成功', res);
						uni.showToast({
							icon: 'none',
							title: '支付成功',
						})
						setTimeout(() => {
							if (this.t == 'b') {
								// 返回上一页
								uni.navigateBack({
									delta: this.b,
								})
							} else {
								uni.redirectTo({
									url: this.b
								})
							}
						}, 500);
					},
					fail: (res) => {
						console.log('支付失败', res);
						uni.showToast({
							icon: 'none',
							title: '支付失败',
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	page{
		background: #f7f8f9;
	}
	.goods {
		width: 100%;
		height: auto;
		float: left;
		margin-top: 15px;
		box-sizing: border-box;
		padding: 30px 15px;
		background-color: white;
		display: flex;
	}

	.goods>.name {
		flex: 1;
		font-size: 16px;
		line-height: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.goods>.charge {
		margin-left: 15px;
		font-size: 14px;
		color: #FE9521;
		font-weight: 500;
		line-height: 1;
	}

	.bottom-bar {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		width: 100%;
		height: 50px;
		box-sizing: border-box;
		border-top: 1px solid #f2f2f2;
		display: flex;
		background-color: white;
	}

	.bottom-bar>.total {
		margin-right: 15px;
		font-size: 16px;
		line-height: 49px;
		padding-left: 15px;
		color: #FE9521;
		font-weight: bold;
	}

	.bottom-bar>.buttons {
		flex: 1;
		text-align: right;
		box-sizing: border-box;
		padding-right: 15px;
	}

	.bottom-bar>.buttons>.pay {
		display: inline-block;
		width: 144px;
		height: 40px;
		line-height: 40px;
		margin-top: 5px;
		// background-image: linear-gradient(to right, #FF104B, #FF785F);
		background: #025BFF;
		// background: #FF9E1B;
		border-radius: 20px;
		text-align: center;
		font-size: 14px;
		color: white;
		letter-spacing: 2rpx;
		font-weight: bold;
	}

	.stat {
		width: 100%;
		height: auto;
		float: left;
		box-sizing: border-box;
		padding: 30px 15px 15px 15px;
		background-color: white;
		margin-top: 15px;
	}

	.stat>.item {
		width: 100%;
		height: auto;
		float: left;
		margin-bottom: 15px;
		display: flex;
	}

	.stat>.item>.name {
		flex: 1;
		text-align: left;
		font-size: 14px;
		line-height: 1;
		color: #333;
	}

	.stat>.item>.value {
		margin-left: 15px;
		font-size: 14px;
		line-height: 1;
		color: #FE9521;
	}
</style>
