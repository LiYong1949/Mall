(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/address/addressManage"],{"06df":function(a,e,t){"use strict";t.r(e);var n=t("52e8"),s=t("a20f");for(var i in s)"default"!==i&&function(a){t.d(e,a,function(){return s[a]})}(i);t("9a6e");var r=t("2877"),d=Object(r["a"])(s["default"],n["a"],n["b"],!1,null,null,null);e["default"]=d.exports},"456e":function(a,e,t){"use strict";(function(a){t("beb4"),t("921b");n(t("66fd"));var e=n(t("06df"));function n(a){return a&&a.__esModule?a:{default:a}}a(e.default)}).call(this,t("543d")["createPage"])},"52e8":function(a,e,t){"use strict";var n=function(){var a=this,e=a.$createElement;a._self._c},s=[];t.d(e,"a",function(){return n}),t.d(e,"b",function(){return s})},"9a6e":function(a,e,t){"use strict";var n=t("f580"),s=t.n(n);s.a},a20f:function(a,e,t){"use strict";t.r(e);var n=t("dcea"),s=t.n(n);for(var i in n)"default"!==i&&function(a){t.d(e,a,function(){return n[a]})}(i);e["default"]=s.a},dcea:function(a,e,t){"use strict";(function(a){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var t={data:function(){return{addressData:{name:"",mobile:"",addressName:"在地图选择",address:"",area:"",default:!1}}},onLoad:function(e){var t="新增收货地址";"edit"===e.type&&(t="编辑收货地址",this.addressData=JSON.parse(e.data)),this.manageType=e.type,a.setNavigationBarTitle({title:t})},methods:{switchChange:function(a){this.addressData.default=a.detail},chooseLocation:function(){var e=this;a.chooseLocation({success:function(a){e.addressData.addressName=a.name,e.addressData.address=a.name}})},confirm:function(){var e=this.addressData;e.name?/(^1[3|4|5|7|8][0-9]{9}$)/.test(e.mobile)?e.address?e.area?(this.$api.prePage().refreshList(e,this.manageType),this.$api.msg("地址".concat("edit"==this.manageType?"修改":"添加","成功")),setTimeout(function(){a.navigateBack()},800)):this.$api.msg("请填写门牌号信息"):this.$api.msg("请在地图选择所在位置"):this.$api.msg("请输入正确的手机号码"):this.$api.msg("请填写收货人姓名")}}};e.default=t}).call(this,t("543d")["default"])},f580:function(a,e,t){}},[["456e","common/runtime","common/vendor"]]]);