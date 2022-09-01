<template>
	<view class="page-container index-container">
		<!-- nav-bar -->
		<uni-nav-bar :fixed="true" status-bar class="uni-navbar-index">
			<template slot="left">
				<view class="city d-flex" @click="goCitys(city_id,city_name)">
					<view>
						<text class="uni-nav-bar-text fs_14">{{ city_name }}</text>
					</view>
					<uni-icons type="arrowdown" size="14" />
				</view>
			</template>
			<view class="d-flex align-items-center justify-content-around w-100 fs_18">首页</view>
		</uni-nav-bar>
		<view class="p-3">
			<!-- banner -->
			<uni-swiper-dot class="uni-swiper-dot-box" @clickItem=dotclickItem :info="bannerList" :current="current" :mode="mode"
				:dots-styles="dotsStyles" field="content">
				<swiper class="swiper-box" @change="bannerChange" :current="current" autoplay="true" interval="3000">
					<swiper-item v-for="(item, index) in bannerList" :key="index">
						<view class="swiper-item">
							<image class="image" :src="item.image" mode="scaleToFill" @click="bannerDetail(item)" />
						</view>
					</swiper-item>
				</swiper>
			</uni-swiper-dot>
			<!-- adv1 -->
			<view class="mt-2 adv1-box">
				<uni-row :gutter="20">
					<uni-col :span="12" v-for="(adv1,index) in adv1List" :key="index">
						<view class="adv1_item" @click="adv1Click(index)">
							<image class="image" :src="adv1.bgImg" mode="scaleToFill" />
							<view class="text">
								<text class="title d-block fs_15 font-weight-black">{{adv1.title}}</text>
								<text class="subtitle d-block">{{adv1.subtitle}}</text>
							</view>
						</view>
					</uni-col>
				</uni-row>
			</view>
			<!-- adv2 -->
			<view class="mt-2 adv2-box" v-if="adv2Img">
				<image class="image" :src="adv2Img" mode="scaleToFill" />
			</view>
			<!-- 为你推荐 -->
			<view class="mt-2 recommend-box">
				<view class="box-title d-flex justify-content-between align-items-center">
					<view class="title">
						<text class="d-block fs_18 font-weight-semibold">为您推荐</text>
						<view class="small-line"></view>
					</view>
					<view class="d-flex align-items-center text-grey" @click="viewMore()">
						<text class="d-block fs_10 mr-1">查看全部</text>
						<uni-icons type="right" size="12"></uni-icons>
					</view>
				</view>
				<view class="box-content">
					<template v-for="(cell,index) in recommendList">
						<view class="recommend-item p-3 mt-2" :key="index" @click="goDetail(cell)">
							<view class="header d-flex justify-content-between align-items-center">
								<text class="d-block fs_14 font-weight-semibold">{{ cell.title }}</text>
								<text class="d-block fs_15 font-weight-semibold pay">
									￥{{ cell.money }}
									<text v-if="cell.type == 1">/小时</text>
									<text v-else-if="cell.type == 2">/天</text>
									<text v-else-if="cell.type == 3">/周</text>
									<text v-else-if="cell.type == 4">/月</text>
								</text>
							</view>
							<view class="content mt-2 mb-2">
								{{ cell.brief }}
							</view>
							<view class="footer">
								<view class="d-flex justify-content-between align-items-center">
									<view>
										<uni-icons type="calendar-filled" size="14"></uni-icons>
										<text class="fs_11 ml-1">{{ cell.startdate }} - {{ cell.enddate }}</text>
									</view>
									<view class="my-1">
										<!-- 1=已停招  2=报名中  3=进行中 4=已结束 5=已招满 -->
										<template v-if="cell.state == 1">
											<uni-tag :circle="true" text="已停招" type="error" size="small" />
										</template>
										<template v-if="cell.state == 2">
											<uni-tag :circle="true" text="报名中" type="primary" size="small" />
										</template>
										<template v-if="cell.state == 3">
											<uni-tag :circle="true" text="进行中" type="success" size="small" />
										</template>
										<template v-if="cell.state == 4">
											<uni-tag :circle="true" text="已结束" type="error" size="small" />
										</template>
										<template v-if="cell.state == 5">
											<uni-tag :circle="true" text="已招满" type="error" size="small" />
										</template>
									</view>
								</view>
								<view class="d-flex justify-content-between align-items-center mt-1">
									<view class="d-flex align-items-center">
										<uni-icons type="location-filled" size="14"></uni-icons>
										<text class="fs_11 ml-1">{{ cell.name }}</text>
									</view>	
									<view class="d-flex align-items-center">
										<view class="d-flex align-items-center mr-3">
											<image class="image" :src="personsIcon" mode="scaleToFill" style="width:28rpx;height:28rpx" />
											<text class="fs_11 ml-1">{{ cell.numbers }}</text>
										</view>
										<view class="d-flex align-items-center">
											<uni-icons type="eye-filled" size="14"></uni-icons>
											<text class="fs_11 ml-1">{{ cell.all_views }}</text>
										</view>
									</view>
								</view>
							</view>
						</view>
					</template>
					<uni-load-more :status="loadStatus"></uni-load-more>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				city_id:"",
				city_name:"",
				bannerList:[],
				current: 0,
				mode: 'default',
				dotsStyles: {
					backgroundColor: 'rgba(255, 255, 255, .4)',
					border: '1px rgba(255, 255, 255, .4) solid',
					color: '#fff',
					selectedBackgroundColor: 'rgba(255, 255, 255, 1)',
					selectedBorder: '1px rgba(255, 255, 255, 1) solid'
				},
				adv1List:[
					{
						bgImg:require("@/static/index/adv1_bg1.png"),
						type:"1",
						title:"临时工",
						subtitle:"工资日结",
					},
					{
						bgImg:require("@/static/index/adv1_bg2.png"),
						type:"1",
						title:"长期职位",
						subtitle:"平均涨薪60%",
					},
				],
				adv2Img:"",
				personsIcon:require("@/static/index/personsIcon.png"),
				recommendList:[],
				currentPage:1,
				pageSize:10,
				total:0,
				loadStatus:"more",
			}
		},
		onLoad() {
			
		},
		onShow(){
			if(uni.getStorageSync('city_name')){
				this.city_id = uni.getStorageSync('city_id');
				this.city_name = uni.getStorageSync('city_name');
				// banner
				this.initBanner(this.city_id);
				// 推荐
				this.initRecommendList(this.city_id);
			}else{
				this.getLocation();
			}
			this.initAdv2Img();
		},
		methods: {
			// 获取当前定位
			getLocation() {
				let _this = this
				uni.getLocation({
					type: 'wgs84',
					geocode: true,  
					success: function(res) {
						_this.$api.locationCurrent({
							longitude:res.longitude,
							latitude:res.latitude,
						}).then(res=>{
							if(res.code == 0){
								_this.city_id = res.data.city_id;
								_this.city_name = res.data.city_name;
								uni.setStorageSync('city_id',res.data.city_id);
								uni.setStorageSync('city_name',res.data.city_name);
								// banner
								_this.initBanner(res.data.city_id);
								// 推荐
								_this.initRecommendList(res.data.city_id);
							}else{
								uni.showToast({
									title: res.msg,
									icon: 'none'
								});
							}
						});
					},
					fail: (err) => {
						console.log('err ==>',err);
					},
				});
			},
			
			// 去城市选择页面
			goCitys(city_id,city_name){
				uni.navigateTo({
					// 保留当前页面，跳转到应用内的某个页面,使用uni.navigateBack可以返回到原页面
					url: "/pages/index/citys/citys",
				})
				uni.setStorageSync('city_id',city_id);
				uni.setStorageSync('city_name',city_name);
			},
			
			// 获取banner图
			initBanner(city_id){
				var type = 0;
				// #ifdef H5
				type = 1;
				// #endif
				
				// #ifdef MP-WEIXIN
				type = 2;
				// #endif
				
				this.$api.banner({
					city_id: city_id,
					type:type, // 1=公众号,2=小程序
				}).then(res=>{
					if(res.code == 0){
						this.bannerList = res.data.map((item,index)=>{
							item.image = this.$globalUrl.baseUrl + item.image;
							return item;
						});
					}else{
						uni.showToast({
							title: res.msg,
							icon: 'none'
						});
					}
				});
			},
			
			// banner切换
			bannerChange(e) {
				this.current = e.detail.current
			},
			
			// banner dot切换
			dotclickItem(e) {
				this.current = e
			},
			
			// banner跳转详情
			bannerDetail(item){
				// 跳转地址:
				// 如果type为1时url不为空则跳转，url为空根据content不为空跳新页面；
				// 如果type为2此字段不作为跳转依据，如果content不为空，则跳新页面;
				// 如果url和congtent都为空，不做任何跳转
				let to_url = '';
				if(item.url){
					to_url = item.url.split('#')[1];
				}
				if(item.type == 1){
					if(item.url){
						uni.navigateTo({
							url: to_url,
						})
					}else if(item.content){
						uni.navigateTo({
							// 保留当前页面，跳转到应用内的某个页面,使用uni.navigateBack可以返回到原页面
							url: "/pages/index/bannerDetail/bannerDetail?id=" + item.id,
						})
					}
				}else if(item.type == 2){
					if(item.content){
						uni.navigateTo({
							// 保留当前页面，跳转到应用内的某个页面,使用uni.navigateBack可以返回到原页面
							url: "/pages/index/bannerDetail/bannerDetail?id=" + item.id,
						})
					}
				}
			},
			
			// 广告位点击事件
			adv1Click(index){
				uni.setStorageSync('job_activeTab',index);
				uni.reLaunch({
					url: "/pages/job/job",
				})
			},
			
			// 获取第二个广告位
			initAdv2Img(){
				this.$api.aboutUs({
					name: 'middle_img',
				}).then(res=>{
					if(res.code == 0){
						this.adv2Img = this.$globalUrl.baseUrl + res.data.value;
					}else{
						uni.showToast({
							title: res.msg,
							icon: 'none'
						});
					}
				});
			},
			
			// 推荐-查看全部
			viewMore(){
				uni.switchTab({
					url: "/pages/job/job",
				})
			},
			
			// 获取推荐列表
			initRecommendList(city_id){
				this.$api.recommendIndex({
					city_id: city_id,
					page:this.currentPage,
					limit:this.pageSize
				}).then(res=>{
					if(res.code == 0){
						this.total = res.data.total;
						if (this.currentPage == 1) {
							this.recommendList = res.data.data;
							if (this.recommendList.length < this.total) {
								this.loadStatus = "more";
							} else {
								this.loadStatus = "no-more";
							}
						} else {
							this.loadStatus = "loading";
							setTimeout(()=>{
								this.recommendList = this.recommendList.concat(res.data.data);
								if (this.recommendList.length < this.total) {
									this.loadStatus = "more";
								} else {
									this.loadStatus = "no-more";
								}
							},1000)
						}
						
						uni.hideNavigationBarLoading();
					}else{
						uni.showToast({
							title: res.msg,
							icon: 'none'
						});
					}
				});
			},
			
			// 推荐-查看详情
			goDetail(item){
				uni.navigateTo({
					// 保留当前页面，跳转到应用内的某个页面,使用uni.navigateBack可以返回到原页面
					url: "/pages/job/jobDetail?sn=" + item.sn,
				})
			},
		},
		
		// 上拉加载
		onReachBottom() {
			this.currentPage++;
			if (this.recommendList.length < this.total) {
				this.initRecommendList(this.city_id);
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
			this.initRecommendList(this.city_id);
			setTimeout(function () {
				uni.stopPullDownRefresh();  //停止下拉刷新动画
			}, 1000);
		},
	}
</script>

<style>

</style>
