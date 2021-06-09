<template>
	<div class="html-box">
		<div v-html="data.data.length>0?data.data:'<h1>UCE知识</h1>'"></div>
	</div>
</template>

<script>
	export default {
		name: 'RichText',
		props: ['data', 'className']
	}
</script>

<style lang="scss" scoped>
	.html-box {
		position: relative;
	}
</style>
