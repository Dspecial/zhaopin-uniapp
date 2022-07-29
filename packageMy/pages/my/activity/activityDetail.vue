<template>
	<view class="page-container detail-container">
		<uni-nav-bar dark :fixed="true" status-bar left-icon="left" :border="false" title="活动详情" @clickLeft="goBack" />
		<view class="bg_arc_detail"></view>
		<view class="p-3 detail-content">
			<view class="info-box p-3">
				<view class="d-flex justify-content-between">
					<text class="d-block fs_15">{{ info.title }}</text>
					<text class="d-block fs_15 text-primary">
						<text v-if="info.status == 1">报名中</text>
						<text v-else-if="info.status == 2">进行中</text>
						<text v-else-if="info.status == 3">已结束</text>
					</text>
				</view>
				<view class="d-flex flex-wrap">
					<view class="w-50 mt-3-1">
						<text class="">工资待遇：</text>
						<text class="text-danger">
							￥{{ info.money }}
							<text v-if="info.type == 1">/小时</text>
							<text v-else-if="info.type == 2">/天</text>
							<text v-else-if="info.type == 3">/周</text>
							<text v-else-if="info.type == 4">/月</text>
						</text>
					</view>
					<view class="w-50 mt-3-1">
						<text class="">保证金：</text>
						<text class="text-danger" v-if="info.earnest_money != 0">
							￥{{ info.earnest_money }}
						</text>
						<text class="text-danger" v-else>
							无
						</text>
					</view>
					<view class="w-50 mt-3-1">
						<text class="">招聘人数：</text>
						<text class="text-danger">{{ info.num }} 人</text>
					</view>
					<view class="w-50 mt-3-1">
						<text class="">结算方式：</text>
						<text class="text-danger" v-if="info.settlement == 1">日结</text>
						<text class="text-danger" v-else-if="info.settlement == 2">周结</text>
						<text class="text-danger" v-else-if="info.settlement == 3">月结</text>
						<text class="text-danger" v-else-if="info.settlement == 4">活动完工结</text>
					</view>
				</view>
				<view class="d-flex justify-content-between mt-3-1">
					<view><uni-icons type="location" size="15" class="text-primary mr-1"></uni-icons>{{ info.address }}</view>
					<uni-icons type="paperplane-filled" size="15" class="text-primary" @click= "goLoaction(info)"></uni-icons>
				</view>
			</view>
			
			<!-- 工作流程 -->
			<view class="info-box p-3 mt-2" v-if="processContent">
				<text class="d-block fs_15 box-title pb-3-1">工作流程</text>
				<view v-html="processContent" class="processContent"></view>
			</view>
			
			<!-- 招聘详情 -->
			<view class="info-box p-3 mt-2">
				<text class="d-block fs_15 box-title pb-3-1">招聘详情</text>
				<view class="mt-3-1">
					<text>{{ info.detail }}</text>
				</view>
			</view>
			
			<!-- 联系方式 -->
			<view class="info-box p-3 mt-2">
				<view class="d-flex justify-content-between align-items-center">
					<view class="w-60">
						<text class="d-block fs_15 box-title pb-3-1">联系方式</text>
						<view class="mt-3-1">
							<text >联系人：</text>
							<text>{{ info.contact }}</text>
						</view>
						<view class="mt-3-1">
							<text >联系方式：</text>
							<text>{{ info.tel }}</text>
						</view>
					</view>
					<view class="contact w-40 text-center">
						<image class="image" :src="info.ewmImg" mode="aspectFit" />
						<text class="mt-2 d-block">加入工作群</text>
					</view>
				</view>
			</view>
			
			<!-- 已报名列表 -->
			<view class="info-box p-3 mt-2">
				<view class="register-search d-flex align-items-center justify-content-between">
					<view class="w-90">
						<uni-easyinput 
						prefixIcon="search" 
						v-model="searchValue" 
						placeholder="姓名或者手机号" 
						@iconClick="iconClick">
						</uni-easyinput>
					</view>
					<text @click="search()" class="ml-2 my-btn w-10">搜索</text>
				</view>
				<!-- 日期搜索 -->
				<view class="d-flex justify-content-end align-items-center mt-2">
					<text>{{ searchDate }}</text>
					<uni-datetime-picker type="date" v-model="searchDate" :start="can_startDate" :end="can_endDate" @change="dateChange">
						<image class="image ml-2" :src="dateImg" mode="aspectFit" style="width: 30rpx;height:30rpx" />
					</uni-datetime-picker>
				</view>
				
				<!-- tab选项卡 -->
				<view class="mt-2 d-flex flex-wrap sign-tab">
					<template v-for="(tabItem,index) in signTab">
						<view :class="['fs_12 sign-tab-item px-2 py-1 m-1',activeTab == (index+1)?'active':'']" @click="changeTab(index)">
							<text>{{ tabItem.title }}</text>
							<text class="num">{{ tabItem.value }}</text><text v-if="tabItem.value !== ''">人</text>
						</view>
					</template>
				</view>
				
				<!-- 已报名人员 -->
				<view class="registerList">
					<view v-for="(list,index) in registerList" :key="index" class="register-item mt-3 pb-3">
						<view class="d-flex align-items-center justify-content-between">
							<view class="d-flex align-items-center">
								<view class="d-flex align-items-center">
									<text class="mr-1 bg-warning sort d-flex justify-content-center align-items-center">
										<text class="fs_18 font-weight-black">{{ index+1 }}</text>
									</text>
									<!-- <image class="image avatar" :src="list.avatar" mode="scaleToFill"/> -->
								</view>
								<view class="ml-2">
									<text class="d-block">{{ list.truename }}</text>
									<text class="d-block">
										<text v-if="list.sex == 1">性别：未知</text>
										<text v-else-if="list.sex == 2">性别：男</text>
										<text v-else-if="list.sex == 3">性别：女</text>
									</text>
									<text class="d-block" @click="callPhone(list.mobile)">{{ list.mobile }}</text>
								</view>
							</view>
							<view v-if="list.is_check == 3">
								<view class="text-primary-600 mr-2 d-flex align-items-center justify-content-end" @click="signPop(list)">
									<uni-icons type="calendar-filled" size="16" color="#435AE0"></uni-icons>
									<text>签到</text>
								</view>
								<view class="action d-flex justify-content-end mt-2">
									<text class="my-btn" @click="evaluate(list)">评价</text>
								</view>
							</view>
							<view v-else-if="list.is_check == 2">
								<view class="action d-flex justify-content-end">
									<text class="my-btn" @click="check(3,list)">审核通过</text>
									<text class="my-btn ml-2" @click="check(4,list)">审核不通过</text>
								</view>
							</view>
						</view>
						<uni-section title="评分" type="line" v-if="list.score">
							<uni-rate :readonly="true" :value="list.score" />
						</uni-section>
						<uni-section title="评价" type="line" v-if="list.content">
							<view>{{ list.content }}</view>
						</uni-section>
						<uni-section title="签到记录" type="line" class="sign-records"  v-if="list.is_check == 3">
							<view class="mt-2 uni-table fs_13">
								<!-- 表头 -->
								<view class="table-header">
									<uni-row class="text-grey-150 font-weight-black">
										<view class="d-flex">
											<uni-col :span="11">
												<view class="text-center p-2 uni-table-tr">日期</view>
											</uni-col>
											<uni-col :span="7">
												<view class="text-center p-2 uni-table-tr">签到</view>
											</uni-col>
											<uni-col :span="7">
												<view class="text-center p-2 uni-table-tr">签退</view>
											</uni-col>
											<uni-col :span="7" v-if="list.is_check == 3">
												<view class="text-center p-2 uni-table-tr">工资</view>
											</uni-col>
										</view>
									</uni-row>
								</view>
								<!-- 数据 -->
								<view class="table-content">
									<template v-if="list.record_list.length == 0">
										<uni-load-more status="no-more" :contentText="{contentnomore:'暂无数据'}"></uni-load-more>
									</template>
									<template v-else>
										<view v-for="(record, re_index) in list.record_list" :key="re_index" @click="showMore(re_index)">
											<uni-row>
												<view class="d-flex">
													<uni-col :span="11">
														<view class="text-center p-2 uni-table-tr">{{ record.date }}</view>
													</uni-col>
													<uni-col :span="7">
														<view class="text-center p-2 uni-table-tr">
															<text v-if="record.signtime">
																是
																<text v-if="record.signstatus == 3" class="text-danger fs_10">(迟到)</text>
															</text>
															<text v-else>否</text>
														</view>
													</uni-col>
													<uni-col :span="7">
														<view class="text-center p-2 uni-table-tr">
															<text v-if="record.signbacktime">
																是
																<text v-if="record.signbackstatus == 3" class="text-danger fs_10">(迟到)</text>
															</text>
															<text v-else>否</text>
														</view>
													</uni-col>
													<uni-col :span="7" v-if="list.is_check == 3">
														<view class="text-center p-2 uni-table-tr">
															<text class="fs_12 text-primary-600" @click="setPay(list,record)">设置工资</text>
														</view>
													</uni-col>
												</view>
											</uni-row>
											<view class="more-image" v-if="showImagesIndex == re_index">
												<view class="p-2 sign-in">
													<text class="d-block fs_12 text-grey">签到照片</text>
													<template v-if="record.images.length == 0">
														<uni-load-more status="no-more" :contentText="{contentnomore:'暂无数据'}"></uni-load-more>
													</template>
													<template v-else>
														<uni-file-picker readonly 
															:value="record.images" 
															:imageStyles="imageStyles" 
															file-mediatype="image">
														</uni-file-picker>
													</template>
												</view>
												<view class="p-2 sign-back">
													<text class="d-block fs_12 text-grey">签退照片</text>
													<template v-if="record.back_images.length == 0">
														<uni-load-more status="no-more" :contentText="{contentnomore:'暂无数据'}"></uni-load-more>
													</template>
													<template v-else>
														<uni-file-picker readonly 
															:value="record.back_images" 
															:imageStyles="imageStyles" 
															file-mediatype="image">
														</uni-file-picker>
													</template>
												</view>
											</view>
										</view>
									</template>
								</view>
							</view>
						</uni-section>
					</view>
					<uni-load-more :status="loadStatus"></uni-load-more>
				</view>
				
				<!-- 签到的pop -->
				<uni-popup ref="signPopup" @change="signPopupChange" :safe-area="false">
					<view class="bg-white signPopup">
						<uni-section title="签到" type="line">
							<uni-forms :modelValue="signForm" label-position="top">
								<view class="px-3">
									<uni-forms-item label="签到日期" name="date">
										<uni-data-select v-model="signForm.date" :clear="false" 
											:localdata="dateOptions"
											placeholder="请选择签到日期">
										</uni-data-select>
									</uni-forms-item>
									<uni-forms-item label="签到类型" name="type">
										<uni-data-select v-model="signForm.type" :clear="false" 
											:localdata="typeOptions"
											placeholder="请选择签到类型">
										</uni-data-select>
									</uni-forms-item>
									<uni-forms-item label="签到图片" name="image">
										<view class="">
											<uni-file-picker
												:limit="4"
												:imageStyles="imageStyles" 
												file-mediatype="image"
												:auto-upload="false"
												@select="imageSelect"
												@success="imageSuccess"
												@delete="imageDelete">
											</uni-file-picker>
										</view>
									</uni-forms-item>
								</view>
							</uni-forms>
							<view class="text-center pt-5 pb-5">
								<text class="my-btn bg-primary-600 fs_13" @click="signInOut_replace()">签到</text>
							</view>
						</uni-section>
					</view>
				</uni-popup>
				
				<!-- 评价的pop -->
				<uni-popup ref="evaluatePopup" @change="evaluatePopupChange" :safe-area="false">
					<view class="bg-white signPopup">
						<uni-section title="评价" type="line">
							<uni-forms :modelValue="evaluateForm" label-position="top">
								<view class="px-3">
									<uni-forms-item label="评价分数" name="score">
										<uni-rate v-model="evaluateForm.score" size="30" touchable :is-fill="false" />
									</uni-forms-item>
									<uni-forms-item label="评价内容">
										<uni-easyinput type="textarea" v-model="evaluateForm.content" placeholder="请输入评价内容" />
									</uni-forms-item>
								</view>
							</uni-forms>
							<view class="text-center pt-5 pb-5">
								<text class="my-btn bg-primary-600 fs_13" @click="evaluateSubmit()">确定</text>
							</view>
						</uni-section>
					</view>
				</uni-popup>
				
				<!-- 设置工资的pop -->
				<uni-popup ref="payPopup" @change="payPopupChange" :safe-area="false">
					<view class="bg-white signPopup">
						<uni-section title="设置工资" type="line">
							<uni-forms :modelValue="payForm" label-position="top">
								<view class="px-3">
									<uni-forms-item label="工时">
										<uni-easyinput type="digit" v-model="payForm.work_hour" placeholder="请输入工时" />
									</uni-forms-item>
									<uni-forms-item label="工资">
										<uni-easyinput type="digit" v-model="payForm.money" placeholder="请输入工资" />
									</uni-forms-item>
								</view>
							</uni-forms>
							<view class="text-center pt-5 pb-5" v-if="payForm.is_send !== 2">
								<text class="my-btn bg-primary-600 py-2 fs_14" @click="paySubmit()">确定</text>
							</view>
						</uni-section>
					</view>
				</uni-popup>
			</view>
			
		</view>
		
		<!-- 查看签到码 -->
		<view class="backHome bg-primary-600 d-flex align-items-center justify-content-center p-2" @click="showSignCode">
			<image class="image signCodeImg" :src="signCodeImg" mode="aspectFit"/>
		</view>
		
		<!-- 签到码窗口 -->
		<uni-popup ref="signCodePopup">
			<view class="signCodePopup p-3">
				<text class="d-block fs_18">扫码签到</text>
				<image class="image signcode-image" :src="posterImg" mode="aspectFit" />
				<text class="mt-3 d-block fs_14">长按图片保存到相册</text>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				sn:"",
				info:{
					title:"",
					money:"¥15.00/小时",
					earnest_money:"¥115.00",
					num:"8",
					settlement:"",
					address:"1",
					latitude:"",
					longitude:"",
					
					detail:"",
					contact:"",
					tel:"",
					ewmImg:"",
				},
				// 流程
				processContent:"",
				// 已报名人员
				searchValue:"",
				searchDate:"",
				can_startDate:"",
				can_endDate:"",
				dateImg: require("@/packageMy/static/my/date.png"),
				imageStyles:{
					width: 70,
					height: 70,
				},
				signTab:[
					{
						title:"已报名",
						value:""
					},
					{
						title:"待审核",
						value:""
					},
					{
						title:"已通过",
						value:""
					},
					{
						title:"不通过",
						value:""
					},
					{
						title:"已签到",
						value:""
					},
					{
						title:"未签到",
						value:""
					},
				],
				activeTab:-1,
				registerList:[],
				currentPage:1,
				pageSize:5,
				total:0,
				loadStatus:"more",
				// 签到、签退照片展示
				showImagesIndex:-1,
				signForm:{
					signId:"",
					type:"",
					date:"",
					images:[],
				},
				typeOptions:[
					{
						text:"签到",
						value:"1"
					},
					{
						text:"签退",
						value:"2"
					},
				],
				dateOptions:[],
				// 评价
				evaluateForm:{
					evaluateId:"",
					score:"",
					content:"",
				},
				// 工资
				payForm:{
					payId:"",
					signId:"",
					work_hour:"",
					money:"",
					is_send:"", // is_send为2 就没确定按钮
				},
				// 签到码
				signCodeImg:require("@/static/ewm_icon.png"),
				posterImg:"",
			}
		},
		onLoad:function(option){
			// option 接受url的传参
			this.sn = option.sn;
		},
		
		onShow:function(){
			this.initDetail(this.sn);
			this.initPersonNum(this.sn);
			this.initSign(this.sn,'');
		},
		
		methods: {
			goBack() {
				uni.navigateBack({
					delta: 1
				})
			},
			
			// 获取职位详情
			initDetail(sn){
				this.$api.activityDetail({
					sn:sn,
					token:uni.getStorageSync('user_token'),
				}).then(res=>{
					if(res.code == 0){
						// 基础信息
						this.info.title = res.data.info.title;
						this.info.status = res.data.info.status;
						this.info.money = res.data.info.money;
						this.info.earnest_money = res.data.info.earnest_money;
						this.info.num = res.data.info.numbers;
						this.info.settlement = res.data.info.settle_model;
						this.info.address = res.data.info.address;
						this.info.latitude = res.data.info.latitude;
						this.info.longitude = res.data.info.longitude;
						
						// 工作流程
						this.processContent = this.$util.formatRichText(res.data.info.content);
						// 招聘详情
						this.info.detail = res.data.info.desc;
						
						// 联系方式
						this.info.contact = res.data.info.truename;
						this.info.tel = res.data.info.mobile;
						this.info.ewmImg = this.$globalUrl.baseUrl + res.data.info.codeimage;
						
						// 可筛选日期
						this.can_startDate = res.data.range_date[0];
						this.can_endDate = res.data.range_date[res.data.range_date.length - 1];
						
						this.dateOptions = res.data.range_date.map((date)=>{
							return {
								text:date,
								value:date,
							}
						});
						
						// 签到码
						this.posterImg = this.$globalUrl.baseUrl + res.data.info.wx_signimage;
					}else{
						uni.showToast({
							title: res.msg,
							icon: 'none'
						});
					}
				});
			},
			
			// 获取各类型的人数
			initPersonNum(sn){
				this.$api.personCount({
					sn:sn,
					token:uni.getStorageSync('user_token'),
					keywords:this.searchValue,
					date:this.searchDate,
				}).then(res=>{
					if(res.code == 0){
						// 审核列表里的数据
						this.signTab[0].value = res.data.sign_count; // 已报名人数
						this.signTab[1].value = res.data.sign_load_check_count; // 待审核人数
						this.signTab[2].value = res.data.sign_check_count; // 已通过人数
						this.signTab[3].value = res.data.sign_no_pass_count; // 不通过人数
						// this.signTab[4].value = res.data.sign_count; // 已签到人数
						// this.signTab[5].value = res.data.sign_count; // 未签到人数
					}else{
						uni.showToast({
							title: res.msg,
							icon: 'none'
						});
					}
				});
			},
			
			// tab切换
			changeTab(index){
				this.activeTab = index+1;
				this.currentPage = 1;
				this.initSign(this.sn,this.activeTab);
			},
			
			// 获取签到+报名
			initSign(sn,type){
				this.$api.activitySignList({
					sn:sn,
					token:uni.getStorageSync('user_token'),
					page:this.currentPage,
					limit:this.pageSize,
					keywords:this.searchValue,
					date:this.searchDate,
					type:type,
				}).then(res=>{
					if(res.code == 0){
						this.total = res.data.sign_list.total;
						if (this.currentPage == 1) {
							this.registerList = res.data.sign_list.data.map((item)=>{
								if(item.avatar.indexOf("http") >= 0){
									item.avatar = item.avatar;
								}else{
									item.avatar = this.$globalUrl.baseUrl + item.avatar;
								}
								item.record_list = item.record_list.map((record)=>{
									record.images = record.images.map((image)=>{
										return {
											"name":"签到图片",
											"extname":"",
											"url": this.$globalUrl.baseUrl + image,
										}
									});
									record.back_images = record.back_images.map((back_image)=>{
										return {
											"name":"签退图片",
											"extname":"",
											"url": this.$globalUrl.baseUrl + back_image,
										}
									});
									return record
								});
								return item
							});
							if (this.registerList.length < this.total) {
								this.loadStatus = "more";
							} else {
								this.loadStatus = "no-more";
							}
						} else {
							this.loadStatus = "loading";
							setTimeout(()=>{
								this.registerList = this.registerList.concat(res.data.sign_list.data.map((item)=>{
										if(item.avatar.indexOf("http") >= 0){
											item.avatar = item.avatar;
										}else{
											item.avatar = this.$globalUrl.baseUrl + item.avatar;
										}
										item.record_list = item.record_list.map((record)=>{
											record.images = record.images.map((image)=>{
												return {
													"name":"签到图片",
													"extname":"",
													"url": this.$globalUrl.baseUrl + image,
												}
											});
											record.back_images = record.back_images.map((back_image)=>{
												return {
													"name":"签退图片",
													"extname":"",
													"url": this.$globalUrl.baseUrl + back_image,
												}
											});
											return record
										});
										return item
									})
								);
								if (this.registerList.length < this.total) {
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
			
			// 位置导航
			goLoaction(info){
				uni.openLocation({
					latitude: Number(info.latitude),
					longitude: Number(info.longitude),
					name: info.address,
					address: info.address,
					success: function () {
						console.log('success');
					}
				});
			},
			
			// 日期改变
			dateChange(e){
				this.searchDate = e;
				this.search();
			},
			
			// 搜索
			search(){
				this.loadStatus = "more";
				this.currentPage = 1;
				this.pageSize = 5;
				this.total = 0;
				this.initSign(this.sn,this.activeTab);
			},
			
			// 拨打电话
			callPhone(tel){
				uni.makePhoneCall({
					// 手机号
					phoneNumber: tel, 
					// 成功回调
					success: (res) => {
						console.log('调用成功!')	
					},
					// 失败回调
					fail: (res) => {
						console.log('调用失败!')
					}
				});
			},
			
			// 展示签到签退图片
			showMore(index){
				if(this.showImagesIndex === index){
					this.showImagesIndex = -1
				}else{
					this.showImagesIndex = index;
				};
			},
			
			// 签到的弹窗打开
			signPop(row){
				this.$refs.signPopup.open('bottom');
				this.signForm.signId = row.id;
			},
			
			// 图片上传
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
					url: this.$globalUrl.baseUrl +'/api/base/uploadimage',
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
							this.signForm.images.push(res.data.path);
						}else{
							uni.showToast({
								title: res.msg,
								icon: 'none'
							});
						}
					}
				});
			},
			
			// 图片上传成功
			imageSuccess(e){
				console.log(e,'上传成功')
			},
			
			// 图片删除
			imageDelete(e){
				this.signForm.images.splice(e.tempFilePath,1)
			},
			
			// 签到弹窗状态改变
			signPopupChange(e){
				if(!e.show){
					this.signForm = {
						signId:"",
						type:"",
						date:"",
						images:[],
					};
				}
			},
			
			// 签到、签退
			signInOut_replace(){
				var signtype = 0;
				// #ifdef H5
				signtype = 1;
				// #endif
				
				// #ifdef MP-WEIXIN
				signtype = 2;
				// #endif
				
				uni.showToast({
					title: '加载中……',
					icon: 'loading',
					duration: 3000,
				})
				var images = "",back_images = "",sign_title = "";
				if(this.signForm.type == 1){ // 签到
					images = this.signForm.images.join(",");
					back_images = "";
					sign_title = "签到";
				}else if(this.signForm.type == 2){ // 签退
					images = "";
					back_images = this.signForm.images.join(",");
					sign_title = "签退";
				}
				
				uni.showModal({
					title: '温馨提示',
					content: '请确认是否' + sign_title,
					confirmText: '确定',
					cancelText: '取消',
					success: (modal_res) => {
						if (modal_res.confirm) {
							// 调代替签到的接口
							this.$api.activitySign_replace({
								token:uni.getStorageSync('user_token'),
								sn:this.sn,
								id:this.signForm.signId,
								date:this.signForm.date,
								sign_type:this.signForm.type,
								signtype:signtype,
								images:images,
								back_images:back_images,
							}).then(res=>{
								if(res.code == 0){
									uni.showToast({
										title: sign_title + '成功',
										icon: 'success'
									});
									this.$refs.signPopup.close();
									this.search();
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
			
			// 审核
			check(type,row){
				var _this = this;
				uni.showModal({
					title: '温馨提示',
					content: '请确认审核操作!',
					success: (modal_res)=>{
						if (modal_res.confirm) {
							_this.$api.activityCheck({
								token:uni.getStorageSync('user_token'),
								sn:_this.sn,
								id:row.id,
								is_check:type,
								remark:"",
							}).then(res=>{
								if(res.code == 0){
									uni.showToast({
										title: '审核成功',
										icon: 'success'
									});
									this.search();
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
			
			// 评价
			evaluate(row){
				this.$refs.evaluatePopup.open('bottom');
				this.evaluateForm.evaluateId = row.id;
				
				this.$api.activityEvaluate({
					token:uni.getStorageSync('user_token'),
					sn:this.sn,
					id:this.evaluateForm.evaluateId,
					function_type:1,
				}).then(res=>{
					if(res.code == 0){
						this.evaluateForm.score = res.data?res.data.score:'';
						this.evaluateForm.content = res.data?res.data.content:'';
					}else{
						uni.showToast({
							title: res.msg,
							icon: 'none'
						});
					}
				});
			},
			
			// 评价弹窗状态改变
			evaluatePopupChange(e){
				if(!e.show){
					this.evaluateForm = {
						evaluateId:"",
						score:"",
						content:"",
					};
				}
			},
			
			// 评价提交
			evaluateSubmit(){
				this.$api.activityEvaluate({
					token:uni.getStorageSync('user_token'),
					sn:this.sn,
					id:this.evaluateForm.evaluateId,
					score:this.evaluateForm.score,
					content:this.evaluateForm.content,
					function_type:2,
				}).then(res=>{
					if(res.code == 0){
						uni.showToast({
							title: '签到成功',
							icon: 'success'
						});
						this.$refs.evaluatePopup.close();
						this.search();
					}else{
						uni.showToast({
							title: res.msg,
							icon: 'none'
						});
					}
				});
			},
			
			// 设置工资
			setPay(row,record){
				this.$refs.payPopup.open('bottom');
				this.payForm.payId = row.id;
				this.payForm.signId = record.id;
				
				this.$api.activityPay({
					token:uni.getStorageSync('user_token'),
					sn:this.sn,
					sign_id:this.payForm.payId,
					id:this.payForm.signId,
					function_type:1,
				}).then(res=>{
					if(res.code == 0){
						this.payForm.work_hour = res.data.work_hour;
						this.payForm.money = res.data.money;
						this.payForm.is_send = res.data.is_send;
					}else{
						uni.showToast({
							title: res.msg,
							icon: 'none'
						});
					}
				});
			},
			
			// 工资弹窗状态改变
			payPopupChange(e){
				if(!e.show){
					this.payForm = {
						payId:"",
						signId:"",
						work_hour:"",
						money:"",
					};
				}
			},
			
			// 工资提交
			paySubmit(){
				this.$api.activityPay({
					token:uni.getStorageSync('user_token'),
					sn:this.sn,
					sign_id:this.payForm.payId,
					id:this.payForm.signId,
					work_hour:this.payForm.work_hour,
					money:this.payForm.money,
					function_type:2,
				}).then(res=>{
					if(res.code == 0){
						uni.showToast({
							title: '工资设置成功',
							icon: 'success'
						});
						this.$refs.payPopup.close();
						this.search();
					}else{
						uni.showToast({
							title: res.msg,
							icon: 'none'
						});
					}
				});
			},
			
			// 查看签到码
			showSignCode(){
				this.$refs.signCodePopup.open();
			},
		},
		
		// 上拉加载
		onReachBottom() {
			this.currentPage++;
			if (this.registerList.length < this.total) {
				this.initSign(this.sn,this.activeTab);
			} else {
				uni.hideNavigationBarLoading();
				this.loadStatus = "no-more";
			}
		},
		
		// 下拉刷新
		onPullDownRefresh(){
			this.loadStatus = "more";
			this.currentPage = 1;
			this.pageSize = 5;
			this.total = 0;
			this.initSign(this.sn);
			setTimeout(function () {
				uni.stopPullDownRefresh();  //停止下拉刷新动画
			}, 1000);
		},
	}
</script>

<style>
</style>
