<template>
	<view class="page-container auth-container">
		<uni-nav-bar dark :fixed="true" status-bar left-icon="left" :border="false" title="注册须知" @clickLeft="goBack" />
		<view class="pt-4 pl-3 pr-3 pb-3">
			<view class="mt-4 fs_14">
				<view v-html="guidanceTxt" class="aboutContent"></view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				logo: require("@/static/uni.png"),
				guidanceTxt:"",
			}
		},
		onLoad(){
			this.initGuidance();
		},
		methods: {
			goBack() {
				uni.navigateBack({
					delta: 1
				})
			},
			
			// 获取注册须知
			initGuidance(){
				this.$api.aboutUs({
					name: 'register_agree',
				}).then(res=>{
					if(res.code == 0){
						this.guidanceTxt = this.$util.formatRichText(res.data.value);
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
