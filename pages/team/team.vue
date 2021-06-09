<template>
	<view>
		<u-toast ref="uToast" />
		<view class="user-info">
			<view class="info">
				<view class="avatar">
					<image :src="user.avatar==null?avatar:user.avatar" />
				</view>
				<view class="nickname">
					{{user.nickname}}
				</view>
			</view>

			<view class="data">
				<view class="people-count" @click="userDetail(1)">
					<view class="value">0</view>
					<view class="name">直属成员</view>
				</view>
				<view class="balance-sum" @click="userDetail(2)">
					<view class="value">0</view>
					<view class="name">非直属成员</view>
				</view>
				<view class="buttons">
					<text class="withdraw" @click="goWallet">钱包</text>
				</view>
			</view>

		</view>

		<view class="promo_code-box" v-if="user.my_invite_code.length > 0">
			<view class="promo_code">
				<view class="content" @click="share">
					<text class="value">{{user.my_invite_code}}</text>
					<image src="../../static/qrcode.png" mode="widthFix" class="qrcode"></image>
				</view>
				<view class="buttons">
					<text class="copy" @click="copy">复制</text>
				</view>

				<view class="desc">
					<view>
						1.填写您的邀请完成注册的用户将会自动成为您的下级，TA的每一笔分销订单您都将享有积分奖励。
					</view>
					<view>
						2.非直属成员支付并完成分销订单的时候，您也将获得积分奖励。
					</view>
					<view v-if="role!==null">
						3.您或您的非直属成员每邀请一名新成员加入，您将获得{{role.reward0}}/{{role.reward1}}积分奖励
					</view>
				</view>
			</view>
		</view>
		<r-canvas ref="rCanvas"></r-canvas>
		<u-mask :show="showShare" @click="showShare = false">
			<view class="warp">
				<view class="shareImg" @tap.stop>
					<image class="image" mode="widthFix" :src="shareImg"></image>
				</view>
				<view class="save-btn" @tap.stop @click="saveImage">
					保存图片
				</view>
			</view>
		</u-mask>
	</view>
</template>

<script>
	import rCanvas from "@/components/r-canvas/r-canvas.vue"
	var that
	export default {
		components: {
			rCanvas
		},
		data() {
			return {
				showShare: false,
				shareImg: "",
				avatar: require('../../static/member/avatra.png'),
				user: getApp().globalData.userInfo,
				team: {
					level1: 0,
					level2: 0
				},
				role: null
			};
		},
		onLoad() {
			that = this
		},
		onShow: function() {
			this.getUser();
			this.getTeam()
		},
		methods: {
			share() {
				uni.showLoading({
					title: "加载中..."
				})
				this.$nextTick(async () => {

					// 初始化
					await this.$refs.rCanvas.init({
						canvas_id: "rCanvas",
						canvas_width: 562,
						canvas_height: 1000,
						hidden: true
					})

					//获取二维码
					// let qrcode = await uni.vk.callFunction({
					// 	url: 'user/kh/getWeixinMPqrcode',
					// 	data: {
					// 		page: "pages/index/index",
					// 		width: 280
					// 	}
					// });

					// console.log(qrcode.base64)

					// 画底图
					await this.$refs.rCanvas.drawImage({
						url: "http://video.nine123.cn/images/2021/04/15/a378618d43620.jpeg",
						x: 0,
						y: 0,
						w: 562,
						h: 1000
					}).catch(err_msg => {
						uni.showToast({
							title: err_msg,
							icon: "none"
						})
					})

					//画头像
					let avatar = this.user.avatar == null ? this.avatar : this.user.avatar
					await this.$refs.rCanvas.drawImage({
						url: avatar,
						x: 218,
						y: 191,
						w: 125,
						h: 125,
						border_width: 4,
						border_color: "#ffffff",
						border_radius: 5
					}).catch(err_msg => {
						uni.showToast({
							title: err_msg,
							icon: "none"
						})
					})


					// 画文字
					await this.$refs.rCanvas.drawText({
						text: this.user.nickname + "邀请您一起学习",
						max_width: 0,
						x: 100,
						y: 350,
						font_color: "rgba(100, 117, 248, 0.7)",
						font_size: 20
					}).catch(err_msg => {
						uni.showToast({
							title: err_msg,
							icon: "none"
						})
					})

					//画二维码
					await this.$refs.rCanvas.drawImage({
						url: "http://video.nine123.cn/images/2021/04/07/818ed6cc3607c.jpg",
						x: 180,
						y: 500,
						w: 200,
						h: 200,
					}).catch(err_msg => {
						uni.showToast({
							title: err_msg,
							icon: "none"
						})
					})

					// 生成海报
					await this.$refs.rCanvas.draw((res) => {
						console.log(res.tempFilePath)
						this.shareImg = res.tempFilePath
						//res.tempFilePath：生成成功，返回base64图片
						// 保存图片
						// this.$refs.rCanvas.saveImage(res.tempFilePath)
					})
					this.showShare = true
					uni.hideLoading()
				})
			},
			saveImage() {
				this.$refs.rCanvas.saveImage(this.shareImg)
			},
			userDetail(level) {
				uni.vk.navigateTo('/pages/team/detail?level=' + level)
			},
			goWallet() {
				uni.vk.navigateTo('/pages/wallet/wallet')
			},
			getTeam() {
				uni.vk.callFunction({
					url: 'client/team/kh/team',
					success(data) {
						that.team.level1 = data.level1.total
						that.team.level2 = data.level2.total
						that.role = data.role
					}
				});
			},
			getUser() {
				uni.vk.callFunction({
					url: 'user/kh/getMyUserInfo',
					success(data) {
						that.user = data.userInfo
					}
				});
			},
			copy() {
				if (this.user.my_invite_code.length === 0) {
					this.$refs.uToast.show({
						title: '请创建邀请码',
						icon: false
					})
					return
				}
				uni.setClipboardData({
					data: this.user.my_invite_code
				})
			},
		}
	}
