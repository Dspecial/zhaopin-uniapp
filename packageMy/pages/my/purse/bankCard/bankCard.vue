<template>
	<view class="page-container bankCard-container">
		<uni-nav-bar dark :fixed="true" status-bar left-icon="left" :border="false" title="我的银行卡" @clickLeft="goBack" />
		<view class="p-3 alipayList">
			<uni-swipe-action>
				<view v-for="(list,index) in bankCardList" :key="index" class="mb-3">
					<uni-swipe-action-item>
						<view class="alipayList-item">
							<image class="image bankCard-bg-image" :src="bankCardBg" mode="aspectFit" />
							<view class="alipayList-item-text fs_15 text-white">
								<text class="d-block">姓名：{{ list.name }}</text>
								<text class="d-block mt-1">银行：{{ list.bank_name }}</text>
								<text class="d-block mt-1">卡号：{{ list.code_num }}</text>
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
			<view class="my-btn bg-primary-600 px-2 py-3 fs_16" type="primary" size="mini" @click="addBankcard()">添加银行卡</view>
		</view>
		
		<!-- 添加银行卡的pop -->
		<uni-popup ref="bankCardPopup" @change="bankCardPopupChange" :safe-area="false">
			<view class="bg-white signPopup">
				<uni-section title="银行卡" type="line">
					<uni-forms :modelValue="bankCardForm" label-position="top">
						<view class="px-3">
							<uni-forms-item label="所属银行" name="date">
								<uni-data-select v-model="bankCardForm.bank_id" :clear="false" 
									:localdata="bankOptions"
									placeholder="请选择所属银行">
								</uni-data-select>
							</uni-forms-item>
							<uni-forms-item label="银行卡号">
								<uni-easyinput type="number" v-model="bankCardForm.code_num" placeholder="请输入银行卡号" />
							</uni-forms-item>
							<uni-forms-item label="姓名">
								<uni-easyinput v-model="bankCardForm.name" placeholder="请输入银行预留姓名" />
							</uni-forms-item>
							<uni-forms-item label="手机号">
								<uni-easyinput type="number" v-model="bankCardForm.phone" placeholder="请输入银行预留手机号" />
							</uni-forms-item>
							<uni-forms-item label="支行信息">
								<uni-easyinput type="textarea" v-model="bankCardForm.su_branch" placeholder="请输入银行支行信息" />
							</uni-forms-item>
						</view>
					</uni-forms>
					<view class="text-center pt-5 pb-5">
						<text class="my-btn bg-primary-600 fs_13" @click="bankCardSubmit()">确定</text>
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
				bankCardBg: require("@/packageMy/static/my/purse_money_bg.png"),
				bankCardList:[],
				bankOptions:[],
				bankCardForm:{
					id:"",
					bank_id:"",
					code_num:"",
					name:"",
					phone:"",
					su_branch:"",
				},
			}
		},
		onLoad(){

		},
		onShow(){
			this.user_token = uni.getStorageSync('user_token');
			if(this.user_token){
				this.initBankCardList();
			}
		},
		methods: {
			goBack() {
				uni.navigateBack({
					delta: 1
				})
			},
			
			// 获取银行列表
			initBank(){
				this.$api.bankList({
					token:uni.getStorageSync('user_token'),
				}).then(res=>{
					if(res.code == 0){
						this.bankOptions = res.data.map((item,index)=>{
							return {
								text: item.bank_name,
								value: item.id,
							}
						})
					}else{
						uni.showToast({
							title: res.msg,
							icon: 'none'
						});
					}
				});
			},
			
			// 获取银行卡列表
			initBankCardList(){
				this.$api.accountList({
					token:uni.getStorageSync('user_token'),
					type:2,
				}).then(res=>{
					if(res.code == 0){
						this.bankCardList = res.data;
					}else{
						uni.showToast({
							title: res.msg,
							icon: 'none'
						});
					}
				});
			},

			// 添加银行卡
			addBankcard(){
				this.$refs.bankCardPopup.open('bottom');
				this.initBank(this.user_token);
			},
			
			// 编辑银行卡
			editCard(row){
				this.$refs.bankCardPopup.open('bottom');
				this.initBank(this.user_token);
				this.$api.accountEdit({
					token:uni.getStorageSync('user_token'),
					id:row.id,
					type:2, // 1=支付宝,2=银行卡
					function_type:1,
				}).then(res=>{
					if(res.code == 0){
						this.bankCardForm.id = res.data.id;
						this.bankCardForm.bank_id = res.data.bank_id;
						this.bankCardForm.code_num = res.data.code_num;
						this.bankCardForm.name = res.data.name;
						this.bankCardForm.phone = res.data.phone;
						this.bankCardForm.su_branch = res.data.su_branch;
					}else{
						uni.showToast({
							title: res.msg,
							icon: 'none'
						});
					}
				});
			},
			
			// 删除银行卡
			delCard(row){
				uni.showModal({
					title: '温馨提示',
					content: '确定删除这张银行卡吗？',
					success: modal_res => {
						if (modal_res.confirm) {
							this.$api.accountDel({
								token:uni.getStorageSync('user_token'),
								id:row.id,
								type:2, // 1=支付宝,2=银行卡
							}).then(res=>{
								if(res.code == 0){
									uni.showToast({
										title: '删除成功',
										icon: 'success'
									});
									this.initBankCardList();
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
			bankCardPopupChange(e){
				if(!e.show){
					this.bankCardForm = {
						id:"",
						bank_id:"",
						code_num:"",
						name:"",
						phone:"",
						su_branch:"",
					};
				}
			},
			
			// 提交银行卡
			bankCardSubmit(){
				if(this.bankCardForm.id){ // 编辑
					this.$api.accountEdit({
						id:this.bankCardForm.id,
						function_type:2,
						token:uni.getStorageSync('user_token'),
						type:2, // 1=支付宝,2=银行卡
						bank_id:this.bankCardForm.bank_id,
						code_num:this.bankCardForm.code_num,
						name:this.bankCardForm.name,
						phone:this.bankCardForm.phone,
						su_branch:this.bankCardForm.su_branch,
					}).then(res=>{
						if(res.code == 0){
							uni.showToast({
								title: '银行卡编辑成功',
								icon: 'success'
							});
							this.$refs.bankCardPopup.close();
							this.initBankCardList();
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
						type:2, // 1=支付宝,2=银行卡
						bank_id:this.bankCardForm.bank_id,
						code_num:this.bankCardForm.code_num,
						name:this.bankCardForm.name,
						phone:this.bankCardForm.phone,
						su_branch:this.bankCardForm.su_branch,
					}).then(res=>{
						if(res.code == 0){
							uni.showToast({
								title: '银行卡添加成功',
								icon: 'success'
							});
							this.$refs.bankCardPopup.close();
							this.initBankCardList();
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
