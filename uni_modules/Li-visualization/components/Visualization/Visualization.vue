<template>
	<view>
		<block v-for="(item,index) in list.datas" :key="index">
			<BannerView v-if="item.type=='banner'" :data="item" :className="getClassName(item)"></BannerView>
			<ImageView v-else-if="item.type=='images'" :data="item" :className="getClassName(item)"></ImageView>
			<RichTextView v-else-if="item.type=='rich_text'" :data="item" :className="getClassName(item)">
			</RichTextView>
			<CoursesView v-else-if="item.type=='courses'" :data="item" :className="getClassName(item)">
			</CoursesView>
			<LiveCoursesView v-else-if="item.type=='live_courses'" :data="item" :className="getClassName(item)">
			</LiveCoursesView>
			<ProductView v-else-if="item.type=='product'" :data="item" :className="getClassName(item)">
			</ProductView>
			<LineBlock v-else-if="item.type=='line_block'" :data="item" :className="getClassName(item)"></LineBlock>
			<Section v-else-if="item.type=='section'" :data="item" :className="getClassName(item)"></Section>
			<Announce v-else-if="item.type=='announce'" :data="item" :className="getClassName(item)"></Announce>
		</block>
	</view>
</template>

<script>
	import BannerView from '@/uni_modules/Li-visualization/components/Visualization/View/Banner.vue'
	import ImageView from '@/uni_modules/Li-visualization/components/Visualization/View/Images.vue'
	import RichTextView from '@/uni_modules/Li-visualization/components/Visualization/View/RichText.vue'
	import CoursesView from '@/uni_modules/Li-visualization/components/Visualization/View/Courses.vue'
	import LiveCoursesView from '@/uni_modules/Li-visualization/components/Visualization/View/LiveCourses.vue'
	import ProductView from '@/uni_modules/Li-visualization/components/Visualization/View/Product.vue'
	import LineBlock from '@/uni_modules/Li-visualization/components/Visualization/View/LineBlock.vue'
	import Section from '@/uni_modules/Li-visualization/components/Visualization/View/Section.vue'
	import Announce from '@/uni_modules/Li-visualization/components/Visualization/View/Announce.vue'
	export default {
		name: 'Visualization',
		props: ['tag'],
		components: {
			BannerView,
			ImageView,
			RichTextView,
			CoursesView,
			LiveCoursesView,
			ProductView,
			LineBlock,
			Section,
			Announce
		},
		data() {
			return {
				list: []
			}
		},
		mounted() {
			let that = this
			uni.vk.callFunction({
				url: 'plugs/client/visualization/pub/getList',
				data: {
					tag: that.tag
				},
				success(data) {
					that.list = data.data
					//是否设置页面标题
					if(data.data.show_nav==true){
						uni.setNavigationBarTitle({
							title:data.data.datas[0].title
						})
					}
				}
			});
		},
		methods: {
			getClassName(item) {
				if (item.tabType == undefined)
					return ''
				else if (item.tabType == 1)
					return 'one'
				else if (item.tabType == 2)
					return 'two'
				else if (item.tabType == 3)
					return 'three'
			}
		}
	}
</script>

<style>
</style>
