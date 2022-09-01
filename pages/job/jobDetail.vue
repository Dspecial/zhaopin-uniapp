<template>
	<view class="page-container detail-container">
		<uni-nav-bar dark :fixed="true" status-bar left-icon="left" :border="false" title="职位详情" @clickLeft="goBack" />
		<view class="bg_arc_detail"></view>
		<view class="p-3 detail-content">
			<view class="info-box p-3">
				<text class="d-block fs_15">{{ info.title }}</text>
				<view class="d-flex flex-wrap">
					<view class="w-50 mt-3-1">
						<text class="">工资待遇：</text>
						<text class="text-danger">
							￥{{ info.money }}
							<text v-if="info.type == 1">/小时</text>
							<text v-else-if="info.type == 2">/天</text>
							<text v-else-if="info.type == 3">/周</text>
							<text v-else-if="info.type == 4">/月</text>
						</text>
					</view>
					<view class="w-50 mt-3-1" v-if="info.job_type != 2">
						<text class="">保证金：</text>
						<text class="text-danger" v-if="info.earnest_money != 0">
							￥{{ info.earnest_money }}
						</text>
						<text class="text-danger" v-else>
							无
						</text>
					</view>
					<view class="w-50 mt-3-1">
						<text class="">招聘人数：</text>
						<text class="text-danger">{{ info.num }} 人</text>
					</view>
					<view class="w-50 mt-3-1">
						<text class="">结算方式：</text>
						<text class="text-danger" v-if="info.settlement == 1">日结</text>
						<text class="text-danger" v-else-if="info.settlement == 2">周结</text>
						<text class="text-danger" v-else-if="info.settlement == 3">月结</text>
						<text class="text-danger" v-else-if="info.settlement == 4">活动完工结</text>
					</view>
				</view>
				<view class="d-flex justify-content-between mt-3-1">
					<view><uni-icons type="location" size="15" class="text-primary mr-1"></uni-icons>{{ info.address }}</view>
					<uni-icons type="paperplane-filled" size="15" class="text-primary" @click= "goLoaction(info)"></uni-icons>
				</view>
			</view>
			
			<!-- 工作流程 -->
			<view class="info-box p-3 mt-2" v-if="processContent">
				<text class="d-block fs_15 box-title pb-3-1">工作流程</text>
				<view v-html="processContent" class="processContent mt-3"></view>
			</view>
			
			<!-- 招聘详情 -->
			<view class="info-box p-3 mt-2">
				<text class="d-block fs_15 box-title pb-3-1">招聘详情</text>
				<view class="mt-3-1">
					<text>{{ info.detail }}</text>
				</view>
			</view>
			
			<!-- 联系方式 -->
			<view class="info-box p-3 mt-2">
				<view class="d-flex justify-content-between align-items-center">
					<view class="w-60">
						<text class="d-block fs_15 box-title pb-3-1">联系方式</text>
						<view class="mt-3-1">
							<text >联系人：</text>
							<text>{{ info.contact }}</text>
						</view>
						<view class="mt-3-1">
							<text >联系方式：</text>
							<text>{{ info.tel }}</text>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 招聘方信息 -->
			<view class="info-box p-3 mt-2">
				<text class="d-block fs_15 box-title pb-3-1">招聘方信息</text>
				<view class="mt-3-1">
					<view class="d-flex align-items-center">
						<image class="image avatar-image" :src="info.cm_image" mode="aspectFit" />
						<text class="ml-2">{{ info.cm_name}}</text>
					</view>
				</view>
			</view>
			
			<!-- 报名人员 -->
			<view class="info-box pt-3 pl-3 pr-3 mt-2 applicant-box">
				<text class="d-block fs_15 box-title pb-3-1">{{ applicant.length }}人已报名</text>
				<scroll-view class="scroll-view_H mt-3-1" scroll-x="true" @scroll="scroll" scroll-left="120">
					<template v-for="(item,index) in applicant">
						<view class="scroll-view-item_H pb-3-1 mr-2" :key="index">
							<image class="image avatar-image" :src="item.avatar" mode="aspectFit" />
						</view>
					</template>
				</scroll-view>
			</view>
			
			<!-- 跳转第三方页面 -->
			<view class="applicant-box" v-if="info.job_type == 2 && info.url">
				<view class="d-flex justify-content-center mt-5">
					<text class="bg-primary-600 my-btn" @click="jumpPosition()">查看岗位</text>
				</view>
			</view>
			
			<!-- 操作 -->
			<view class="info-actions px-2">
				<view class="d-flex align-items-center justify-content-between uni-goods-nav">
					<view class="d-flex text-grey">
						<view class="text-center mr-3" @click="callPhone">
							<uni-icons type="headphones" size="18"></uni-icons>
							<view>联系领队</view>
						</view>
						<view class="text-center mr-3" @click="share">
							<uni-icons type="redo-filled" size="18"></uni-icons>
							<view>分享</view>
						</view>
						
						<!-- #ifdef MP-WEIXIN -->
						<!-- <view class="text-center mr-3 share_view">
							<button open-type="share" class="btn-share">
								<uni-icons type="redo-filled" size="18"></uni-icons>
								<view>分享</view>
							</button>
						</view> -->
						<!-- #endif -->
						
						<view class="text-center mr-3" @click="collect(can_collect)">
							<uni-icons :type="can_collect == 1?'star':'star-filled'" size="18" :color="can_collect == 1?'':'#FF6549'"></uni-icons>
							<view>{{ can_collect == 1?'收藏':'取消'}}</view>
						</view>
					</view>
					<view class="w-60">
						<!-- #ifdef H5 -->
						<!-- 微信环境 -->
						<template v-if="isWeChat && can_sign == 1">
							<wx-open-subscribe :template="templateId" ref="subscribeBtn" class="subscribeBtn_enrolled">
								<script type="text/wxtag-template" slot="style">
										<style>
												.bao_btn {
													border-radius: 50px;
													height: 40px;
													line-height: 40px;
													font-size:16px;
													text-align:center;
													background-color: #435AE0;
													color:#FFFFFF;
													width: 210px;
												}
										</style>
								</script>
								<script type="text/wxtag-template">
									<div class="fs_16 text-center bao_btn">立即报名</div>
								</script>
							</wx-open-subscribe>
						</template>
						<!-- 其他H5环境 -->
						<template v-else>
							<view class="fs_16 text-center bao_btn"
								:style="{backgroundColor:buttonGroup.backgroundColor,color:buttonGroup.color}"
								@click="buttonClick">
								{{ buttonGroup.text }}
							</view>
						</template>
						<!-- #endif -->
						
						<!-- 非H5 -->
						<!-- #ifndef H5 -->
						<view class="fs_16 text-center bao_btn"
							:style="{backgroundColor:buttonGroup.backgroundColor,color:buttonGroup.color}"
							@click="buttonClick">
							{{ buttonGroup.text }}
						</view>
						<!-- #endif -->
					</view>
				</view>
			</view>
			
			<!-- 提示窗示例 -->
			<uni-popup ref="alertDialog" type="dialog">
				<uni-popup-dialog 
					type="warn" 
					cancelText="关闭" 
					confirmText="同意" 
					title="温馨提示" 
					:content="msgContent" 
					@confirm="dialogConfirm"
					@close="dialogClose">
				</uni-popup-dialog>
			</uni-popup>
			
			<!-- 海报窗口 -->
			<uni-popup ref="posterPopup">
				<view class="posterPopup p-3">
					<image class="image poster-image" :src="posterImg" mode="aspectFit" />
					<text class="mt-3 d-block fs_14">长按图片保存到相册</text>
				</view>
			</uni-popup>
			
		</view>
		<!-- 返回首页 -->
		<back-home></back-home>
	</view>
