<template>
	<view>
		<courses :list="list" :className="'one'" :hasBuy="true"></courses>
	</view>
</template>

<script>
	var that
	import courses from '@/components/courses.vue'
	export default {
		components: {
			courses
		},
		data() {
			return {
				hasmore: true,
				pagination: {
					pageIndex: 1,
					pageSize: 10
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
			getList() {
				uni.vk.callFunction({
					url: 'client/courses/kh/my_list',
					data: this.pagination,
					title: '加载中...',
					success(res) {
						that.list = that.list.concat(res.rows.map(v => {
							return v.course
						}))
						that.hasmore = res.hasMore
					}
				});
			},
		}
	}
</script>

<style lang="scss">

</style>