</script>

<style lang="scss">
	// page {
	// 	background-color: #f2f2f2;
	// }

	.user-info {
		width: 100%;
		height: auto;
		float: left;
		box-sizing: border-box;
		padding: 15px;
		background: linear-gradient(180deg, #FFFFFF, #F9F9F9);
	}

	.user-info>.info {
		width: 100%;
		height: auto;
		float: left;
		display: flex;
		margin-bottom: 15px;
	}

	.user-info>.info>.avatar {
		width: 36px;
		height: 36px;
		margin-right: 10px;
	}

	.user-info>.info>.avatar>image {
		width: 36px;
		height: 36px;
		border-radius: 50%;
	}

	.user-info>.info>.nickname {
		flex: 1;
		font-size: 14px;
		font-weight: 600;
		line-height: 36px;
		color: #333333;
	}

	.user-info>.data {
		width: 100%;
		height: auto;
		float: left;
		box-sizing: border-box;
		padding: 30px 15px;
		border-radius: 15px;
		background-color: white;
		display: flex;
	}

	.user-info>.data>.people-count {
		flex: 1;
	}

	.user-info>.data>.people-count>.value {
		text-align: center;
		font-size: 16px;
		font-weight: 500;
		line-height: 1;
		margin-bottom: 15px;
		color: #1663ff;
	}

	.user-info>.data>.people-count>.name {
		text-align: center;
		font-size: 12px;
		font-weight: normal;
	}

	.user-info>.data>.balance-sum {
		flex: 1;
	}

	.user-info>.data>.balance-sum>.value {
		text-align: center;
		font-size: 16px;
		font-weight: 500;
		line-height: 1;
		margin-bottom: 15px;
		color: #1663ff;
	}

	.user-info>.data>.balance-sum>.name {
		text-align: center;
		font-size: 12px;
		font-weight: normal;
	}

	.user-info>.data>.buttons {
		margin-left: 15px;
		padding-top: 10px;
	}

	.user-info>.data>.buttons>.withdraw {
		display: inline-block;
		padding: 5px 15px;
		font-size: 14px;
		font-weight: normal;
		background-color: white;
		border: 1px solid #1663ff;
		border-radius: 15px;
		color: #1663ff;
	}


	.promo_code-box {
		width: 100%;
		height: auto;
		float: left;
		margin-top: 15px;
		box-sizing: border-box;
		padding-left: 15px;
		padding-right: 15px;
	}

	.promo_code-box>.promo_code {
		width: 100%;
		height: auto;
		float: left;
		box-sizing: border-box;
		padding: 30px 15px;
		background-color: white;
		border-radius: 15px;
	}

	.promo_code-box>.promo_code>.content {
		width: 100%;
		height: auto;
		float: left;
		text-align: center;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.promo_code-box>.promo_code>.content>.value {
		font-size: 16px;
		font-weight: 600;
		color: #333;
	}

	.promo_code-box>.promo_code>.content>.qrcode {
		width: 48rpx;
		height: 48rpx;
		margin-left: 20rpx;
	}

	.promo_code-box>.promo_code>.content>.create-promo_code {
		display: block;
		width: 100%;
		height: 36px;
		background-color: #1663ff;
		line-height: 36px;
		color: white;
		text-align: center;
		border-radius: 18px;
		letter-spacing: 2rpx;
	}

	.promo_code-box>.promo_code>.buttons {
		width: 100%;
		height: auto;
		float: left;
		margin-top: 30px;
	}

	.promo_code-box>.promo_code>.buttons>.copy {
		display: block;
		width: 100%;
		height: 36px;
		background-color: #1663ff;
		line-height: 36px;
		color: white;
		text-align: center;
		border-radius: 18px;
	}

	.promo_code-box>.promo_code>.desc {
		width: 100%;
		height: auto;
		float: left;
		margin-top: 30px;
		font-size: 12px;
		color: rgba(0, 0, 0, .6);
		line-height: 20px;
	}

	.warp {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
		flex-direction: column;

		.shareImg {
			width: 562rpx;
			height: 1000rpx;
			background: #FFFFFF;

			.image {
				width: 100%;
			}
		}

		.save-btn {
			height: 60rpx;
			line-height: 60rpx;
			text-align: center;
			padding: 0 30rpx;
			background-color: #FFFFFF;
			color: #333333;
			margin-top: 40rpx;
			border-radius: 30rpx;
			letter-spacing: 4rpx;
		}
	}
</style>
