<template>
	<view>
		<view class="content b-t" v-if="userInfo.verified===true&&!isedit">
			<view class="list b-b">
				<view class="wrapper">
					<view class="address-box">
						<text class="address">{{userInfo.realname}}</text>
					</view>
					<view class="u-box">
						<text class="name">{{userInfo.idnumber}}</text>
					</view>
				</view>
				<text class="yticon icon-bianji" @click="editVerified"></text>
			</view>
		</view>
		<view class="content" v-if="isedit||userInfo.verified===false">
			<view class="row b-b">
				<text class="tit">姓名</text>
				<input class="input" type="text" v-model="userInfo.realname" placeholder="请输入真实姓名" placeholder-class="placeholder" />
			</view>
			<view class="row b-b">
				<text class="tit">身份证号</text>
				<input class="input" type="text" v-model="userInfo.idnumber" placeholder="请输入身份证号" placeholder-class="placeholder" />
			</view>
			<button class="add-btn" @click="confirm">提交</button>
		</view>
	</view>
</template>
<script>
	import {
		mapState,
		mapMutations
	} from 'vuex';
	export default {
		data() {
			return {
				isedit: false
			};
		},
		computed: {
			...mapState(['hasLogin', 'userInfo'])
		},
		methods: {
			//提交
			confirm() {
				let data = this.userInfo;
				if (!/^([\u4e00-\u9fa5]+|([a-zA-Z]+\s?)+)$/.test(data.realname) || !data.realname) {
					this.$api.msg('请填写真实姓名');
					return;
				}
				if (!
					/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/
					.test(data.idnumber)) {
					this.$api.msg('请输入正确的身份证号');
					return;
				}

				//this.$api.prePage()获取上一页实例，可直接调用上页所有数据和方法，在App.vue定义
				this.$api.msg(`${this.userInfo.verified===true?'修改':'提交'}成功`);
				this.userInfo.verified=true;
				this.isedit=false;
				// setTimeout(() => {
				// 	uni.navigateBack()
				// }, 800)
			},
			editVerified(){
				this.isedit=true;
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: $page-color-base;
	}

	.content {
		position: relative;
	}

	.list {
		display: flex;
		align-items: center;
		padding: 20upx 30upx;
		;
		background: #fff;
		position: relative;
	}

	.wrapper {
		display: flex;
		flex-direction: column;
		flex: 1;
	}

	.address-box {
		display: flex;
		align-items: center;

		.tag {
			font-size: 24upx;
			color: $base-color;
			margin-right: 10upx;
			background: #fffafb;
			border: 1px solid #ffb4c7;
			border-radius: 4upx;
			padding: 4upx 10upx;
			line-height: 1;
		}

		.address {
			font-size: 30upx;
			color: $font-color-dark;
		}
	}

	.icon-bianji {
		display: flex;
		align-items: center;
		height: 80upx;
		font-size: 40upx;
		color: $font-color-light;
		padding-left: 30upx;
	}

	.u-box {
		font-size: 28upx;
		color: $font-color-light;
		margin-top: 16upx;

		.name {
			margin-right: 30upx;
		}
	}

	.row {
		display: flex;
		align-items: center;
		position: relative;
		padding: 0 30upx;
		height: 110upx;
		background: #fff;

		.tit {
			flex-shrink: 0;
			width: 150upx;
			font-size: 30upx;
			color: $font-color-dark;
			padding: 0 5upx 0 5upx;
		}

		.input {
			flex: 1;
			font-size: 30upx;
			color: $font-color-dark;
		}

		.icon-shouhuodizhi {
			font-size: 36upx;
			color: $font-color-light;
		}
	}

	.add-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 690upx;
		height: 80upx;
		margin: 60upx auto;
		font-size: $font-lg;
		color: #fff;
		background-color: $base-color;
		border-radius: 10upx;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
	}
</style>
