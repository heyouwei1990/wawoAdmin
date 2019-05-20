<template>
	<div class="articleManagement">
			<div class="container">
        <el-form :inline="true" :model="filterForm" class="demo-form-inline">
          <el-form-item>
            <el-input v-model="filterForm.keyword" placeholder="请输入文章标题关键字搜索" prefix-icon="el-icon-search" @keyup.enter.native='getArticleList'></el-input>
          </el-form-item>
          <el-form-item label="文章种类">
            <el-select v-model="filterForm.categoryId" placeholder="请选择" @change="getArticleList">
              <el-option label="请选择" value=""></el-option>
              <el-option v-for="(item,index) in articleCategory" :key="index" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="文章状态">
            <el-select v-model="filterForm.status" placeholder="请选择" @change="getArticleList">
              <el-option label="请选择" value=""></el-option>
              <el-option label="已发布" value="1"></el-option>
              <el-option label="未发布" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button @click="getArticleList" type="primary">查询</el-button>
          </el-form-item>
          <el-form-item class="pull-right">
            <el-button @click="$router.push({path:'/articleCategory'})">分类管理</el-button>
            <el-button @click="$router.push({path:'/articleDetails'})">新增文章</el-button>
            <el-button @click="remove()">批量删除</el-button>
            <el-button @click="export2Excel">批量导出</el-button>
          </el-form-item>
        </el-form>
					<el-table :data="tableData" border class="table" ref="multipleTable" @select="handleSelectionChange">
						<el-table-column type="selection" width="40" align="center"></el-table-column>
						<el-table-column prop="id" label="序号" min-width="50"></el-table-column>
						<el-table-column prop="name" label="文章种类"></el-table-column>
						<el-table-column label="文章封面">
							<template slot-scope="scope">
								<img :src="scope.row.thumbnail" width="40" height="40" class="thumbnail" />
							</template>
						</el-table-column>
						<el-table-column prop="title" label="文章标题"></el-table-column>
						<el-table-column prop="status" label="文章状态" :formatter="formatState"></el-table-column>
						<el-table-column prop="c_time" label="发布时间"></el-table-column>
            <el-table-column prop="sort" label="顺序"></el-table-column>
						<el-table-column label="文章详情" align="center">
							<template slot-scope="scope">
								<el-button type="text" icon="el-icon-edit-outline" @click="$router.push({path:'/articleDetails',query:{id:scope.row.id}})">修改</el-button>
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
			</div>
	</div>
</template>

<script>
  import { mapState } from 'vuex'
	export default {
		data() {
			return {
				pageSize: 10,
				pageNum: 1,
				total: 0,
        filterForm: {
					keyword: '',
					categoryId: '',
					status: ''
				},
				tableData: [],
			}
		},
    computed:{
      ...mapState({
        articleCategory:state=>state.articleCategory,
      })
    },
		created() {
			this.getArticleList();
			this.getArticleCategory()
		},
		methods: {
			//格式化文章状态
			formatState: function(row, column) {
				return row.status === 1 ? '已发布' : '未发布'
			},
			handleSizeChange(size) {
				this.pageSize = size;
				this.getArticleList();
			},
			handleCurrentChange(currentPage) {
				this.pageNum = currentPage;
				this.getArticleList();
			},
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			//获取文章列表展示
			getArticleList() {
				this.$http('/admin/article/get', {
						...this.filterForm,
						page: this.pageNum,
						size: this.pageSize
				}).then(res => {
					if (res.code == 0) {
						this.tableData = res.data.list;
						this.total = res.data.totalRow;
					}
				})
			},
			//获取文章种类渲染到课程种类下拉框
			getArticleCategory() {
				this.$store.dispatch('getArticleCategory');
			},
      remove(pkid){
        var arr=[];
        var ids;
        if(pkid){
          ids=pkid;
        }else{
          for(var i=0;i<this.multipleSelection.length;i++){
            arr.push(this.multipleSelection[i].id);
          }
          ids=arr.join(',');
        }
        if(!ids){
          return;
        }
        this.$confirm('是否删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http('/admin/article/deleteIds',{
            ids:ids
          }).then(r=>{
            if(r.code==0){
              this.$message.success('删除成功！');
              this.getArticleList();
            }
          })
        }).catch(() => {

        });
      },
      //导出
      export2Excel(){
        require.ensure([], () => {
          let { export_json_to_excel } = require('../../util/Export2Excel');
          let tHeader = ['序号','文章种类', '文章封面', '文章标题', '文章状态','发布时间'];
          let filterVal = ['id','name', 'thumbnail','title', 'status', 'c_time'];
          let list = this.tableData;
          let data = this.formatJson(filterVal, list);
          for(var i=0;i<data.length;i++){
            data[i][4] = data[i][4]==1?"已发布":'未发布'
          }
          export_json_to_excel(tHeader, data, '文章管理excel');
        })
      },
		}

	}
</script>

<style lang="scss">
	.articleManagement {
		.container {
			.title {
				font-size: 15px;
				padding-bottom: 20px;
			}
		}

		.thumbnail {
			display: block;
			width: 100%;
			height: auto;
		}
	}
</style>
