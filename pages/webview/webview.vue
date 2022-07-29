<template>
	<view>
		<web-view :src="url"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				 url:''
			}
		},
		onLoad(item) { // 获取传递过来的链接
			this.url = item.url;
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
