<template>
	<div class="commodityInformation">
		<el-container>
			<el-header>
				<el-row>
					<el-col :span="24">
						<el-button icon="el-icon-back" type="text" style="font-size: 18px;" @click="returnRouter"></el-button>
						<span style="padding-left: 10px;" class="text">分润信息</span>
					</el-col>
				</el-row>
			</el-header>
			<div class="container">
				<el-main>
					<el-table :data="tableData" border class="table" ref="multipleTable" @select="handleSelectionChange">
						<el-table-column prop="nickName" label="昵称"></el-table-column>
						<el-table-column prop="gender" label="性别"></el-table-column>
						<el-table-column prop="phone" label="手机号"></el-table-column>
						<el-table-column prop="level" label="等级"></el-table-column>
						<el-table-column prop="affiliated_team" label="所属团队"></el-table-column>
						<el-table-column prop="profit_num" label="分润金额"></el-table-column>
					</el-table>
				</el-main>
			</div>


		</el-container>

	</div>
</template>

<script>
	export default {
		data() {
			return {
				tableData: [{
					nickName: '张三',
					gender: '男',
					phone: '13999999999',
					level: 'VIP',
					affiliated_team: 'xxxxx',
					profit_num: '0'
				}]
			}
		},
		methods: {
			returnRouter() {
				this.$router.go(-1);
			},
			handleSelectionChange(val) {
				this.multipleSelection = val;
			}
		}
	}
</script>

<style lang="scss">
	.commodityInformation {
		.el-header {
			background-color: white;
			padding: 10px 30px;
			margin-bottom: 6px;

			.text {
				font-size: 15px;
				box-sizing: border-box;
				padding-right: 30px;
				line-height: 40px;
			}
		}

		.container {
			padding: 0;

			.title {
				font-size: 15px;
				padding-bottom: 20px;
			}

			.demonstration {
				text-align: right;
				float: left;
				font-size: 14px;
				color: #606266;
				line-height: 40px;
				padding: 0 12px 0 0;
				-webkit-box-sizing: border-box;
				box-sizing: border-box;
			}
		}

		.el-footer {
			background-color: white;
			padding: 10px 30px;
			margin-top: 6px;
		}
	}
</style>
