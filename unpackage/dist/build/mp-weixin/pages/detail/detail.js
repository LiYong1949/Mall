(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/detail/detail"],{"2e5f":function(t,e,n){},"2fde":function(t,e,n){"use strict";var a=function(){var t=this,e=t.$createElement;t._self._c},r=[];n.d(e,"a",function(){return a}),n.d(e,"b",function(){return r})},3386:function(t,e,n){"use strict";n.r(e);var a=n("b6e2"),r=n.n(a);for(var i in a)"default"!==i&&function(t){n.d(e,t,function(){return a[t]})}(i);e["default"]=r.a},"45b5":function(t,e,n){"use strict";var a=n("2e5f"),r=n.n(a);r.a},"5a9b":function(t,e,n){"use strict";n.r(e);var a=n("2fde"),r=n("3386");for(var i in r)"default"!==i&&function(t){n.d(e,t,function(){return r[t]})}(i);n("45b5");var s=n("2877"),u=Object(s["a"])(r["default"],a["a"],a["b"],!1,null,null,null);e["default"]=u.exports},"8fbd":function(t,e,n){"use strict";(function(t){n("beb4"),n("921b");a(n("66fd"));var e=a(n("5a9b"));function a(t){return t&&t.__esModule?t:{default:t}}t(e.default)}).call(this,n("543d")["createPage"])},b6e2:function(t,e,n){"use strict";(function(t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var a=r(n("a34a"));function r(t){return t&&t.__esModule?t:{default:t}}function i(t,e,n,a,r,i,s){try{var u=t[i](s),o=u.value}catch(c){return void n(c)}u.done?e(o):Promise.resolve(o).then(a,r)}function s(t){return function(){var e=this,n=arguments;return new Promise(function(a,r){var s=t.apply(e,n);function u(t){i(s,a,r,u,o,"next",t)}function o(t){i(s,a,r,u,o,"throw",t)}u(void 0)})}}var u=function(){return n.e("components/share").then(n.bind(null,"913f"))},o={components:{share:u},data:function(){return{loaded:!1,currentEpd:1,data:{guessList:[{},{},{},{}]},shareList:[]}},onLoad:function(){var e=s(a.default.mark(function e(){var n,r;return a.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,this.$api.json("detailData");case 2:return n=e.sent,e.next=5,this.$api.json("shareList");case 5:r=e.sent,this.loaded=!0,this.data=n,this.shareList=r,t.setNavigationBarTitle({title:n.title});case 10:case"end":return e.stop()}},e,this)}));function n(){return e.apply(this,arguments)}return n}(),methods:{imageOnLoad:function(t,e){this.$set(this.data[t][e],"loaded","loaded")},changeEpd:function(t){var e=this.data.episodeList,n=e[t];this.$api.msg("切换到第".concat(n,"项")),this.currentEpd=n},share:function(){this.$refs.share.toggleMask()},favorite:function(){this.data.favorite=!this.data.favorite}},onBackPress:function(){if(this.$refs.share.show)return this.$refs.share.toggleMask(),!0}};e.default=o}).call(this,n("543d")["default"])}},[["8fbd","common/runtime","common/vendor"]]]);