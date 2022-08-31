<template>
	<view class="page-container bankCard-container">
		<uni-nav-bar dark :fixed="true" status-bar left-icon="left" :border="false" title="我的提现账号" @clickLeft="goBack" />
		<view class="p-3 alipayList">
			<uni-swipe-action>
				<view v-for="(list,index) in bankCardList" :key="index" class="mb-3">
					<uni-swipe-action-item :right-options="options" @click="e=>bindClick(e,list)">
						<!-- 支付宝 -->
						<view class="w-100 alipayList-item" v-if="list.type == 1">
							<image class="image alipay-bg-image" :src="alipayBg" mode="aspectFit" />
							<view class="alipayList-item-text fs_15 text-white">
								<text class="d-block">姓名：{{ list.name }}</text>
								<view class="d-block mt-1 d-flex align-items-center cursor-pointer" @click="showCode(list)">
									<text>收款码：</text>
									<image class="image signcode-image" :src="list.image" mode="aspectFit" style="width:30px;height:30px" />
								</view>
							</view>
						</view>
						<!-- 银行卡 -->
						<view class="w-100 alipayList-item" v-else-if="list.type == 2">
							<image class="image bankCard-bg-image" :src="bankCardBg" mode="aspectFit" />
							<view class="alipayList-item-text fs_15 text-white">
								<text class="d-block">姓名：{{ list.name }}</text>
								<text class="d-block mt-1">银行：{{ list.bank_name }}</text>
								<text class="d-block mt-1">卡号：{{ list.code_num }}</text>
							</view>
						</view>
						<!-- 微信 -->
						<view class="w-100 alipayList-item" v-else-if="list.type == 3">
							<image class="image alipay-bg-image" :src="wxBg" mode="aspectFit" />
							<view class="alipayList-item-text fs_15 text-white">
								<text class="d-block">姓名：{{ list.name }}</text>
								<view class="d-block mt-1 d-flex align-items-center cursor-pointer" @click="showCode(list)">
									<text>收款码：</text>
									<image class="image signcode-image" :src="list.image" mode="aspectFit" style="width:30px;height:30px" />
								</view>
							</view>
						</view>
						<!-- <template v-slot:right>
							<view class="d-flex swipe-right">
								<view class="bg-primary swipe-btn" @click.native="editCard(list)">
									<text class="fs_14">编辑44</text>
								</view>
								<view class="bg-danger swipe-btn" @click.native="delCard(list)">
									<text class="fs_14">删除</text>
								</view>
							</view>
						</template> -->
					</uni-swipe-action-item>
				</view>
			</uni-swipe-action>
		</view>
		
		<view class="p-btn">
			<view class="my-btn bg-primary-600 px-2 py-3 fs_16" type="primary" size="mini" @click="addBankcard()">添加提现账号</view>
		</view>
		
		<!-- 收款码窗口 -->
		<uni-popup ref="signCodePopup">
			<view class="signCodePopup p-3">
				<view class="text-left">姓名：{{ posterName}}</view>
				<image class="image poster-image" :src="posterImg" mode="aspectFit" />
				<text class="mt-3 d-block fs_14">长按收款码保存到相册</text>
			</view>
		</uni-popup>
		
		<!-- 添加银行卡的pop -->
		<uni-popup ref="bankCardPopup" @change="bankCardPopupChange" :safe-area="false">
			<view class="bg-white signPopup bankCardPopup">
				<uni-section title="提现账号" type="line">
					<uni-forms :modelValue="bankCardForm" label-position="top" :label-width="120">
						<view class="px-3">
							<uni-forms-item label="账号类型" name="type">
								<uni-data-select v-model="bankCardForm.type" :clear="false" 
									:localdata="typeOptions"
									placeholder="请选择账号类型">
								</uni-data-select>
							</uni-forms-item>
							<!-- 支付宝 -->
							<template v-if="bankCardForm.type == 1">
								<uni-forms-item label="姓名">
									<uni-easyinput v-model="bankCardForm.name" placeholder="请输入真实姓名" />
								</uni-forms-item>
								<uni-forms-item label="支付宝收款码" name="alipay_image">
									<view class="">
										<uni-file-picker
											:limit="1"
											:value="alipay_fileLists"
											:imageStyles="imageStyles" 
											file-mediatype="image"
											:auto-upload="false"
											@select="imageSelect"
											@success="imageSuccess"
											@delete="imageDelete">
										</uni-file-picker>
									</view>
								</uni-forms-item>
							</template>
							<!-- 银行卡 -->
							<template v-else-if="bankCardForm.type == 2">
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
							</template>
							<!-- 微信 -->
							<template v-else-if="bankCardForm.type == 3">
								<uni-forms-item label="姓名">
									<uni-easyinput v-model="bankCardForm.name" placeholder="请输入真实姓名" />
								</uni-forms-item>
								<uni-forms-item label="微信收款码" name="wx_image">
									<view class="">
										<uni-file-picker
											:limit="1"
											:imageStyles="imageStyles" 
											:value="wx_fileLists"
											file-mediatype="image"
											:auto-upload="false"
											@select="imageSelect2"
											@success="imageSuccess2"
											@delete="imageDelete2">
										</uni-file-picker>
									</view>
								</uni-forms-item>
							</template>
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
					type:"",
					id:"",
					bank_id:"",
					code_num:"",
					name:"",
					phone:"",
					su_branch:"",
					wx_image:[],
					alipay_image:[],
				},
				options:[
					{
						text: '编辑',
						style: {
							backgroundColor: '#3778EF'
						}
					},
					{
						text: '删除',
						style: {
							backgroundColor: '#dd524d'
						}
					}
				],
				typeOptions:[
					{
						text:"银行卡",
						value:"2"
					},
					{
						text:"支付宝",
						value:"1"
					},
					{
						text:"微信",
						value:"3"
					},
				],
				imageStyles:{
					width: 100,
					height: 100,
				},
				alipay_fileLists:[],
				wx_fileLists:[],
				alipayBg: require("@/packageMy/static/my/alipay_bg.png"),
				wxBg: require("@/packageMy/static/my/wx_bg.png"),
				posterName:"",
				posterImg:"",
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
				}).then(res=>{
					if(res.code == 0){
						this.bankCardList = res.data.map((item,index)=>{
							item.image = this.$globalUrl.baseUrl + item.image;
							return item
						});
					}else{
						uni.showToast({
							title: res.msg,
							icon: 'none'
						});
					}
				});
			},
			
			
			bindClick(e,item){
				if(e.index == 0){ // 编辑
					this.editCard(item);
				}else if(e.index == 1){ // 删除
					this.delCard(item);
				}
			},
			
			// 收款码弹窗显示
			showCode(item){
				this.$refs.signCodePopup.open();
				this.posterName = item.name;
				this.posterImg = item.image;
			},
			
			// 添加银行卡
			addBankcard(){
				this.$refs.bankCardPopup.open('bottom');
				this.initBank(this.user_token);
			},
			
			// 编辑银行卡
			editCard(row){
				this.$refs.bankCardPopup.open('bottom');
				if(row.type == 2){
					this.initBank(this.user_token);
				}
				this.$api.accountEdit({
					token:uni.getStorageSync('user_token'),
					id:row.id,
					type:row.type, // 1=支付宝,2=银行卡,3=微信
					function_type:1,
				}).then(res=>{
					if(res.code == 0){
						this.bankCardForm.type = res.data.type;
						this.bankCardForm.id = res.data.id;
						if(row.type == 1){
							this.bankCardForm.name = res.data.name;
							this.bankCardForm.alipay_image.push(res.data.image);
							this.alipay_fileLists.push({
								url: this.$globalUrl.baseUrl + res.data.image,
								name: '支付宝收款码'
							})
						}else if(row.type == 2){
							this.bankCardForm.bank_id = res.data.bank_id;
							this.bankCardForm.code_num = res.data.code_num;
							this.bankCardForm.name = res.data.name;
							this.bankCardForm.phone = res.data.phone;
							this.bankCardForm.su_branch = res.data.su_branch;
						}else if(row.type == 3){
							this.bankCardForm.name = res.data.name;
							this.bankCardForm.wx_image.push(res.data.image);
							this.wx_fileLists.push({
								url: this.$globalUrl.baseUrl + res.data.image,
								name: '微信收款码'
							})
						}
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
					content: '确定删除此提现账号吗？',
					success: modal_res => {
						if (modal_res.confirm) {
							this.$api.accountDel({
								token:uni.getStorageSync('user_token'),
								id:row.id,
								type:row.type, // 1=支付宝,2=银行卡,3=微信
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
						type:"",
						id:"",
						bank_id:"",
						code_num:"",
						name:"",
						phone:"",
						su_branch:"",
						wx_image:[],
						alipay_image:[]
					};
					this.alipay_fileLists = [];
					this.wx_fileLists = [];
				}
			},
			
			// 图片上传-支付宝收款码
			imageSelect(e){
				uni.showLoading({
					title: "上传中...",
					mask: true,
				});
				const tempFilePaths = e.tempFilePaths;
				const tempFiles = e.tempFiles;
				uni.uploadFile({
					header:{
						token: this.$globalUrl.token,
					},
					url: this.$globalUrl.baseUrl +'/api/base/uploadpayimg',
					filePath: tempFilePaths[0],
					name: 'file',
					formData: {
						token: uni.getStorageSync('user_token'),
						file: tempFiles[0],
					},
					success: (uploadFileRes) => {
						let res = JSON.parse(uploadFileRes.data);
						if(res.code == 0){
							uni.hideLoading({});
							this.bankCardForm.alipay_image.push(res.data.path);
						}else{
							uni.showToast({
								title: res.msg,
								icon: 'none'
							});
						}
					}
				});
			},
			
			// 图片上传成功-支付宝收款码
			imageSuccess(e){
				console.log(e,'上传成功')
			},
			
			// 图片删除-支付宝收款码
			imageDelete(e){
				this.bankCardForm.alipay_image.splice(e.tempFilePath,1)
			},
			
			// 图片上传-微信收款码
			imageSelect2(e){
				uni.showLoading({
					title: "上传中...",
					mask: true,
				});
				const tempFilePaths = e.tempFilePaths;
				const tempFiles = e.tempFiles;
				uni.uploadFile({
					header:{
						token: this.$globalUrl.token,
					},
					url: this.$globalUrl.baseUrl +'/api/base/uploadpayimg',
					filePath: tempFilePaths[0],
					name: 'file',
					formData: {
						token: uni.getStorageSync('user_token'),
						file: tempFiles[0],
					},
					success: (uploadFileRes) => {
						let res = JSON.parse(uploadFileRes.data);
						if(res.code == 0){
							uni.hideLoading({});
							this.bankCardForm.wx_image.push(res.data.path);
						}else{
							uni.showToast({
								title: res.msg,
								icon: 'none'
							});
						}
					}
				});
			},
			
			// 图片上传成功-微信收款码
			imageSuccess2(e){
				console.log(e,'上传成功')
			},
			
			// 图片删除-微信收款码
			imageDelete2(e){
				this.bankCardForm.wx_image.splice(e.tempFilePath,1)
			},
			
			// 提交银行卡
			bankCardSubmit(){
				let img = '';
				if(this.bankCardForm.type == 1){ // 支付宝
					img = this.bankCardForm.alipay_image.join(",")
				}else if(this.bankCardForm.type == 2){ // 银行卡
					img = '';
				}else if(this.bankCardForm.type == 3){ // 微信
					img = this.bankCardForm.wx_image.join(",")
				};
				if(this.bankCardForm.id){ // 编辑
					this.$api.accountEdit({
						id:this.bankCardForm.id,
						function_type:2,
						token:uni.getStorageSync('user_token'),
						type:this.bankCardForm.type, // 1=支付宝,2=银行卡,3=微信
						bank_id:this.bankCardForm.bank_id,
						code_num:this.bankCardForm.code_num,
						name:this.bankCardForm.name,
						phone:this.bankCardForm.phone,
						su_branch:this.bankCardForm.su_branch,
						image:img,
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
						type:this.bankCardForm.type, // 1=支付宝,2=银行卡,3=微信
						bank_id:this.bankCardForm.bank_id,
						code_num:this.bankCardForm.code_num,
						name:this.bankCardForm.name,
						phone:this.bankCardForm.phone,
						su_branch:this.bankCardForm.su_branch,
						image:img,
					}).then(res=>{
						if(res.code == 0){
							uni.showToast({
								title: '提现账号添加成功',
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
