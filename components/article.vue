<template>
	<view class="g-article" @click="openDetail">
		<view class="title">
			{{article.title}}
		</view>
		<view class="desc">
			<view class="thumb" v-if="article.avatar.tempFileURL">
				<image :src="article.avatar.tempFileURL" mode="aspectFill"></image>
			</view>
			<view class="excerpt">
				{{article.excerpt}}
			</view>
		</view>
		<view class="bottom-info">
			<view class="left">
				<view class="item">
					浏览 {{article.view_count}}
				</view>
			</view>
			<view class="right">
				{{article.created_at | date('yyyy-mm-dd hh:MM') }}
			</view>
		</view>
	</view>
</template>

<script scoped="true">
	export default {
		name: "article",
		props: {
			article: {
				type: Object,
				default: null
			}
		},

		data() {
			return {
				formatDate(date) {
					return date.substring(0, 16)
				}
			};
		},
		methods: {
			openDetail() {
				uni.vk.navigateTo('/pages/community/article?aid=' + this.article._id)
			},
			imgMum(img_str) {
				return JSON.parse(img_str).length
			},
			isToday(str) {
				return new Date().getTime() - new Date(str).getTime() < 86400000;
			},
			handleImg(img_str) {
				var json = JSON.parse(img_str)
				if (json.length == 0) {
					return null;
				}
				if (json.length == 1) {
					return json[0]
				}
				return json;
			}
		}
	};
</script>

<style lang="scss" scoped>
	.g-article {
		position: relative;
		width: 750rpx;
		padding: 20rpx;
		min-height: 100rpx;
		background: #FFFFFF;
		border-bottom: 1rpx dashed #efefef;
		// margin-bottom: 20rpx;

		.title {
			font-size: 30rpx;
			font-family: PingFangSC-Semibold, PingFang SC;
			font-weight: bold;
			color: #333333;
			line-height: 1.5;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
			overflow: hidden;
		}

		.desc {
			display: flex;
			margin-top: 10rpx;


			.thumb {
				width: 240rpx;
				height: 120rpx;
				overflow: hidden;
				padding-right: 15rpx;

				image {
					width: 100%;
					height: 100%;
					border-radius: 5rpx
				}
			}

			.excerpt {
				flex: 1;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 3;
				overflow: hidden;
			}
		}

		.new-icon {
			display: inline-block;
			margin-right: 20rpx;
			width: 74rpx;
			height: 46rpx;
			position: relative;
			top: 10rpx;
		}


		.bottom-info {
			width: 100%;
			height: 50rpx;
			// margin-top: 20rpx;
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
	}
</style>
