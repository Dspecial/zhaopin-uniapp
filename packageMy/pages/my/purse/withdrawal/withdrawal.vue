<template>
	<view class="page-container withdrawal-container">
		<uni-nav-bar dark :fixed="true" status-bar left-icon="left" :border="false" title="提现" @clickLeft="goBack" />
		<view class="p-3">
			<uni-forms ref="withdrawalForm" :modelValue="withdrawalForm" label-width="0">
				<view class="withdrawalForm">
					<uni-forms-item label=" ">
						<uni-data-select
							v-model="withdrawalForm.type"
							:localdata="typeOptions"
							@change="typeChange"
							placeholder="提现方式"
						></uni-data-select>
					</uni-forms-item>
					<uni-forms-item label=" ">
						<uni-data-select
							v-model="withdrawalForm.account"
							:localdata="accountOptions"
							placeholder="账号"
						></uni-data-select>
					</uni-forms-item>
					<uni-forms-item label=" ">
						<uni-easyinput v-model="withdrawalForm.amount" placeholder="提现金额" />
						<!-- 提现提示 -->
						<view class="mt-2 text-danger fs_12" v-if="tips">
							温馨提示：请于当月的 {{ tips }} 号申请提现
						</view>
						<!-- 可提现金额 -->
						<view class="mt-2 d-flex justify-content-between fs_12">
							<view>
								<text class="text-grey-150">可提金额：</text>
								<text class="text-grey-150">￥{{ allAmount }}</text>
								<text class="ml-3 text-primary" @click="allWithdrawal">全部提现</text>
							</view>
							<text class="text-grey-200" @click="goDetail()">提现记录</text>
						</view>
					</uni-forms-item>
				</view>
			</uni-forms>
			<view class="p-btn">
				<!-- #ifdef H5 -->
				<!-- 微信环境 -->
				<template v-if="isWeChat">
					<wx-open-subscribe :template="templateId" ref="subscribeBtn" class="subscribeBtn_money">
						<script type="text/wxtag-template" slot="style">
								<style>
										.my-btn {
											padding: 10px 40px;
											border-radius: 20px;
											border: 0;
											background-color: #435AE0;
											color:#FFFFFF;
											font-size: 16px;
											padding-left:7px;
											padding-right:7px;
											padding-top:10px;
											padding-bottom:10px;
											text-align: center;
										}
								</style>
						</script>
						<script type="text/wxtag-template">
							<div class="my-btn">确认提现</div>
						</script>
					</wx-open-subscribe>
				</template>
				<template v-else>
					<view class="my-btn bg-primary-600 px-2 py-3 fs_16" @click="apply()">确认提现</view>
				</template>
				<!-- #endif -->
				
				<!-- 非H5 -->
				<!-- #ifndef H5 -->
				<view class="my-btn bg-primary-600 px-2 py-3 fs_16" @click="apply()">确认提现</view>
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
				withdrawalForm:{
					type:2,
					account:"",
					amount:"",
				},
				typeOptions: [
					{ value: 2, text: "银行卡" },
				],
				tips:"",
				accountOptions: [],
				allAmount: "",
				// 订阅的模板id
				templateId:"",
				isWeChat:App.globalData.isWeChat,
			}
		},
		onLoad(){
			
		},
		onShow(){
			this.getBalance();
			this.initDeposit();
			this.initBankCardList(2);
		},
		methods: {
			goBack() {
				uni.navigateBack({
					delta: 1
				})
			},
			
			// 获取余额
			getBalance(){
				this.$api.balanceInfo({
					token:uni.getStorageSync('user_token')
				}).then(res=>{
					if(res.code == 0){
						this.allAmount = res.data.balance;
						// #ifdef H5
						// 订阅
						if(this.isWeChat){
							this.money_subscribe_h5();
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
			money_subscribe_h5(){
				this.templateId = this.$globalUrl.template_id_money;
				App.subscribeShare();
				
				// wx-open-subscribe 原生绑定点击事件
				this.$nextTick(() => {
					var btn = this.$refs.subscribeBtn;
					btn.addEventListener('success', ({detail}) => {
						this.apply();
					});
					btn.addEventListener('error', ({detail}) => {
						this.apply();
					});
				})
			},
			
			// 提现方式选择
			typeChange(value){
				if(value){
					this.initBankCardList(value);
				}
			},
			
			// 全部提现
			allWithdrawal(){
				this.withdrawalForm.amount = this.allAmount;
			},
			
			// 获取银行卡列表
			initBankCardList(type){
				this.$api.accountList({
					token:uni.getStorageSync('user_token'),
					type:type,
				}).then(res=>{
					if(res.code == 0){
						this.accountOptions = res.data.map((item,index)=>{
							return {
								text: item.code_num + '（' + item.name  + '）',
								value: item.id
							}
						});
					}else{
						uni.showToast({
							title: res.msg,
							icon: 'none'
						});
					}
				});
			},
			
			// 获取提现提示
			initDeposit(){
				this.$api.aboutUs({
					name: 'set_deposit',
				}).then(res=>{
					if(res.code == 0){
						this.tips = res.data.value;
					}else{
						uni.showToast({
							title: res.msg,
							icon: 'none'
						});
					}
				});
			},
			
			// 跳转提现记录
			goDetail(){
				uni.navigateTo({
					// 保留当前页面，跳转到应用内的某个页面,使用uni.navigateBack可以返回到原页面
					url: "/packageMy/pages/my/purse/withdrawal/withdrawalDetail",
				})
			},
			
			// 提现申请
			apply(){
				var plateform = 0;
				// #ifdef H5
				plateform = 1;
				// #endif
				
				// #ifdef MP-WEIXIN
				plateform = 2;
				// #endif
				
				uni.showModal({
					title: '温馨提示',
					content: '请确认是否提现',
					confirmText: '确定',
					cancelText: '取消',
					success: (modal_res) => {
						if (modal_res.confirm) {
							this.$api.withdrawalApply({
								token:uni.getStorageSync('user_token'),
								deposit_money:this.withdrawalForm.amount,
								account_id:this.withdrawalForm.account,
								type:this.withdrawalForm.type,
								plateform:plateform,
							}).then(res=>{
								if(res.code == 0){
									uni.showToast({
										title: res.msg,
										icon: 'success'
									});
									setTimeout(()=>{
										this.withdrawalForm = {
											type:"",
											account:"",
											amount:"",
										};
										this.getBalance();
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
									},2000)
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
		}
	}
</script>

<style>

</style>
