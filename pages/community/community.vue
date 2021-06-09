<template>
	<view>
		<u-toast ref="uToast" />
		<view class="top-bg">
			<u-navbar :is-back="false" title=" " :background="background" :border-bottom="false">
				<view class="nav-slot-wrap-title nav-slot-wrap-title-black">
					发现
				</view>
			</u-navbar>
			<u-tabs name="name" :bar-width="50" :bar-style="barStyle" :list="categories" active-color="#025BFF"
				:current="current" @change="change" :active-item-style="activeItemStyle"></u-tabs>
		</view>
		<scroll-view class="classes-box" :style="{  top: 92 + statusBarHeight + 'px' }" :scroll-y="true"
			@scrolltolower="loadMore()">
			<block v-for="(item,index) in list">
				<Article :article="item" :key="index"> </Article>
			</block>
			<view style="width: 100%;height: 40rpx;"></view>

		</scroll-view>
	</view>
</template>

<script>
	import Article from '@/components/article.vue'
	let systemInfo = uni.getSystemInfoSync();
	let that
	export default {
		components: {
			Article
		},
		data() {
			return {
				barStyle: {
					left: "-6rpx"
				},
				statusBarHeight: systemInfo.statusBarHeight,
				activeItemStyle: {
					fontSize: "36rpx",
					color: "#333333",
				},
				background: "#FFFFFF",
				categories: [{
					"_id": 0,
					"name": "推荐"
				}],
				current: 0,
				hasmore: true,
				pagination: {
					categoryId: 0,
					pageIndex: 1,
					pageSize: 10
				},
				list: []
			};
		},
		onLoad() {
			that = this
			this.getCategories()
			this.getList()
		},
		methods: {
			change(index) {
				this.current = index;
				this.hasmore = true
				this.list = []
				this.pagination = {
					categoryId: this.categories[index]._id,
					pageIndex: 1,
					pageSize: 10
				}
				this.getList()
			},
			getList() {
				uni.vk.callFunction({
					url: 'client/article/pub/list',
					data: this.pagination,
					title: '加载中...',
					success(res) {
						that.list = that.list.concat(res.rows)
						that.hasmore = res.hasMore
					}
				});
			},
			getCategories() {
				uni.vk.callFunction({
					url: 'client/article/pub/categories',
					success(res) {
						that.categories = that.categories.concat(res.data)
					}
				});
			},
			loadMore() {
				if (!this.hasmore) {
					this.$refs.uToast.show({
						title: '没有更多了',
						icon: false
					})
					return;
				}
				this.pagination.pageIndex = this.pagination.pageIndex + 1
				this.getList();
			}
		}
	}
</script>

<style lang="scss">
	.classes-box {
		width: 100%;
		box-sizing: border-box;
		position: absolute;
		left: 0;
		bottom: 0;
	}
</style>
