<template>
	<view class="content">
		<u-toast ref="uToast" />
		<!-- 自定义顶部导航栏 -->
		<!-- #ifdef H5 -->
		<u-navbar :is-back="false" :is-fixed="false" :border-bottom="false" :background="background">
			<view class="slot-wrap" style="margin-top: 20rpx;">
				<!-- <viw class="navabar-left">教师编</viw> -->
				<view class="search-wrap">
					<u-search v-model="keyword" :show-action="showAction" :animation="true" height="76"
						:action-style="{color:'#ffffff'}" :action-text="'搜 索'" @search="goSearch" @custom="goSearch">
					</u-search>
				</view>
			</view>
		</u-navbar>
		<!-- #endif -->
		<!-- #ifndef H5 -->
		<u-navbar :is-back="false" :is-fixed="isFixed" :border-bottom="false" :background="background">
			<view class="slot-wrap">
				<!-- <viw class="navabar-left">教师编</viw> -->
				<view class="search-wrap">
					<u-search v-model="keyword" :show-action="showAction" :animation="true" height="76"
						:action-style="{color:'#ffffff'}" :action-text="'搜 索'" @search="goSearch" @custom="goSearch">
					</u-search>
				</view>
			</view>
		</u-navbar>
		<!-- #endif -->

		<!--幻灯片栏-->
		<view class="swiper-box shadow-blur">
			<u-swiper mode="none" bg-color="#4687FF" :list="sliders" name="url" :title="true" height="294"
				@click="swiperClick">
			</u-swiper>
		</view>

		<!-- 宫格导航  -->
		<swiper class="swiper" :style="{height:(nav_row*90+Math.floor(nav_row/2)*15)+'px'}" @change="nav_change"
			v-if="home_nav.length>0">
			<block v-for="(item, index) in Math.ceil(home_nav.length/(nav_column*nav_row))">
				<swiper-item>
					<u-grid :border="false" :col="nav_column" @click="navClick" hover-class="hover-class">
						<u-grid-item :custom-style="customStyle" v-for="(item_sub, index_sub) in (nav_column*nav_row)"
							:index="index*(nav_column*nav_row)+index_sub" :key="index*nav_column+index_sub"
							v-if="index*(nav_column*nav_row)+index_sub<home_nav.length">
							<u-icon :name="home_nav[index*(nav_column*nav_row)+index_sub].url" :size="110"></u-icon>
							<text class="grid-text">{{ home_nav[index*(nav_column*nav_row)+index_sub].title }}</text>
						</u-grid-item>
					</u-grid>
				</swiper-item>
			</block>
		</swiper>
		<view class="indicator-dots" v-if="Math.ceil(home_nav.length/(nav_column*nav_row))>1">
			<block v-for="(item, index) in Math.ceil(home_nav.length/(nav_column*nav_row))">
				<view class="indicator-dots-item" :class="[nav_current == index ? 'indicator-dots-active' : '']">
				</view>
			</block>
		</view>

		<!-- 装修布局 -->
		<Visualization :tag="'index_block'"></Visualization>
	</view>
</template>

<script>
	var that; // 当前页面对象
	var vk; // vk依赖
	let systemInfo = uni.getSystemInfoSync()
	export default {
		data() {
			// 页面数据变量
			return {
				statusBarHeight: systemInfo.statusBarHeight,
				customStyle: {
					padding: '10rpx 0'
				},
				background: {
					backgroundColor: '#FFFFFF',
					backgroundImage: 'linear-gradient(180deg, #1663ff, #4687FF)'
				},
				showAction: true,
				isFixed: true,
				keyword: '',
				sliders: [],
				home_nav: [],
				nav_column: 5,
				nav_row: 1,
				nav_current: 0
			}
		},
		// 监听 - 页面每次【加载时】执行(如：前进)
		onLoad(options = {}) {
			that = this;
			vk = that.vk;
			that.options = options;
			that.init(options);
		},
		// 函数
		methods: {
			navClick(e) {
				this.pageTo(this.home_nav[e].href)
			},
			nav_change(e) {
				this.nav_current = e.detail.current;
			},
			// 页面数据初始化函数
			init(options) {
				this.getHomenav()
				this.getSliders()
			},
			getSliders() {
				vk.callFunction({
					url: 'client/sliders/pub/all',
					success(data) {
						that.sliders = data.rows.map(v => {
							v.url = v.thumb.path
							return v
						})
					}
				});
			},
			getHomenav() {
				vk.callFunction({
					url: 'client/home_nav/pub/all',
					success(data) {
						that.home_nav = data.rows.map(v => {
							v.url = v.thumb.path
							return v
						})
					}
				});
			},
			//查询事件
			goSearch(keyword) {
				getApp().globalData.searchText = keyword
				vk.navigateTo('/pages/search/search');
			},
			//幻灯片点击事件
			swiperClick(index) {},
			pageTo(path) {
				vk.navigateTo(path);
			}
		},
		// 过滤器
		filters: {

		},
		// 计算属性
		computed: {

		}
	}
</script>
<style lang="scss">
	.slot-wrap {
		display: flex;
		align-items: center;
		flex: 1;
	}

	.search-wrap {
		margin: 0 20rpx 10rpx 20rpx;
		flex: 1;
	}

	.navabar-left {
		position: relative;
		margin: 0 16rpx;
		display: flex;
		width: 110rpx;
		text-align: center;
		font-size: 30rpx;
		font-weight: bold;

		&:after {
			content: '';
			position: absolute;
			right: -10rpx;
			top: 16rpx;
			width: 0;
			height: 0;
			border: 10rpx solid transparent;
			border-top-color: rgb(94, 89, 89);
		}
	}

	.recommend {
		position: sticky;
		top: 200rpx;
		background: #FFFFFF;
		z-index: 999;
		width: 100%;
	}

	// .white-bg {
	// 	z-index: 88;
	// 	background: #FFFFFF;
	// }

	/* 幻灯片 */
	.swiper-box {
		position: relative;
		width: 100%;
		height: auto;
		box-sizing: border-box;
		padding: 16rpx 30rpx;
		background: #79ACFF;
		background-image: linear-gradient(180deg, #4687FF, #79ACFF, #FFFFFF)
	}

	.grid-text {
		font-size: 28rpx;
		margin-top: 4rpx;
		letter-spacing: 2rpx;
		color: $u-type-info;
	}

	.swiper {
		position: relative;
		// height: 480rpx;
	}

	.indicator-dots {
		margin-top: 10rpx;
		margin-bottom: 20rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	// .indicator-dots-item {
	// 	background-color: $u-tips-color;
	// 	height: 6px;
	// 	width: 6px;
	// 	border-radius: 10px;
	// 	margin: 0 3px;
	// }

	// .indicator-dots-active {
	// 	background-color: $u-type-primary;
	// }

	.indicator-dots-item {
		width: 14rpx;
		height: 14rpx;
		margin: 0 6rpx;
		border-radius: 20rpx;
		transition: all 0.5s;
		background-color: $u-tips-color;
	}

	.indicator-dots-active {
		width: 34rpx;
		background-color: $u-type-primary;
	}
</style>
