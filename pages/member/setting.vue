<template>
	<view>
		<view class="logout">
			<u-button type="warning" @click="logout">退出登陆</u-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			};
		},
		methods: {
			logout() {
				uni.vk.userCenter.logout()
				uni.clearStorageSync()
				uni.showToast({
					title: "退出成功",
					icon: "none"
				})
				setTimeout(function() {
					uni.navigateBack({

					})
				}, 500)
			}
		}
	}
</script>

<style lang="scss">
	.logout {
		width: 100%;
		padding: 40rpx 60rpx;
	}
</style>
