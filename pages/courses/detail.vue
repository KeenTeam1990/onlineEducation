<template>
	<view>
		<!-- 课程封面 -->
		<view class="course-thumb">
			<image :src="course.thumb.tempFileURL" mode="aspectFill" />
		</view>
		<!-- 课程介绍 -->
		<view class="course-info">
			<view class="course-title">
				{{course.title}}
			</view>
			<view class="course-desc">
				{{course.short_description}}
			</view>
			<view class="sub-info">
				<view>
					<u-icon :label="'上架日期：'+$u.timeFormat(course.published_at, 'yyyy/mm/dd')" size="28" label-size='24'
						name="clock"></u-icon>
				</view>
				<view>
					<u-icon :label="course.user_count+'人在学'" size="28" label-size='24' name="man-add"></u-icon>
				</view>
				<view @click="Share" v-if="multi_level_share">
					<u-icon :label="'分销'" size="28" label-size='24' name="share"></u-icon>
				</view>
			</view>
		</view>
		<view class="course-tabs">
			<u-tabs-swiper ref="uTabs" active-color="#025BFF" :list="list" :current="current" @change="tabsChange"
				:is-scroll="false" swiperWidth="750"></u-tabs-swiper>
		</view>
		<swiper class="swiper-item-box" :current="swiperCurrent" @transition="transition"
			@animationfinish="animationfinish">
			<swiper-item class="swiper-item">
				<scroll-view scroll-y @scrolltolower="onreachBottom">
					<mp-html :content="course.render_desc"></mp-html>
				</scroll-view>
			</swiper-item>
			<swiper-item class="swiper-item">
				<scroll-view scroll-y @scrolltolower="onreachBottom">
					<view class="chapters">

						<block v-if="chapters.length === 0">
							<view class="video-item" v-for="(item,index) in videos[0]" :key="index"
								@click="goVideo(item._id)">
								<view class="name">
									<text class="free">视频</text>
									<text class="video-name">{{item.title}}</text>
									<!-- <text class="free" v-if="item.charge===0&&!isBuy">试看</text> -->
									<!-- <text class="lock-fill" v-if="item.charge>0&&!isBuy"></text> -->
								</view>
								<view class="duration">
									<block
										v-if="videoWatchedProgress[item._id]&&videoWatchedProgress[item._id].watched_at!=null">
										已看完
									</block>
									<block v-else>
										<block v-if="videoWatchedProgress[item._id]">
											看完
											{{Number(videoWatchedProgress[item._id].watch_seconds*100/item.duration).toFixed(1)}}%
										</block>
										<block v-else>
											{{item.duration|durationForHuman}}
										</block>
									</block>
								</view>
							</view>
						</block>

						<block v-else>
							<view class="chapter-item" v-for="(chapter,index) in chapters" :key="index">
								<view class="chapter-name">{{chapter.title}}</view>
								<view class="video-item" v-for="(item,index) in videos[chapter._id]" :key="index"
									@click="goVideo(item._id)">
									<view class="name">
										<text class="free">视频</text>
										<text class="video-name">{{item.title}}</text>
										<!-- <text class="free" v-if="item.charge===0&&!isBuy">试看</text> -->
										<!-- 	<text class="lock-fill" v-if="item.charge>0&&!isBuy"></text>
										<text class="lock-fill" v-if="isBuy"></text> -->
									</view>
									<view class="duration">
										<block
											v-if="videoWatchedProgress[item.id]&&videoWatchedProgress[item.id].watched_at!=null">
											已看完
										</block>
										<block v-else>
											<block v-if="videoWatchedProgress[item.id]">
												看完
												{{Number(videoWatchedProgress[item.id].watch_seconds*100/item.duration).toFixed(1)}}%
											</block>
											<block v-else>
												{{item.duration|durationForHuman}}
											</block>
										</block>
									</view>
								</view>
							</view>
						</block>
					</view>
				</scroll-view>
			</swiper-item>
		</swiper>

		<block v-if="!isBuy">
			<view style="width: 100%;height: 100rpx;"></view>
			<view class="buy-foot">
				<!-- #ifdef MP -->
				<view class="charge" v-if="isIos">
					不可购买
				</view>
				<view class="charge" v-else>
					¥ {{course.charge/100.0}}
				</view>
				<!-- #endif -->

				<!-- #ifndef MP -->
				<view class="charge">
					¥ {{course.charge/100.0}}
				</view>
				<!-- #endif -->

				<view class="buy-btn-box">
					<!-- #ifdef MP -->
					<block v-if="isIos">
						<view class="vip-tip" style="color:#B2B5C6;">
							因苹果公司政策原因无法购买课程
						</view>
					</block>
					<block v-else>
						<block v-if="course.charge==0">
							<view class="vip-tip">
								本课程免费学习
							</view>
						</block>
						<block v-else>
							<button class="buy-btn" @click="buy">
								立即购买
							</button>
						</block>
					</block>
					<!-- #endif -->
					<!-- #ifdef H5 -->
					<block v-if="course.charge==0">
						<view class="vip-tip">
							本课程免费学习
						</view>
					</block>
					<block v-else>
						<button class="buy-btn" @click="buy">
							立即购买
						</button>
					</block>
					<!-- #endif -->
				</view>
			</view>
		</block>
		<block v-else>
			<view class="buy-foot">
				<view class="charge">

				</view>
				<view class="buy-btn-box">
					<button class="buy-btn" @click="swiperCurrent=1">
						立即学习
					</button>
				</view>
			</view>
		</block>
		<u-modal title='分销说明' @confirm="confirmShare" v-model="shareShow" :content="shareContent"></u-modal>
	</view>
