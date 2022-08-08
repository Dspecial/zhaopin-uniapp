<template>
	<view class="page-container job-container">
		<uni-nav-bar dark :fixed="true" status-bar title="我的报名"/>
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
										<text class="d-block fs_15 font-weight-semibold">
											<!-- 状态 -->
											<!-- 如果status=1或2:is_check=2 报名审核中;is_check=3 审核通过;is_check=4 报名不通过;is_check=5自主取消
											如果status=3 :is_check = 2 已结束;is_check=3的时候 如果is_end=1考勤待审核;is_end=2考勤已审核;is_check=4 报名不通过;is_check=5自主取消 -->
											<template v-if="cell.status == 1 || cell.status == 2">
												<text v-if="cell.is_check == 2" class="text-orange ml-1">报名审核中</text>
												<text v-else-if="cell.is_check == 3" class="text-success ml-1">审核通过</text>
												<text v-else-if="cell.is_check == 4" class="text-danger ml-1">报名不通过</text>
												<text v-else-if="cell.is_check == 5" class="text-grey-150 ml-1">自主取消</text>
											</template>
											<template v-else-if="cell.status == 3">
												<text v-if="cell.is_check == 2" class="text-grey-150 ml-1">已结束</text>
												<template v-else-if="cell.is_check == 3">
													<text v-if="cell.is_end == 1" class="text-orange ml-1">考勤待审核</text>
													<text v-else-if="cell.is_end == 2" class="text-success ml-1">考勤已审核</text>
												</template>
												<text v-else-if="cell.is_check == 4" class="text-danger ml-1">报名不通过</text>
												<text v-else-if="cell.is_check == 5" class="text-grey-150 ml-1">自主取消</text>
											</template>
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
											<!-- <view>
												<text v-if="cell.status == 1 && (cell.is_check == 2 || cell.is_check == 3)">已报名</text>
												<text v-else-if="cell.status == 2 && (cell.is_check == 2 || cell.is_check == 3)">进行中</text>
												<text v-else-if="cell.status == 3">已完成</text>
											</view> -->
										</view>
									</view>
								</view>
								<view class="d-flex justify-content-end mt-2" v-if="cell.status == 1 && cell.is_check == 2">
									<text class="bg-primary-600 my-btn py-2 px-4" @click="cancelEnroll(cell)">取消报名</text>
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
				tabs: ['全部', '已报名', '进行中', '已完成'],
				personsIcon:require("@/static/index/personsIcon.png"),
				tab_content_list:[],
				currentPage:1,
				pageSize:10,
				total:0,
				loadStatus:"more",
			}
		},
		onLoad(){
			
		},
		onShow(){
			this.user_token = uni.getStorageSync('user_token');
			if(uni.getStorageSync('enrolled_activeTab')){
				this.currentTab = uni.getStorageSync('enrolled_activeTab');
			}else{
				this.currentTab = 0;
			}
			var eObj = {
				currentIndex:this.currentTab
			};
			if(this.user_token){
				this.onClickItem(eObj);
			}
		},
		methods: {
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
				uni.setStorageSync('enrolled_activeTab',e.currentIndex);
				this.loadStatus = "more";
				this.currentPage = 1;
				this.pageSize = 10;
				this.total = 0;
				this.initEnrolledList(this.currentTab);
			},
			
			// 获取报名列表
			initEnrolledList(type){
				this.$api.enrolledList({
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
				// console.log(item,'item');
				if(item.is_end == 4 || item.is_end == 5){
					uni.navigateTo({
						// 保留当前页面，跳转到应用内的某个页面,使用uni.navigateBack可以返回到原页面
						url: "/pages/job/jobDetail?sn=" + item.sn,
					})
				}else{
					uni.navigateTo({
						// 保留当前页面，跳转到应用内的某个页面,使用uni.navigateBack可以返回到原页面
						url: "/pages/enrolled/enrolledDetail?id=" + item.id,
					})
				}
				
			},
			
			// 取消报名
			cancelEnroll(item){
				uni.showModal({
					title: '温馨提示',
					content: '请确认是否取消报名',
					confirmText: '确定',
					cancelText: '取消',
					success: (modal_res) => {
						if (modal_res.confirm) {
							// 调用取消报名的接口
							this.$api.cancelSignUp({
								token:uni.getStorageSync('user_token'),
								id:item.id, 	// 类型:1=临时,2=长期
							}).then(res=>{
								uni.showToast({
									title: res.msg,
									icon: 'success'
								});
								this.loadStatus = "more";
								this.currentPage = 1;
								this.pageSize = 10;
								this.total = 0;
								this.initEnrolledList(this.currentTab);
							});
						} else if (modal_res.cancel) {
							console.log('关闭');
						}
					}
				});
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
			this.pageSize = 10;
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
