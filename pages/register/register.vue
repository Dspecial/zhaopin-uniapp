<template>
	<view class="page-container auth-container">
		<uni-nav-bar dark :fixed="true" status-bar title="授权登录" :border="false"/>
		<view class="my-profile">
			<image class="image profile-bg" :src="authBg" mode="aspectFill" />
		</view>
		<view class="p-5 auth-content">
			<image class="image about-logo-image" :src="logo" mode="aspectFit" />
			<view class="d-flex justify-content-center mt-5">
				<uni-forms ref="registerForm" :modelValue="registerForm" label-width="0">
					<view class="registerForm">
						<uni-forms-item label=" ">
							<uni-easyinput type="number" prefixIcon="person-filled" :inputBorder="false" v-model="registerForm.mobile" placeholder="请输入手机号" />
						</uni-forms-item>
						<uni-forms-item label=" ">
							<uni-easyinput type="password" prefixIcon="locked-filled" :inputBorder="false" v-model="registerForm.password" placeholder="请输入密码" />
						</uni-forms-item>
					</view>
				</uni-forms>
				<view class="p-btn">
					<view class="my-btn bg-primary-600 px-2 py-3 fs_16" @click="registerLogin">注册登录</view>
					<view class="d-flex mt-1 align-items-center">
						<uni-data-checkbox multiple v-model="registerForm.is_agree" :localdata="localdata" class="w-10"></uni-data-checkbox>
						<text class="text-grey-150 w-90" @click="goNotice">登录注册代表您同意《注册须知》</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	let App = getApp();
	export default {
		data() {
			return {
				authBg: require("@/static/my_navbar_auth.png"),
				logo: require("@/static/uni.png"),
				agreementName:"",
				registerForm:{
					mobile:"",
					password:"",
					is_agree:'',
				},
				localdata:[
					{
						text: '足球',
						value: 1,
					},
				],
				isWeChat:App.globalData.isWeChat,
			}
		},
		onLoad(){
			// 获取log
			this.initLogo();
		},
		methods: {
			// 获取log
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
			
			// 去须知页面
			goNotice(){
				uni.navigateTo({
					// 保留当前页面，跳转到应用内的某个页面,使用uni.navigateBack可以返回到原页面
					url: "/pages/register/guidance/guidance",
				})
			},
			
			// 注册登录
			registerLogin(){
				var plateform = 0;
				// #ifdef H5
				plateform = 1;
				// #endif
				
				// #ifdef MP-WEIXIN
				plateform = 2;
				// #endif
				
				var user_info = uni.getStorageSync('user_info');
				
				this.$api.login({
					openid:user_info.openid,
					nickname:user_info.nickname,
					unionid:user_info.unionid,
					headimgurl:user_info.headimgurl,
					is_agree:this.registerForm.is_agree,
					mobile:this.registerForm.mobile,
					type:plateform,
				}).then(res=>{
					if(res.code == 0){
						uni.showToast({
							title: '注册成功',
							icon: 'success'
						});
						uni.setStorageSync('user_token',res.data);
						var beforePageFullPath = uni.getStorageSync('beforePageFullPath');
						// #ifdef H5
						setTimeout(()=>{
							var url_g = window.location.href.split("?code=")[0];
							window.location.href = url_g + "#" + beforePageFullPath;
						},1000)
						// #endif
						
						// #ifdef MP-WEIXIN
						setTimeout(()=>{
							uni.reLaunch({
								url: beforePageFullPath,
							})
						},1000)
						
						// #endif
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
