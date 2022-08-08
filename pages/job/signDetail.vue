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
					<view class="contact w-40 text-center">
						<image class="image" :src="info.ewmImg" mode="aspectFit" />
						<text class="mt-2 d-block">加入工作群</text>
					</view>
				</view>
			</view>

			<!-- 签到 -->
			<view class="d-flex justify-content-center mt-5">
				<text class="bg-primary-600 my-btn" @click="showSign()">签到</text>
			</view>
		</view>
		
		<!-- 签到的pop -->
		<uni-popup ref="signTypePopup" @change="signTypePopupChange" :safe-area="false">
			<view class="bg-white signPopup">
				<uni-section title="签到" type="line">
					<uni-forms :modelValue="signTypeForm" label-position="top">
						<view class="px-3">
							<uni-forms-item label="签到类型" name="score">
								<uni-data-checkbox v-model="signTypeForm.type" :localdata="range"></uni-data-checkbox>
							</uni-forms-item>
						</view>
					</uni-forms>
					<view class="text-center pt-5 pb-5">
						<text class="my-btn bg-primary-600 fs_13" @click="signInOut(signTypeForm.type)">确定</text>
					</view>
				</uni-section>
			</view>
		</uni-popup>
		
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
				},
				// 流程
				processContent:"",
				isWeChat:App.globalData.isWeChat,
				signTypeForm:{
					type:"",
				},
				range:[
					{"value": 1,"text": "签到"	},
					{"value": 2,"text": "签退"	}
				]
			}
		},
		
		onLoad:function(option){
			// option 接受url的传参 
			this.sn = option.sn;
		},
		
		onShow:function(){
			this.initDetail(this.sn);
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
						
					}else{
						uni.showToast({
							title: res.msg,
							icon: 'none'
						});
					}
				});
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
			
			// 判断签到还是签退
			showSign(){
				this.$refs.signTypePopup.open('bottom');
			},
			
			// 评价弹窗状态改变
			signTypePopupChange(e){
				if(!e.show){
					this.signTypeForm = {
						type:"",
					};
				}
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
								sn:this.sn,
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
									this.$refs.signTypePopup.close();
									setTimeout(()=>{
										uni.reLaunch({
											url: "/pages/enrolled/enrolled"
										})
									},1000)
								}else{
									this.$refs.signTypePopup.close();
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
			
		}
	}
</script>

<style>
</style>
