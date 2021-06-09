<template>
	<view>
		<view class="page-content">
			<view class="a-title">
				{{article.title}}
			</view>
			<view class="bottom-info">
				<view class="left">
					<view class="item">
						发布于：{{article.created_at | date('yyyy-mm-dd hh:MM') }}
					</view>
				</view>
				<view class="right">
					浏览 {{article.view_count}}
				</view>
			</view>
			<mp-html :content="article.content"></mp-html>
		</view>
	</view>
</template>

<script>
	let that
	export default {
		data() {
			return {
				articleId: null,
				article: {
					title: '',
					view_count: 0,
					created_at: ''
				}
			};
		},
		onLoad(options) {
			console.log(options)
			that = this
			this.articleId = options.aid
			this.getData()
		},
		methods: {
			getData() {
				uni.vk.callFunction({
					url: 'client/article/pub/detail',
					data: {
						_id: this.articleId,
						need_user_info: true
					},
					success(res) {
						uni.setNavigationBarTitle({
							title: res.data.title,
						})
						// 	// 富文本图片溢出
						res.data.content = res.data.content.replace(/\<img/gi,
							'<img style="max-width:100%;height:auto;display:block;" ');
						that.article = res.data
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	.page-content {
		width: 750rpx;
		padding: 20rpx;
		background: #FFFFFF;

		.a-title {
			font-size: 32rpx;
			font-family: PingFangSC-Semibold, PingFang SC;
			font-weight: bold;
			color: #333333;
			line-height: 1.5;
			text-align: justify;
		}

		.user-info {
			display: flex;
			justify-content: flex-start;
			align-items: center;
			width: 100%;
			height: 100rpx;
			margin-top: 20rpx;

			.nick-name {
				font-size: 28rpx;
				font-family: PingFangSC-Semibold, PingFang SC;
				color: #555555;
				font-weight: bold;
			}
		}
	}

	.bottom-info {
		width: 100%;
		height: 50rpx;
		margin-bottom: 20rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-right: 20rpx;
		padding-top: 10rpx;

		.left {
			display: flex;

			.item {
				font-size: 24rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #7F7F7F;
				line-height: 34rpx;
				margin-right: 20rpx;
			}
		}

		.right {
			font-size: 24rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #7F7F7F;
			line-height: 34rpx;
		}
	}
</style>
