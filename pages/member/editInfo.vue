<template>
	<view class="page-content">
		<u-toast ref="uToast" />
		<view class="nick-input">
			<view class="u-avatar-box">
				<image class="u-avatar" :src="user.avatar==null?avatar:user.avatar" mode="aspectFill"></image>
			</view>
			<u-form-item required label="昵称:">
				<u-input v-model="user.nickname" type="text" :border="false" placeholder="请输入您的新昵称" />
			</u-form-item>
			<u-form-item label="性别:">
				<u-input v-model="gender" type="text" :border="false" placeholder="请选择您的性别" @click="show = true" />
				<u-action-sheet :list="actionSheetList" v-model="show" @click="actionSheetCallback"></u-action-sheet>
			</u-form-item>
		</view>

		<u-button type="primary" @click="submit">完 成</u-button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				avatar: require('../../static/member/avatra.png'),
				user: {
					avatar: require('../../static/member/avatra.png'),
					nickname: "未登录",
					gender: 0
				},
				actionSheetList: [{
						text: '保密'
					}, {
						text: '男'
					},
					{
						text: '女'
					}
				],
				show: false,
				gender: ''
			};
		},
		created() {

		},
		onLoad(options) {
			let that = this
			uni.vk.callFunction({
				url: 'user/kh/getMyUserInfo',
				success(data) {
					that.user = data.userInfo
					that.gender = that.actionSheetList[that.user.gender].text
				}
			});
		},
		methods: {
			// 点击actionSheet回调
			actionSheetCallback(index) {
				this.user.gender = index;
				this.gender = this.actionSheetList[index].text
			},
			submit() {
				uni.vk.callFunction({
					url: 'user/kh/updateUser',
					title:'处理中',
					data: {
						nickname: this.user.nickname,
						gender: Number(this.user.gender)
					},
					success(data) {
						uni.showToast({
							icon: 'none',
							title: data.msg
						})
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #FFFFFF;
	}

	.page-content {
		position: relative;
		width: 700rpx;
		margin: 0rpx auto;

		.nick-input {
			width: 100%;
			border-bottom: 1px solid #efefef;
			margin-bottom: 40rpx;
		}
	}

	.u-avatar-box {
		width: 100%;
		height: 190rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		.u-avatar {
			width: 130rpx;
			height: 130rpx;
		}

		.u-text {
			margin-top: 10rpx;
		}
	}
</style>
