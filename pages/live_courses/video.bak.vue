<template>
	<view>
		<!-- 视频区 -->
		<view class="play-box">
			<block v-if="isBuy">
				<video id="myVideo" :src="video.url" :poster="poster" :title="video.title"
					:poster-for-crawler="course.thumb" @ended="playEnd" @timeupdate="playTimeUpdate"
					object-fit='contain' :enable-danmu="true" :danmu-list="danmuList" :auto-pause-if-navigate="false"
					:auto-pause-if-open-native="false"></video>
			</block>
			<block v-else>
				<view class="no-auth" @click="buyCourse">
					<text class="btn">请先订阅</text>
				</view>
			</block>
		</view>
		<!-- 课程介绍 -->
		<view class="course-info">
			<view class="course-title">
				{{video.title}}
			</view>
			<view class="course-desc">
				简介：{{video.short_description}}
			</view>
			<view class="play-rate">
				<text>倍速：</text>
				<view class="rate-item" :class="playbackRate==item ? 'active' : ''" v-for="item in rate" :key="item"
					@click="changeRate(item)">
					{{item}} X
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
					<view class="chapters">

						<block v-if="chapters.length === 0">
							<view class="video-item" v-for="(item,index) in videos[0]" :key="index"
								@click="goVideo(item._id)">
								<view class="name" :class="video._id == item._id ? 'active' : ''">
									<text class="free">视频</text>
									<text class="video-name">{{item.title}}</text>
									<text class="free" v-if="item.charge===0&&!isBuy">试看</text>
									<!-- <text class="lock-fill" v-if="item.charge>0&&!isBuy"></text> -->
								</view>
								<view class="duration" v-if="video._id == item._id">
									<image src="../../static/liveing.gif" mode="widthFix"></image>
								</view>
								<view class="duration" v-else>
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
									<view class="name" :class="video._id == item._id ? 'active' : ''">
										<text class="free">视频</text>
										<text class="video-name">{{item.title}}</text>
										<text class="free" v-if="item.charge===0&&!isBuy">试看</text>
										<!-- <text class="lock-fill" v-if="item.charge>0&&!isBuy"></text> -->
									</view>
									<view class="duration" v-if="video._id == item._id">
										<image src="../../static/liveing.gif" mode="widthFix"></image>
									</view>
									<view class="duration" v-else>
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
							</view>
						</block>
					</view>
				</scroll-view>
			</swiper-item>
			<swiper-item class="swiper-item">
				<scroll-view scroll-y @scrolltolower="onreachBottom">
					<u-parse :html="video.render_desc"></u-parse>
				</scroll-view>
			</swiper-item>
		</swiper>


	</view>
</template>

