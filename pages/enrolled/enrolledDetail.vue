<template>
	<view class="page-container detail-container">
		<uni-nav-bar dark :fixed="true" status-bar left-icon="left" :border="false" title="职位详情" @clickLeft="goBack" />
		<view class="bg_arc_detail"></view>
		<view class="p-3 detail-content">
			<view class="info-box p-3">
				<view class="d-flex justify-content-between">
					<text class="d-block fs_15">{{ info.title }}</text>
					<text class="d-block fs_15 text-primary">
						<text v-if="info.status == 1">已报名</text>
						<text v-else-if="info.status == 2">进行中</text>
						<text v-else-if="info.status == 3">已完成</text>
					</text>
				</view>
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
					<view class="w-50 mt-3-1">
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
					<view class="contact w-40 text-center" v-if="info.is_check == 3">
						<image class="image" :src="info.ewmImg" mode="aspectFit" />
						<text class="mt-2 d-block">加入工作群</text>
					</view>
				</view>
			</view>
			
			<!-- 签到记录 -->
			<!-- 审核成功的时候会有签到记录 -->
			<view class="info-box p-3 mt-2" v-if="info.is_check == 3">
				<view class="box-title d-flex justify-content-between align-items-center pb-3-1">
					<text class="d-block fs_15">签到记录</text>
					<view class="d-flex align-items-center">
						<view class="text-primary-600 mr-2 sign">
							<uni-icons type="calendar-filled" size="16" color="#435AE0"></uni-icons>
							<!-- #ifdef H5 -->
							<!-- 微信环境 -->
							<template v-if="isWeChat">
								<!-- <wx-open-subscribe :template="templateId" ref="subscribeBtnSignIn">
									<script type="text/wxtag-template" slot="style">
											<style>
													.text {
														color: #435AE0;
														font-size:12px;
													}
											</style>
									</script>
									<script type="text/wxtag-template">
										<div class="text">上班签到</div>
									</script>
								</wx-open-subscribe> -->
								<text @click="signInOut(1)">上班签到</text>
							</template>
							<template v-else>
								<text @click="signInOut(1)">上班签到</text>
							</template>
							<!-- #endif -->
							
							<!-- 非H5 -->
							<!-- #ifndef H5 -->
							<text @click="signInOut(1)">上班签到</text>
							<!-- #endif -->
						</view>
						<view class="text-primary-600 sign">
							<uni-icons type="calendar-filled" size="16" color="#435AE0"></uni-icons>
							<!-- #ifdef H5 -->
							<!-- 微信环境 -->
							<template v-if="isWeChat">
								<!-- <wx-open-subscribe :template="templateId" ref="subscribeBtnSignOut">
									<script type="text/wxtag-template" slot="style">
											<style>
													.text {
														color: #435AE0;
														font-size:12px;
													}
											</style>
									</script>
									<script type="text/wxtag-template">
										<div class="text">下班签退</div>
									</script>
								</wx-open-subscribe> -->
								<text @click="signInOut(2)">下班签退</text>
							</template>
							<template v-else>
								<text @click="signInOut(2)">下班签退</text>
							</template>
							<!-- #endif -->
							
							<!-- 非H5 -->
							<!-- #ifndef H5 -->
							<text @click="signInOut(2)">下班签退</text>
							<!-- #endif -->
						</view>
					</view>
				</view>
				<view>
					<block v-for="(record,index) in signRecords" :key="index">
						<view class="d-flex justify-content-between align-items-center mt-2">
							<text class="w-40">{{ record.date }}</text>
							<text class="w-30"><text v-if="record.signtime">上午签到成功</text></text>
							<text class="w-30"><text v-if="record.signbacktime">下午签退成功</text></text>
						</view>
					</block>
				</view>
			</view>
			
			<!-- is_check如果为2的话 是待审核（取消报名）；为3的话 是审核通过；4的话 审核不通过；5的话是已取消 -->
			<!-- 按钮 -->
			<!-- 待审核 取消报名 -->
			<view class="d-flex justify-content-center mt-5" v-if="info.is_check == 2">
				<text class="bg-primary-600 my-btn" @click="cancelEnroll">取消报名</text>
			</view>
			
			<!-- 审核通过 -->
			<view class="d-flex justify-content-center mt-5" v-else-if="info.is_check == 3">
				<text class="bg-primary-600 my-btn">审核通过</text>
			</view>
			
			<!-- 审核不通过 -->
			<view class="d-flex justify-content-center mt-5" v-else-if="info.is_check == 4">
				<text class="bg-warning my-btn">审核不通过</text>
			</view>
			
			<!-- 已取消-->
			<view class="d-flex justify-content-center mt-5" v-else-if="info.is_check == 5">
				<text class="bg-grey-150 my-btn mr-3">已取消</text>
			</view>
			
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
				info:{
					title:"",
					money:"",
					earnest_money:"",
					num:"",
					settlement:"",
					address:"1",
					latitude:"",
					longitude:"",
					
					detail:"",
					contact:"",
					tel:"",
					ewmImg:"",
					
					is_check:"",
				},
				// 流程
				processContent:"",
				// 报名人员
				applicant:[
					{
						id:"01",
						name:"张三",
						avatar:require("@/static/uni.png"),
					},
				],
				signRecords: [],
				// 订阅的模板id
				templateId:"",
				isWeChat:App.globalData.isWeChat,
			}
		},
		
		onLoad:function(option){
			// option 接受url的传参 
			this.id = option.id;
		},
		
		onShow:function(){
			this.initDetail(this.id);
		},
	
		// 小程序转发分享给朋友
		onShareAppMessage(option){
			if (option.from === 'button') { // 来自页面内分享按钮
				console.log(option.target)
			}
			return {
				title: this.info.title,
				path: '/pages/job/jobDetail?sn='+ this.info.sn + '&signcode=' + App.globalData.signcode,
				desc: this.info.brief,
			}
		},
		
		// 小程序转发分享到朋友圈
		onShareTimeline(){
			
		},
	
		methods: {
			goBack() {
				uni.navigateBack({
					delta: 1
				})
			},
			
			// 获取职位详情
			initDetail(id){
				this.$api.enrolledDetail({
					id:id,
					token:uni.getStorageSync('user_token'),
				}).then(res=>{
					if(res.code == 0){
						// 基础信息
						this.info.sn = res.data.info.sn;
						this.info.title = res.data.info.title;
						this.info.brief = res.data.info.brief;
						this.info.status = res.data.info.status;
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
						
						// 签到记录
						this.signRecords = res.data.sgin_record_list;
						
						// 审核状态
						// is_check如果为2的话 是待审核；为3的话 是审核通过；4的话 审核不通过；5的话是已取消
						this.info.is_check = res.data.info.is_check;
						
						// #ifdef H5
						if(this.isWeChat){
							// 获取微信签名
							App.subscribeShare();
							
							// 订阅
							this.sign_subscribe_h5(this.info.is_check);
							
							// 分享
							this.share_h5();
						}
						// #endif
						
					}else{
						uni.showToast({
							title: res.msg,
							icon: 'none'
						});
					}
				});
			},
			
			// 订阅
			sign_subscribe_h5(is_check){
				if(is_check == 3){
					this.templateId = this.$globalUrl.template_id_sign;
					
					// wx-open-subscribe 原生绑定点击事件
					this.$nextTick(() => {
						// 签到
						var btn_in = this.$refs.subscribeBtnSignIn;
						btn_in.addEventListener('success', ({detail}) => {
							this.signInOut(1);
						});
						btn_in.addEventListener('error', ({detail}) => {
							this.signInOut(1);
						});
						
						// 签退
						var btn_out = this.$refs.subscribeBtnSignOut;
						btn_out.addEventListener('success', ({detail}) => {
							this.signInOut(2);
						});
						btn_out.addEventListener('error', ({detail}) => {
							this.signInOut(2);
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
			
			// 分享
			share_h5(){
				var _hrefArry = window.location.href.split("#");
				var _href1 = _hrefArry[0];
				var _href2 = "#/pages/job/jobDetail";
				var _href3 = "?sn="+ this.info.sn;
				var params = {
					title:this.info.title,
					desc: this.info.brief,
					url:_href1+_href2+_href3,
				};
				App.pageShare(params);
			},
			
			// 签到、签退
			signInOut(type){
				var signtype = 0;
				// #ifdef H5
				signtype = 1;
				// #endif
				
				// #ifdef MP-WEIXIN
				signtype = 2;
				// #endif
				
				var sign_title = "";
				if(type == 1){ // 签到
					sign_title = "签到";
				}else if(type == 2){ // 签退
					sign_title = "签退";
				}
				
				uni.showModal({
					title: '温馨提示',
					content: '请确认是否' + sign_title,
					confirmText: '确定',
					cancelText: '取消',
					success: (modal_res) => {
						if (modal_res.confirm) {
							// 调签到的接口
							this.$api.sign({
								token:uni.getStorageSync('user_token'),
								id:this.id,
								longitude:this.info.longitude,
								latitude:this.info.latitude,
								sign_type:type,
								signtype:signtype,
							}).then(res=>{
								if(res.code == 0){
									uni.showToast({
										title: sign_title + '成功',
										icon: 'success'
									});
									this.initDetail(this.id);
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
				
			},
			
			// 取消报名
			cancelEnroll(){
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
								id:this.id,
							}).then(res=>{
								uni.showToast({
									title: res.msg,
									icon: 'success'
								});
								this.initDetail(this.id);
							});
						} else if (modal_res.cancel) {
							console.log('关闭');
						}
					}
				});
			},
		}
	}
</script>

<style>
</style>
