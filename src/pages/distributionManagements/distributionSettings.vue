<template>
	<div class="distributionSettings container">
        <el-form  :inline="true" :model="searchform">
          <el-form-item>
            <el-input v-model="searchform.nickName_search" placeholder="请输入昵称搜索" prefix-icon="el-icon-search"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button >查询</el-button>
          </el-form-item>
          <el-form-item class="pull-right">
            <el-button @click="setProfit_dialog = true">设置分润比例</el-button>
          </el-form-item>
          <el-form-item class="pull-right">
            <el-button @click="confirmProfit_dialog = true">批量确认分润</el-button>
          </el-form-item>
          <el-form-item class="pull-right">
            <el-button>批量导出</el-button>
          </el-form-item>
        </el-form>

					<el-table :data="tableData" border class="table" ref="multipleTable" @select="handleSelectionChange">
						<el-table-column type="selection" width="40" align="center"></el-table-column>
						<el-table-column prop="id" label="序号" min-width="50"></el-table-column>
						<el-table-column prop="nickName" label="昵称"></el-table-column>
						<el-table-column prop="gender" label="性别"></el-table-column>
						<el-table-column prop="phone" label="手机号"></el-table-column>
						<el-table-column prop="level" label="等级"></el-table-column>
						<el-table-column prop="team_name" label="团队名称"></el-table-column>
						<el-table-column prop="team_achievement" label="团队业绩"></el-table-column>
						<el-table-column prop="self_achievement" label="个人业绩"></el-table-column>
						<el-table-column label="操作" min-width="180" align="center">
							<template slot-scope="scope">
								<el-button type="text" icon="el-icon-edit-outline" style="font-size: 18px;" @click="operation_dialog = true"></el-button>
							</template>
						</el-table-column>
					</el-table>
					<div class="pagination">
						<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" class='page' :current-page="pageNum"
						 :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
						</el-pagination>

			</div>

		<!--设置分润比例弹出框-->
		<el-dialog title="设置分润比例" :visible.sync="setProfit_dialog">
			<el-form :model="form" label-width="140px">
				<el-form-item label="分润百分比(%)">
					<el-input v-model="form.profit" placeholder="请输入分润百分比"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="setProfit_dialog = false">保 存</el-button>
			</div>
		</el-dialog>
		<!--批量确认分润	-->
		<el-dialog title="提示" :visible.sync="confirmProfit_dialog" width="30%">
			<span>是否确认进行分润</span>
			<span slot="footer" class="dialog-footer">
				<el-button @click="confirmProfit_dialog = false">取 消</el-button>
				<el-button type="primary" @click="confirmProfit_dialog = false">确 定</el-button>
			</span>
		</el-dialog>
		<!--操作弹出框-->
		<el-dialog title="录入个人业绩" :visible.sync="operation_dialog">
			<el-form :model="form1" label-width="140px">
				<el-form-item label="个人业绩金额">
					<el-input v-model="form.self_achievement" placeholder="请输入个人业绩金额"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="operation_dialog = false">保 存</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				setProfit_dialog: false,
				confirmProfit_dialog:false,
				operation_dialog:false,
				pageSize: 10,
				pageNum: 1,
				total: 0,
        searchform:{
          nickName_search: ''
        },
				tableData: [],
				form: {
					profit: ''
				},
				form1:{
					self_achievement:''
				}
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
	.distributionSettings {
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
