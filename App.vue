<script>
	// #ifdef H5
	const jweixin = require('jweixin-module');
	// #endif
	export default {
		globalData:{
			isWeChat:false,
		},
		onLaunch: function() {
			// console.warn('当前组件仅支持 uni_modules 目录结构 ，请升级 HBuilderX 到 3.1.0 版本以上！')
			console.log('App Launch')
			// #ifdef H5
			// 判断是不是微信
			let ua = window.navigator.userAgent.toLowerCase();
			if (ua.match(/MicroMessenger/i) == 'micromessenger') {//判断微信
				this.$options.globalData.isWeChat = true
			}else{
				this.$options.globalData.isWeChat = false
			}
			// #endif
		},
		onShow: function() {
			console.log('App Show')
			// #ifdef H5
			this.hideNavBar();
			// #endif
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods:{
			// 在微信浏览器隐藏navbar
			hideNavBar(){
				if(this.$options.globalData.isWeChat){
					let style = document.createElement('style');
					style.type = 'text/css';
					style.innerHTML=`
						uni-navbar:not(.uni-navbar-index),.uni-navbar:not(.uni-navbar-index){
							display:none;
						}
						uni-navbar .uni-navbar__header-container,.uni-navbar .uni-navbar__header-container{
							display:none!important;
						}
					`;
					document.getElementsByTagName('head').item(0).appendChild(style);
				}
			},
			
			// 订阅消息
			subscribeShare(){
				this.$api.share({
					url: "http://h5.yuezhongkeji.com/web/",
				}).then(res=>{
					if(res.code == 0){
						jweixin.config({
							debug: true,
							appId: res.data.appId,
							timestamp: res.data.timestamp,
							nonceStr: res.data.nonceStr,
							signature: res.data.signature,
							jsApiList: ['wx-open-launch-weapp', 'wx-open-subscribe'], // 必填，需要使用的JS接口列表,
							openTagList: ['wx-open-launch-weapp', 'wx-open-subscribe'],
						});
					}else{
						uni.showToast({
							title: res.msg,
							icon: 'none'
						});
					}
				});
			},
		},
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import '@/uni_modules/uni-scss';
	@import '@/common/css/base.scss';
	@import '@/common/css/main.scss';
	
	/* #ifndef APP-NVUE */
	// APP-PLUS App HTML5+ 规范
	// APP-PLUS-NVUE App nvue Weex 规范
	// H5 H5 
	// MP-WEIXIN 微信⼩程序微信⼩程序
	// MP-ALIPAY ⽀付宝⼩程序⽀付宝⼩程序
	// MP-BAIDU 百度⼩程序百度⼩程序
	// MP-TOUTIAO 头条⼩程序头条⼩程序
	// MP-QQ QQ⼩程序（⽬前仅cli版⽀持）
	// MP 微信⼩程序/⽀付宝⼩程序/百度⼩程序/头条⼩程序/QQ⼩程序
	@import '@/static/customicons.css';
	/* #endif */
</style>
