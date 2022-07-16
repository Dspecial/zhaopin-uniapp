<template>
	<view class="page-container my-container">
		<uni-nav-bar dark :fixed="true" status-bar title="个人中心" :border="false"/>
		<view class="my-profile">
			<image class="image profile-bg" :src="profileBg" mode="aspectFill" />
			<view class="pl-3 pr-3 profile-content pt-2">
				<view class="d-flex align-items-center">
					<image class="image avatar" :src="profile.avatar" mode="aspectFit" />
					<view class="text-white ml-3">
						<template v-if="!user_token">
							<span class="getUserInfo" @click="goAuth">请点击登录</span>
						</template>
						<template v-else>
							<text class="fs_15 font-weight-semibold text-white d-block">{{ profile.nickname }}</text>
							<view class="d-flex align-items-center mt-2">
								<image class="image tel" :src="telImg" mode="aspectFit" />	
								<text class="fs_15 text-white d-block">{{ profile.mobile }}</text>
							</view>
						</template>
					</view>
				</view>
				<!-- 余额 -->
				<view class="my-balance text-white" @click="goPurse">
					<view class="p-3 d-flex justify-content-between align-items-center">
						<view>
							<view class="d-flex align-items-center mb-1">
								<image class="image balanceIcon" :src="balanceIcon" mode="aspectFit" />
								<text class="d-inline-block ml-2">我的余额</text>
							</view>
							<text class="fs_17 font-weight-semibold">{{ profile.balance }}</text><text class="ml-1">元</text>
						</view>
						<text class="bg-primary-600 my-btn py-1 px-4">提现</text>
					</view>
				</view>
			</view>
		</view>
		<view class="p-3">
			<!-- 我的报名 -->
			<view class="card-box p-3 my-enroll">
				<text class="d-block fs_15 box-title pb-3-1">我的报名</text>
				<view class="d-flex align-items-center justify-content-between">
					<template v-for="(enroll,index) in myEnroll" >
						<view class="my-enroll-item text-center mt-2" :key="index" @click="goEnrolled(index)">
							<image class="image" :src="enroll.img" mode="aspectFit" />
							<text class="fs_13 font-weight-semibold mt-3 d-inline-block">{{ enroll.name }}</text>
						</view>
					</template>
				</view>
			</view>
			
			<!-- 功能点 -->
			<view class="card-box p-3 mt-2 my-function">
				<!-- 实名认证 -->
				<view class="d-flex justify-content-between align-items-center my-function-cell pb-3" @click="goAuthentication()">
					<view class="d-flex align-items-center">
						<image class="image" :src="functions.img1" mode="aspectFit" />
						<text class="ml-2">实名认证</text>
					</view>
					<view>
						<text v-if="profile.is_auth == 2" class="text-grey-150 mr-1">已认证</text>
						<uni-icons type="right" size="14"></uni-icons>
					</view>
				</view>
				<!-- 个人信息 -->
				<view class="d-flex justify-content-between align-items-center my-function-cell pt-3 pb-3" @click="goProfile()">
					<view class="d-flex align-items-center">
						<image class="image" :src="functions.img2" mode="aspectFit" />
						<text class="ml-2">个人信息</text>
					</view>
					<view>
						<uni-icons type="right" size="14"></uni-icons>
					</view>
				</view>
				<!-- 负责活动 -->
				<view class="d-flex justify-content-between align-items-center my-function-cell pt-3 pb-3" @click="goActivity()">
					<view class="d-flex align-items-center">
						<image class="image" :src="functions.img3" mode="aspectFit" />
						<text class="ml-2">负责活动</text>
					</view>
					<view>
						<uni-icons type="right" size="14"></uni-icons>
					</view>
				</view>
				<!-- 我的邀请 -->
		<!-- 		<view class="d-flex justify-content-between align-items-center my-function-cell pt-3 pb-3" @click="goInvitation()">
					<view class="d-flex align-items-center">
						<image class="image" :src="functions.img4" mode="aspectFit" />
						<text class="ml-2">我的邀请</text>
					</view>
					<view>
						<uni-icons type="right" size="14"></uni-icons>
					</view>
				</view> -->
				<!-- 我的收藏 -->
				<view class="d-flex justify-content-between align-items-center my-function-cell pt-3 pb-3" @click="goCollection()">
					<view class="d-flex align-items-center">
						<image class="image" :src="functions.img4" mode="aspectFit" />
						<text class="ml-2">我的收藏</text>
					</view>
					<view>
						<uni-icons type="right" size="14"></uni-icons>
					</view>
				</view>
				<!-- 关于我们 -->
				<view class="d-flex justify-content-between align-items-center my-function-cell pt-3 pb-3" @click="goAbout()">
					<view class="d-flex align-items-center">
						<image class="image" :src="functions.img5" mode="aspectFit" />
						<text class="ml-2">关于我们</text>
					</view>
					<view>
						<uni-icons type="right" size="14"></uni-icons>
					</view>
				</view>
				<!-- 联系客服 -->
				<view class="d-flex justify-content-between align-items-center my-function-cell pt-3">
					<view class="d-flex align-items-center">
						<image class="image" :src="functions.img6" mode="aspectFit" />
						<text class="ml-2">联系客服</text>
					</view>
					<view>
						<uni-icons type="right" size="14"></uni-icons>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				user_token:uni.getStorageSync('user_token'),
				profileBg: require("@/packageMy/static/my/my_navbar_profile.png"),
				telImg: require("@/packageMy/static/my/phone.png"),
				balanceIcon: require("@/packageMy/static/my/balance_icon.png"),
				profile:{
					avatar: require("@/static/uni.png"),
					is_auth:"1", // 是否实名认证:1=否,2=是
					nickname:"",
					mobile:"",
					balance:"0.00"
				},
				myEnroll:[
					{
						img:require("@/packageMy/static/my/myEnrollImg1.png"),
						name:"全部",
						type:"3"
					},
					{
						img:require("@/packageMy/static/my/myEnrollImg2.png"),
						name:"已报名",
						type:"0"
					},
					{
						img:require("@/packageMy/static/my/myEnrollImg3.png"),
						name:"进行中",
						type:"1"
					},
					{
						img:require("@/packageMy/static/my/myEnrollImg4.png"),
						name:"已完成",
						type:"2"
					},
				],
				functions:{
					img1: require("@/packageMy/static/my/fun_icon1.png"),
					img2: require("@/packageMy/static/my/fun_icon2.png"),
					img3: require("@/packageMy/static/my/fun_icon3.png"),
					img4: require("@/packageMy/static/my/fun_icon4.png"),
					img5: require("@/packageMy/static/my/fun_icon5.png"),
					img6: require("@/packageMy/static/my/fun_icon6.png"),
				},
			}
		},
		onLoad(){
			this.user_token = uni.getStorageSync('user_token');
			if(this.user_token){
				this.getProfileInfo(this.user_token);
			}
		},
		onShow(){
			
		},
		methods: {
			// 跳转授权页面
			goAuth(){
				uni.navigateTo({
					// 保留当前页面，跳转到应用内的某个页面,使用uni.navigateBack可以返回到原页面
					url: "/pages/auth/auth"
				})
			},
			
			// 获取用户信息
			getProfileInfo(token){
				this.$api.profileInfo({
					token:token
				}).then(res=>{
					if(res.code == 0){
						this.profile = res.data;
						if(res.data.is_auth == 2){ // 已经实名，显示真实姓名
							this.profile.nickname = res.data.truename
						}else{
							this.profile.nickname = res.data.nickname
						}
						if(res.data.avatar.indexOf("http") >= 0){
							this.profile.avatar = res.data.avatar;
						}else{
							this.profile.avatar = this.$globalUrl.baseUrl + res.data.avatar;
						}
					}else{
						uni.showToast({
							title: res.msg,
							icon: 'none'
						});
					}
				});
			},
			
			// 跳转我的钱包
			goPurse(){
				if(this.user_token){
					uni.navigateTo({
						// 保留当前页面，跳转到应用内的某个页面,使用uni.navigateBack可以返回到原页面
						url: "/packageMy/pages/my/purse/purse",
					})
				}else{
					uni.showModal({
						title: '温馨提示',
						content: '请先授权登录',
						confirmText: '同意',
						cancelText: '关闭',
						success: function (res) {
							if (res.confirm) {
								uni.navigateTo({
									// 保留当前页面，跳转到应用内的某个页面,使用uni.navigateBack可以返回到原页面
									url: "/pages/auth/auth"
								})
							} else if (res.cancel) {
								console.log('关闭');
							}
						}
					});
				}
			},
			
			// 跳转提现页面
			goWithdrawal(){
				if(this.user_token){
					uni.navigateTo({
						// 保留当前页面，跳转到应用内的某个页面,使用uni.navigateBack可以返回到原页面
						url: "/packageMy/pages/my/purse/withdrawal/withdrawal",
					})
				}else{
					uni.showModal({
						title: '温馨提示',
						content: '请先授权登录',
						confirmText: '同意',
						cancelText: '关闭',
						success: function (res) {
							if (res.confirm) {
								uni.navigateTo({
									// 保留当前页面，跳转到应用内的某个页面,使用uni.navigateBack可以返回到原页面
									url: "/pages/auth/auth"
								})
							} else if (res.cancel) {
								console.log('关闭');
							}
						}
					});
				}
			},
			
			// 跳转我的报名
			goEnrolled(index){
				uni.setStorageSync('enrolled_activeTab',index);
				uni.reLaunch({
					url: "/pages/enrolled/enrolled",
				})
			},
			
			// 跳转实名认证
			goAuthentication(){
				if(this.user_token){
					uni.navigateTo({
						// 保留当前页面，跳转到应用内的某个页面,使用uni.navigateBack可以返回到原页面
						url: "/packageMy/pages/my/authentication/authentication",
					})
				}else{
					uni.showModal({
						title: '温馨提示',
						content: '请先授权登录',
						confirmText: '同意',
						cancelText: '关闭',
						success: function (res) {
							if (res.confirm) {
								uni.navigateTo({
									// 保留当前页面，跳转到应用内的某个页面,使用uni.navigateBack可以返回到原页面
									url: "/pages/auth/auth"
								})
							} else if (res.cancel) {
								console.log('关闭');
							}
						}
					});
				}
			},
			
			// 跳转个人信息
			goProfile(){
				if(this.user_token){
					uni.navigateTo({
						// 保留当前页面，跳转到应用内的某个页面,使用uni.navigateBack可以返回到原页面
						url: "/packageMy/pages/my/profile/profile",
					})
				}else{
					uni.showModal({
						title: '温馨提示',
						content: '请先授权登录',
						confirmText: '同意',
						cancelText: '关闭',
						success: function (res) {
							if (res.confirm) {
								uni.navigateTo({
									// 保留当前页面，跳转到应用内的某个页面,使用uni.navigateBack可以返回到原页面
									url: "/pages/auth/auth"
								})
							} else if (res.cancel) {
								console.log('关闭');
							}
						}
					});
				}
			},
			
			// 跳转负责活动
			goActivity(){
				if(this.user_token){
					uni.navigateTo({
						// 保留当前页面，跳转到应用内的某个页面,使用uni.navigateBack可以返回到原页面
						url: "/packageMy/pages/my/activity/activity",
					})
				}else{
					uni.showModal({
						title: '温馨提示',
						content: '请先授权登录',
						confirmText: '同意',
						cancelText: '关闭',
						success: function (res) {
							if (res.confirm) {
								uni.navigateTo({
									// 保留当前页面，跳转到应用内的某个页面,使用uni.navigateBack可以返回到原页面
									url: "/pages/auth/auth"
								})
							} else if (res.cancel) {
								console.log('关闭');
							}
						}
					});
				}
			},
			// 跳转我的邀请
			goInvitation(){
				if(this.user_token){
					uni.navigateTo({
						// 保留当前页面，跳转到应用内的某个页面,使用uni.navigateBack可以返回到原页面
						url: "/packageMy/pages/my/invitation/invitation",
					})
				}else{
					uni.showModal({
						title: '温馨提示',
						content: '请先授权登录',
						confirmText: '同意',
						cancelText: '关闭',
						success: function (res) {
							if (res.confirm) {
								uni.navigateTo({
									// 保留当前页面，跳转到应用内的某个页面,使用uni.navigateBack可以返回到原页面
									url: "/pages/auth/auth"
								})
							} else if (res.cancel) {
								console.log('关闭');
							}
						}
					});
				}
			},
			
			// 跳转我的收藏
			goCollection(){
				if(this.user_token){
					uni.navigateTo({
						// 保留当前页面，跳转到应用内的某个页面,使用uni.navigateBack可以返回到原页面
						url: "/packageMy/pages/my/collection/collection",
					})
				}else{
					uni.showModal({
						title: '温馨提示',
						content: '请先授权登录',
						confirmText: '同意',
						cancelText: '关闭',
						success: function (res) {
							if (res.confirm) {
								uni.navigateTo({
									// 保留当前页面，跳转到应用内的某个页面,使用uni.navigateBack可以返回到原页面
									url: "/pages/auth/auth"
								})
							} else if (res.cancel) {
								console.log('关闭');
							}
						}
					});
				}
			},
			
			// 跳转关于我们
			goAbout(){
				uni.navigateTo({
					// 保留当前页面，跳转到应用内的某个页面,使用uni.navigateBack可以返回到原页面
					url: "/packageMy/pages/my/about/about",
				})
			},
		}
	}
</script>

<style>

</style>
