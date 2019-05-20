<template>
	<div class="selfClassification container">
    <el-form :inline="true" :model="filterForm">
      <el-form-item>
        <el-input v-model="filterForm.name" placeholder="请输入分类名称搜索" prefix-icon="el-icon-search" @keyup.enter.native='categoryList'></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="categoryList" type="primary">查询</el-button>
      </el-form-item>
      <el-form-item class="pull-right">
        <el-button @click="edit()">新增分类</el-button>
        <!--<el-button @click="">批量导出</el-button>-->
      </el-form-item>
    </el-form>
    <el-table :data="tableData" row-key="id" border lazy>
      <el-table-column prop="id" label="序号" width="60px">
      </el-table-column>
      <el-table-column prop="name" label="分类名称">
      </el-table-column>
      <!--<el-table-column prop="quantity" label="商品数量">
      </el-table-column>
      <el-table-column prop="classification_cover" label="分类封面">
      </el-table-column> -->
      <el-table-column prop="sort" label="顺序">
      </el-table-column>
      <el-table-column label="操作" align="center" width="160px">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit-outline" @click="edit(scope.row)">修改</el-button>
          <el-button type="text" icon="el-icon-delete" @click="remove(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        class='page'
        :current-page="pageNum"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
		<!--新增分类弹出框-->
		<el-dialog :title="editTitle" :visible.sync="showEditDialog" width="30%">
			<el-form :model="editForm" label-width="80px">
				<el-form-item label="分类名称">
					<el-input v-model="editForm.name" placeholder="请输入分类名称"></el-input>
				</el-form-item>
        <el-form-item label="顺序">
          <el-input v-model="editForm.sort" placeholder="请输入顺序"></el-input>
        </el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="save">保 存</el-button>
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
        showEditDialog: false,
        editTitle: '',
        filterForm:{
				  name:''
        },
				tableData: [],
				editForm: {
					name: '',
          sort:''
				},
				editId:""
			}
		},
		created() {
			this.categoryList()
		},
		methods: {
		  //改变每页条数
			handleSizeChange(size) {
				this.pageSize = size;
				this.categoryList()
			},
      //分页
			handleCurrentChange(currentPage) {
				this.pageNum = currentPage;
				this.categoryList()
			},
			//获取商品分类列表
			categoryList() {
				this.$http('/admin/commodity/getCategoryList', {
						page: this.pageNum,
						size: this.pageSize,
						name: this.filterForm.name
				}).then(res => {
					if (res.code == 0) {
						this.tableData = res.data.list
						this.total = res.data.totalRow
					}
				})
			},
			//新增分类
			save() {
			  var params;
			  if(this.editId){
          params={
            id:this.editId,
            name: this.editForm.name,
            sort:this.editForm.sort
          }
        }else{
          params={
            name: this.editForm.name,
            sort:this.editForm.sort
          }
        }
				this.$http('/admin/commodity/insertOrUpdateCategory', params).then(res => {
					if (res.code == 0) {
						this.$message.success('保存成功');
					}
          this.showEditDialog = false;
          this.categoryList()
				})

			},
			//修改分类
			edit(item) {
				if(item){
				  this.editTitle='编辑分类名称';
          this.editId = item.id;
          this.editForm.name = item.name;
          this.editForm.sort = item.sort;
        }else{
          this.editTitle='新增分类';
          this.editId = '';
          this.editForm.name = '';
          this.editForm.sort = '';
        }
				this.showEditDialog =true;
			},
			//删除分类
			remove(pkid){
        this.$confirm('是否删除该分类','提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
          this.$http('/admin/commodity/deleteCategory',{id:pkid}).then(res=>{
            if(res.code == 0){
              this.$message.success('删除成功！');
            }
            this.categoryList()
          })
        })
			}
		}
	}
</script>

<style lang='scss'>
	.selfClassification {

	}
</style>
