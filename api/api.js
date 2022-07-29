import Request from '@/common/request.js'
let request = new Request().http;

// POST、GET 必须大写，为了兼容其他应用
export default {
	/*
	**授权
	*/
	// 获取小程序授权user-token(废弃)
	mini_wx_auth: (params) => {
		return request({
			url: "/api/weixin/mini_wx_auth", // 请求url
			method: "POST", // 请求方式
			data: params, // 请求数据
		})
	},
	
	// 获取微信授权user-token(废弃)
	wx_wx_auth: (params) => {
		return request({
			url: "/api/weixin/weixin_auth_by_wx", // 请求url
			method: "POST", // 请求方式
			data: params, // 请求数据
		})
	},
	
	// 小程序授权后判断是不是第一次授权获取user-token
	get_mini_auth: (params) => {
		return request({
			url: "/api/weixin/get_wx_mini_data", // 请求url
			method: "POST", // 请求方式
			data: params, // 请求数据
		})
	},
	
	// 微信授权后判断是不是第一次授权获取user-token
	get_wx_auth: (params) => {
		return request({
			url: "/api/weixin/get_wx_data", // 请求url
			method: "POST", // 请求方式
			data: params, // 请求数据
		})
	},
	
	// 统一的注册登录
	login: (params) => {
		return request({
			url: "/api/weixin/unite_login", // 请求url
			method: "POST", // 请求方式
			data: params, // 请求数据
		})
	},
	
	/* 
	**首页 
	*/
	// 获取当前城市信息
	locationCurrent: (params) => {
			return request({
				url: "/api/city/get_city", // 请求url
				method: "POST", // 请求方式
				data: params, // 请求数据
			})
	},
	
	// 获取城市列表
	citys: (params) => {
			return request({
				url: "/api/city/index", // 请求url
				method: "POST", // 请求方式
				data: params, // 请求数据
			})
	},
	
	// 获取轮播图
	banner: (params) => {
			return request({
				url: "/api/banner/index", // 请求url
				method: "POST", // 请求方式
				data: params, // 请求数据
			})
	},
	
	// 获取轮播图详情
	bannerDetail: (params) => {
			return request({
				url: "/api/banner/details", // 请求url
				method: "POST", // 请求方式
				data: params, // 请求数据
			})
	},
	
	// 获取首页推荐
	recommendIndex: (params) => {
		return request({
			url: "/api/exercise/index", // 请求url
			method: "POST", // 请求方式
			data: params, // 请求数据
		})
	},
	
	/*
	**求职
	*/
	// 获取求职列表
	jobList: (params) => {
		return request({
			url: "/api/exercise/get_list", // 请求url
			method: "POST", // 请求方式
			data: params, // 请求数据
		})
	},
	
	// 获取求职详情
	jobDetail: (params) => {
		return request({
			url: "/api/exercise/exercise_detail", // 请求url
			method: "POST", // 请求方式
			data: params, // 请求数据
		})
	},
	
	// 收藏工作
	collectJob: (params) => {
		return request({
			url: "/api/member/collections", // 请求url
			method: "POST", // 请求方式
			data: params, // 请求数据
		})
	},
	
	// 取消收藏工作
	del_collectJob: (params) => {
		return request({
			url: "/api/member/collections_del", // 请求url
			method: "POST", // 请求方式
			data: params, // 请求数据
		})
	},
	
	// 立即报名
	signUp: (params) => {
		return request({
			url: "/api/exercise/sign_up", // 请求url
			method: "POST", // 请求方式
			data: params, // 请求数据
		})
	},
	
	// 分享-订阅消息-换取微信签名
	share: (params) => {
		return request({
			url: "/api/base/share", // 请求url
			method: "POST", // 请求方式
			data: params, // 请求数据
		})
	},
	
	
	// 分享-生成海报
	posterShare: (params) => {
		return request({
			url: "/api/exercise/create_poster", // 请求url
			method: "POST", // 请求方式
			data: params, // 请求数据
		})
	},
	
	/*
	**报名
	*/
	// 获取报名列表
	enrolledList: (params) => {
		return request({
			url: "/api/exercise/my_sign", // 请求url
			method: "POST", // 请求方式
			data: params, // 请求数据
		})
	},
	
	// 取消报名
	cancelSignUp: (params) => {
		return request({
			url: "/api/exercise/cancel_sign", // 请求url
			method: "POST", // 请求方式
			data: params, // 请求数据
		})
	},
	
	// 获取报名详情
	enrolledDetail: (params) => {
		return request({
			url: "/api/exercise/sign_detail", // 请求url
			method: "POST", // 请求方式
			data: params, // 请求数据
		})
	},
	
	// 签到、签退
	sign: (params) => {
		return request({
			url: "/api/exercise/to_sign", // 请求url
			method: "POST", // 请求方式
			data: params, // 请求数据
		})
	},
	
	// 取消报名
	cancelRegister: (params) => {
		return request({
			url: "/api/exercise/to_sign", // 请求url
			method: "POST", // 请求方式
			data: params, // 请求数据
		})
	},
	
	/*
	**我的-个人中心
	*/
	// 获取用户信息
	profileInfo: (params) => {
		return request({
			url: "/api/member/index", // 请求url
			method: "POST", // 请求方式
			data: params, // 请求数据
		})
	},
	
	/*
	**我的-钱包
	*/ 
	// 提现申请
	withdrawalApply: (params) => {
		return request({
			url: "/api/member/apply_deposit", // 请求url
			method: "POST", // 请求方式
			data: params, // 请求数据
		})
	},
	
	// 获取余额、金额明细
	balanceInfo: (params) => {
		return request({
			url: "/api/member/balance_comission", // 请求url
			method: "POST", // 请求方式
			data: params, // 请求数据
		})
	},

	// 提现明细
	withdrawalList: (params) => {
		return request({
			url: "/api/member/deposit_list", // 请求url
			method: "POST", // 请求方式
			data: params, // 请求数据
		})
	},

	// 银行列表
	bankList: (params) => {
		return request({
			url: "/api/accounts/get_bank_list", // 请求url
			method: "POST", // 请求方式
			data: params, // 请求数据
		})
	},
	
	// 账号列表
	accountList: (params) => {
		return request({
			url: "/api/accounts/account_list", // 请求url
			method: "POST", // 请求方式
			data: params, // 请求数据
		})
	},
	
	// 新增账号
	accountAdd: (params) => {
		return request({
			url: "/api/accounts/add_account", // 请求url
			method: "POST", // 请求方式
			data: params, // 请求数据
		})
	},
	
	// 编辑账号
	accountEdit: (params) => {
		return request({
			url: "/api/accounts/edit_account", // 请求url
			method: "POST", // 请求方式
			data: params, // 请求数据
		})
	},

	// 删除账号
	accountDel: (params) => {
		return request({
			url: "/api/accounts/del_account", // 请求url
			method: "POST", // 请求方式
			data: params, // 请求数据
		})
	},
		
	/*
	**我的-关于我们
	*/
	// 关于我们
	aboutUs: (params) => {
		return request({
			url: "/api/base/get_config", // 请求url
			method: "POST", // 请求方式
			data: params, // 请求数据
		})
	},
	
	/*
	**我的-个人信息
	*/ 
	// 小程序授权获取手机号
	mini_get_phone: (params) => {
		return request({
			url: "/api/weixin/get_phone", // 请求url
			method: "POST", // 请求方式
			data: params, // 请求数据
		})
	},
	
	// 保存个人信息
	setProfile: (params) => {
		return request({
			url: "/api/member/set_info", // 请求url
			method: "POST", // 请求方式
			data: params, // 请求数据
		})
	},
	
	/*
	**我的-实名认证
	*/ 
	// 实名认证提交
	submitAuth: (params) => {
		return request({
			url: "/api/member/to_auth", // 请求url
			method: "POST", // 请求方式
			data: params, // 请求数据
		})
	},

	/*
	**我的-收藏
	*/ 
	// 收藏列表
	collectionList: (params) => {
		return request({
			url: "/api/member/collections_list", // 请求url
			method: "POST", // 请求方式
			data: params, // 请求数据
		})
	},
	
	
	
	/*
	**我的-负责活动
	*/
	// 获取活动列表
	activityList: (params) => {
		return request({
			url: "/api/charger/get_list", // 请求url
			method: "POST", // 请求方式
			data: params, // 请求数据
		})
	},
	
	// 获取活动详情
	activityDetail: (params) => {
		return request({
			url: "/api/charger/details", // 请求url
			method: "POST", // 请求方式
			data: params, // 请求数据
		})
	},
	
	// 获取活动详情-各类型人数
	personCount: (params) => {
		return request({
			url: "/api/charger/get_sign_count", // 请求url
			method: "POST", // 请求方式
			data: params, // 请求数据
		})
	},
		
	// 获取活动详情-签到+报名
	activitySignList: (params) => {
		return request({
			url: "/api/charger/get_sign_list", // 请求url
			method: "POST", // 请求方式
			data: params, // 请求数据
		})
	},
	
	// 代替签到
	activitySign_replace: (params) => {
		return request({
			url: "/api/charger/set_member_sign", // 请求url
			method: "POST", // 请求方式
			data: params, // 请求数据
		})
	},
	
	// 审核
	activityCheck: (params) => {
		return request({
			url: "/api/charger/to_check", // 请求url
			method: "POST", // 请求方式
			data: params, // 请求数据
		})
	},
	
	// 评价
	activityEvaluate: (params) => {
		return request({
			url: "/api/charger/to_evaluate", // 请求url
			method: "POST", // 请求方式
			data: params, // 请求数据
		})
	},

	// 设置工资
	activityPay: (params) => {
		return request({
			url: "/api/charger/set_sign_record", // 请求url
			method: "POST", // 请求方式
			data: params, // 请求数据
		})
	},
};
