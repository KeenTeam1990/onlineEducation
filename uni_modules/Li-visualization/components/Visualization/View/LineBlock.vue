<template>
	<div class="html-box">
		<div :style="{width:getValue('width'),height:getValue('height'),background: getValue('background')}"> </div>
	</div>
</template>

<script>
	export default {
		name: 'LineBlock',
		props: ['data'],
		data() {
			return {
				options: {
					width: "100%",
					height: "20rpx",
					background: "#f7f8f9"
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
			}
		}
	}
</script>

<style lang="scss" scoped>
	.html-box {
		position: relative;
	}
</style>
