<template>
	<div class="homeLink container" >

        <el-form  :inline="true">
          <el-form-item class="pull-right">
            <el-button @click="addAccount_dialog = true">新增</el-button>
          </el-form-item>
        </el-form>

					<el-table :data="tableData" border class="table" ref="multipleTable" @select="handleSelectionChange">
						<el-table-column type="selection" width="40" align="center"></el-table-column>
						<el-table-column prop="id" label="序号" min-width="50"></el-table-column>
						<el-table-column prop="link_name" label="链接名称"></el-table-column>
						<el-table-column prop="link_address" label="链接地址"></el-table-column>
						<el-table-column prop="sorting" label="排序"></el-table-column>
						<el-table-column label="操作" min-width="180" align="center">
							<template slot-scope="scope">
								<el-button type="text" icon="el-icon-edit-outline" style="font-size: 18px;" @click="addAccount_dialog = true"></el-button>
								<el-button type="text" icon="el-icon-delete" style="font-size: 18px;" @click="deleteAccount_dialog = true"></el-button>
							</template>
						</el-table-column>
					</el-table>
					<div class="pagination">
						<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" class='page' :current-page="pageNum"
						 :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
						</el-pagination>
					</div>


		<!--新增链接弹出框-->
		<el-dialog title="新增链接" :visible.sync="addAccount_dialog">
			<el-form :model="form" label-width="100px">
				<el-form-item>
					<el-input v-model="form.linkName" placeholder="链接名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="form.linkAddress" placeholder="链接地址"></el-input>
				</el-form-item>
				<el-form-item>
					<el-select v-model="form.order" placeholder="顺序">
						<el-option label="1" value="1"></el-option>
						<el-option label="2" value="2"></el-option>
						<el-option label="3" value="3"></el-option>
						<el-option label="4" value="4"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="addAccount_dialog = false">保 存</el-button>
			</div>
		</el-dialog>
		<!--删除弹出框-->
		<el-dialog title="提示" :visible.sync="deleteAccount_dialog" width="30%">
			<span>是否确认删除该链接？</span>
			<span slot="footer" class="dialog-footer">
				<el-button @click="deleteAccount_dialog = false">取 消</el-button>
				<el-button type="primary" @click="deleteAccount_dialog = false">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				addAccount_dialog: false,
				deleteAccount_dialog: false,
				pageSize: 10,
				pageNum: 1,
				total: 0,
				tableData: [],
				form: {
					linkName: '',
					linkAddress: '',
					order: ''
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
	.homeLink {
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
