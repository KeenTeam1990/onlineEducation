<template>
	<view class="app">
		<!-- 页面内容开始 -->
		
		这里是404页面
		
		<!-- 页面内容结束 -->
	</view>
</template>

<script>
	var that;											// 当前页面对象
	var vk;												// vk依赖
	export default {
		data() {
			// 页面数据变量
			return {

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
			// 页面数据初始化函数
			init(options){
				console.log("init: ",options);
			},
			pageTo(path){
				vk.navigateTo(path);
			}
		},
		// 过滤器
		filters:{
			
		},
		// 计算属性
		computed:{
			
		}
	}
</script>
<style lang="scss" scoped>
	
	
</style>