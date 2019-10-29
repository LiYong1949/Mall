<template>
	<view class="container">
		<view class="top_nav_segmented">
			<view class="left-nav-icon" @click="back"></view>
			<view class="nav_segmented">
				<text>{{title}}</text>
			</view>
			<view class="right-plus-edit" @click="editList">{{btnEdit}}</view>
			<view class="right-plus-check" v-show="edit" @click="check('all')">{{btnCheck}}</view>
		</view>
		<!-- 空白页 -->
		<view v-if="!hasLogin || empty===true" class="empty">
			<image src="/static/emptyCart.jpg" mode="aspectFit"></image>
			<view v-if="hasLogin" class="empty-tips">
				空空如也
				<navigator class="navigator" v-if="hasLogin" url="../index/index" open-type="switchTab">随便逛逛></navigator>
			</view>
			<view v-else class="empty-tips">
				空空如也
				<view class="navigator" @click="navToLogin">去登陆></view>
			</view>
		</view>
		<view v-else>
			<!-- 列表 -->
			<view class="cart-list">
				<block v-for="(item, index) in cartList" :key="item.id">
					<view class="cart-item" :class="{'b-b': index!==cartList.length-1}">
						<view class="image-wrapper">
							<image :src="item.image" :class="[item.loaded]" mode="aspectFill" lazy-load @load="onImageLoad('cartList', index)"
							 @error="onImageError('cartList', index)"></image>
							<view class="yticon icon-xuanzhong2 checkbox" v-if="edit" :class="{checked: item.checked}" @click="check('item', index)"></view>
						</view>
						<view class="item-right">
							<text class="clamp title">{{item.title}}</text>
							<text class="attr">{{item.attr_val}}</text>
							<text class="price">¥{{item.price}}</text>
						</view>
						<text class="del-btn yticon icon-fork" @click="deleteCartItem(index)"></text>
					</view>
				</block>
			</view>
			<!-- 底部菜单栏 -->
			<view class="clear-btn" v-if="del" @click="clearCart">
				删除
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	import uniNumberBox from '@/components/uni-number-box.vue'
	export default {
		components: {
			uniNumberBox
		},
		data() {
			return {
				total: 0, //总价格
				allChecked: true, //全选状态  true|false
				empty: false, //空白页显示  true|false
				cartList: [],
				edit: false,
				del: false,
				title:'收藏',
				btnCheck:'全选',
				btnEdit:'编辑'
			};
		},
		onLoad() {
			this.loadData();
		},
		watch: {
			//显示空白页
			cartList(e) {
				let empty = e.length === 0 ? true : false;
				if (this.empty !== empty) {
					this.empty = empty;
				}
			}
		},
		computed: {
			...mapState(['hasLogin'])
		},
		methods: {
			//请求数据
			async loadData() {
				let list = await this.$api.json('cartList');
				let cartList = list.map(item => {
					item.checked = true;
					return item;
				});
				this.cartList = cartList;
				this.calcTotal(); //计算总价
				
			},
			//监听image加载完成
			onImageLoad(key, index) {
				this.$set(this[key][index], 'loaded', 'loaded');
			},
			//监听image加载失败
			onImageError(key, index) {
				this[key][index].image = '/static/errorImage.jpg';
			},
			navToLogin() {
				uni.navigateTo({
					url: '/pages/public/login'
				})
			},
			editList(e){
				if(this.btnEdit==='编辑'){
					this.edit=true;
					this.del=true;
					this.btnEdit='完成';
					this.cartList.forEach(item=>{
						item.checked=true;
					});
				}else{
				this.btnEdit='编辑';
				this.edit=false;
				this.del=false;
				}
			},
			back(){
				uni.navigateBack();
			},
			//选中状态处理
			check(type, index) {
				if (type === 'item') {
					this.cartList[index].checked = !this.cartList[index].checked;
				} else {
					const checked = !this.allChecked
					const list = this.cartList;
					list.forEach(item => {
						item.checked = checked;
					})
					this.allChecked = checked;
				}
				this.calcTotal(type);
			},
			//数量
			numberChange(data) {
				this.cartList[data.index].number = data.number;
				this.calcTotal();
			},
			//删除
			deleteCartItem(index) {
				let list = this.cartList;
				let row = list[index];
				let id = row.id;

				this.cartList.splice(index, 1);
				this.calcTotal();
				uni.hideLoading();
			},
			//删除选中
			clearCart() {
				let list = this.cartList;
				let selectedlist=[];
				list.forEach(item => {
					if (item.checked === true) {
						selectedlist.push(item);
					}
				});
				if(selectedlist.length===0){
					this.$api.msg('未选中商品');
					return false;
				}
				let unselectedlist = [];
				list.forEach(item => {
					if (item.checked === false) {
						unselectedlist.push(item);
					}
				});
				uni.showModal({
					content: '删除选中购物车？',
					success: (e) => {
						if (e.confirm) {
							this.cartList = unselectedlist;
						}
					}
				})
			},
			//计算总价
			calcTotal() {
				let list = this.cartList;
				if (list.length === 0) {
					this.empty = true;
					return;
				}
				let total = 0;
				let checked = true;
				list.forEach(item => {
					if (item.checked === true) {
						total += item.price * item.number;
					} else if (checked === true) {
						checked = false;
					}
				})
				this.allChecked = checked;
				this.total = Number(total.toFixed(2));
			},
			//创建订单
			createOrder() {
				let list = this.cartList;
				let goodsData = [];
				list.forEach(item => {
					if (item.checked) {
						goodsData.push({
							attr_val: item.attr_val,
							number: item.number
						})
					}
				})

				uni.navigateTo({
					url: `/pages/order/createOrder?data=${JSON.stringify({
						goodsData: goodsData
					})}`
				})
				this.$api.msg('跳转下一页 sendData');
			}
		},

	}
