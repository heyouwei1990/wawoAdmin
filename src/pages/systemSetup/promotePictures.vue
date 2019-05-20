<template>
	<div class="promotePictures container">

        <el-form  :inline="true">
          <el-form-item class="pull-right">
            <el-button @click="addAccount_dialog = true">新增</el-button>
          </el-form-item>
        </el-form>

					<el-table :data="tableData" border class="table" ref="multipleTable" @select="handleSelectionChange">
						<el-table-column type="selection" width="40" align="center"></el-table-column>
						<el-table-column prop="id" label="序号" min-width="50"></el-table-column>
						<el-table-column prop="picture" label="图片"></el-table-column>
						<el-table-column prop="send_time" label="发送时间"></el-table-column>
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



		<!--新增图片弹出框-->
		<el-dialog title="新增图片" :visible.sync="addAccount_dialog">
			<el-form :model="form" label-width="100px">	
					<el-form-item label="上传图片">
						<input type="file">
					</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="addAccount_dialog = false">保 存</el-button>
			</div>
		</el-dialog>
		<!--删除弹出框-->
		<el-dialog title="提示" :visible.sync="deleteAccount_dialog" width="30%">
			<span>是否确认删除该图片？</span>
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
	.promotePictures {
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
