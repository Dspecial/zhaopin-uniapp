<template>
	<view class="page-container auth-container">
		<uni-nav-bar dark :fixed="true" status-bar left-icon="left" :border="false" title="关于我们" @clickLeft="goBack" />
		<view class="pt-4 pl-3 pr-3 pb-3">
			<image class="image about-logo-image" :src="logo" mode="aspectFit" />
			<view class="mt-4 fs_14">
				<view v-html="aboutUs" class="aboutContent"></view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				logo: require("@/static/uni.png"),
				aboutUs:"",
			}
		},
		onLoad(){
			this.initLogo();
			this.initAbout();
		},
		methods: {
			goBack() {
				uni.navigateBack({
					delta: 1
				})
			},
			
			// 获取logo
			initLogo(){
				this.$api.aboutUs({
					name: 'logo',
				}).then(res=>{
					if(res.code == 0){
						this.logo = this.$globalUrl.baseUrl + res.data.value;
					}else{
						uni.showToast({
							title: res.msg,
							icon: 'none'
						});
					}
				});
			},
			
			// 获取简介
			initAbout(){
				this.$api.aboutUs({
					name: 'aboutus',
				}).then(res=>{
					if(res.code == 0){
						this.aboutUs = this.$util.formatRichText(res.data.value);
					}else{
						uni.showToast({
							title: res.msg,
							icon: 'none'
						});
					}
				});
			},
			
			
		}
	}
</script>

<style>

</style>
