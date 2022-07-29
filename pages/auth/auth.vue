<template>
	<view class="page-container auth-container">
		<uni-nav-bar dark :fixed="true" status-bar title="授权登录" :border="false"/>
		<view class="my-profile">
			<image class="image profile-bg" :src="authBg" mode="aspectFill" />
		</view>
		<view class="p-5 auth-content">
			<image class="image about-logo-image" :src="logo" mode="aspectFit" />
			<view class="d-flex justify-content-center mt-5">
				<!-- #ifdef MP-WEIXIN -->
				<text class="bg-primary-600 fs_18 auth-btn" @click="getUserInfo">授权登录</text>
				<!-- #endif -->
				
				<!-- #ifdef H5 -->
				<template v-if="!isWeChat">
					<text class="bg-primary-600 fs_18 auth-btn" @click="getUserInfo">授权登录</text>
				</template>
				<!-- #endif -->
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
				isWeChat:App.globalData.isWeChat,
			}
		},
		onLoad(){
			this.initLogo();
			
			// 记录上一页
			var pages = getCurrentPages(); //当前页
			var beforePage = pages[pages.length - 2]; //上个页面
			var beforePageFullPath = "";
			if(beforePage){
				beforePageFullPath = "/" + beforePage.route;
			}else{
				beforePageFullPath = "/pages/index/index";
			}
			// 将上一页的路由保存到storage
			uni.setStorageSync('beforePageFullPath',beforePageFullPath);
			
			// #ifdef H5
			// 判断H5是微信还是其他浏览器
			if(this.isWeChat){
				// console.log('微信浏览器');
				// 获取当前页面的url
				let link = window.location.href;
				let code = this.getUrlCode('code');
				// 判断link中有没有code=字符串，  
				if (code == null || code == '') {
					//没有code= 发请求
					let appid = this.$globalUrl.appId; // 公众号的固定appid
					let uri = encodeURIComponent(link); // 编码后的回调地址
					let authURL = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+ appid +'&redirect_uri='+ uri +'&response_type=code&scope=snsapi_userinfo&state=STATE&connect_redirect=1#wechat_redirect';
					window.location.href = authURL;
				} else {
					// 微信公众号授权后调接口-跳转
					this.wx_auth(code);
				}
			}else{
				// console.log('普通浏览器');
			};
			// #endif
		},
		methods: {
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
			
			// 授权
			getUserInfo:function(){
				// #ifdef MP-WEIXIN
				// 展示加载框
				uni.showLoading({
					title: '加载中',
				});
				setTimeout(function () {
					uni.hideLoading();
				}, 500);
				uni.getUserProfile({
					desc: '登录后可同步数据',
					success: async (obj) => {
						uni.login({
							provider: 'weixin',
							success: (res) => {
								if (res.errMsg == 'login:ok') {
									this.$api.get_mini_auth({
										code: res.code,
										encryptedData:obj.encryptedData,
										iv:obj.iv
									}).then(authRes=>{
										if(authRes.code == 0){
											if(authRes.data.need_login == 1){ // 是第一次授权，需要跳转到注册页面
												uni.setStorageSync('user_info',authRes.data.data);
												uni.reLaunch({
													url: '/pages/register/register',
												})
											}else{
												uni.showToast({
													title: '已授权',
													icon: 'success'
												});
												uni.setStorageSync('user_token',authRes.data.data);
												setTimeout(()=>{
													uni.navigateBack({
														success: () => {
															let page = getCurrentPages().pop();  //跳转页面成功之后
															if (!page) {
																return;
															} else {
																page.onLoad(page.options);// page自带options对象.
															}
														}
													})
												},1000)
											}
											
										}else{
											uni.showToast({
												title: authRes.msg,
												icon: 'none'
											});
										}
									});
								}
							},
						});
					},
					fail: () => {
						uni.showToast({
							title: '授权已取消',
							icon: 'error',
							mask: true,
						});
					},
					complete: () => {
						// 隐藏loading
						uni.hideLoading();
					},
				});
				//#endif
				
				// #ifdef H5
				if(this.isWeChat){
					// console.log('微信浏览器');
					// 微信公众号授权后调接口-跳转
					let link = window.location.href;
					let code = this.getUrlCode('code');
					this.wx_auth(code);
				}else{
					// console.log('普通浏览器');
					uni.showToast({
						title: '普浏直接登录',
						icon: 'success'
					});
					// 写死一个token
					uni.setStorageSync('user_token','62bbc9bd759eb1656474045642861');
					var beforePageFullPath = uni.getStorageSync('beforePageFullPath');
					setTimeout(()=>{
						uni.reLaunch({
							url: beforePageFullPath,
						})
					},1000)
				}
				// #endif
			},
			
			// 解析URL 参数
			getUrlCode(name) {
				return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ''])[1]
					.replace(/\+/g, '%20')) || null
			},
			
			// 微信公众号授权后调接口-跳转
			wx_auth(code){
				// 接口的跳转
				this.$api.get_wx_auth({
					code:code,
					signcode:"",
				}).then(authRes => {
					if(authRes.code == 0){
						if(authRes.data.need_login == 1){ // 是第一次授权，需要跳转到注册页面
							uni.setStorageSync('user_info',authRes.data.data);
							uni.reLaunch({
								url: '/pages/register/register',
							})
						}else{
							uni.showToast({
								title: '已授权',
								icon: 'success'
							});
							uni.setStorageSync('user_token',authRes.data.data);
							var beforePageFullPath = uni.getStorageSync('beforePageFullPath');
							var url_g = window.location.href.split("?code=")[0];
							setTimeout(()=>{
								window.location.href = url_g + "#" + beforePageFullPath;
							},1000)
						}
					}else{
						uni.showToast({
							title: authres.msg,
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