</script>

<style lang='scss'>
	.container {
		padding-bottom: 134upx;

		.top_nav_segmented {
			width: 100%;
			height: 88upx;
			position: fixed;
			z-index: 99;
			top: 0;
			background: #fff;
			.left-nav-icon{
				content: " ";
				height: 25upx;
				width: 25upx;
				border-bottom: 2upx solid #303133;
				border-left: 2upx solid #303133;
				transform: rotate(45deg);
				float: left;
				margin-left: 30upx;
				margin-top: 30upx;
			}
			.nav_segmented{
				display: inline-block;
				font-weight: 700;
				line-height: 44px;
				margin-left:40%;
			}
			.right-plus-check{
				display: inline-block;
				margin-right: 20upx;
				float: right;
				font-size: 28upx;
				line-height: 44px;
			}
			.right-plus-edit{
				display: inline-block;
				margin-right: 20upx;
				float: right;
				font-size: 28upx;
				line-height: 44px;
			}
		}

		/* 空白页 */
		.empty {
			position: fixed;
			left: 0;
			margin-top: 88upx;
			width: 100%;
			height: 100vh;
			padding-bottom: 100upx;
			display: flex;
			justify-content: center;
			flex-direction: column;
			align-items: center;
			background: #fff;

			image {
				width: 240upx;
				height: 160upx;
				margin-bottom: 30upx;
			}

			.empty-tips {
				display: flex;
				font-size: $font-sm+2upx;
				color: $font-color-disabled;

				.navigator {
					color: $uni-color-primary;
					margin-left: 16upx;
				}
			}
		}
	}

	/* 购物车列表项 */
	.cart-list{
		margin-top:88upx;
	}
	
	.cart-item {
		display: flex;
		position: relative;
		padding: 30upx 40upx;

		.image-wrapper {
			width: 230upx;
			height: 230upx;
			flex-shrink: 0;
			position: relative;

			image {
				border-radius: 8upx;
			}
		}

		.checkbox {
			position: absolute;
			left: -16upx;
			top: -16upx;
			z-index: 8;
			font-size: 44upx;
			line-height: 1;
			padding: 4upx;
			color: $font-color-disabled;
			background: #fff;
			border-radius: 50px;
		}

		.item-right {
			display: flex;
			flex-direction: column;
			flex: 1;
			overflow: hidden;
			position: relative;
			padding-left: 30upx;

			.title,
			.price {
				font-size: $font-base + 2upx;
				color: $font-color-dark;
				height: 40upx;
				line-height: 40upx;
			}

			.attr {
				font-size: $font-sm + 2upx;
				color: $font-color-light;
				height: 50upx;
				line-height: 50upx;
			}

			.price {
				height: 50upx;
				line-height: 50upx;
			}
		}

		
	}

	/* 底部删除 */

	.clear-btn {
		position: fixed;
		right: 30upx;
		bottom: 30upx;
		text-align: center;
		z-index: 10;
		width: 100upx;
		height: 52upx;
		line-height: 52upx;
		font-size: $font-base;
		color: #fff;
		background: #e06666;
		border-radius: 50upx;
	}


	/* 复选框选中状态 */
	.action-section .checkbox.checked,
	.cart-item .checkbox.checked {
		color: $uni-color-primary;
	}
</style>
