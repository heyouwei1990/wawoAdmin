<template>
	<div class="distributionManagement container">
        <el-form  :inline="true" :model="searchform">
          <el-form-item>
            <el-input v-model="searchform.nickName_search" placeholder="请输入昵称搜索" prefix-icon="el-icon-search"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button >查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-select v-model="searchform.secret_status" placeholder="全部团队">

            </el-select>
          </el-form-item>
          <el-form-item class="pull-right">
            <el-button>批量导出</el-button>
          </el-form-item>
        </el-form>


					<el-table :data="tableData" border class="table" ref="multipleTable" @select="handleSelectionChange">
						<el-table-column type="selection" width="40" align="center"></el-table-column>
						<el-table-column prop="id" label="序号" min-width="50"></el-table-column>
						<el-table-column prop="team_name" label="团队名称"></el-table-column>
						<el-table-column prop="nickName" label="昵称"></el-table-column>
						<el-table-column prop="gender" label="性别"></el-table-column>
						<el-table-column prop="phone" label="手机号"></el-table-column>
						<el-table-column prop="level" label="等级"></el-table-column>
						<el-table-column prop="recommender" label="推荐人"></el-table-column>
						<el-table-column prop="profit_amount" label="分润金额"></el-table-column>
						<el-table-column prop="profit_time" label="分润时间"></el-table-column>
					</el-table>
					<div class="pagination">
						<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" class='page' :current-page="pageNum"
						 :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
						</el-pagination>
					</div>


		
	</div>
</template>

<script>
	export default {
		data() {
			return {
				pageSize: 10,
				pageNum: 1,
				total: 0,
        searchform:{
          nickName_search: '',
          secret_status:''
        },
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
	.distributionManagement {
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
