<template>
	<view class="page-container invitation-container">
		<uni-nav-bar dark :fixed="true" status-bar left-icon="left" :border="false" title="我的邀请" @clickLeft="goBack" />
		<view class="pt-4 pl-3 pr-3 pb-3">
			<image class="image about-logo-image" :src="logo" mode="aspectFit" />
			<view class="mt-4 fs_14">

			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				logo: require("@/static/uni.png"),
				
			}
		},
		methods: {
			goBack() {
				uni.navigateBack({
					delta: 1
				})
			},
		}
	}
</script>

<style>

</style>
