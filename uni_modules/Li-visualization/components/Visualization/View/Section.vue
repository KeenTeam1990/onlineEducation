<template>
	<div class="section-box">
		<u-section :title="getValue('title')" :sub-title="getValue('sub_title')" :right="getValue('right')"
			:color="getValue('color')" @click="open(getValue('url'))"></u-section>
	</div>
</template>

<script>
	export default {
		name: 'Section',
		props: ['data'],
		data() {
			return {
				options: {
					title: "今日热门",
					sub_title: "查看更多",
					right: true,
					color: "#1663ff",
					url: ''
				}
			}
		},
		methods: {
			getValue(key, defaultValue = '') {
				let customDatas = this.data.options
				let value = defaultValue;
				if (typeof customDatas[key] === "undefined") {
					value = this.options[key];
					if (typeof value === "undefined") {
						value = defaultValue;
					}
				} else {
					value = customDatas[key]
				}
				return value;
			},
			open(path){
				uni.vk.navigateTo(path);
			}
		}
	}
</script>

<style lang="scss" scoped>
	.section-box {
		position: relative;
		padding: 20rpx 15rpx;
	}
</style>
