import globalUrl from './globalUrl.js'
let token = globalUrl.token;

const headers = {
	'token': token,
	'content-type': 'application/json',
}

export default class Request {
    http(param) {
        // 请求参数
        var url = param.url,
            method = param.method,
            header = headers,
            data = param.data || {},
            token = param.token || "";

        //拼接完整请求地址
        var requestUrl = globalUrl.baseUrl + url;

        //请求方式:GET或POST(POST需配置
        // header: {'content-type' : "application/x-www-form-urlencoded"},)
        if (method) {
						method = method.toUpperCase(); //小写改为大写
						if (method == "POST") {
								headers["content-type"] = "application/x-www-form-urlencoded";
						} else {
								headers["content-type"] = "application/json";
						}
        }
				
        // 返回 promise
        return new Promise((resolve, reject) => {
            // 请求
            uni.request({
                url: requestUrl,
                data: data,
                method: method,
                header: header,
                success: (res) => {
                    // 判断 请求api 格式是否正确
                    if (res.statusCode && res.statusCode != 200) {
                        uni.showToast({
                            title: "api错误" + res.errMsg,
                            icon: 'none',
														duration: 3000
                        });
                        return;
                    }
										// code判断:0成功,不等于0错误
										if (res.data.hasOwnProperty('code')) {
										    if (res.data.code != '0') {
														// uni.showToast({
														// 		title: "code!=0" + res.data.msg,
														// 		icon: 'none',
														// 		duration: 3000,
														// });
										        return;
										    }
										} else {
												uni.showToast({
														title: "code不存在" + res.data.msg,
														icon: 'none',
														duration: 3000,
												});
										    return;
										}
										// 将结果抛出
										resolve(res.data);
                },
                // 请求失败
                fail: (e) => {
                    uni.showToast({
                        title: "" + e.data.msg,
                        icon: 'none',
												duration: 3000
                    });
                    resolve(e.data);
                },
                // 请求完成
                complete:(res)=> {
                    resolve(res.data);
                    return;
                }
            })
        })
    }
}