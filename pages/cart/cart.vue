<template>
	<view class="container">
		<view class="top_nav_segmented">
			<view class="nav_segmented">
				<text>{{title}}</text>
			</view>
			<view class="right-plus-edit" @click="editList">{{btnEdit}}</view>
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
				<block v-for="(item, index) in cartList" :key="index">
					<view class="cart-item" :class="{'b-b': index!==cartList.length-1}">
						<view class="image-wrapper">
							<image :src="item.image" :class="[item.loaded]" mode="aspectFill" lazy-load @load="onImageLoad('cartList', index)"
							 @error="onImageError('cartList', index)"></image>
							<view class="yticon icon-xuanzhong2 checkbox" :class="{checked: item.checked}" @click="check('item', index)"></view>
						</view>
						<view class="item-right">
							<text class="clamp title">{{item.title}}</text>
							<text class="attr">{{item.attr_val}}</text>
							<text class="price">¥{{item.price}}</text>
							<uni-number-box class="step" :min="1" :max="item.stock" :value="item.number>item.stock?item.stock:item.number"
							 :isMax="item.number>=item.stock?true:false" :isMin="item.number===1" :index="index" @eventChange="numberChange"></uni-number-box>
						</view>
						<text class="del-btn yticon icon-fork" @click="deleteCartItem(index)"></text>
					</view>
				</block>
			</view>
			<!-- 底部菜单栏 -->
			<view class="action-section">
				<view class="yticon icon-xuanzhong2 checkbox" :class="{checked:allChecked}" @click="check('all')"><text class="checkbox-all">全选</text></view>
				<view class="total-box" v-show="!edit">
					<text class="price">¥{{total}}</text>
					<text class="coupon">
						已优惠
						<text>74.35</text>
						元
					</text>
				</view>
				<button type="primary" class="no-border confirm-btn" @click="edit?clearCart():createOrder()">{{edit?"删除":"去结算"}}</button>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	import uniNumberBox from '@/components/uni-number-box.vue';
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	export default {
		components: {
			uniNumberBox,
			uniLoadMore
		},
		data() {
			return {
				total: 0, //总价格
				allChecked: true, //全选状态  true|false
				empty: false, //空白页显示  true|false
				loadingType: 'more', //加载更多状态
				cartList: [],
				title: '购物车',
				btnCheck: '全选',
				btnEdit: '编辑',
				edit:false
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
		//下拉刷新
		onPullDownRefresh() {
			this.loadData('refresh');
		},
		//加载更多
		onReachBottom() {
			this.loadData();
		},
		methods: {
			//请求数据
			async loadData(type = 'add') {
				let list = await this.$api.json('cartList');
				//没有更多直接返回
				if (type === 'add') {
					if (this.loadingType === 'nomore') {
						return;
					}
					this.loadingType = 'loading';
				} else {
					this.loadingType = 'more';
					this.cartList = [];
				}
				if (list.length > 0) {
					list = list.map(item => {
						item.checked = this.allChecked;
						return item;
					});
				}
				this.cartList = this.cartList.concat(list);
				this.calcTotal(); //计算总价

				//判断是否还有下一页，有是more  没有是nomore(测试数据判断大于20就没有了)
				this.loadingType = this.cartList.length > 20 ? 'nomore' : 'more';
				if (type === 'refresh') {
					uni.stopPullDownRefresh();
				}
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
			//编辑
			editList() {
				if (this.btnEdit === '编辑') {
					this.allChecked = false;
					this.btnEdit = '完成';
					this.edit=true;
					this.cartList.forEach(item=>{
						item.checked=false;
					});
				} else {
					this.btnEdit = '编辑';
					this.edit=false;
					this.calcTotal(); //计算总价
				}
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
				let selectedlist = [];
				let unselectedlist = [];
				list.forEach(item => {
					if (item.checked === true) {
						selectedlist.push(item);
					} else {
						unselectedlist.push(item);
					}
				});
				if (selectedlist.length === 0) {
					this.$api.msg('未选中商品');
					return false;
				}
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
					} else {
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
						goodsData.push(item.id);
					}
				})

				uni.navigateTo({
					url: `/pages/order/createOrder?data=${JSON.stringify(goodsData)}`
				})
				this.$api.msg('跳转下一页 sendData');
			}
		}
	}
</script>

<style lang='scss'>
	.container {
		padding-bottom: 134upx;

		/* 顶部导航栏 */
		.top_nav_segmented {
			width: 100%;
			height: 88upx;
			position: fixed;
			z-index: 99;
			top: 0;
			padding: 10upx;
			background: #fff;

			.top_left_checkall_icon {
				font-size: 34upx;
				height: 42upx;
				width: 42upx;
				float: left;
				margin-left: 19upx;
				top: 25upx;
				display: inline-block;
				color: $font-color-light;
			}

			.nav_segmented {
				display: inline-block;
				font-weight: 700;
				line-height: 44px;
				margin-left: 40%;
			}

			.right-plus-check {
				display: inline-block;
				margin-right: 20upx;
				float: right;
				font-size: 28upx;
				line-height: 44px;
			}

			.right-plus-edit {
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
	.cart-list {
		margin-top: 88upx;
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

		.del-btn {
			padding: 4upx 10upx;
			font-size: 34upx;
			height: 50upx;
			color: $font-color-light;
		}
	}

	/* 底部栏 */
	.action-section {
		/* #ifdef H5 */
		/* #endif */
		position: fixed;
		bottom: 100upx;
		z-index: 95;
		display: flex;
		align-items: center;
		width: 100%;
		height: 100upx;
		padding: 0 20upx;
		background: rgba(255, 255, 255, .9);
		box-shadow: 0 0 20upx 0 rgba(0, 0, 0, .5);

		.checkbox {
			position: relative;
			z-index: 8;
			font-size: 44upx;
			line-height: 62upx;
			vertical-align: middle;
			padding: 4upx;
			color: $font-color-disabled;
			background: #fff;
			border-radius: 50px;
			.checkbox-all{
				font-size: 30upx;
				color: #303133;
			}
		}
		

		.clear-btn {
			position: absolute;
			left: 26upx;
			top: 0;
			z-index: 4;
			width: 0;
			height: 52upx;
			line-height: 52upx;
			padding-left: 38upx;
			font-size: $font-base;
			color: #fff;
			background: $font-color-disabled;
			border-radius: 50upx;
			opacity: 0;
			transition: .2s;
			background: $uni-color-primary;

			&.show {
				opacity: 1;
				width: 120upx;
			}
		}

		.total-box {
			flex: 1;
			display: flex;
			flex-direction: column;
			text-align: right;
			padding-right: 40upx;

			.price {
				font-size: $font-lg;
				color: $font-color-dark;
			}

			.coupon {
				font-size: $font-sm;
				color: $font-color-light;

				text {
					color: $font-color-dark;
				}
			}
		}

		.confirm-btn {
			padding: 0 38upx;
			display: inline-block;
			margin-right: 10upx;
			border-radius: 100px;
			height: 76upx;
			line-height: 76upx;
			font-size: $font-base + 2upx;
			background: $uni-color-primary;
			box-shadow: 1px 2px 5px rgba(217, 60, 93, 0.72)
		}
	}

	/* 复选框选中状态 */
	.action-section .checkbox.checked,
	.cart-item .checkbox.checked {
		color: $uni-color-primary;
	}
</style>
