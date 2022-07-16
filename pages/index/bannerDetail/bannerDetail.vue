<template>
	<view class="page-container bannerDetail-container">
		<uni-nav-bar dark :fixed="true" status-bar left-icon="left" :border="false" title="悦众科技" @clickLeft="goBack" />
		<view class="pt-4 pl-3 pr-3 pb-3">
			<view class="text-center fs_18 mb-2">{{ title }}</view>
			<view v-html="content"></view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title:"",
				content:"",
			}
		},
		onLoad(option) {
			this.initDetail(option.id);
		},
		methods: {
			goBack() {
				uni.navigateBack({
					delta: 1
				})
			},
			// 获取详情
			initDetail(id){
				this.$api.bannerDetail({
					id: id,
				}).then(res=>{
					if(res.code == 0){
						this.title = res.data.title;
						this.content = this.$util.formatRichText(res.data.content);
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
