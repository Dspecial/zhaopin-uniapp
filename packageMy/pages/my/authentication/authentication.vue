<template>
	<view class="page-container auth-container">
		<uni-nav-bar dark :fixed="true" status-bar left-icon="left" :border="false" title="实名认证" @clickLeft="goBack" />
		<view class="p-3">
			<!-- 拍摄 -->
			<view class="mb-3">
				<text class="text-grey-150 fs_15">请拍摄并上传你的有效身份证</text>
				<view class="mt-3 d-inline-block auth-card">
					<view class="p-3">
						<image class="image auth-image" :src="authCard" mode="aspectFit" />
					</view>
					<view class="bg-primary-600 d-block text-center my-btn fs_14" @click="unloadIDImage">上传身份证正面</view>
				</view>
			</view>
			<!-- 表单 -->
			<uni-forms ref="authForm" :modelValue="authForm" label-position="top" label-width="200" class="authForm">
				<uni-forms-item label="姓名">
					<uni-easyinput v-model="authForm.name" placeholder="请输入姓名" />
				</uni-forms-item>
				<uni-forms-item label="身份证号码">
					<uni-easyinput v-model="authForm.idcode" placeholder="请输入身份证号码" />
				</uni-forms-item>
			</uni-forms>
			<view class="p-btn">
				<view class="my-btn bg-primary-600 px-2 py-3 fs_16" type="primary" size="mini" @click="submit()">身份认证</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				authCard: require("@/packageMy/static/my/auth_card.png"),
				authForm:{
					name:"",
					idcode:"",
				},
			}
		},
		methods: {
			goBack() {
				uni.navigateBack({
					delta: 1
				})
			},
			
			// 上传身份证
			unloadIDImage(){
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
								url: this.$globalUrl.baseUrl +'/api/base/uploadidcode',
								filePath: tempFilePaths[0],
								name: 'file',
								formData: {
									token: uni.getStorageSync('user_token'),
									file: tempFiles[0],
								},
								success: (uploadFileRes) => {
									let res = JSON.parse(uploadFileRes.data);
									if(res.code == 0){
										this.authForm.name = res.data.name;
										this.authForm.idcode = res.data.idcode;
										this.authForm.idcodeimage = res.data.imgpath;
										this.authCard = this.$globalUrl.baseUrl + res.data.imgpath;
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
			
			// 身份认证
			submit() {
				this.$api.submitAuth({
					token: uni.getStorageSync('user_token'),
					name: this.authForm.name,
					idcode: this.authForm.idcode,
					idcodeimage: this.authForm.idcodeimage,
				}).then(authRes=>{
					if(authRes.code == 0){
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
						uni.showToast({
							title: authRes.msg,
							icon: 'success'
						});
					}else{
						console.log(authRes.msg,'authres.msg');
						uni.showToast({
							title: authRes.msg,
							icon: 'none'
						});
					}
				});
			}
		}
	}
</script>

<style scoped>

</style>
