function Init(e) {
	const that = this;
 
	// #ifdef H5
	// 监听订阅消息授权回调
	that.monitorSubscribeMsgAuthorize = (options) => {
		if (options.action === 'confirm') {
			const {
				class_id
			} = JSON.parse(uni.getStorageSync('courseInfo') || '{}');
 
			// this.$request(this.$api.Weike.subscribe, {
			// 	class_id: class_id
			// }).then(res => {
   //      //授权成功的处理
			// 	uni.showToast({
			// 		title: res.data.msg,
			// 		icon: 'none'
			// 	});
			// });
		}
	}
	// #endif
 
 
	// 订阅消息授权
	that.subscribeMsgAuthorize = (scene_id, template_id) => {
		// #ifdef MP-WEIXIN
		uni.requestSubscribeMessage({
			tmplIds: [template_id],
			success(res) {
				console.log(res)
				if (res.errMsg == 'requestSubscribeMessage:ok') {
					// this.$request(this.$api.Weike.subscribe, {
					// 	'class_id': scene_id
					// }).then(res => {
					// 	uni.navigateTo({
					// 		url: `/pages/classRoom/courseList/courseList?id=${scene_id}`
					// 	});
					// })
				}
			}
		})
		// #endif
 
		// #ifdef H5
		//记录场景值到缓存，用户授权成功后传给后端
    uni.setStorageSync('courseInfo', JSON.stringify({
			class_id: scene_id
		}));
		
		// let redirect_url = encodeURIComponent(location.href);
		let redirect_url = encodeURIComponent("http://h5.yuezhongkeji.com");
		let appId = this.$globalUrl.appId; // 公众号的固定appid
		location.href =
			`https://mp.weixin.qq.com/mp/subscribemsg?action=get_confirm&appid=${appId}&scene=${scene_id}&template_id=${template_id}&redirect_url=${redirect_url}#wechat_redirect`;
 
		// #endif
	}
 
 
 
}
module.exports = {
	Init: Init
}