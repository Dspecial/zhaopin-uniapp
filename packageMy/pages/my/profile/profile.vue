<template>
	<view class="page-container profile-container">
		<uni-nav-bar dark :fixed="true" status-bar left-icon="left" :border="false" title="个人信息" @clickLeft="goBack" />
		<!-- 基础用法，不包含校验规则 -->
		<uni-forms ref="baseForm" :modelValue="baseFormData">
			<view class="mt-2 bg-white fs_15">
				<view class="profile-cell d-flex align-items-center pl-3 pr-3">
					<uni-forms-item label="头像" name="avatarImg">
						<text class="text-grey-700 fs_15" slot="label">头像</text>
						<image class="image avatar ml-auto" :src="baseFormData.avatarImg" mode="widthFix" @click="changeAvatar"></image>
					</uni-forms-item>
				</view>
				
				<view class="profile-cell d-flex align-items-center pl-3 pr-3">
					<uni-forms-item label="昵称" name="nickname">
						<text class="text-grey-700 fs_15" slot="label">昵称</text>
						<uni-easyinput v-model="baseFormData.nickname" :clearable="false" :inputBorder="false" placeholder="请填写昵称"/>
					</uni-forms-item>
				</view>
			</view>
			
			<view class="mt-2 bg-white fs_15">
				<view class="profile-cell d-flex align-items-center pl-3 pr-3">
					<uni-forms-item label="姓名" name="name">
						<text class="text-grey-700 fs_15" slot="label">姓名</text>
						<uni-easyinput v-model="baseFormData.name" :clearable="false" :inputBorder="false" placeholder="请填写姓名" disabled/>
					</uni-forms-item>
				</view>
				
				<view class="profile-cell d-flex align-items-center pl-3 pr-3">
					<uni-forms-item label="性别" name="sex">
						<text class="text-grey-700 fs_15" slot="label">性别</text>
						<uni-data-select v-model="baseFormData.sex" :clear="false" 
							:localdata="sexs"
							placeholder="请选择性别"
							@change="sexChange">
						</uni-data-select>
					</uni-forms-item>
				</view>
				
				<view class="profile-cell d-flex align-items-center pl-3 pr-3">
					<uni-forms-item label="手机" name="tel">
						<text class="text-grey-700 fs_15" slot="label">手机</text>
						<view class="d-flex align-items-center">
							<uni-easyinput v-model="baseFormData.tel" :clearable="false" :inputBorder="false" placeholder="请填写手机号" class="w-100"/>
							<!-- #ifdef MP-WEIXIN -->
							<button v-if="!baseFormData.tel" class="getUserPhone ml-2" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">一键获取</button>
							<!-- #endif -->
						</view>
					</uni-forms-item>
				</view>
				
				<view class="profile-cell d-flex align-items-center pl-3 pr-3">
					<uni-forms-item label="生日" name="birthday">
						<text class="text-grey-700 fs_15" slot="label">生日</text>
						<uni-datetime-picker type="date" return-type="string" v-model="baseFormData.birthday" 
						:border="false"
						:clear-icon="false"
						placeholder="请选择生日"/>
					</uni-forms-item>
				</view>
			</view>
			
			<view class="mt-2 bg-white fs_15">
				<view class="profile-cell d-flex align-items-center pl-3 pr-3">
					<uni-forms-item label="微信号" name="wechat">
						<text class="text-grey-700 fs_15" slot="label">微信号</text>
						<uni-easyinput v-model="baseFormData.wechat" :clearable="false" :inputBorder="false" placeholder="请填写微信号"/>
					</uni-forms-item>
				</view>
			</view>
		</uni-forms>
		<!-- 保存 -->
		<view class="p-btn">
			<view class="my-btn bg-primary-600 px-2 py-3 fs_16" type="primary" size="mini" @click="submit('baseForm')">保存</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				avatarImg:"",
				baseFormData:{
					avatarImg:require("@/static/uni.png"),
					nickname:"",
					name:"",
					sex:"",
					tel:"",
					birthday:"",
					wechat:"",
				},
				sexs:[{
					text: '男',
					value: '2'
				}, {
					text: '女',
					value: '3'
				}]
			}
		},
		onLoad(option){
			this.user_token = uni.getStorageSync('user_token');
			if(this.user_token){
				this.getProfileInfo(this.user_token);
			}
			this.isGoback = option.isGoback;
		},
		onShow(){
			
		},
		methods: {
			goBack() {
				uni.navigateBack({
					delta: 1
				})
			},
			// 获取用户信息
			getProfileInfo(token){
				this.$api.profileInfo({
					token:token
				}).then(res=>{
					if(res.code == 0){
						if(res.data.is_auth == 2){ // 已经实名，显示真实姓名
							this.baseFormData.nickname = res.data.truename
						}else{
							this.baseFormData.nickname = res.data.nickname
						}
						if(res.data.avatar.indexOf("http") >= 0){
							this.baseFormData.avatarImg = res.data.avatar;
						}else{
							this.baseFormData.avatarImg = this.$globalUrl.baseUrl + res.data.avatar;
						}
						this.baseFormData.name = res.data.truename;
						this.baseFormData.sex = res.data.sex;
						this.baseFormData.tel = res.data.mobile;
						this.baseFormData.birthday = res.data.birth;
						this.baseFormData.wechat = res.data.wx_number;
					}else{
						uni.showToast({
							title: res.msg,
							icon: 'none'
						});
					}
				});
			},
			
			// 点击授权手机号
			getPhoneNumber(e){
				var _this = this;
				// #ifdef MP-WEIXIN
				if(e.detail.errMsg=="getPhoneNumber:ok"){
					uni.login({
						provider: 'weixin',
						success(res) {
							_this.$api.mini_get_phone({
								token:uni.getStorageSync('user_token'),
								code:res.code,
								session_key:'',
								encryptedData:e.detail.encryptedData,
								iv:e.detail.iv
							}).then(res=>{
								_this.baseFormData.tel = res.data;
							})
						}
					})
					
				}else{
					// console.log('用户点击了拒绝') ;
					uni.showToast({
						title: '授权已取消',
						icon: 'error',
						mask: true,
					});
				}
				//#endif
			},

			// 修改头像
			changeAvatar(){
				var _this = this;
				uni.chooseImage({
					count: 1,
					success: (chooseImageRes) => {
						try {
							uni.showLoading({
								title: "上传中...",
								mask: true,
							});
							const tempFilePaths = chooseImageRes.tempFilePaths;
							const tempFiles = chooseImageRes.tempFiles;
							uni.uploadFile({
								header:{
									token: this.$globalUrl.token,
								},
								url: this.$globalUrl.baseUrl +'/api/base/uploadavatar',
								filePath: tempFilePaths[0],
								name: 'file',
								formData: {
									token: uni.getStorageSync('user_token'),
									file: tempFiles[0],
								},
								success: (uploadFileRes) => {
									let res = JSON.parse(uploadFileRes.data);
									if(res.code == 0){
										this.baseFormData.avatarImg = this.$globalUrl.baseUrl + res.data.path;
										this.avatarImg = res.data.path;
									}else{
										uni.showToast({
											title: res.msg,
											icon: 'none'
										});
									}
								}
							});
						}catch (e) {
								console.log(e);
						} finally {
								uni.hideLoading();
						}
					}
				});
			},
			
			// 性别切换
			sexChange(){
				
			},
			
			// 提交保存
			submit(ref){
				uni.showToast({
					title: '加载中……',
					icon: 'loading',
					duration: 3000,
				})
				this.$refs[ref].validate().then(res => {
					this.$api.setProfile({
						token:this.user_token,
						avatar:this.avatarImg,
						nickname:this.baseFormData.nickname,
						sex:this.baseFormData.sex,
						mobile:this.baseFormData.tel,
						birth:this.baseFormData.birthday,
						wx_number:this.baseFormData.wechat,
					}).then((res)=>{
						if(res.code == 0){
							uni.hideToast();
							uni.showToast({
								title: '保存成功'
							});
							this.getProfileInfo(this.user_token);
							if(this.isGoback == 1){
								setTimeout(()=>{
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
								},1000)
							}
						}else{
							uni.showToast({
								title: res.msg,
								icon: 'none'
							});
						}
					})
				}).catch(err => {
					uni.hideToast();
					// console.log('err', err);
				})
			},
		}
	}
</script>

<style scoped>
uni-page-body{
	height: 100%;
}
</style>
