<template>
	<view class="vk-u-notice-bar">
		<view v-if="datas && datas.list && datas.list.length > 0">
			<u-notice-bar
			:list="getValue('list')"
			:mode="getValue('mode','horizontal')"
			:type="getValue('type','warning')"
			:volume-icon="getValue('volume-icon', true)"
			:more-icon="getValue('more-icon')"
			:close-icon="getValue('close-icon')"
			:autoplay="getValue('autoplay', true)"
			:color="getValue('color')"
			:bg-color="getValue('bg-color')"
			:show="getValue('show', true)"
			:volume-size="getValue('volume-size')"
			:font-size="getValue('font-size')"
			:duration="getValue('duration', 2000)"
			:speed="getValue('speed', 160)"
			:is-circular="getValue('is-circular', true)"
			:play-state="getValue('play-state', 'play')"
			:disable-touch="getValue('disable-touch', true)"
			:padding="getValue('padding')"
			:border-radius="getValue('border-radius')"
			:no-list-hidden="getValue('no-list-hidden', true)"
			@click="onClick"
			@close="onClose"
			@getMore="onGetMore"
			@end="onEnd"
			></u-notice-bar>
		</view>
	</view>
</template>

<script>
	export default {
		name: "vk-u-notice-bar",
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
			// 点击通告文字触发，只有mode = vertical，或者mode = horizontal且is-circular = false时有效
			onClick(index){
				this.$emit("click",index);
			},
			// 点击右侧关闭图标触发
			onClose(){
				this.$emit("close");
			},
			// 点击右侧向右图标触发
			onGetMore(){
				this.$emit("getMore");
			},
			// 列表的消息每次被播放一个周期时触发，只有mode = vertical，或者mode = horizontal且is-circular = false时有效
			onEnd(){
				this.$emit("end");
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
			}
		}
	}
</script>

<style lang="scss" scoped>
	
</style>
