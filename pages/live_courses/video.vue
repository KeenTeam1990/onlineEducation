<template>
	<view class="container">
		<web-view :src="webViewSrc"></web-view>
	</view>
</template>

<script>
	const db = uniCloud.database()
	export default {
		data() {
			return {
				userInfo: null,
				roomId: null,
				courseId: null,
				webViewSrc: "",
				roomInfo: null,
				signInfo: null
			};
		},
		onLoad(options) {
			this.roomId = options.video_id
			this.courseId = options.course_id
			this.userInfo = uni.getStorageSync("userInfo")
			this.getRoomInfo()
		},
		methods: {
			getRoomInfo() {
				var that = this
				uni.vk.callFunction({
					url: 'client/live_courses/kh/agora',
					data: {
						roomId: that.roomId,
						courseId: that.courseId
					},
					success(data) {
						that.signInfo = data.data.sign
						that.userInfo = data.data.userInfo
						that.roomInfo = data.data.roomInfo
						that.startLive()
					}
				});
			},
			startLive() {
				// Room1v1Class	0: 1 对 1 互动教学。1 位老师对 1 名学生进行专属在线辅导教学。
				// RoomBigClass	2: 互动直播大班课。1 位老师进行在线教学，多名学生实时观看和收听。学生人数无上限。上课过程中，学生可“举手”请求发言，与老师进行实时音视频互动。
				// RoomSmallClass	4: 在线互动小班课。1 位老师进行在线教学，多名学生实时观看和收听。课堂人数上限为 500。上课过程中，老师可点名学生“上台”发言，与老师进行实时音视频互动。
				let param = {
					appId: this.signInfo.appID,
					rtmToken: this.signInfo.sign,
					userUuid: this.signInfo.userUuid,
					userName: this.userInfo.nickname,
					roomUuid: this.signInfo.roomUuid,
					roleType: 2,//学生
					roomType: 2,
					roomName: this.roomInfo.title,
				}
				console.log("封装前参数", param)
				this.webViewSrc = "/hybrid/html/agora.html?data=" + encodeURIComponent(this.queryParams(param))
			},
			/**
			 * 对象转url参数
			 * @param {*} data
			 * @param {*} isPrefix
			 */
			queryParams(data, isPrefix) {
				isPrefix = isPrefix ? isPrefix : false
				let prefix = isPrefix ? '?' : ''
				let _result = []
				for (let key in data) {
					let value = data[key]
					// 去掉为空的参数
					if (['', undefined, null].includes(value)) {
						continue
					}
					if (value.constructor === Array) {
						value.forEach(_value => {
							_result.push(encodeURIComponent(key) + '[]=' + encodeURIComponent(_value))
						})
					} else {
						_result.push(encodeURIComponent(key) + '=' + encodeURIComponent(value))
					}
				}

				return _result.length ? prefix + _result.join('&') : ''
			}
		}
	}
</script>

<style lang="scss">
	.container {
		width: 100wh;
		height: 100vh;
	}
</style>
