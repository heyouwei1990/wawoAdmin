<template>
	<div class="teamManagement container">
        <el-form  :inline="true" :model="filterForm">
          <el-form-item>
            <el-input v-model="filterForm.input" placeholder="请输入团队名称关键字搜索" prefix-icon="el-icon-search" @keyup.enter.native="getTeamList"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="getTeamList" type="primary">查询</el-button>
          </el-form-item>
          <el-form-item class="pull-right">
            <el-button @click="export2Excel">批量导出</el-button>
          </el-form-item>
        </el-form>
					<el-table :data="tableData" border class="table" ref="multipleTable" @select="handleSelectionChange">
						<el-table-column type="selection" width="40" align="center"></el-table-column>
						<el-table-column prop="id" label="序号" min-width="50"></el-table-column>
						<el-table-column prop="name" label="团队名称"></el-table-column>
						<el-table-column prop="customer_name" label="团队长"></el-table-column>
						<el-table-column prop="rank_name" label="等级"></el-table-column>
						<el-table-column prop="phone" label="手机号"></el-table-column>
						<el-table-column prop="number" label="团队人数"></el-table-column>
						<el-table-column label="人员详情" align="center">
							<template slot-scope="scope">
								<el-button type="text" icon="el-icon-view" @click="getUserDetail(scope)">查看</el-button>
							</template>
						</el-table-column>
						<el-table-column label="操作"  align="center">
							<template slot-scope="scope">
								<el-button type="text" icon="el-icon-edit-outline" @click="showTeamInfo(scope)">修改</el-button>
							</template>
						</el-table-column>
					</el-table>
					<div class="pagination">
						<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" class='page' :current-page="pageNum"
						 :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
						</el-pagination>
					</div>
		<!--人员详情弹出框-->
		<el-dialog title="人员详情" :visible.sync="dialogTableVisible">
			<el-table :data="gridData">
				<el-table-column property="customer_name" label="姓名"></el-table-column>
				<el-table-column property="gender" label="性别" :formatter="formatSex"></el-table-column>
				<el-table-column property="rank_name" label="等级"></el-table-column>
				<el-table-column property="recommend_name" label="推荐人"></el-table-column>
				<el-table-column property="recommend_phone" label="推荐人手机号"></el-table-column>
			</el-table>
		</el-dialog>
		<!--团队信息弹出框-->
		<el-dialog title="团队信息" :visible.sync="dialogFormVisible" :before-close="handleClose" >
			<el-form :model="editForm"  :label-position="labelPosition" label-width="100px" >
				<el-form-item label="团队名称">
					<el-input v-model="editForm.name"  placeholder="团队名称" style="width:300px"></el-input>
				</el-form-item>
				<el-form-item label="团队长手机号">
					<el-input v-model="editForm.phone" placeholder="团队长手机号" style="width:300px"></el-input>
					<el-button @click='getUserName'>搜索</el-button>
					<span class="red">团队长昵称：{{userName}}</span>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="updataTeam">保 存</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		data() {
			return {
        labelPosition: 'right',
				pageSize: 10,
				pageNum: 1,
				total: 0,
        filterForm:{
          input: '',
        },
				userName: '',
				dialogTableVisible: false,
				dialogFormVisible: false,
				tableData: [],
				gridData: [],
        editForm: {
					name: '',
					phone: '',
					id: '',
					customer_name: ''
				},
			}
		},
		created() {
			this.getTeamList()
		},
		methods: {
		  //翻页
			handleSizeChange(size) {
				this.pageSize = size;
				this.getTeamList()
			},
      //改变每页条目
			handleCurrentChange(currentPage) {
				this.pageNum = currentPage;
				this.getTeamList()
			},
      //多选
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			//获取团队列表信息
			getTeamList() {
				this.$http('/admin/customer/getTeamList', {
						name: this.filterForm.input,
						page: this.pageNum,
						size: this.pageSize
				}).then(res => {
					if ( res.code == 0) {
						this.tableData = res.data.list
						this.total = res.data.totalRow
					}
				})
			},
			//获取团队人员详情
			getUserDetail(scope) {
				this.dialogTableVisible = true;
				this.$http('/admin/customer/getDetails', {
						id: scope.row.id
				}).then(res => {
					if (res.code == 0) {
						this.gridData = res.data
					}
				})
			},
			//格式化性别
			formatSex: function(row, column) {
				return row.gender === 0 ? '未知' : row.gender === 1 ? '男' : '女'
			},
			//显示团队信息
			showTeamInfo(scope) {
				this.dialogFormVisible = true
				this.editForm.name = scope.row.name;
				this.editForm.phone = scope.row.phone;
				this.editForm.id = scope.row.id;
				this.editForm.customer_name = scope.row.customer_name
			},
			//根据手机号码查询用户
			getUserName() {
				this.$http('/admin/customer/getCustomerList', {
						page: '',
						size: '',
						name_or_phone: this.editForm.phone
				}).then(res => {
					if (this.editForm.phone) {
						if ( res.code == 0) {
							this.userName = res.data.list[0].customer_name;
						}
					}
				})
			},
			//弹出框关闭
			handleClose(done) {
				this.userName = '';
				done();
			},
			//保存团队信息
			updataTeam() {
				this.$http('/admin/customer/updateTeam', {
						name: this.editForm.name,
						phone: this.editForm.phone,
						id: this.editForm.id,
						customer_name: this.editForm.customer_name
				}).then(res => {
					if (res.code == 0) {
						this.$message({
							message: res.data,
							type: 'success'
						});
					} else {
						this.$message.error(res.message);
					}
					this.getTeamList();
				})
				this.userName = '';
				this.dialogFormVisible = false;
			},
      //导出
      export2Excel(){
        require.ensure([], () => {
          let { export_json_to_excel } = require('../../util/Export2Excel');
          let tHeader = ['序号','团队名称', '团队长', '等级', '手机号', '团队人数',];
          let filterVal = ['id','name', 'customer_name', 'rank_name', 'phone', 'number'];
          let list = this.tableData;
          let data = this.formatJson(filterVal, list);
           // for(var i=0;i<data.length;i++){
           //   data[i][2] = data[i][2]==''?"无":this.formatImg(data[i][2]);
           //   data[i][8] = data[i][8]==0?"0":tool.timeFormat(data[i][8]);
           // }
          export_json_to_excel(tHeader, data, '团队管理excel');
        })
      },
		}
	}
</script>

<style lang="scss">
	.teamManagement {
			.el-table .cell .el-button .el-icon-view,
			.el-table .cell .el-button .el-icon-edit-outline {
				font-size: 18px;
			}
	}
</style>
