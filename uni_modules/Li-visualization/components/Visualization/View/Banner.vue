<template>
	<view class="uce-swiper">
		<view v-if="data && data.data && data.data.length > 0" class="swiper--box" :style="{padding:getValue('padding','0')}">
			<u-swiper :list="data.data" name="url" :mode="getValue('mode','round')" :height="getValue('height',300)"
				:indicator-pos="getValue('indicator_pos','bottomCenter')" :autoplay="getValue('autoplay',true)"
				:interval="getValue('interval',2500)" :circular="getValue('circular',true)"
				:duration="getValue('duration',500)" :border-radius="getValue('border_radius',8)"
				:img-mode="getValue('img_mode','widthFix')" :bg-color="getValue('bg_color','#ffffff')"
				:current="getValue('current',0)" :effect3d="getValue('effect3d',false)"
				:effect3d-previous-margin="getValue('effect3d_previous_margin',50)" @click="swiperClick"></u-swiper>
		</view>
		<view v-else :style="'height: '+getValue('height',300)+'rpx;'" style="display: block;">
			<u-image width="100%" height="100%" mode="scaleToFill"></u-image>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'Banner',
		props: ['data', 'className'],
		methods: {
			swiperClick(e) {},
			getValue(key, defaultValue) {
				let customDatas = this.data.options.swiperConfig
				let value = customDatas[key];
				if (typeof value === "undefined") {
					value = defaultValue;
				}
				return value;
			}
		},
		mounted() {
			console.log(this.data)
		}
	}
</script>

<style lang="scss" scoped>
	.swiper--box {
		width: 100%;
		position: relative;
	}
</style>
