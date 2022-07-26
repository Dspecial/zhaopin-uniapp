<template>
	<view class="backHome bg-primary-600 d-flex align-items-center justify-content-center p-2" @click="goHome">
		<uni-icons type="home-filled" size="26" color="#FFFFFF"></uni-icons>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			// 跳转首页
			goHome(){
				uni.reLaunch({
					url: "/pages/index/index",
				})
			},
		}
	}
</script>

<style>

</style>
