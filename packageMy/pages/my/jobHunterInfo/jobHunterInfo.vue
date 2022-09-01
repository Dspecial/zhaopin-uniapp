<template>
	<view class="page-container my-container">
		<uni-nav-bar dark :fixed="true" status-bar left-icon="left" :border="false" title="求职者" @clickLeft="goBack" />
		<view class="my-profile">
			<image class="image member-bg" :src="profileBg" mode="scaleToFill" />
			<view class="pl-3 pr-3 profile-content pt-2">
				<view class="d-flex align-items-center">
					<image class="image avatar" :src="member.avatar" mode="aspectFill" />
					<view class="text-white ml-3">
						<template v-if="!user_token">
							<span class="getUserInfo" @click="goAuth">请点击登录</span>
						</template>
						<template v-else>
							<view class="fs_15 font-weight-semibold text-white d-block">
								<text>{{ member.truename }}</text> 
								<text>
									<text class="mx-2">|</text>
									<text v-if="member.sex == 1">未知</text>
									<text v-else-if="member.sex == 2">男</text>
									<text v-else-if="member.sex == 3">女</text>
								</text>
								<text>
									<text class="mx-2">|</text>
									{{ member.age }} 岁
								</text>
							</view>
							<view class="d-flex align-items-center mt-2">
							 	<image class="image tel" :src="telImg" mode="aspectFit" />	
							 	<text class="fs_15 text-white d-block ml-1" @click="goMobile(member.mobile)">{{ member.mobile }}</text>
							</view>
							<view class="d-flex align-items-center mt-2">
								<image class="image tel" :src="wxImg" mode="aspectFit" />	
								<text class="fs_15 text-white d-block ml-1" @click="getCopy(member.wx_number)">{{ member.wx_number }}</text>
							</view>
						</template>
					</view>
				</view>
			</view>
		</view>
		<view class="job_tab mb-5">
			<uni-segmented-control :current="currentTab" :values="tabs" @clickItem="onClickItem" />
			<view class="p-3">
				<template v-if="currentTab == 0">
					<view class="recommend-box">
						<view class="box-content">
							<template v-for="(cell,index) in tab_content_list">
								<view class="recommend-item p-3 mt-2" :key="index" >
									<view>
										<view class="header d-flex justify-content-between align-items-center">
											<text class="d-block fs_14 font-weight-semibold">{{ cell.title }}</text>
											<text class="d-block fs_15 font-weight-semibold pay">
												<text v-if="cell.is_check == 2">待审核</text>
												<text v-else-if="cell.is_check == 3">审核通过</text>
												<text v-else-if="cell.is_check == 4">审核不通过</text>
												<text v-else-if="cell.is_check == 5">已取消</text>
												<text v-else-if="cell.is_check == 6">已离职</text>
											</text>
										</view>
										<view class="content mt-2 mb-2">
											招聘方：{{ cell.coname }}
										</view>
										<view class="d-flex align-items-center mt-1 text-grey">
											<view class="d-flex align-items-center w-100">
												<uni-icons type="wallet-filled" size="15" class="text-primary"></uni-icons>
												<text class="fs_11 ml-1">总金额: {{ cell.all_money }}</text>
											</view>
											<view class="d-flex align-items-center w-100">
												<uni-icons type="wallet-filled" size="15" class="text-primary"></uni-icons>
												<text class="fs_11 ml-1">待发金额: {{ cell.daifa_money }}</text>
											</view>
											<view class="d-flex align-items-center w-100">
												<uni-icons type="wallet-filled" size="15" class="text-primary"></uni-icons>
												<text class="fs_11 ml-1">已发金额: {{ cell.yifa_money }}</text>
											</view>
										</view>
									</view>
								</view>
							</template>
							<uni-load-more :status="loadStatus"></uni-load-more>
						</view>
					</view>
				</template>
				<template v-else-if="currentTab == 1">
					<view class="recommend-box">
						<view class="box-content">
							<template v-for="(cell,index) in evaluate_content_list">
								<view class="recommend-item p-3 mt-2" :key="index" >
									<view class="d-flex justify-content-between">
										<view class="d-flex align-items-center">
											<image class="image company_avatar" :src="cell.avatar" mode="aspectFill" />
											<view class="ml-3">
												<view>{{cell.name}}</view>
												<uni-rate :readonly="true" :value="cell.score" :is-fill="false"/>
												<text>{{ cell.content?cell.content:'暂无评价内容' }}</text>
											</view>
										</view>
										<text class="text-grey-150">{{ cell.createtime }}</text>
									</view>
								</view>
							</template>
							<uni-load-more :status="evaluate_loadStatus"></uni-load-more>
						</view>
					</view>
				</template>
			</view>
		</view>
		<!-- 打电话 -->
		<view class="pt-3 w-50 phone-fixed">
			<view class="phone-btn bg-primary-600 fs_14" type="primary" size="mini" @click="goMobile(member.mobile)">打电话</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				user_token:uni.getStorageSync('user_token'),
				sn:'',
				signcode:'',
				profileBg: require("@/packageMy/static/my/my_navbar_profile.png"),
				telImg: require("@/packageMy/static/my/phone.png"),
				wxImg: require("@/packageMy/static/my/wx.png"),
				member:{
					avatar: require("@/static/uni.png"),
				},
				currentTab: 0,
				tabs: ['活动记录', '他的评价'],
				// 活动记录列表
				tab_content_list:[],
				currentPage:1,
				pageSize:10,
				total:0,
				loadStatus:"more",
				// 评价记录列表
				evaluate_content_list:[],
				evaluate_currentPage:1,
				evaluate_pageSize:10,
				evaluate_total:0,
				evaluate_loadStatus:"more",
			}
		},
		onLoad(options){
			this.user_token = uni.getStorageSync('user_token');
			this.sn = options.sn;
			this.signcode = options.signcode;
			var eObj = {
				currentIndex:0
			};
			if(this.user_token){
				this.getMemberInfo(this.user_token);
				this.onClickItem(eObj);
			}
		},
		onShow(){
			this.user_token = uni.getStorageSync('user_token');
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
			
			// 拨打电话
			goMobile(mobile){
				uni.makePhoneCall({
					// 手机号
					phoneNumber: mobile, 
					// 成功回调
					success: (res) => {
						console.log('调用成功!')	
					},
					// 失败回调
					fail: (res) => {
						console.log('调用失败!')
					}
				});
			},
			
			// 复制
			getCopy(value){
				uni.setClipboardData({
					data: value,
					success: function () {
						// 调用方法成功
						uni.showToast({
							title: '邀请码已复制',
							icon: 'success'
						});
					}
				})
			},
			
			// 获取用户信息
			getMemberInfo(token){
				this.$api.memberInfo({
					token:token,
					sn:this.sn,
					signcode:this.signcode,
				}).then(res=>{
					if(res.code == 0){
						this.member = res.data;
						if(res.data.is_auth == 2){ // 已经实名，显示真实姓名
							this.member.nickname = res.data.truename
						}else{
							this.member.nickname = res.data.nickname
						}
						if(res.data.avatar.indexOf("http") >= 0){
							this.member.avatar = res.data.avatar;
						}else{
							this.member.avatar = this.$globalUrl.baseUrl + res.data.avatar;
						}
					}else{
						uni.showToast({
							title: res.msg,
							icon: 'none'
						});
					}
				});
			},
			
			// tab切换
			onClickItem(e) {
				if (this.currentTab !== e.currentIndex) {
					this.currentTab = e.currentIndex
				}
				if(this.currentTab == 0){
					this.loadStatus = "more";
					this.currentPage = 1;
					this.pageSize = 10;
					this.total = 0;
					this.initEnrolledList();
				}else if(this.currentTab == 1){
					this.evaluate_loadStatus = "more";
					this.evaluate_currentPage = 1;
					this.evaluate_pageSize = 10;
					this.evaluate_total = 0;
					this.initEvaluateList();
				}
			},
			
			// 获取活动记录
			initEnrolledList(){
				this.$api.memberExerciseList({
					token:uni.getStorageSync('user_token'),
					sn:this.sn,
					signcode:this.signcode,
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
			
			// 获取评价记录
			initEvaluateList(){
				this.$api.memberEvaluateList({
					token:uni.getStorageSync('user_token'),
					sn:this.sn,
					signcode:this.signcode,
					page:this.evaluate_currentPage,
					limit:this.evaluate_pageSize
				}).then(res=>{
					this.evaluate_total = res.data.total;
					if (this.evaluate_currentPage == 1) {
						this.evaluate_content_list = res.data.data.map((item,index)=>{
							if(item.avatar){
								if(item.avatar.indexOf("http") >= 0){
									item.avatar = item.avatar;
								}else{
									item.avatar = this.$globalUrl.baseUrl + item.avatar;
								}
							}else{
								item.avatar = require("@/static/default_avatar.png")
							}
							return item;
						});
						
						if (this.evaluate_content_list.length < this.evaluate_total) {
							this.evaluate_loadStatus = "more";
						} else {
							this.evaluate_loadStatus = "no-more";
						}
					} else {
						this.evaluate_loadStatus = "loading";
						setTimeout(()=>{
							this.evaluate_content_list = this.evaluate_content_list.concat(res.data.data);
							if (this.evaluate_content_list.length < this.evaluate_total) {
								this.evaluate_loadStatus = "more";
							} else {
								this.evaluate_loadStatus = "no-more";
							}
						},1000)
					};
					uni.hideNavigationBarLoading();
				});
			},
		},
		
		// 上拉加载
		onReachBottom() {
			if(this.currentTab == 0){
				this.currentPage++;
				if (this.tab_content_list.length < this.total) {
					this.initEnrolledList();
				} else {
					uni.hideNavigationBarLoading();
					this.loadStatus = "no-more";
				}
			}else if(this.currentTab == 1){
				this.evaluate_currentPage++;
				if (this.evaluate_content_list.length < this.evaluate_total) {
					this.initEvaluate_List();
				} else {
					uni.hideNavigationBarLoading();
					this.evaluate_loadStatus = "no-more";
				}
			}
			
		},
		
		// 下拉刷新
		onPullDownRefresh(){
			if(this.currentTab == 0){
				this.loadStatus = "more";
				this.currentPage = 1;
				this.pageSize = 10;
				this.total = 0;
				this.initEnrolledList();
			}else if(this.currentTab == 1){
				this.evaluate_loadStatus = "more";
				this.evaluate_currentPage = 1;
				this.evaluate_pageSize = 10;
				this.evaluate_total = 0;
				this.initEvaluateList();
			}
			setTimeout(function () {
				uni.stopPullDownRefresh();  //停止下拉刷新动画
			}, 1000);
		},
	}
</script>

<style>

</style>
