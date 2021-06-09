<template>
	<view class="announce" v-if="list.length>0">
		<view class="announce-title">
			<text class="font1">公</text><text class="font2">告</text>
		</view>
		<view class="announce-item">
			<swiper class="announce-swiper" :autoplay="true" :vertical="true" :circular="true">
				<swiper-item v-for="(item, index) in list" :key="index">
					<view class="announce-swiper-item" @click="open(item._id)">{{item.title}}</view>
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'Announce',
		props: ['data', 'className'],
		data() {
			return {
				list: []
			}
		},
		mounted() {
			if (this.data.options.type == 'latest')
				this.getLatest()
			else if (this.data.options.type == 'recommend')
				this.getRecommend()
		},
		methods: {
			getLatest() {
				let that = this
				let params = this.data.options.params
				params.limit = Number(params.limit)

				uni.vk.callFunction({
					url: 'plugs/client/visualization/pub/getLatestArticle',
					data: params,
					success(data) {
						that.list = data.rows
					}
				});
			},
			getRecommend() {
				let that = this
				let params = this.data.options.params
				params.limit = Number(params.limit)

				uni.vk.callFunction({
					url: 'plugs/client/visualization/pub/getRecommendArticle',
					data: params,
					success(data) {
						that.list = data.rows
					}
				});
			},
			open(id) {
				uni.vk.navigateTo('/pages/community/article?aid=' + id)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.empty {
		width: 100%;
		height: 50px;
		background: #efefef;
		line-height: 50px;
		text-align: center;
	}

	.announce {
		width: 700rpx;
		height: 90rpx;
		border-radius: 45rpx;
		padding: 0 35rpx;
		line-height: 90rpx;
		background: #f4f4f5;
		margin: 20rpx auto;
		display: flex;

		.announce-title {
			width: 100rpx;
			height: 90rpx;
			line-height: 90rpx;
			font-size: 34rpx;
			font-weight: 800;

			.font1 {
				margin-right: 6rpx;
			}

			.font2 {
				color: #1663ff;
				font-size: 35rpx;
			}
		}

		.announce-item {
			position: relative;
			width: 530rpx;
			height: 90rpx;

			.announce-swiper {
				width: 100%;
				height: 90rpx;

				.announce-swiper-item {
					text-overflow: ellipsis;
					white-space: nowrap;
					overflow: hidden;
					letter-spacing: 1rpx;
				}
			}
		}
	}
</style>
