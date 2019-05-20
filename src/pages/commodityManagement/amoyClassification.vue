<template>
	<div class="amoyClassification">
		<el-container>
			<el-header>
				<el-row>
					<el-col :span="2">
						<span style="padding-left: 10px;" class="text">分类列表</span>
					</el-col>
					<el-col :span='4'>
						<el-input v-model="classification_search" placeholder="请输入分类名称搜索" prefix-icon="el-icon-search"></el-input>
					</el-col>
					<el-col :span="2" :offset="14">
						<el-button @click="addClassification_dialog = true">新增分类</el-button>
					</el-col>
					<el-col :span="2">
						<el-button>批量导出</el-button>
					</el-col>
				</el-row>
			</el-header>
			<div class="container">
				<el-main>
					<el-table :data="tableData" style="width: 100%" row-key="id" border lazy :load="load">
						<el-table-column prop="classification_name" label="分类名称" width="180">
						</el-table-column>
						<el-table-column prop="commodity_num" label="商品数量" width="180">
						</el-table-column>
						<el-table-column prop="sorting" label="排序">
						</el-table-column>
						<el-table-column prop="classification_cover" label="分类封面"></el-table-column>
						<el-table-column label="操作" min-width="180" align="center">
							<template slot-scope="scope">
								<el-button type="text" icon="el-icon-edit-outline" style="font-size: 18px;" @click="changeClassification_dialog = true"></el-button>
								<el-button type="text" icon="el-icon-delete" style="font-size: 18px;" @click="delete_dialog = true"></el-button>
							</template>
						</el-table-column>
					</el-table>
					<div class="pagination">
						<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" class='page' :current-page="pageNum"
						 :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
						</el-pagination>
					</div>
				</el-main>
			</div>
		</el-container>
		<!--新增分类弹出框-->
		<el-dialog title="新增分类" :visible.sync="addClassification_dialog" width="30%">
			<el-form :model="form" label-width="80px">
				<el-form-item label="分类名称">
					<el-input v-model="form.classification_name" placeholder="请输入分类名称"></el-input>
				</el-form-item>
				<el-form-item label="分类">
					<el-select v-model="form.classification" placeholder="请选择分类">
						<el-option label="上级分类" value="shangjifenlei"></el-option>
						<el-option label="顶级分类" value="dingjifenlei"></el-option>
						<el-option label="男装" value="nanzhuang"></el-option>
						<el-option label="女装" value="nvzhuang"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="分类封面">

				</el-form-item>
				<el-form-item label="排序">
					<el-select v-model="form.sorting" placeholder="请选择排序">
						<el-option label="1" value="1"></el-option>
						<el-option label="2" value="2"></el-option>
						<el-option label="3" value="3"></el-option>
						<el-option label="4" value="4"></el-option>
						<el-option label="5" value="5"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="addClassification_dialog = false">保 存</el-button>
			</span>
		</el-dialog>
		<!--修改分类弹出框-->
		<el-dialog title="修改分类信息" :visible.sync="changeClassification_dialog" width="30%">
			<el-form :model="form1" label-width="80px">
				<el-form-item label="分类名称">
					<el-input v-model="form1.classification_name" placeholder="请输入分类名称"></el-input>
				</el-form-item>
				<el-form-item label="分类">
					<el-select v-model="form1.classification" placeholder="请选择分类">
						<el-option label="上级分类" value="shangjifenlei"></el-option>
						<el-option label="顶级分类" value="dingjifenlei"></el-option>
						<el-option label="男装" value="nanzhuang"></el-option>
						<el-option label="女装" value="nvzhuang"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="分类封面">

				</el-form-item>
				<el-form-item label="排序">
					<el-select v-model="form1.sorting" placeholder="请选择排序">
						<el-option label="1" value="1"></el-option>
						<el-option label="2" value="2"></el-option>
						<el-option label="3" value="3"></el-option>
						<el-option label="4" value="4"></el-option>
						<el-option label="5" value="5"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="changeClassification_dialog = false">保 存</el-button>
			</span>
		</el-dialog>
		<!--删除弹出框-->
		<el-dialog title="提示" :visible.sync="delete_dialog" width="30%">
			<span>是否删除该分类？</span>
			<span slot="footer" class="dialog-footer">
				<el-button @click="delete_dialog = false">取 消</el-button>
				<el-button type="primary" @click="delete_dialog = false">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				pageSize: 10,
				pageNum: 1,
				total: 0,
				addClassification_dialog: false,
				changeClassification_dialog: false,
				delete_dialog: false,
				classification_search: '',
				tableData: [],
				form: {
					classification_name: '',
					classification: '',
					sorting: ''
				},
				form1: {
					classification_name: '',
					classification: '',
					sorting: ''
				}
			}
		},
		
		methods: {
			load(tree, treeNode, resolve) {
				resolve([{
					id: 31,
					classification_name: '张三'
				}, {
					id: 32,
					classification_name: '李四'
				}])
			},
			handleSizeChange(size) {
				this.pageSize = size;
			},
			handleCurrentChange(currentPage) {
				this.pageNum = currentPage;
			},
			
		}
	}
</script>

<style lang='scss'>
	.amoyClassification {
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
