<template>
	<div class="product" :class="className">
		<template v-if="dataType!='normal'&&couresList.length > 0">
			<div class="product-item" v-for="(item, index) in couresList" :key="index" @click="open(item._id)">
				<div class="image">
					<image :src="item.thumb.tempFileURL" mode="widthFix">
				</div>
				<div class="info">
					<p class="name">{{ item.title }}</p>
					<p class="desc">
						{{ item.short_description }}
					</p>
					<p class="price">
						<span>￥{{ item.charge/100 }}</span>
						<span v-if="item.charge_original">￥{{ item.charge_original/100 }}</span>
					</p>
				</div>
			</div>
		</template>
	</div>
</template>

<script>
	export default {
		name: 'Product',
		props: ['data', 'className'],
		data() {
			return {
				couresList: []
			}
		},
		mounted() {
			if (this.data.options.type == 'latest')
				this.getLatestCourses()
			else if (this.data.options.type == 'recommend')
				this.getRecommendCourses()
		},
		methods: {
			getLatestCourses() {
				let that = this
				let params = this.data.options.params
				params.limit = Number(params.limit)

				uni.vk.callFunction({
					url: 'plugs/client/visualization/pub/getLatestLiveCourses',
					data: params,
					success(data) {
						that.couresList = data.rows
					}
				});
			},
			getRecommendCourses() {
				let that = this
				let params = this.data.options.params
				params.limit = Number(params.limit)

				uni.vk.callFunction({
					url: 'plugs/client/visualization/pub/getRecommendLiveCourses',
					data: params,
					success(data) {
						that.couresList = data.rows
					}
				});
			},
			open(id) {
				uni.vk.navigateTo('/pages/live_courses/detail?_id=' + id);
			}
		}
	}
</script>

<style lang="scss" scoped>
	.product {
		display: flex;
		flex-wrap: wrap;
		padding: 4rpx 8rpx;
		box-sizing: border-box;

		* {
			box-sizing: border-box;
		}

		&.one .product-item {
			width: 100%;
			// padding: 10px;
			display: flex;
			border-bottom: 1px dashed #eee;

			.image {
				display: block;
				width: 310rpx;
				height: 160rpx;
				border-radius: 5rpx;
				overflow: hidden;
				margin-right: 10px;
			}

			.info {
				position: relative;
				padding: 0;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				flex: 1;

				.name {
					width: 400rpx;
					font-weight: bold;
					font-size: 28rpx;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 1;
					overflow: hidden;
					height: 40rpx;
				}

				.desc {
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
					font-size: 26rpx;
					color: #666666;
					min-height: 60rpx;
				}

				.price {
					font-size: 28rpx;
					margin: 0;
				}

				.num {
					font-size: 26rpx;
					margin: 12px 0 0;
				}
			}
		}

		&.two .product-item {

			.info {
				position: relative;
				width: 100%;
				padding: 10rpx 0;

				.name {
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
					// font-weight: bold;
					font-size: 28rpx;
					height: auto;
				}

				.desc {
					margin-top: 10rpx;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
					font-size: 26rpx;
					color: #666666;
					min-height: 60rpx;
					display: none;
				}

				.price {
					margin-top: 10rpx;
				}
			}
		}

		&.three .product-item {
			width: 33.33%;

			.info {
				padding: 10rpx 0;

				.name {
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
					font-size: 28rpx;
					height: auto;
					min-height: 70rpx;
				}

				.desc {
					display: none;
				}

				.price {
					font-size: 28rpx;
					margin-top: 10rpx;
				}

				.num {
					font-size: 24rpx;
					margin: 12px 0 0;
				}

			}

			&.product-default:nth-of-type(3) {
				display: block;
			}
		}

		.product-item {
			position: relative;
			width: 50%;
			padding: 5px;

			// &.product-default:nth-of-type(3) {
			// 	display: none;
			// }

			.image {
				font-size: 0;
				height: 200rpx;

				image {
					width: 100%;
				}
			}

			.info {
				padding: 10px 5px 0;

				.name {
					font-size: 28rpx;
					margin: 0;
					color: #333;
					text-overflow: ellipsis;
					word-break: break-all;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
					overflow: hidden;
					// height: 38px;
					line-height: 18px;
				}

				.num {
					font-size: 26rpx;
					color: #d23000;
					font-weight: 600;
				}

				.price {
					font-weight: 600;
					margin: 12px 0 0;
					font-size: 28rpx;

					span:nth-of-type(1) {
						color: red;
					}

					span:nth-of-type(2) {
						color: #b5b5b5;
						font-weight: 400;
						font-size: 26rpx;
						margin-left: 4px;
						text-decoration: line-through;
					}
				}
			}
		}
	}
</style>
