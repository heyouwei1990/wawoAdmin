<template>
	<div class="amoyProducts">
		<el-container>
			<el-header>
				<el-row>
					<el-col :span="2">
						<span style="padding-left: 10px;" class="text">商品列表</span>
					</el-col>
					<el-col :span='4'>
						<el-input v-model="classification_search" placeholder="请输入商品名称搜索" prefix-icon="el-icon-search"></el-input>
					</el-col>
					<el-col :span='4' :offset='1'>
						<el-select v-model="first_classification" placeholder="一级分类">

						</el-select>
					</el-col>
					<el-col :span='4'>
						<el-select v-model="second_classification" placeholder="二级分类">

						</el-select>
					</el-col>
					<el-col :span="2" :offset='3'>
						<el-button @click="deleteAll_dialog = true">批量删除</el-button>
					</el-col>
					<el-col :span="2">
						<el-button>批量导出</el-button>
					</el-col>
					<el-col :span="2">
						<el-button @click="add_commodity = true">新增商品</el-button>
					</el-col>
				</el-row>
			</el-header>
			<div class="container">
				<el-main>
					<el-table :data="tableData" border class="table" ref="multipleTable" @select="handleSelectionChange">
						<el-table-column type="selection" width="40" align="center"></el-table-column>
						<el-table-column prop="id" label="序号" min-width="50"></el-table-column>
						<el-table-column prop="mall_name" label="商品名称"></el-table-column>
						<el-table-column prop="classification" label="所属分类"></el-table-column>
						<el-table-column prop="original_price" label="原价"></el-table-column>
						<el-table-column prop="present_price" label="现价"></el-table-column>
						<el-table-column prop="state" label="状态"></el-table-column>
						<el-table-column prop="stock_num" label="库存数量"></el-table-column>
						<el-table-column prop="home_recommendation" label="首页推荐"></el-table-column>
						<el-table-column prop="mall_recommendation" label="商城推荐"></el-table-column>
						<el-table-column label="操作" min-width="180" align="center">
							<template slot-scope="scope">
								<router-link to='/commodityComment'>
									<el-button type="text" icon="el-icon-message" style="font-size: 18px;" @click="addAccount_dialog = true"></el-button>
								</router-link>
								<router-link to='/commodityInfo'>
									<el-button type="text" icon="el-icon-edit-outline" style="font-size: 18px;" @click="addAccount_dialog = true"></el-button>
								</router-link>
								
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
		<!--批量删除弹出框-->
		<el-dialog title="提示" :visible.sync="deleteAll_dialog" width="30%">
			<span>是否确认批量删除所选商品？</span>
			<span slot="footer" class="dialog-footer">
				<el-button @click="deleteAll_dialog = false">取 消</el-button>
				<el-button type="primary" @click="deleteAll_dialog = false">确 定</el-button>
			</span>
		</el-dialog>
		<!--新增商品弹出框-->
		<el-dialog title="新增商品" :visible.sync="add_commodity">
			<el-form :model="form">
				<el-row>
					<el-col :span='8'>
						<el-form-item>
							<el-input v-model="form.name" placeholder="商品名称"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span='8' :offset='8'>
						<el-form-item>
							<el-select v-model="form.classification" placeholder="所属二级分类">

							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span='8'>
						<el-form-item>
							<el-input v-model="form.original_price" placeholder="商品原价"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span='8' :offset='8'>
						<el-form-item>
							<el-input v-model="form.present_price" placeholder="商品现价"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span='8'>
						<el-form-item>
							<el-select v-model="form.state" placeholder="状态">
								<el-option label="已上架" value="1"></el-option>
								<el-option label="已下架" value="2"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span='8' :offset='8'>
						<el-form-item>
							<el-input v-model="form.stock" placeholder="库存数量"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span='8'>
						<el-form-item>
							<el-select v-model="form.home_recommendation" placeholder="首页推荐">
								<el-option label="是" value="1"></el-option>
								<el-option label="否" value="2"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span='8' :offset='8'>
						<el-form-item>
							<el-select v-model="form.mall_recommendation" placeholder="商城推荐">
								<el-option label="是" value="1"></el-option>
								<el-option label="否" value="2"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="add_commodity = false">保 存</el-button>
			</div>
		</el-dialog>
		<!--删除提示框-->
		<el-dialog title="提示" :visible.sync="delete_dialog" width="30%">
			<span>是否确认删除该商品？</span>
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
				delete_dialog: false,
				deleteAll_dialog:false,
				add_commodity: false,
				classification_search:'',
				first_classification:'',
				second_classification:'',
				pageSize: 10,
				pageNum: 1,
				total: 0,
				tableData: [{
					id: 1,
					mall_name: 'xxxx',
					classification: 'xxxxx',
					original_price: '',
					present_price:'',
					state:'',
					stock_num:'',
					home_recommendation:'是',
					mall_recommendation:'否'
				}],
				form: {
					name: '',
					classification: '',
					original_price: '',
					present_price:'',
					state:'',
					stock:'',
					home_recommendation:'',
					mall_recommendation:'',
					
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
	.amoyProducts {
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
