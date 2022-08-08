<template>
	<view class="page-container purse-container">
		<uni-nav-bar dark :fixed="true" status-bar left-icon="left" :border="false" title="提现明细" @clickLeft="goBack" />
		<view class="detail-list">
			<template v-for="(item,index) in lists">
				<view class="d-flex align-content-start detailList-item pl-3 pr-3" :key="index">
					<view class="w-20 date pt-3 pb-3">
						<text class="fs_25">{{ item.date_y }}</text>
						<text class="fs_12 ml-1">{{ item.date_m }} 月</text>
					</view>
					<view class="w-80">
						<template v-for="(cell,j) in item.list">
							<view class="content pt-3 pb-3" :key="j">
								<view class="d-flex align-items-center justify-content-between">
									<view class="mr-3">
										<text class="fs_14 d-block">
											<text v-if="cell.type == 1">支付宝</text>
											<text v-else-if="cell.type == 2">银行卡</text>
											<text v-else-if="cell.type == 3">微信</text>
										</text>
										<text class="fs_12 text-grey-200 d-block">
											<text v-if="cell.status == 1">待审核</text>
											<text v-else-if="cell.status == 2">已通过</text>
											<text v-else-if="cell.status == 3">已驳回</text>
										</text>
										<text class="fs_12 text-grey-200 d-block">{{ cell.remark }}</text>
									</view>
									<text class="fs_17 text-warning">{{ cell.money }}</text>
								</view>
								<text class="fs_12 text-grey-200 d-flex justify-content-end">{{ cell.date_time }}</text>
							</view>
						</template>
					</view>
					
				</view>
			</template>
			<uni-load-more :status="loadStatus"></uni-load-more>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				lists:[],
				currentPage:1,
				pageSize:10,
				total:0,
				loadStatus:"more",
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
			
			// 获取收入明细
			getBalance(token){
				this.$api.withdrawalList({
					token:token,
					page:this.currentPage,
					limit:this.pageSize
				}).then(res=>{
					if(res.code == 0){
						this.total = res.data.total;
						if (this.currentPage == 1) {
							this.lists = res.data.list;
							if (this.lists.length < this.total) {
								this.loadStatus = "more";
							} else {
								this.loadStatus = "no-more";
							}
						} else {
							this.loadStatus = "loading";
							setTimeout(()=>{
								this.lists = this.lists.concat(res.data.list);
								if (this.lists < this.total) {
									this.loadStatus = "more";
								} else {
									this.loadStatus = "no-more";
								}
							},1000)
						};
						uni.hideNavigationBarLoading();
					}else{
						uni.showToast({
							title: res.msg,
							icon: 'none'
						});
					}
				});
			},
		},
		
		// 上拉加载
		onReachBottom() {
			this.currentPage++;
			if (this.lists.length < this.total) {
				this.getBalance();
			} else {
				uni.hideNavigationBarLoading();
				this.loadStatus = "no-more";
			}
		},
		
		// 下拉刷新
		onPullDownRefresh(){
			this.loadStatus = "more";
			this.currentPage = 1;
			this.pageSize = 10;
			this.total = 0;
			this.getBalance();
			setTimeout(function () {
				uni.stopPullDownRefresh();  //停止下拉刷新动画
			}, 1000);
		},
	}
</script>

<style>

</style>
