<template>
	<view class="page-container my-container">
		<uni-nav-bar dark :fixed="true" status-bar title="授权登录" :border="false"/>
		<view class="my-profile">
			<image class="image profile-bg" :src="authBg" mode="aspectFill" />
		</view>
		<view class="p-3">
			<image class="image about-logo-image" :src="logo" mode="aspectFit" />
			<view class="d-flex justify-content-center mt-5">
				<text class="bg-primary-600 fs_18 auth-btn" @click="getUserInfo">授权登录</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				authBg: require("@/static/my_navbar_auth.png"),
				logo: require("@/static/uni.png"),
			}
		},
		onLoad(){
			// #ifdef H5
			// 判断H5是微信还是pc
			let ua = navigator.userAgent.toLowerCase();
			if (ua.match(/MicroMessenger/i) == "micromessenger") {
				// console.log('微信浏览器');
				
				// 获取当前页面的url
				let link = window.location.href;
				let code = this.getUrlCode('code')
				// 判断link中有没有code=字符串，  
				if (code == null || code == '') {
					//没有code= 发请求
					let appid = this.$globalUrl.appId; // 公众号的固定appid
					let uri = encodeURIComponent(link); // 编码后的回调地址
					let authURL = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+ appid +'&redirect_uri='+ uri +'&response_type=code&scope=snsapi_userinfo&state=STATE&connect_redirect=1#wechat_redirect';
					window.location.href = authURL;
					
					// 记录上一页
					var pages = getCurrentPages(); //当前页
					var beforePage = pages[pages.length - 2]; //上个页面
					var beforePageFullPath = beforePage.__page__.fullPath;
					uni.setStorageSync('beforePageFullPath',beforePageFullPath);
				} else {
					// 微信公众号授权后调接口-跳转
					this.wx_auth(code);
				}
			}else{
				// 记录上一页
				var pages = getCurrentPages(); //当前页
				var beforePage = pages[pages.length - 2]; //上个页面
				var beforePageFullPath = beforePage.__page__.fullPath;
				uni.setStorageSync('beforePageFullPath',beforePageFullPath);
				console.log('普通浏览器');
			}
			// #endif
		},
		methods: {
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
									this.$api.mini_wx_auth({
										code: res.code,
										encryptedData:obj.encryptedData,
										iv:obj.iv
									}).then(authRes=>{
										if(authRes.code == 0){
											uni.setStorageSync('user_token',authRes.data);
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
										}else{
											uni.showToast({
												title: authres.msg,
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
				let ua = navigator.userAgent.toLowerCase();
				if (ua.match(/MicroMessenger/i) == "micromessenger") {
					// console.log('微信浏览器');
					// 微信公众号授权后调接口-跳转
					let link = window.location.href;
					this.wx_auth(link);
				}else{
					// console.log('普通浏览器');
					// 写死一个token
					uni.setStorageSync('user_token','62bbc9bd759eb1656474045642861');
					var beforePageFullPath = uni.getStorageSync('beforePageFullPath');
					uni.reLaunch({
						url: beforePageFullPath,
					})
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
				this.$api.wx_wx_auth({
					code:code,
					signcode:"",
				}).then(authRes => {
					if(authRes.code == 0){
						uni.setStorageSync('user_token',authRes.data);
						var beforePageFullPath = uni.getStorageSync('beforePageFullPath');
						uni.reLaunch({
							url: beforePageFullPath,
						})
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
