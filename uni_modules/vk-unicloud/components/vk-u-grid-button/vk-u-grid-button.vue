<template>
	<view class="vk-u-grid-button" v-if="getValue('show', true)">
		<view v-if="datas && datas.list && datas.list.length > 0">
			<view class="grid-view">
				<u-grid 
					:col="getValue('col', 4)" 
					:border="getValue('border', false)" 
					:hover-class="getValue('hover-class', 'vk-hover-class')"
					>
					<u-grid-item v-for="(item,index) in datas.list" :key="index" @click="onClick(item)">
						<u-badge v-if="item.badge" :count="item.badge" :offset="[20, 20]"></u-badge>
						<u-image v-if="item['icon'] && item['icon'].indexOf('http') == 0"
							mode="scaleToFill"
							:src="item['icon']"
							:height="getValue('icon-size', 46)"
							:width="getValue('icon-size', 46)"
							:lazy-load="false"
							:fade="false"
						></u-image>
						<u-icon v-else 
							:name="item['icon'] || 'photo'" 
							:size="getValue('icon-size', 46)" 
							:color="item['icon-color'] || getValue('icon-color', 'inherit')" 
							>
						</u-icon>
						
						<view class="grid-text"
						:style="{
							fontSize:getValue('text-size', 24) + 'rpx',
							color:item['text-color'] || getValue('text-color', '#000000'),
							marginTop:getValue('text-margin-top', 10) + 'rpx'
						}"
						>{{item.text}}</view>
						
						<button
							v-if="item.openType"
							:open-type="item.openType"
							plain="true"
							style="width: 100rpx;height: 140rpx;position: absolute;border: 0;"
						></button>
						
					</u-grid-item>
				</u-grid>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "vk-u-grid-button",
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
			pageTo(url){
				this.vk.navigateTo(url);
			},
			onClick(item){
				let that = this;
				let { vk } = that;
				if(item.miniProgram){
					vk.navigateToMiniProgram(item.miniProgram);
				}else if(item.page){
					that.pageTo(item.page);
				}else{
					that.$emit("click",item);
				}
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
		},
		// 过滤器
		filters: {
		
		},
		// 计算属性
		computed: {
			
		}
	}
</script>

<style lang="scss" scoped>
	.grid-text{
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
	}
</style>
