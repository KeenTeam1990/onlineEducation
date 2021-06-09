<template>
	<view>
		<!-- 装修布局 -->
		<Visualization :tag="tag"></Visualization>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tag: 'index_block'
			};
		},
		onLoad(options) {
			this.tag = options.tag
		}
	}
</script>

<style lang="scss">

</style>
