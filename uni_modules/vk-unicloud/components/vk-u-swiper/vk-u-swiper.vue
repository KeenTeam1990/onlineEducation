<template>
	<view class="vk-u-swiper">
		<view v-if="datas && datas.list && datas.list.length > 0">
			<u-swiper 
				:list="getValue('list')"
				:title="getValue('title')"
				:mode="getValue('mode','round')"
				:height="getValue('height',300)"
				:indicator-pos="getValue('indicator-pos','bottomCenter')"
				:autoplay="getValue('autoplay',true)"
				:interval="getValue('interval',2500)"
				:circular="getValue('circular',true)"
				:duration="getValue('duration',500)"
				:border-radius="getValue('border-radius',8)"
				:title-style="getValue('title-style')"
				:img-mode="getValue('img-mode','aspectFill')"
				:name="getValue('name','image')"
				:bg-color="getValue('bg-color','#f3f4f6')"
				:current ="getValue('current',0)"
				:effect3d="getValue('effect3d')"
				:effect3d-previous-margin="getValue('effect3d-previous-margin',50)"
				
				@click="onClick"
				@change="onChange"
			></u-swiper>
		</view>
		<view v-else 
			:style="'height: '+getValue('height',300)+'rpx;'"
			style="display: block;"
			>
			<u-image width="100%" height="100%" mode="scaleToFill"></u-image>
		</view>
	</view>
</template>

<script>
	export default {
		name: "vk-u-swiper",
		props: {
			dataId:{
				type: String,
				default () {
					return "";
				}
			},
			datas: {
				type: Object,
				default () {
					return {};
				}
			},
			customDatas: {
				type: Object,
				default () {
					return {};
				}
			}
		},
		data: function () {
			// 组件创建时,进行数据初始化
			return {
				
			}
		},
		mounted() {
			
		},
		methods: {
			// 点击轮播图时触发 index：点击了第几张图片，从0开始
			onClick(index){
				this.$emit("click",index);
			},
			// 轮播图切换时触发(自动或者手动切换) index：切换到了第几张图片，从0开始
			onChange(index){
				this.$emit("change",index);
			},
			getValue(key, defaultValue){
				let { customDatas, datas } = this;
				if(!customDatas) customDatas = {};
				if(!datas) datas = {};
				let value = customDatas[key];
				if(typeof value === "undefined"){
					value = datas[key];
					if(typeof value === "undefined"){
						value = defaultValue;
					}
				}
				return value;
			},
		}
	}
</script>

<style lang="scss" scoped>
	
</style>