</template>

<script>
	// import mpHtml from '@/components/mp-html/mp-html'
	import util from '@/utils/util'
	var that = this
	export default {
		// components: {
		// 	mpHtml
		// },
		data() {
			return {
				multi_level_share: null,
				shareShow: false,
				shareContent: "",
				course: {
					title: "",
					short_description: "",
					user_count: "",
					charge: 0,
					thumb: {
						tempFileURL: ''
					}
				},
				chapters: [],
				videos: [],
				attachs: [],
				navTab: 'desc',
				isCollect: false,
				isBuy: false,
				videoWatchedProgress: [],
				comments: [],
				commentUsers: [],
				courseId: 0,
				commentContent: '',
				isIos: util.isIos(),
				list: [{
					name: '课程介绍'
				}, {
					name: '课程目录'
				}],
				current: 0,
				swiperCurrent: 0,
			};
		},
		filters: {
			durationForHuman(data) {
				return util.durationForHuman(data)
			}
		},
		onLoad(options) {
			that = this
			this.courseId = options._id
		},
		onShow: function() {
			this.getCourse();
		},
		methods: {
			//分销
			Share() {
				this.shareContent = "本课程开启了分销奖励，直属成员购买后您可获得" + this.multi_level_share.reward0 + "积分奖励，非直属成员购买后，您可获得" + this
					.multi_level_share.reward1 + "积分奖励。您可通过右上角分享功能进行分享，通过此链接注册的会员，自动成为您的直属成员。"
				this.shareShow = true
			},
			confirmShare(){
				// #ifdef H5
				uni.setClipboardData({
					data:window.location.host+`/#/pages/courses/detail?_id=${this.courseId}&invite=` + getApp().globalData.userInfo.my_invite_code,
					success() {
						uni.showToast({
							icon:"none",
							title:"分享链接已复制"
						})
					}
				})
				// #endif
			},
			goVideo(id) {
				uni.vk.navigateTo(`/pages/courses/video?course_id=${this.courseId}&video_id=${id}`)
			},
			buy() {
				//先创建订单
				uni.vk.callFunction({
					url: 'client/order/kh/createCourseOrder',
					data: {
						_id: this.courseId
					},
					success(data) {
						//再前往支付
						uni.vk.navigateTo('/pages/pay/payment/payment?order_id=' + data.order_id)
					}
				});
			},
			getCourse() {
				uni.vk.callFunction({
					url: 'client/courses/pub/detail',
					title:"加载中...",
					data: {
						_id: this.courseId,
						need_user_info: true
					},
					success(res) {
						uni.setNavigationBarTitle({
							title: res.data.courses.title,
						})
						// 	// 富文本图片溢出
						res.data.courses.render_desc = res.data.courses.render_desc.replace(/\<img/gi,
							'<img style="max-width:100%;height:auto;display:block;" ');

						that.course = res.data.courses
						that.chapters = res.data.chapters
						let videos = []
						res.data.videos.data.forEach(v => {
							videos[v._id] = v.data
						})
						that.videos = videos
						that.isBuy = res.data.has_buy
						that.multi_level_share = res.data.multi_level_share
					}
				});
			},
			// tabs通知swiper切换
			tabsChange(index) {
				this.swiperCurrent = index;
			},
			// swiper-item左右移动，通知tabs的滑块跟随移动
			transition(e) {
				let dx = e.detail.dx;
				this.$refs.uTabs.setDx(dx);
			},
			// 由于swiper的内部机制问题，快速切换swiper不会触发dx的连续变化，需要在结束时重置状态
			// swiper滑动结束，分别设置tabs和swiper的状态
			animationfinish(e) {
				let current = e.detail.current;
				this.$refs.uTabs.setFinishCurrent(current);
				this.swiperCurrent = current;
				this.current = current;
			},
			// scroll-view到底部加载更多
			onreachBottom() {

			}

		},
		onShareTimeline(res) {
			return {
				title: this.course.title,
				path: `/pages/courses/detail?_id=${this.courseId}&invite=` + getApp().globalData.userInfo
					.my_invite_code,
				imageUrl: this.course.thumb
			}

		},
		onShareAppMessage: function() {
			return {
				title: this.course.title,
				path: `/pages/courses/detail?_id=${this.courseId}&invite=` + getApp().globalData.userInfo
					.my_invite_code,
				imageUrl: this.course.thumb
			}
		},
	}
</script>

