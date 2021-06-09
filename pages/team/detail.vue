<template>
	<view>
		<u-toast ref="uToast" />
		<view class="empty" v-if="list.length==0">
			<image src="../../static/empty.png" mode="widthFix"></image>
			<view class="title">
				暂无成员
			</view>
		</view>
		<view class="team-list">
			<view class="user" v-for="(item,index) in list" :key="index">
				<view class="nickname">
					{{item.username}}
				</view>
				<view class="join-time">
					{{item.invite_time | date('yyyy-mm-dd hh:MM')}}
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
					pageSize: 20,
					level: 0
				},
				list: []
			};
		},
		onLoad(options) {
			that = this
			this.pagination.level = options.level
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
					url: 'client/team/kh/list',
					data: this.pagination,
					title: '加载中...',
					success(res) {
						that.list = that.list.concat(res.invitedUser)
						that.hasmore = res.invitedUser.length == that.pagination.pageSize
					}
				});
			},
		}
	}
</script>

<style lang="scss">
	.team-list {
		position: relative;
		width: 100%;

		.user {
			height: 100rpx;
			border-bottom: 1rpx dashed #efefef;
			line-height: 100rpx;
			display: flex;
			padding: 0 20rpx;

			.nickname {
				flex: 1;
				color: #333333;
			}

			.join-time {
				text-align: right;
				width: 300rpx;
				color: #999999;
			}
		}
	}
</style>
