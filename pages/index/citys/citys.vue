<template>
	<view class="page-container city-container">
		<uni-nav-bar dark :fixed="true" status-bar left-icon="left" :border="false" title="城市选择" @clickLeft="goBack" />
		<view>
			<view class="pt-3 pl-3 pr-3 pb-2">当前城市：{{ city_name }}</view>
			<view class="hotCitys">
				<view class="hot-title pt-1 pb-1 pl-3 pr-3">热门城市</view>
				<uni-row>
					<template v-for="(city,index) in citysList" >
						<uni-col :span="6":key="index">
							<view @click="chooseCity(city)" class="mt-1 city-item">{{ city.name }}</view>
						</uni-col>
					</template>
				</uni-row>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				city_id:'0',
				city_name:'北京市',
				citysList:[],
			}
		},
		onLoad(){
			this.city_id = uni.getStorageSync('city_id');
			this.city_name = uni.getStorageSync('city_name');
			this.getLocation();
			this.initCitys();
		},
		methods: {
			// 返回上一级
			goBack() {
				uni.navigateBack({
					delta: 1
				})
			},
			
			// 获取城市列表
			initCitys(){
				this.$api.citys({
				}).then(res=>{
					this.citysList = res.data;
				});
			},
			
			// 获取当前定位
			getLocation(option) {
				let _this = this;
				uni.getLocation({
					type: 'wgs84',
					geocode: true,  
					success: (res) => {
						_this.$api.locationCurrent({
							longitude:res.longitude,
							latitude:res.latitude,
						}).then(res=>{
							// option 接受url的传参
							if(_this.city_id != res.data.city_id){
								uni.showModal({
									content: '您当前所在城市为[' + res.data.city_name + '],是否切换',
									success: function (modal_res) {
										if (modal_res.confirm) {
											uni.setStorageSync('city_id',res.data.city_id);
											uni.setStorageSync('city_name',res.data.city_name);
											_this.switchIndex();
										} else if (modal_res.cancel) {
											// console.log('用户点击取消');
											uni.setStorageSync('city_id',_this.city_id);
											uni.setStorageSync('city_name',_this.city_name);
										}
									}
								});
							}
						});
					},
					fail: (err) => {
						console.log('err ==>',err);
					},
				});
			},
			
			// 城市选择
			chooseCity(city){
				uni.setStorageSync('city_id',city.id);
				uni.setStorageSync('city_name',city.name);
				this.switchIndex();
			},
			
			// 跳转回首页
			switchIndex(){
				uni.reLaunch({
					url: "/pages/index/index",
				})
			},
		}
	}
</script>

<style>

</style>