<style lang="scss">
	page {
		background-color: #f2f2f2;
	}

	.course-thumb {
		width: 100%;
		height: 300rpx;
		min-height: 100rpx;

		image {
			width: 100%;
			height: 300rpx;
		}
	}

	.course-info {
		position: relative;
		width: 100%;
		min-height: 200rpx;
		background: #FFFFFF;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: 30rpx;

		.course-title {
			font-size: 32rpx;
			font-weight: 800;
			color: #000000;
		}

		.course-desc {
			color: #333333;
			font-size: 28rpx;
			text-align: justify;
			overflow: hidden;
			display: -webkit-box;
			text-overflow: ellipsis;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
			margin-top: 10rpx;
		}

		.sub-info {
			display: flex;
			justify-content: space-between;
			color: #555555;
			font-size: 26rpx;
			margin-top: 10rpx;
		}

		.course-other {
			color: #B7BACA;
			font-size: 25rpx;

			text {
				margin-right: 40rpx;
			}
		}
	}

	.course-tabs {
		margin-top: 10rpx;
		position: sticky;
		top: 0;
		background: #FFFFFF;
		z-index: 999;
	}


	.swiper-item-box {
		position: relative;
		height: 100vh;

		.swiper-item {
			border-top: 1px solid #efefef;
			background: #FFFFFF;
			position: relative;

			scroll-view {
				height: 100% !important;
			}
		}
	}

	.course-like {
		position: absolute;
		bottom: 10rpx;
		right: 40rpx;
	}

	.buy-foot,
	.comment-bottom-bar {
		position: fixed;
		bottom: 0;
		left: 0;
		height: 100rpx;
		width: 750rpx;
		background: #FFFFFF;
		display: flex;
		align-items: center;
		padding: 0 30rpx;
		justify-content: space-between;
		box-shadow: 0px 0px 10px #B2B5C6;

		.charge {
			color: #F11C1C;
			font-size: 36rpx;
			font-weight: bold;
		}

		.buy-btn-box {
			padding: 0 20rpx;
			display: flex;
			align-items: center;

			.vip-tip {
				margin: 0 20rpx;
				font-size: 30rpx;
				letter-spacing: 2rpx;
				font-weight: bold;
				color: #FE9521;
			}

			.buy-btn {
				width: 180rpx;
				height: 60rpx;
				line-height: 60rpx;
				text-align: center;
				border-radius: 35rpx;
				// background-image: linear-gradient(to right, #FF104B, #FF785F);
				background: #FF9E1B;
				color: #FFFFFF;
				font-size: 26rpx;
				font-weight: bold;
				letter-spacing: 2rpx;
			}
		}

	}

	.chapters {
		padding: 20rpx 30rpx;

		.chapter-name {
			width: 100%;
			height: auto;
			float: left;
			font-size: 15px;
			color: #333;
			font-weight: 700;
			margin-bottom: 15px;
			margin-top: 10px;
		}

		.video-item {
			width: 100%;
			height: auto;
			float: left;
			display: flex;
			margin-bottom: 20rpx;
			line-height: 60rpx;
			box-sizing: border-box;
			padding-left: 5px;
			border-bottom: 1rpx dashed #efefef;

			.name {
				-webkit-box-flex: 1;
				-webkit-flex: 1;
				flex: 1;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				font-size: 14px;
				color: rgba(51, 51, 51, .8);

				.video-name {
					font-size: 30rpx;
					width: 490rpx;
				}

				.free {
					padding: 2px 4px;
					background-color: #025BFF;
					-webkit-border-radius: 3px;
					border-radius: 3px;
					color: #fff;
					font-size: 12px;
					margin-right: 5px;
				}

				.lock-fill {
					&:before {
						content: "";
					}
				}
			}

			.duration {
				width: auto;
				height: auto;
				font-size: 12px;
				margin-left: 10px;
				color: #999;
			}
		}
	}

	.comment {
		display: flex;
		padding: 30rpx;

		.left {
			image {
				width: 64rpx;
				height: 64rpx;
				border-radius: 50%;
				background-color: #f2f2f2;
			}
		}

		.right {
			flex: 1;
			padding-left: 20rpx;
			font-size: 30rpx;

			.top {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 10rpx;

				.name {
					color: #000000;
					font-weight: 500;
				}
			}

			.content {
				margin-bottom: 10rpx;
			}
		}
	}


	.comment-bottom-bar>.input {
		flex: 1;
	}

	.comment-bottom-bar>.input>input {
		width: 100%;
		height: 30px;
		float: left;
		background: rgba(238, 238, 238, 1);
		border-radius: 18px;
		border: 0;
		box-sizing: border-box;
		padding: 3px 15px;
		font-size: 12px;
	}

	.comment-bottom-bar>.send-button {
		margin-left: 15px;
		font-size: 13px;
		font-weight: 400;
		color: rgba(204, 204, 204, 1);
		line-height: 30px;
	}

	.comment-bottom-bar>.send-button.active {
		color: rgba(23, 132, 237, 1);
		font-weight: bold;
	}

	.xiao {
		display: inline-block;
		margin-left: 20rpx;
		width: 30rpx;
		height: 30rpx;
	}
</style>
