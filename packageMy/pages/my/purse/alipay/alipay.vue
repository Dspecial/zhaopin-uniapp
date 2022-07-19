<template>
	<view class="page-container alipay-container">
		<uni-nav-bar dark :fixed="true" status-bar left-icon="left" :border="false" title="我的支付宝" @clickLeft="goBack" />
		<view class="p-3 alipayList">
			<uni-swipe-action>
				<view v-for="(list,index) in alipayList" :key="index" class="mb-3">
					<uni-swipe-action-item>
						<view class="alipayList-item">
							<image class="image alipay-bg-image" :src="alipayBg" mode="aspectFit" />
							<view class="alipayList-item-text fs_15 text-white">
								<text class="d-block">姓名：{{ list.name }}</text>
								<text class="d-block mt-1">支付宝账号：{{ list.code_num }}</text>
							</view>
						</view>
						<template v-slot:right>
							<view class="d-flex justify-content-between align-content-stretch">
								<view class="slot-button bg-primary d-flex align-items-center px-4" @click="editCard(list)">
									<text class="fs_14">编辑</text>
								</view>
								<view class="slot-button bg-danger d-flex align-items-center px-4" @click="delCard(list)">
									<text class="fs_14">删除</text>
								</view>
							</view>
						</template>
					</uni-swipe-action-item>
				</view>
			</uni-swipe-action>
		</view>
		
		<view class="p-btn">
			<view class="my-btn bg-primary-600 px-2 py-3 fs_16" type="primary" size="mini" @click="addAlipay()">添加支付宝</view>
		</view>
		
		<!-- 添加支付宝的pop -->
		<uni-popup ref="alipayPopup" @change="alipayPopupChange" :safe-area="false">
			<view class="bg-white signPopup">
				<uni-section title="支付宝" type="line">
					<uni-forms :modelValue="alipayForm" label-position="top">
						<view class="px-3">
							<uni-forms-item label="姓名">
								<uni-easyinput v-model="alipayForm.name" placeholder="请输入支付宝姓名" />
							</uni-forms-item>
							<uni-forms-item label="支付宝账号">
								<uni-easyinput v-model="alipayForm.code_num" placeholder="请输入支付宝账号" />
							</uni-forms-item>
						</view>
					</uni-forms>
					<view class="text-center pt-5 pb-5">
						<text class="my-btn bg-primary-600 fs_13" @click="alipaySubmit()">确定</text>
					</view>
				</uni-section>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				alipayBg: require("@/packageMy/static/my/alipay_bg.png"),
				alipayList:[],
				alipayForm:{
					id:"",
					code_num:"",
					name:"",
				},
			}
		},
		onLoad(){
			
		},
		onShow(){
			this.user_token = uni.getStorageSync('user_token');
			if(this.user_token){
				this.initAlipayList();
			}
		},
		methods: {
			goBack() {
				uni.navigateBack({
					delta: 1
				})
			},
			
			// 获取支付宝账号列表
			initAlipayList(){
				this.$api.accountList({
					token:uni.getStorageSync('user_token'),
					type:1, // 1=支付宝,2=银行卡
				}).then(res=>{
					if(res.code == 0){
						this.alipayList = res.data;
					}else{
						uni.showToast({
							title: res.msg,
							icon: 'none'
						});
					}
				});
			},

			// 添加支付宝账号
			addAlipay(){
				this.$refs.alipayPopup.open('bottom');
			},
			
			// 编辑支付宝账号
			editCard(row){
				this.$refs.alipayPopup.open('bottom');
				this.$api.accountEdit({
					token:uni.getStorageSync('user_token'),
					id:row.id,
					type:1, // 1=支付宝,2=银行卡
					function_type:1,
				}).then(res=>{
					if(res.code == 0){
						this.alipayForm.id = res.data.id;
						this.alipayForm.code_num = res.data.code_num;
						this.alipayForm.name = res.data.name;
					}else{
						uni.showToast({
							title: res.msg,
							icon: 'none'
						});
					}
				});
			},
			
			// 删除支付宝账号
			delCard(row){
				uni.showModal({
					title: '温馨提示',
					content: '确定删除这个支付宝账户吗？',
					success: modal_res => {
						if (modal_res.confirm) {
							this.$api.accountDel({
								token:uni.getStorageSync('user_token'),
								id:row.id,
								type:1, // 1=支付宝,2=银行卡
							}).then(res=>{
								if(res.code == 0){
									uni.showToast({
										title: '删除成功',
										icon: 'success'
									});
									this.initAlipayList();
								}else{
									uni.showToast({
										title: res.msg,
										icon: 'none'
									});
								}
							});
						} else if (modal_res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
				
			},
			
			// 添加弹窗状态改变
			alipayPopupChange(e){
				if(!e.show){
					this.alipayForm = {
						id:"",
						code_num:"",
						name:"",
					};
				}
			},
			
			// 提交支付宝账号
			alipaySubmit(){
				if(this.alipayForm.id){ // 编辑
					this.$api.accountEdit({
						id:this.alipayForm.id,
						function_type:2,
						token:uni.getStorageSync('user_token'),
						type:1, // 1=支付宝,2=银行卡
						code_num:this.alipayForm.code_num,
						name:this.alipayForm.name,
					}).then(res=>{
						if(res.code == 0){
							uni.showToast({
								title: '支付宝账号编辑成功',
								icon: 'success'
							});
							this.$refs.alipayPopup.close();
							this.initAlipayList();
						}else{
							uni.showToast({
								title: res.msg,
								icon: 'none'
							});
						}
					});
				}else{ // 新增
					this.$api.accountAdd({
						token:uni.getStorageSync('user_token'),
						type:1, // 1=支付宝,2=银行卡
						bank_id:this.alipayForm.bank_id,
						code_num:this.alipayForm.code_num,
						name:this.alipayForm.name,
						phone:this.alipayForm.phone,
						su_branch:this.alipayForm.su_branch,
					}).then(res=>{
						if(res.code == 0){
							uni.showToast({
								title: '支付宝账号添加成功',
								icon: 'success'
							});
							this.$refs.alipayPopup.close();
							this.initAlipayList();
						}else{
							uni.showToast({
								title: res.msg,
								icon: 'none'
							});
						}
					});
				}
			},
		}
	}
</script>

<style>

</style>