<script>
	import util from '../../utils/util'
	var that
	const app = getApp();

	export default {
		data() {
			return {
				playOptions: [],
				video: {
					title: "",
					short_description: ""
				},
				course: null,
				chapters: [],
				videos: [],
				attachs: [],
				navTab: 'menu',
				isBuy: false,
				videoWatchedProgress: [],
				comments: [],
				commentUsers: [],
				videoId: 0,
				courseId: 0,
				commentContent: '',
				playInfo: [],
				playUrl: '',
				poster: '',
				lastPlaySeconds: 0,
				isIos: util.isIos(),
				list: [{
					name: '课程目录'
				}, {
					name: '视频介绍'
				}],
				current: 0,
				swiperCurrent: 0,
				videoContext: null,
				playbackRate: 1.0,
				rate: [0.8, 1.0, 1.25, 1.5, 2.0],
				danmuList: []
			};
		},
		filters: {
			durationForHuman(data) {
				return util.durationForHuman(data)
			}
		},
		onLoad: function(options) {
			this.courseId = options.course_id
			this.videoId = options.video_id
			this.poster = app.globalData.player_cover
			this.videoContext = uni.createVideoContext('myVideo')
			this.playbackRate = 1.0
			this.videoContext.playbackRate(this.playbackRate)
			this.getCourse()
			this.getVideo();

		},
		onReady: function() {},
		onShareAppMessage: function() {
			return {
				title: this.video.title,
				path: `/pages/course/video?course_id=${this.courseId}&video_id=${this.videoId}`,
				imageUrl: this.course.thumb
			}
		},
		methods: {
			getCourse() {
				uni.vk.callFunction({
					url: 'client/courses/pub/detail',
					data: {
						_id: this.courseId,
						need_user_info:true
					},
					success(res) {
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
					}
				});
			},
			changeRate(rate) {
				this.playbackRate = rate
				this.videoContext.playbackRate(this.playbackRate)
			},
			getVideo() {
				uni.showLoading({
					title: "加载中..."
				})
				that = this
				uni.vk.callFunction({
					url: 'client/videos/pub/detail',
					data: {
						course_id: this.courseId,
						video_id: this.videoId,
						need_user_info:true
					},
					success(res) {
						uni.setNavigationBarTitle({
							title: res.data.video.title,
						})
						// 	// 富文本图片溢出
						res.data.video.render_desc = res.data.video.render_desc.replace(/\<img/gi,
							'<img style="max-width:100%;height:auto" ');

						that.video = res.data.video
						that.isBuy = res.data.has_buy
						uni.hideLoading()
					}
				});
			},

			getPlayInfo() {
				video.playUrl(this.video.id).then(res => {
					if (res.urls.length === 0) {
						uni.showToast({
							icon: 'none',
							title: '播放地址为空',
						})
					} else {
						this.playInfo = res.urls
						this.playUrl = res.urls[0].url

						//记忆播放功能
						this.videoContext.play()

						if (this.videoWatchedProgress[this.video.id] && this.videoWatchedProgress[this.video.id]
							.watched_at == null) {
							this.videoContext.seek(this.videoWatchedProgress[this.video.id].watch_seconds)
							uni.showToast({
								title: "已为您定位至 " + util.durationForHuman(this.videoWatchedProgress[this
									.video.id].watch_seconds),
								icon: "none"
							})
						}

					}
				})
			},

			goVideo(videoId) {
				//切换视频
				this.videoId = videoId
				this.getVideo()
				//重置播放器
				this.playbackRate = 1.0
				this.videoContext.playbackRate(this.playbackRate)
			},

			playEnd(e) {
				uni.vk.callFunction({
					url: 'client/videos/kh/records',
					data: {
						course_id: this.courseId,
						video_id: this.videoId,
						watch_seconds: this.lastPlaySeconds,
						watched_at: 1
					}
				});
			},

			playTimeUpdate(e) {
				let seconds = parseInt(e.detail.currentTime);
				if (seconds - this.lastPlaySeconds > 10) {
					this.lastPlaySeconds = seconds
					uni.vk.callFunction({
						url: 'client/videos/kh/records',
						data: {
							course_id: this.courseId,
							video_id: this.videoId,
							watch_seconds: seconds
						}
					});
				}

			},

			buyCourse() {
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
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f2f2f2;
	}


	.play-box {
		position: relative;
		width: 100%;
		height: 210px;
		float: left;
		background-color: rgba(0, 0, 0, 1);
	}

	.xgplayer-mobile {
		padding-top: 50% !important;
	}

	.xgplayer-skin-default .xgplayer-poster {
		height: 192px !important;
		overflow: hidden;
	}

	.play-box>video {
		width: 100%;
		height: 210px;
		float: left;
	}

	.play-box>.no-auth {
		width: 100%;
		height: auto;
		float: left;
		box-sizing: border-box;
		padding-left: 30px;
		padding-right: 30px;
	}

	.play-box>.no-auth>.btn {
		display: inline-block;
		width: 100%;
		height: 42px;
		line-height: 42px;
		text-align: center;
		background-color: rgba(0, 0, 0, .9);
		color: rgba(23, 132, 237, 1);
		border: 1px solid rgba(23, 132, 237, 1);
		border-radius: 21px;
		margin-top: 70px;
	}

	.course-info {
		position: relative;
		width: 100%;
		min-height: 150rpx;
		background: #FFFFFF;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: 30rpx;

		.play-rate {
			width: 100%;
			height: 60rpx;
			display: flex;
			justify-content: left;
			align-items: center;

			text {
				color: #333333;
				line-height: 40rpx;
			}

			.rate-item {
				width: 80rpx;
				height: 40rpx;
				border-radius: 10rpx;
				line-height: 40rpx;
				font-size: 20rpx;
				text-align: center;
				border: 1rpx solid #ACAFC3;
				color: #ACAFC3;
				margin-left: 30rpx;
				font-weight: bold;
			}

			.active {
				color: #025BFF !important;
				background-color: #CCDEFF !important;
				border: 1rpx solid #CCDEFF;
			}
		}

		.course-title {
			font-size: 32rpx;
			font-weight: 800;
			color: #000000;
		}

		.course-desc {
			margin: 20rpx 0;
			color: #555555;
			font-size: 28rpx;
			text-align: justify;
			overflow: hidden;
			display: -webkit-box;
			text-overflow: ellipsis;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
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
		bottom: 30rpx;
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
				background-image: linear-gradient(to right, #FF104B, #FF785F);
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

			.active {
				color: #025BFF !important;
				font-weight: bold !important;
			}

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

				image {
					position: relative;
					top: 10rpx;
					display: inline-block;
					width: 28rpx;
					height: 20rpx;
					margin-left: 20rpx;
				}
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
</style>