</template>

<script>
	let App = getApp();
	import backHome from "@/components/back-home/back-home.vue"
	export default {
		components:{
			backHome
		},
		data() {
			return {
				sn:"",
				isCollection:false,
				info:{
					job_type:"",
					title:"",
					money:"",
					earnest_money:"",
					num:"",
					settlement:"",
					address:"",
					latitude:"",
					longitude:"",
					
					detail:"",
					contact:"",
					tel:"",
					ewmImg:"",
					
					cm_image:"",
					cm_name:"",
					
					url:"",
				},
				// 流程
				processContent:"",
				// 报名人员
				applicant:[],
				// 操作
				buttonGroup: {},
				
				can_sign: 0, // 0表示已结束 1表示可报名 2表示已报名
				sign_sn:'', // 有值的时候去签到
				// 弹窗的内容
				msgContent:"",
				dialogCode:"0",
				can_collect: 1, // 1 表示未收藏  0表示已收藏
				collect_id:"", // 收藏的id
				// 订阅的模板id
				templateId:"",
				isWeChat:App.globalData.isWeChat,
				// 分享海报
				posterImg:"",
			}
		},

		onLoad:function(option){
			// option 接受url的传参
			this.sn = option.sn;
			if(option.signcode){
				let items = {};
				items[option.sn] = option.signcode;
				let jsonitems = JSON.stringify(items);
				uni.setStorageSync('job_signcode',jsonitems);
			}
		},
		
		// 小程序转发分享给朋友
		onShareAppMessage(option){
			if (option.from === 'button') { // 来自页面内分享按钮
				// console.log(option.target)
			}
			return {
				title: this.info.title,
				path: '/pages/job/jobDetail?sn='+ this.sn + '&signcode=' + App.globalData.signcode,
				desc: this.info.brief,
			}
		},
		
		// 小程序转发分享到朋友圈
		onShareTimeline(){
			
		},
		
		onShow(){
			this.initDetail(this.sn);
		},
		
		onReady:function(){
			
		},
		
		methods: {
			goBack() {
				uni.navigateBack({
					delta: 1
				})
			},
			
			// 获取职位详情
			initDetail(sn){
				this.$api.jobDetail({
					sn:sn,
					token:uni.getStorageSync('user_token'),
				}).then(res=>{
					if(res.code == 0){
						// 基础信息
						this.info.job_type = res.data.info.job_type;
						this.info.title = res.data.info.title;
						this.info.brief = res.data.info.brief;
						this.info.money = res.data.info.money;
						this.info.earnest_money = res.data.info.earnest_money;
						this.info.num = res.data.info.numbers;
						this.info.settlement = res.data.info.settle_model;
						this.info.address = res.data.info.address;
						this.info.latitude = res.data.info.latitude;
						this.info.longitude = res.data.info.longitude;
						
						// 工作流程
						this.processContent = this.$util.formatRichText(res.data.info.content);
						// 招聘详情
						this.info.detail = res.data.info.desc;
						
						// 联系方式
						this.info.contact = res.data.info.truename;
						this.info.tel = res.data.info.mobile;
						this.info.ewmImg = this.$globalUrl.baseUrl + res.data.info.codeimage;
						
						// 招聘方信息
						if( res.data.info.cm_image ){
							if(res.data.info.cm_image.indexOf("http") >= 0){
								this.info.cm_image = res.data.info.cm_image;
							}else{
								this.info.cm_image = this.$globalUrl.baseUrl + res.data.info.cm_image;
							}
						}else{
							this.info.cm_image = require("@/static/default_avatar.png")
						}
						this.info.cm_name = res.data.info.cm_name;
						
						// 报名列表
						this.applicant = res.data.sign_info.list.map((item,index)=>{
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
						})
						
						// 操作列表-收藏情况
						this.collect_id = res.data.collect_id;
						this.can_collect = res.data.can_collect; // 0 已收藏 1 未收藏
						
						this.sign_sn = res.data.sign_sn;
						// 操作列表-报名情况
						// if(this.info.job_type == 2){ // 长期职位 报名按钮不显示
						// 	this.buttonGroup = {};
						// }else{
							this.can_sign = res.data.can_sign; // 0表示已结束 1表示可以报名  2表示已报名
							if(res.data.can_sign == 0){ // 已结束
								this.buttonGroup = {
									text: '已结束',
									backgroundColor: '#FF6549',
									color: '#fff'
								};
							}else if(res.data.can_sign == 1){  // 可以报名
								this.buttonGroup = {
									text: '立即报名',
									backgroundColor: '#435AE0',
									color: '#fff'
								};
							}else if(res.data.can_sign == 2){ // 已报名
								// 审核状态:1=待支付,2=待审核,3=审核通过,4=审核不通过,5=已取消,6=已离职
								// 等于3的时候  显示去签到  等于4、5、6就显示上面的 审核报名不通过、报名已取消、已离职  同样可以跳转到详情
								// 1的时候先不考虑  0的时候就说明这个人没报名 参考sign_sn就行
								if(res.data.is_check == 2){
									this.buttonGroup = {
										text: '等待审核',
										backgroundColor: '#435AE0',
										color: '#fff'
									};
								}else if(res.data.is_check == 3){
									this.buttonGroup = {
										text: '去签到',
										backgroundColor: '#435AE0',
										color: '#fff'
									};
								}else if(res.data.is_check == 4){
									this.buttonGroup = {
										text: '报名审核不通过',
										backgroundColor: '#999999',
										color: '#fff'
									};
								}else if(res.data.is_check == 5){
									this.buttonGroup = {
										text: '报名已取消',
										backgroundColor: '#999999',
										color: '#fff'
									};
								}else if(res.data.is_check == 6){
									this.buttonGroup = {
										text: '已离职',
										backgroundColor: '#999999',
										color: '#fff'
									};
								}
							}
						// }
						// #ifdef H5
						if(this.isWeChat){
							// 获取微信签名
							App.subscribeShare();
							
							// 订阅
							this.enrolled_subscribe_h5(this.can_sign,this.info.job_type);
							
							// 分享
							this.share_h5();
						}
						// #endif
						
						// 第三方链接
						this.info.url = res.data.info.url;
					}else{
						uni.showToast({
							title: res.msg,
							icon: 'none'
						});
					}
				});
			},
			
			
			// 长期职位的跳转第三方页面
			jumpPosition(){
				uni.navigateTo({
					url:'/pages/webview/webview?url=' + this.info.url
				})
			},
			
			// 订阅和分享
			enrolled_subscribe_h5(can_sign,job_type){
				if(can_sign == 1 && job_type != 2){
					this.templateId = this.$globalUrl.template_id_enrolled;
					// wx-open-subscribe 原生绑定点击事件
					this.$nextTick(() => {
						var btn = this.$refs.subscribeBtn;
						btn.addEventListener('success', ({detail}) => {
							this.buttonClick();
						});
						btn.addEventListener('error', ({detail}) => {
							this.buttonClick();
						});
					})
				}
			},
			
			// 位置导航
			goLoaction(info){
				uni.openLocation({
					latitude: Number(info.latitude),
					longitude: Number(info.longitude),
					name: info.address,
					address: info.address,
					success: function () {
						console.log('success');
					}
				});
			},
			
			// 拨打电话
			callPhone(){
				if(!this.info.tel){
					this.$refs.alertDialog.open();
					this.msgContent = "请先授权登录";
				}else{
					uni.makePhoneCall({
						// 手机号
						phoneNumber: this.info.tel, 
						// 成功回调
						success: (res) => {
							console.log('调用成功!')	
						},
						// 失败回调
						fail: (res) => {
							console.log('调用失败!')
						}
					});
				}
			},
			
			// 分享
			share(){
				this.share_poster();
			},
			
			// 分享
			share_h5(){
				var params = {
					title:this.info.title,
					desc: this.info.brief,
					url:window.location.href
				};
				App.pageShare(params);
			},
			
			// 生成海报
			share_poster(){
				uni.showLoading({
					title: '合成中',
				});
				var plateform = 0;
				// #ifdef H5
				plateform = 1;
				// #endif
				
				// #ifdef MP-WEIXIN
				plateform = 2;
				// #endif
				
				this.$api.posterShare({
					token:uni.getStorageSync('user_token'),
					sn:this.sn,
					type:plateform,
				}).then(res=>{
					this.dialogCode = res.code;
					if(res.code == 0){
						this.posterImg = this.$globalUrl.baseUrl + res.data;
						uni.hideLoading();
						this.$refs.posterPopup.open();
					}else if(res.code == 1){
						uni.hideLoading();
						uni.showToast({
							title: res.msg,
							icon: 'none'
						});
					}else if(res.code == 2){ // 实名认证
						uni.hideLoading();
						this.$refs.alertDialog.open();
						this.msgContent = res.msg;
					}else if(res.code == 3){ // 手机号绑定
						uni.hideLoading();
						this.$refs.alertDialog.open();
						this.msgContent = res.msg;
					}else if(res.code == 4){ // 授权登录
						uni.hideLoading();
						this.$refs.alertDialog.open();
						this.msgContent = res.msg;
					}else{
						uni.hideLoading();
						uni.showToast({
							title: res.msg,
							icon: 'none'
						});
					}
				});
			},
			
			// 收藏
			collect(can_collect) {
				if(can_collect == 0){ // 已收藏
					// 操作是取消收藏
					this.cancelCollectJob();
				}else if(can_collect == 1){ // 位收藏
					// 操作是收藏
					this.collectJob();
				}
			},
			
			// 收藏活动
			collectJob(){
				this.$api.collectJob({
					token:uni.getStorageSync('user_token'),
					exercise_sn:this.sn,
				}).then(res=>{
					this.dialogCode = res.code;
					if(res.code == 0){
						uni.showToast({
							title: res.msg,
							icon: 'success'
						});
						this.initDetail(this.sn);
					}else if(res.code == 1){
						uni.showToast({
							title: res.msg,
							icon: 'none'
						});
					}else if(res.code == 2){ // 实名认证
						this.$refs.alertDialog.open();
						this.msgContent = res.msg;
					}else if(res.code == 3){ // 手机号绑定
						this.$refs.alertDialog.open();
						this.msgContent = res.msg;
					}else if(res.code == 4){ // 授权登录
						this.$refs.alertDialog.open();
						this.msgContent = res.msg;
					}else{
						uni.showToast({
							title: res.msg,
							icon: 'none'
						});
					}
				});
			},
			
			// 取消收藏活动
			cancelCollectJob(){
				this.$api.del_collectJob({
					token:uni.getStorageSync('user_token'),
					id:this.collect_id,
				}).then(res=>{
					if(res.code == 0){
						uni.showToast({
							title: '取消收藏',
							icon: 'success'
						});
						this.initDetail(this.sn);
					}else{
						uni.showToast({
							title: res.msg,
							icon: 'none'
						});
					}
				});
			},
			
			// 点击操作按钮
			buttonClick () {
				var signcode = "";
				// 立即报名
				if(this.can_sign == 1){
					var plateform = 0;
					// #ifdef H5
					plateform = 1;
					var storage_signcode = uni.getStorageSync("job_signcode");
					var JSON_signcode = storage_signcode?JSON.parse(storage_signcode):{}
					if(Object.keys(JSON_signcode)[0] == this.sn){
						signcode = JSON_signcode[this.sn]
					}
					// #endif
					
					// #ifdef MP-WEIXIN
					plateform = 2;
					// #endif
					
					uni.showModal({
						title: '温馨提示',
						content: '请确认是否报名',
						confirmText: '确定',
						cancelText: '取消',
						success: (modal_res) => {
							if (modal_res.confirm) {
								// 调立即报名的接口
								this.$api.signUp({
									token:uni.getStorageSync('user_token'),
									sn:this.sn,
									plateform:plateform,
									signcode:signcode,
								}).then(res=>{
									this.dialogCode = res.code;
									if(res.code == 0){ // 报名成功
										if(res.data.need_pay == 1){ // 要调支付接口
											this.initDetail(this.sn);
										}else{
											uni.showToast({
												title: res.msg,
												icon: 'success'
											});
											setTimeout(()=>{
												uni.setStorageSync('enrolled_activeTab',1);
												uni.reLaunch({
													url: "/pages/enrolled/enrolled",
												})
											},2000)
										}
									}else if(res.code == 1){ 
										uni.showToast({
											title: res.msg,
											icon: 'none'
										});
									}else if(res.code == 2){ // 实名认证
										this.$refs.alertDialog.open();
										this.msgContent = res.msg;
									}else if(res.code == 3){ // 手机号绑定
										this.$refs.alertDialog.open();
										this.msgContent = res.msg;
									}else if(res.code == 4){ // 授权登录
										this.$refs.alertDialog.open();
										this.msgContent = res.msg;
									}else{
										uni.showToast({
											title: res.msg,
											icon: 'none'
										});
									}
								});
							} else if (modal_res.cancel) {
								console.log('关闭');
							}
						}
					});
					
				}else if(this.can_sign == 2){
					// 已报名，并且有6中审核状态，跳转到报名详情页
					setTimeout(()=>{
						uni.navigateTo({
							// 保留当前页面，跳转到应用内的某个页面,使用uni.navigateBack可以返回到原页面
							url: "/pages/enrolled/enrolledDetail?id=" + this.sign_sn,
						})
					},300)
				}
			},
			
			// 点击关闭
			dialogClose() {
				console.log('点击关闭')
			},
			
			// 点击确定
			dialogConfirm(){
				if(this.dialogCode == '1'){
					
				}else if(this.dialogCode == '2'){
					// 跳转实名认证
					uni.navigateTo({
						url: "/packageMy/pages/my/authentication/authentication"
					})
				}else if(this.dialogCode == '3'){
					// 跳转个人中心-绑定手机号
					uni.navigateTo({
						url: "/packageMy/pages/my/profile/profile",
					})
				}else if(this.dialogCode == '4'){
					// 跳转授权
					uni.navigateTo({
						url: "/pages/auth/auth"
					})
				}
			},
			
			// 已报名人员
			scroll: function(e) {
				// console.log(e)
				// this.old.scrollTop = e.detail.scrollTop
			},
		}
	}
</script>

<style>
</style>
