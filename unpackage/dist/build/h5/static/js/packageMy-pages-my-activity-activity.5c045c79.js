(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["packageMy-pages-my-activity-activity"],{3917:function(t,e,i){"use strict";i.r(e);var n=i("c537"),a=i("5afa");for(var s in a)"default"!==s&&function(t){i.d(e,t,(function(){return a[t]}))}(s);var o,l=i("f0c5"),c=Object(l["a"])(a["default"],n["b"],n["c"],!1,null,"07ebd8f8",null,!1,n["a"],o);e["default"]=c.exports},"5afa":function(t,e,i){"use strict";i.r(e);var n=i("bb93"),a=i.n(n);for(var s in n)"default"!==s&&function(t){i.d(e,t,(function(){return n[t]}))}(s);e["default"]=a.a},bb93:function(t,e,i){"use strict";i("99af"),Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var n={data:function(){return{user_token:"",currentTab:0,tabs:["全部","报名中","进行中","已结束"],personsIcon:i("7bfe"),tab_content_list:[],currentPage:1,pageSize:5,total:0,loadStatus:"more"}},onLoad:function(){this.user_token=uni.getStorageSync("user_token");var t={currentIndex:0};this.user_token&&this.onClickItem(t)},onshow:function(){},methods:{goBack:function(){uni.navigateBack({delta:1})},goAuth:function(){uni.navigateTo({url:"/pages/auth/auth"})},onClickItem:function(t){this.currentTab!==t.currentIndex&&(this.currentTab=t.currentIndex),this.loadStatus="more",this.currentPage=1,this.pageSize=5,this.total=0,this.initEnrolledList(this.currentTab)},initEnrolledList:function(t){var e=this;this.$api.activityList({token:uni.getStorageSync("user_token"),type:t,page:this.currentPage,limit:this.pageSize}).then((function(t){e.total=t.data.total,1==e.currentPage?(e.tab_content_list=t.data.data,e.tab_content_list.length<e.total?e.loadStatus="more":e.loadStatus="no-more"):(e.loadStatus="loading",setTimeout((function(){e.tab_content_list=e.tab_content_list.concat(t.data.data),e.tab_content_list.length<e.total?e.loadStatus="more":e.loadStatus="no-more"}),1e3)),uni.hideNavigationBarLoading()}))},goDetail:function(t){uni.navigateTo({url:"/packageMy/pages/my/activity/activityDetail?sn="+t.sn})}},onReachBottom:function(){this.currentPage++,this.tab_content_list.length<this.total?this.initEnrolledList(this.currentTab):(uni.hideNavigationBarLoading(),this.loadStatus="no-more")},onPullDownRefresh:function(){this.loadStatus="more",this.currentPage=1,this.pageSize=5,this.total=0,this.initEnrolledList(this.currentTab),setTimeout((function(){uni.stopPullDownRefresh()}),1e3)}};e.default=n},c537:function(t,e,i){"use strict";i.d(e,"b",(function(){return a})),i.d(e,"c",(function(){return s})),i.d(e,"a",(function(){return n}));var n={uniNavBar:i("f519").default,uniSegmentedControl:i("2b1c").default,uniIcons:i("b31a").default,uniLoadMore:i("0a0b").default},a=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("v-uni-view",{staticClass:"page-container job-container"},[i("uni-nav-bar",{attrs:{dark:!0,fixed:!0,"status-bar":!0,"left-icon":"left",border:!1,title:"负责活动"},on:{clickLeft:function(e){arguments[0]=e=t.$handleEvent(e),t.goBack.apply(void 0,arguments)}}}),i("v-uni-view",{staticClass:"pl-3 pr-3 pb-3 pt-1"},[i("v-uni-view",{staticClass:"job_tab"},[i("uni-segmented-control",{attrs:{current:t.currentTab,values:t.tabs},on:{clickItem:function(e){arguments[0]=e=t.$handleEvent(e),t.onClickItem.apply(void 0,arguments)}}})],1),t.user_token?[i("v-uni-view",{staticClass:"recommend-box"},[i("v-uni-view",{staticClass:"box-content"},[t._l(t.tab_content_list,(function(e,n){return[i("v-uni-view",{key:n,staticClass:"recommend-item p-3 mt-2"},[i("v-uni-view",{on:{click:function(i){arguments[0]=i=t.$handleEvent(i),t.goDetail(e)}}},[i("v-uni-view",{staticClass:"header d-flex justify-content-between align-items-center"},[i("v-uni-text",{staticClass:"d-block fs_14 font-weight-semibold"},[t._v(t._s(e.title))]),i("v-uni-text",{staticClass:"d-block fs_15 font-weight-semibold pay"},[1==e.status?i("v-uni-text",[t._v("报名中")]):2==e.status?i("v-uni-text",[t._v("进行中")]):3==e.status?i("v-uni-text",[t._v("已结束")]):t._e()],1)],1),i("v-uni-view",{staticClass:"content mt-2 mb-2"},[t._v(t._s(e.brief))]),i("v-uni-view",{staticClass:"footer"},[i("v-uni-view",{},[i("uni-icons",{attrs:{type:"calendar-filled",size:"14"}}),i("v-uni-text",{staticClass:"fs_11 ml-1"},[t._v(t._s(e.startdate)+" - "+t._s(e.enddate))])],1),i("v-uni-view",{staticClass:"d-flex justify-content-between align-items-center mt-1"},[i("v-uni-view",{staticClass:"d-flex align-items-center"},[i("uni-icons",{attrs:{type:"location-filled",size:"14"}}),i("v-uni-text",{staticClass:"fs_11 ml-1"},[t._v(t._s(e.name))])],1),i("v-uni-view",{staticClass:"d-flex align-items-center"},[i("v-uni-view",{staticClass:"d-flex align-items-center"},[i("uni-icons",{attrs:{type:"eye-filled",size:"14"}}),i("v-uni-text",{staticClass:"fs_11 ml-1"},[t._v(t._s(e.all_views))])],1)],1)],1),i("v-uni-view",{staticClass:"d-flex justify-content-end align-items-center mt-1"},[i("v-uni-view",{staticClass:"d-flex align-items-center mr-3"},[i("v-uni-image",{staticClass:"image",staticStyle:{width:"24rpx",height:"24rpx"},attrs:{src:t.personsIcon,mode:"scaleToFill"}}),i("v-uni-text",{staticClass:"fs_11 ml-1"},[t._v("待审: "+t._s(e.loading_check))])],1),i("v-uni-view",{staticClass:"d-flex align-items-center mr-3"},[i("v-uni-image",{staticClass:"image",staticStyle:{width:"24rpx",height:"24rpx"},attrs:{src:t.personsIcon,mode:"scaleToFill"}}),i("v-uni-text",{staticClass:"fs_11 ml-1"},[t._v("通过: "+t._s(e.sign))])],1),i("v-uni-view",{staticClass:"d-flex align-items-center"},[i("v-uni-image",{staticClass:"image",staticStyle:{width:"24rpx",height:"24rpx"},attrs:{src:t.personsIcon,mode:"scaleToFill"}}),i("v-uni-text",{staticClass:"fs_11 ml-1"},[t._v("招聘: "+t._s(e.numbers))])],1)],1)],1)],1)],1)]})),i("uni-load-more",{attrs:{status:t.loadStatus}})],2)],1)]:[i("span",{staticClass:"bg-primary-600 fs_16 no-auth-btn",on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.goAuth.apply(void 0,arguments)}}},[t._v("请点击登录")])]],2)],1)},s=[]}}]);