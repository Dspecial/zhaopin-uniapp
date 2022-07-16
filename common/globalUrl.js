
let globalUrl = {
	baseUrl:"",
	token:"d13a09a289343111dd1fff07bb40539f",
	appId:"wx98d6fbadc838f948",
	template_id_enrolled:"CIICkipUHlOnG2Wtqlx4qHXX3qrQHj9ZdSQl724QDns",
	template_id_sign:"WmqTfZYQkirMybkfbYhrXWvnx6X_ffyH4ECzmaozwgk",
	template_id_money:"fslpD98zx5N4xiZ-GpIxCJSH_bsQGIDkLUhUgOSjM7M",
};
 
if(process.env.NODE_ENV === 'development'){
  // 开发环境 配置ip地址端口号
  globalUrl.baseUrl = 'http://h5.yuezhongkeji.com'
}else{
  // 生产环境
  globalUrl.baseUrl = 'http://h5.yuezhongkeji.com'
}
 
export default globalUrl;