<template>
	<div class="photoManagement">
		<el-container>
			<el-header>
				<el-row>
					<el-col :span="2">
						<span style="padding-left: 10px;" class="text">业绩列表</span>
					</el-col>
					<el-col :span="4">
						<el-input v-model="search" placeholder="请输入用户姓名或手机号关键字搜索" prefix-icon="el-icon-search"></el-input>
					</el-col>
					<el-col :span="2" :offset="16">
						<el-button>批量导出</el-button>
					</el-col>
				</el-row>
			</el-header>
			<div class="container">
				<el-main>
					<el-table :data="tableData" border class="table" ref="multipleTable" @select="handleSelectionChange">
						<el-table-column type="selection" width="40" align="center"></el-table-column>
						<el-table-column prop="id" label="序号" min-width="50"></el-table-column>
						<el-table-column prop="team_name" label="团队名称"></el-table-column>
						<el-table-column prop="team_achievement" label="团队业绩"></el-table-column>
						<el-table-column prop="self_achievement" label="个人业绩"></el-table-column>
						<el-table-column prop="username" label="姓名"></el-table-column>
						<el-table-column prop="gender" label="性别"></el-table-column>
						<el-table-column prop="phone" label="手机号"></el-table-column>
						<el-table-column prop="level" label="等级"></el-table-column>
					</el-table>
					<div class="pagination">
						<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" class='page' :current-page="pageNum"
						 :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
						</el-pagination>
					</div>
				</el-main>
			</div>
		</el-container>

	</div>
</template>

<script>
	export default {
		data() {
			return {
				pageSize: 10,
				pageNum: 1,
				total: 0,
				search:'',
				tableData: []
			}
		},
		methods: {
			handleSizeChange(val) {
				console.log(`每页 ${val} 条`);
			},
			handleCurrentChange(val) {
				console.log(`当前页: ${val}`);
			},
			handleSelectionChange(val) {
				this.multipleSelection = val;
			}
		}
	}
</script>

<style lang='scss'>
	.photoManagement {
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
			.title {
				font-size: 15px;
				padding-bottom: 20px;
			}
		}
	}
</style>
