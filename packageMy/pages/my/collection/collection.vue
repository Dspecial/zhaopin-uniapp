<template>
	<view class="page-container job-container">
		<uni-nav-bar dark :fixed="true" status-bar left-icon="left" :border="false" title="我的收藏" @clickLeft="goBack" />
		<view class="pl-3 pr-3 pb-3 pt-1">
			<view class="recommend-box">
				<view class="box-content">
					<template v-for="(cell,index) in tab_content_list">
						<view class="recommend-item p-3 mt-2" :key="index" @click="goDetail(cell)">
							<view class="header d-flex justify-content-between align-items-center">
								<text class="d-block fs_14 font-weight-semibold">{{ cell.title }}</text>
								<text class="d-block fs_15 font-weight-semibold pay">
									￥{{ cell.money }}
									<text v-if="cell.type == 1">/小时</text>
									<text v-else-if="cell.type == 2">/天</text>
									<text v-else-if="cell.type == 3">/周</text>
									<text v-else-if="cell.type == 4">/月</text>
								</text>
							</view>
							<view class="content mt-2 mb-2">
								{{ cell.brief }}
							</view>
							<view class="footer">
								<view class="">
									<uni-icons type="calendar-filled" size="14"></uni-icons>
									<text class="fs_11 ml-1">{{ cell.startdate }} - {{ cell.enddate }}</text>
								</view>
								<view class="d-flex justify-content-between align-items-center">
									<view class="d-flex align-items-center">
										<uni-icons type="location-filled" size="14"></uni-icons>
										<text class="fs_11 ml-1">{{ cell.name }}</text>
									</view>	
									<view class="d-flex align-items-center">
										<view class="d-flex align-items-center mr-3">
											<image class="image" :src="personsIcon" mode="scaleToFill" style="width:24rpx;height:24rpx" />
											<text class="fs_11 ml-1">{{ cell.numbers }}</text>
										</view>
										<view class="d-flex align-items-center">
											<uni-icons type="eye-filled" size="14"></uni-icons>
											<text class="fs_11 ml-1">{{ cell.all_views }}</text>
										</view>
									</view>
								</view>
							</view>
						</view>
					</template>
					<uni-load-more :status="loadStatus"></uni-load-more>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				personsIcon:require("@/static/index/personsIcon.png"),
				tab_content_list:[],
				currentPage:1,
				pageSize:10,
				total:0,
				loadStatus:"more",
			}
		},
		onLoad(){
			this.initCollection();
		},
		onShow(){
			
		},
		methods: {
			goBack() {
				uni.navigateBack({
					delta: 1
				})
			},
			
			// 获取求职列表
			initCollection(){
				this.$api.collectionList({
					// city_id: uni.getStorageSync('city_id'),
					token:uni.getStorageSync('user_token'),
					page:this.currentPage,
					limit:this.pageSize
				}).then(res=>{
					if(res.code == 0){
						this.total = res.data.total;
						if (this.currentPage == 1) {
							this.tab_content_list = res.data.data;
							if (this.tab_content_list.length < this.total) {
								this.loadStatus = "more";
							} else {
								this.loadStatus = "no-more";
							}
						} else {
							this.loadStatus = "loading";
							setTimeout(()=>{
								this.tab_content_list = this.tab_content_list.concat(res.data.data);
								if (this.tab_content_list.length < this.total) {
									this.loadStatus = "more";
								} else {
									this.loadStatus = "no-more";
								}
							},1000)
						};
						uni.hideNavigationBarLoading();
					}else{
						uni.showToast({
							title: res.msg,
							icon: 'none'
						});
					}
					
				});
			},
			
			// 查看详情
			goDetail(item){
				uni.navigateTo({
					// 保留当前页面，跳转到应用内的某个页面,使用uni.navigateBack可以返回到原页面
					url: "/pages/job/jobDetail?sn=" + item.sn,
				})
			},
		},
		
		// 上拉加载
		onReachBottom() {
			this.currentPage++;
			if (this.tab_content_list.length.length < this.total) {
				this.initCollection();
			} else {
				uni.hideNavigationBarLoading();
				this.loadStatus = "no-more";
			}
		},
		
		// 下拉刷新
		onPullDownRefresh(){
			this.loadStatus = "more";
			this.currentPage = 1;
			this.pageSize = 10;
			this.total = 0;
			this.initCollection();
			setTimeout(function () {
				uni.stopPullDownRefresh();  //停止下拉刷新动画
			}, 1000);
		},
	}
</script>

<style>

</style>
