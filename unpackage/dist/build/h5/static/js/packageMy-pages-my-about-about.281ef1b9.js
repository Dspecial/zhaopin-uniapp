(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["packageMy-pages-my-about-about"],{1273:function(t,n,a){"use strict";a.r(n);var i=a("e4f0"),o=a("2f08");for(var e in o)"default"!==e&&function(t){a.d(n,t,(function(){return o[t]}))}(e);var u,s=a("f0c5"),c=Object(s["a"])(o["default"],i["b"],i["c"],!1,null,"40e62466",null,!1,i["a"],u);n["default"]=c.exports},"2f08":function(t,n,a){"use strict";a.r(n);var i=a("d3dd"),o=a.n(i);for(var e in i)"default"!==e&&function(t){a.d(n,t,(function(){return i[t]}))}(e);n["default"]=o.a},5129:function(t,n,a){t.exports=a.p+"static/img/uni.e19b3310.png"},d3dd:function(t,n,a){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var i={data:function(){return{logo:a("5129"),aboutUs:""}},onLoad:function(){this.initLogo(),this.initAbout()},methods:{goBack:function(){uni.navigateBack({delta:1})},initLogo:function(){var t=this;this.$api.aboutUs({name:"logo"}).then((function(n){0==n.code?t.logo=t.$globalUrl.baseUrl+n.data.value:uni.showToast({title:n.msg,icon:"none"})}))},initAbout:function(){var t=this;this.$api.aboutUs({name:"aboutus"}).then((function(n){0==n.code?t.aboutUs=t.$util.formatRichText(n.data.value):uni.showToast({title:n.msg,icon:"none"})}))}}};n.default=i},e4f0:function(t,n,a){"use strict";a.d(n,"b",(function(){return o})),a.d(n,"c",(function(){return e})),a.d(n,"a",(function(){return i}));var i={uniNavBar:a("f519").default},o=function(){var t=this,n=t.$createElement,a=t._self._c||n;return a("v-uni-view",{staticClass:"page-container auth-container"},[a("uni-nav-bar",{attrs:{dark:!0,fixed:!0,"status-bar":!0,"left-icon":"left",border:!1,title:"关于我们"},on:{clickLeft:function(n){arguments[0]=n=t.$handleEvent(n),t.goBack.apply(void 0,arguments)}}}),a("v-uni-view",{staticClass:"pt-4 pl-3 pr-3 pb-3"},[a("v-uni-image",{staticClass:"image about-logo-image",attrs:{src:t.logo,mode:"aspectFit"}}),a("v-uni-view",{staticClass:"mt-4 fs_14"},[a("v-uni-view",{staticClass:"aboutContent",domProps:{innerHTML:t._s(t.aboutUs)}})],1)],1)],1)},e=[]}}]);