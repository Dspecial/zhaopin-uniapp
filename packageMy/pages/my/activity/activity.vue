<template>
	<view class="page-container job-container">
		<uni-nav-bar dark :fixed="true" status-bar left-icon="left" :border="false" title="负责活动" @clickLeft="goBack" />
		<view class="pl-3 pr-3 pb-3 pt-1">
			<view class="job_tab">
				<uni-segmented-control :current="currentTab" :values="tabs" @clickItem="onClickItem" />
			</view>
			<!-- 有授权 -->
			<template v-if="user_token">
				<view class="recommend-box">
					<view class="box-content">
						<template v-for="(cell,index) in tab_content_list">
							<view class="recommend-item p-3 mt-2" :key="index" >
								<view @click="goDetail(cell)">
									<view class="header d-flex justify-content-between align-items-center">
										<text class="d-block fs_14 font-weight-semibold">{{ cell.title }}</text>
										<text class="d-block fs_15 font-weight-semibold pay">
											<text v-if="cell.status == 1">报名中</text>
											<text v-else-if="cell.status == 2">进行中</text>
											<text v-else-if="cell.status == 3">已结束</text>
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
										<view class="d-flex justify-content-between align-items-center mt-1">
											<view class="d-flex align-items-center">
												<uni-icons type="location-filled" size="14"></uni-icons>
												<text class="fs_11 ml-1">{{ cell.name }}</text>
											</view>	
											<view class="d-flex align-items-center">
												<view class="d-flex align-items-center">
													<uni-icons type="eye-filled" size="14"></uni-icons>
													<text class="fs_11 ml-1">{{ cell.all_views }}</text>
												</view>
											</view>
										</view>
										<view class="d-flex justify-content-end align-items-center mt-1">
											<view class="d-flex align-items-center mr-3">
												<image class="image" :src="personsIcon" mode="scaleToFill" style="width:24rpx;height:24rpx" />
												<text class="fs_11 ml-1">待审: {{ cell.loading_check }}</text>
											</view>
											<view class="d-flex align-items-center mr-3">
												<image class="image" :src="personsIcon" mode="scaleToFill" style="width:24rpx;height:24rpx" />
												<text class="fs_11 ml-1">通过: {{ cell.sign }}</text>
											</view>
											<view class="d-flex align-items-center">
												<image class="image" :src="personsIcon" mode="scaleToFill" style="width:24rpx;height:24rpx" />
												<text class="fs_11 ml-1">招聘: {{ cell.numbers }}</text>
											</view>
										</view>
									</view>
								</view>
							</view>
						</template>
						<uni-load-more :status="loadStatus"></uni-load-more>
					</view>
				</view>
			</template>
			<!-- 尚未授权 -->
			<template v-else>
				<span class="bg-primary-600 fs_16 no-auth-btn" @click="goAuth">请点击登录</span>
			</template>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				user_token:"",
				currentTab: 0,
				tabs: ['全部', '报名中', '进行中', '已结束'],
				personsIcon:require("@/static/index/personsIcon.png"),
				tab_content_list:[],
				currentPage:1,
				pageSize:5,
				total:0,
				loadStatus:"more",
			}
		},
		onLoad(){
			
		},
		onshow(){
			this.user_token = uni.getStorageSync('user_token');
			var eObj = {
				currentIndex:0
			};
			if(this.user_token){
				this.onClickItem(eObj);
			}
		},
		methods: {
			goBack() {
				uni.navigateBack({
					delta: 1
				})
			},
			
			// 跳转授权页面
			goAuth(){
				uni.navigateTo({
					// 保留当前页面，跳转到应用内的某个页面,使用uni.navigateBack可以返回到原页面
					url: "/pages/auth/auth"
				})
			},
			
			// tab切换
			onClickItem(e) {
				if (this.currentTab !== e.currentIndex) {
					this.currentTab = e.currentIndex
				}
				this.loadStatus = "more";
				this.currentPage = 1;
				this.pageSize = 5;
				this.total = 0;
				this.initEnrolledList(this.currentTab);
			},
			
			// 获取报名列表
			initEnrolledList(type){
				this.$api.activityList({
					token:uni.getStorageSync('user_token'),
					type:type, 	// 类型:1=临时,2=长期
					page:this.currentPage,
					limit:this.pageSize
				}).then(res=>{
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
				});
			},
			
			// 查看详情
			goDetail(item){
				uni.navigateTo({
					// 保留当前页面，跳转到应用内的某个页面,使用uni.navigateBack可以返回到原页面
					url: "/packageMy/pages/my/activity/activityDetail?sn=" + item.sn,
				})
			},
		},
		
		// 上拉加载
		onReachBottom() {
			this.currentPage++;
			if (this.tab_content_list.length < this.total) {
				this.initEnrolledList(this.currentTab);
			} else {
				uni.hideNavigationBarLoading();
				this.loadStatus = "no-more";
			}
		},
		
		// 下拉刷新
		onPullDownRefresh(){
			this.loadStatus = "more";
			this.currentPage = 1;
			this.pageSize = 5;
			this.total = 0;
			this.initEnrolledList(this.currentTab);
			setTimeout(function () {
				uni.stopPullDownRefresh();  //停止下拉刷新动画
			}, 1000);
		},
	}
</script>

<style>

</style>
