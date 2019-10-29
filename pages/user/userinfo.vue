<template>
	<view class="content">
		<view class="user-section">
			<image class="bg" src="/static/user-bg.jpg"></image>
			<text class="bg-upload-btn yticon icon-paizhao"></text>
			<view class="portrait-box">
				<image class="portrait" :src="userInfo.portrait" :onerror="portraitError" @click="upload"></image>
				<text class="pt-upload-btn yticon icon-paizhao"></text>
			</view>
		</view>

		<view class="row b-b">
			<text class="tit">用户名</text>
			<input class="input" type="text" v-model="userInfo.nickname" placeholder="用户名" placeholder-class="placeholder" />
		</view>
		<view class="row b-b">
			<text class="tit">手机号</text>
			<input class="input" type="text" v-model="userInfo.mobile" placeholder="手机号" placeholder-class="placeholder" />
		</view>
		<button class="add-btn" @click="confirm">提交</button>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	export default {
		data() {
			return {
				portraitError:'this.src="'+require('../../static/missing-face.png')+'"',
				uploadUrl:''
			};
		},
		computed: {
			...mapState(['hasLogin','userInfo'])
		},
		async onLoad(){
			let urls=await this.$api.json('urls');
			this.uploadUrl=urls.uploadUrl;
			console.log(this.uploadUrl);
		},
		methods: {
			//提交
			confirm() {
				let data = this.userInfo;
				console.log(data);
				if (!data.nickname) {
					this.$api.msg('请填写用户名');
					return;
				}
				if (!/(^1[3|4|5|7|8][0-9]{9}$)/.test(data.mobile)) {
					this.$api.msg('请输入正确的手机号码');
					return;
				}

				//this.$api.prePage()获取上一页实例，可直接调用上页所有数据和方法，在App.vue定义
				this.$api.msg(`修改成功`);
				setTimeout(() => {
					uni.navigateBack()
				}, 800)
			},
			upload() {
				let data = this.userInfo;
				let url=this.uploadUrl;
				uni.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: function(res) {
						const tempFilePaths = res.tempFilePaths;
						const uploadTask = uni.uploadFile({
							url: url,
							filePath: tempFilePaths[0],
							name: 'file',
							formData: {
								'action': 'uploadAvatar',
								'file':tempFilePaths[0]
							},
							success: function(result) {
								console.log(url);
								const src=JSON.parse(result.data);
								if(src.OK){
								data.portrait=src.Message;
								uni.showToast({
									title:'上传成功',
									duration:1500,
									icon:'none'
								});
								}else{
									uni.showToast({
										title:src.Message,
										duration:1500,
										icon:'none'
									});
								}
							},
							error:function(e){
								this.$api.msg(e.Message);
							}
						});
					},
					error: function(e) {
						console.log(e);
					},
				});
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: $page-color-base;
	}

	.user-section {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 460upx;
		padding: 40upx 30upx 0;
		position: relative;

		.bg {
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			filter: blur(1px);
			opacity: .7;
		}

		.portrait-box {
			width: 200upx;
			height: 200upx;
			border: 6upx solid #fff;
			border-radius: 50%;
			position: relative;
			z-index: 2;
		}

		.portrait {
			position: relative;
			width: 100%;
			height: 100%;
			border-radius: 50%;
		}

		.yticon {
			position: absolute;
			line-height: 1;
			z-index: 5;
			font-size: 48upx;
			color: #fff;
			padding: 4upx 6upx;
			border-radius: 6upx;
			background: rgba(0, 0, 0, .4);
		}

		.pt-upload-btn {
			right: 0;
			bottom: 10upx;
		}

		.bg-upload-btn {
			right: 20upx;
			bottom: 16upx;
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
			width: 120upx;
			font-size: 30upx;
			color: $font-color-dark;
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
