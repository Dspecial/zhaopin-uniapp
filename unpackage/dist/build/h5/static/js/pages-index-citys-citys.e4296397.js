(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages-index-citys-citys"],{"69a3":function(t,i,n){"use strict";n.r(i);var e=n("7b79"),c=n("d016");for(var a in c)"default"!==a&&function(t){n.d(i,t,(function(){return c[t]}))}(a);var u,o=n("f0c5"),s=Object(o["a"])(c["default"],e["b"],e["c"],!1,null,"1f613387",null,!1,e["a"],u);i["default"]=s.exports},"7b79":function(t,i,n){"use strict";n.d(i,"b",(function(){return c})),n.d(i,"c",(function(){return a})),n.d(i,"a",(function(){return e}));var e={uniNavBar:n("f519").default,uniRow:n("f127").default,uniCol:n("f346").default},c=function(){var t=this,i=t.$createElement,n=t._self._c||i;return n("v-uni-view",{staticClass:"page-container city-container"},[n("uni-nav-bar",{attrs:{dark:!0,fixed:!0,"status-bar":!0,"left-icon":"left",border:!1,title:"城市选择"},on:{clickLeft:function(i){arguments[0]=i=t.$handleEvent(i),t.goBack.apply(void 0,arguments)}}}),n("v-uni-view",[n("v-uni-view",{staticClass:"pt-3 pl-3 pr-3 pb-2"},[t._v("当前城市："+t._s(t.city_name))]),n("v-uni-view",{staticClass:"hotCitys"},[n("v-uni-view",{staticClass:"hot-title pt-1 pb-1 pl-3 pr-3"},[t._v("热门城市")]),n("uni-row",[t._l(t.citysList,(function(i,e){return[n("uni-col",{key:e,attrs:{span:6}},[n("v-uni-view",{staticClass:"mt-1 city-item",on:{click:function(n){arguments[0]=n=t.$handleEvent(n),t.chooseCity(i)}}},[t._v(t._s(i.name))])],1)]}))],2)],1)],1)],1)},a=[]},d016:function(t,i,n){"use strict";n.r(i);var e=n("d7a0"),c=n.n(e);for(var a in e)"default"!==a&&function(t){n.d(i,t,(function(){return e[t]}))}(a);i["default"]=c.a},d7a0:function(t,i,n){"use strict";(function(t){Object.defineProperty(i,"__esModule",{value:!0}),i.default=void 0;var n={data:function(){return{city_id:"0",city_name:"北京市",citysList:[]}},onLoad:function(){this.city_id=uni.getStorageSync("city_id"),this.city_name=uni.getStorageSync("city_name"),this.getLocation(),this.initCitys()},methods:{goBack:function(){uni.navigateBack({delta:1})},initCitys:function(){var t=this;this.$api.citys({}).then((function(i){t.citysList=i.data}))},getLocation:function(i){var n=this;uni.getLocation({type:"wgs84",geocode:!0,success:function(t){n.$api.locationCurrent({longitude:t.longitude,latitude:t.latitude}).then((function(t){n.city_id!=t.data.city_id&&uni.showModal({content:"您当前所在城市为["+t.data.city_name+"],是否切换",success:function(i){i.confirm?(uni.setStorageSync("city_id",t.data.city_id),uni.setStorageSync("city_name",t.data.city_name),n.switchIndex()):i.cancel&&(uni.setStorageSync("city_id",n.city_id),uni.setStorageSync("city_name",n.city_name))}})}))},fail:function(i){t("log","err ==>",i," at pages/index/citys/citys.vue:82")}})},chooseCity:function(t){uni.setStorageSync("city_id",t.id),uni.setStorageSync("city_name",t.name),this.switchIndex()},switchIndex:function(){uni.reLaunch({url:"/pages/index/index"})}}};i.default=n}).call(this,n("0de9")["log"])}}]);