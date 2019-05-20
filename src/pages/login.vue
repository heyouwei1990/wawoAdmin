<template>
	<div class="login-page">
		<div class="logo"></div>
		<div class="login-area">
			<div class="title">登录</div>
			<el-form :model="loginForm" ref="loginForm" :rules="rules" label-position="left">
				<el-form-item label="用户名" prop="phone">
					<el-input v-model="loginForm.phone" placeholder="请输入用户名"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="password">
					<el-input v-model="loginForm.password" placeholder="请输入密码"></el-input>
				</el-form-item>
				<el-button type="primary" class="btn-login" @click="login">登录</el-button>
			</el-form>
		</div>
	</div>
</template>

<script>
  import tool from '@/util/tool'
	export default {
		data() {
			return {
				loginForm: {
					phone: '',
					password: ''
				},
				rules: {
					phone: [{
						required: true,
						message: '请输入用户名',
						trigger: 'blur'
					}],
					password: [{
						required: true,
						message: '请输入密码',
						trigger: 'blur'
					}]
				}
			}
		},
		created() {
			var loginInfo = JSON.parse(tool.getLocal('loginInfo'));
			if(loginInfo){
			  this.loginForm.phone=loginInfo.phone || '';
        this.loginForm.password=loginInfo.password || '';
      }

		},
		methods: {
			login() {
				this.$refs['loginForm'].validate(valid => {
					if (valid) {
						tool.setLocal('loginInfo', this.loginForm);
						this.$http('/admin/customer/login', this.loginForm,'post').then(r => {
              if(r.code==0){
                this.$store.commit('setUser',r.data);
                tool.setLocal('userInfo', r.data);
                this.$message.success('登录成功');
                tool.setSession('Jwt',r.data.Jwt);
                this.$router.push({
                  path: '/'
                })
              }else{
                this.$message.err(r.message);
              }
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.login-page {
		position: fixed;
		width: 100%;
		height: 100%;
		overflow: hidden;
		background: linear-gradient(blue, lightblue);

		//background:url("../../static/login-bg.jpg") no-repeat center /cover;
		.logo {
			position: absolute;
			left: 50%;
			top: 12%;
			width: 140px;
			height: 140px;
			background-color: #aff;
			border-radius: 50%;
			margin-left: -70px;
		}

		.login-area {
			width: 500px;
			//height:340px;
			position: absolute;
			left: 50%;
			top: 50%;
			z-index: 2;
			margin-left: -250px;
			margin-top: -170px;
			background-color: #fff;
			border-radius: 10px;
			padding: 20px 40px;
			box-sizing: border-box;
		}

		.title {
			font-size: 20px;
			font-weight: 600;
			color: #333;
			line-height: 2;
			text-align: center;
			margin-bottom: 20px;
		}

		.btn-login {
			margin-bottom: 20px;
			margin-top: 30px;
			display: block;
			width: 100%;
		}
	}
</style>
