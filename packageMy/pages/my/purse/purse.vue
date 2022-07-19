<template>
	<view class="page-container purse-container">
		<uni-nav-bar dark :fixed="true" status-bar left-icon="left" :border="false" title="钱包" @clickLeft="goBack" />
		<view class="p-3">
			<view class="money">
				<image class="image money-image" :src="moneyBg" mode="aspectFit" />
				<view class="money-text text-white">
					<view class="d-flex justify-content-between align-items-center">
						<view>
							<view class="d-flex align-items-center">
								<image class="image" :src="moneyIcon" mode="aspectFit" style="width:35rpx;height:35rpx" />
								<view class="ml-2">当前余额</view>
							</view>
							<text class="d-block fs_32 mt-2 ml-4">{{ money }}</text>
						</view>
						<view class="my-btn bg-white py-1 px-4" @click="goWithdrawal()">提现</view>
					</view>
				</view>
			</view>
			
			<view class="card-box mt-3 purse-list pl-3 pr-3">
				<!-- 我的支付宝 -->
				<view class="d-flex justify-content-between align-items-center purse-list-item pt-3 pb-3" @click="goAlipay()">
					<view class="d-flex align-items-center">
						<image class="image" :src="purseListIcon1" mode="aspectFit" style="width:29rpx;height:29rpx" />
						<text class="ml-3 fs_14">我的支付宝</text>
					</view>
					<view>
						<uni-icons type="right" size="14"></uni-icons>
					</view>
				</view>
				
				<!-- 我的银行卡 -->
				<view class="d-flex justify-content-between align-items-center purse-list-item pt-3 pb-3" @click="goBankcard()">
					<view class="d-flex align-items-center">
						<image class="image" :src="purseListIcon2" mode="aspectFit" style="width:29rpx;height:29rpx" />
						<text class="ml-3 fs_14">我的银行卡</text>
					</view>
					<view>
						<uni-icons type="right" size="14"></uni-icons>
					</view>
				</view>
				
				<!-- 提现明细 -->
				<view class="d-flex justify-content-between align-items-center purse-list-item pt-3 pb-3" @click="goWithdrawalDetail()">
					<view class="d-flex align-items-center">
						<image class="image" :src="purseListIcon3" mode="aspectFit" style="width:29rpx;height:29rpx" />
						<text class="ml-3 fs_14">提现明细</text>
					</view>
					<view>
						<uni-icons type="right" size="14"></uni-icons>
					</view>
				</view>
				
				<!-- 金额明细 -->
				<view class="d-flex justify-content-between align-items-center purse-list-item pt-3 pb-3" @click="goIncomeDetail()">
					<view class="d-flex align-items-center">
						<image class="image" :src="purseListIcon4" mode="aspectFit" style="width:29rpx;height:29rpx" />
						<text class="ml-3 fs_14">金额明细</text>
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
				moneyBg: require("@/packageMy/static/my/purse_money_bg.png"),
				moneyIcon: require("@/packageMy/static/my/money_icon.png"),
				money: '2000.00',
				purseListIcon1: require("@/packageMy/static/my/purseList_icon1.png"),
				purseListIcon2: require("@/packageMy/static/my/purseList_icon2.png"),
				purseListIcon3: require("@/packageMy/static/my/purseList_icon3.png"),
				purseListIcon4: require("@/packageMy/static/my/purseList_icon4.png"),
			}
		},
		onLoad(){
			
		},
		onShow(){
			this.user_token = uni.getStorageSync('user_token');
			if(this.user_token){
				this.getBalance(this.user_token);
			}
		},
		methods: {
			goBack() {
				uni.navigateBack({
					delta: 1
				})
			},
			
			// 获取余额
			getBalance(token){
				this.$api.balanceInfo({
					token:token
				}).then(res=>{
					if(res.code == 0){
						this.money = res.data.balance;
					}else{
						uni.showToast({
							title: res.msg,
							icon: 'none'
						});
					}
				});
			},
			
			// 跳转提现
			goWithdrawal(){
				uni.navigateTo({
					// 保留当前页面，跳转到应用内的某个页面,使用uni.navigateBack可以返回到原页面
					url: "/packageMy/pages/my/purse/withdrawal/withdrawal",
				})
			},
			
			// 跳转我的支付宝
			goAlipay(){
				uni.navigateTo({
					// 保留当前页面，跳转到应用内的某个页面,使用uni.navigateBack可以返回到原页面
					url: "/packageMy/pages/my/purse/alipay/alipay",
				})
			},
			
			// 跳转我的银行卡
			goBankcard(){
				uni.navigateTo({
					// 保留当前页面，跳转到应用内的某个页面,使用uni.navigateBack可以返回到原页面
					url: "/packageMy/pages/my/purse/bankCard/bankCard",
				})
			},
			
			// 跳转提现明细
			goWithdrawalDetail(){
				uni.navigateTo({
					// 保留当前页面，跳转到应用内的某个页面,使用uni.navigateBack可以返回到原页面
					url: "/packageMy/pages/my/purse/withdrawal/withdrawalDetail",
				})
			},
			
			// 跳转金额明细
			goIncomeDetail(){
				uni.navigateTo({
					// 保留当前页面，跳转到应用内的某个页面,使用uni.navigateBack可以返回到原页面
					url: "/packageMy/pages/my/purse/income/incomeDetail",
				})
			},
		}
	}
</script>

<style>

</style>
