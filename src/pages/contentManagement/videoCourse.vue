 <template>
	<div class="videoCourse container">
    <el-form :inline="true" :model="filterForm" class="demo-form-inline">
      <el-form-item label="视频课程">
      </el-form-item>
      <el-form-item>
        <el-input v-model="filterForm.keyword" placeholder="请输入课程关键字搜索" prefix-icon="el-icon-search" @keyup.enter.native='getVideoCourse'></el-input>
      </el-form-item>
      <el-form-item label="课程种类">
        <el-select v-model="filterForm.categoryId" placeholder="请选择" @change='getVideoCourse'>
          <el-option label="请选择" value=""></el-option>
          <el-option v-if="videoCategory.length" v-for='(item,index) in videoCategory' :key='index' :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="课程状态">
        <el-select v-model="filterForm.status" placeholder="请选择" @change='getVideoCourse'>
          <el-option label="请选择" value=""></el-option>
          <el-option label="已发布" value="1"></el-option>
          <el-option label="未发布" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="getVideoCourse" type="primary">查询</el-button>
      </el-form-item>
      <el-form-item class="pull-right">
        <el-button @click="$router.push({path:'/videoCategory'})">分类管理</el-button>
        <el-button @click="$router.push({path:'/classDetails'})">新增课程</el-button>
        <el-button @click="remove()">批量删除</el-button>
        <el-button @click="export2Excel">批量导出</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" border class="table" ref="multipleTable" @select="handleSelectionChange">
      <el-table-column type="selection" width="40" align="center"></el-table-column>
      <el-table-column prop="id" label="序号" min-width="50"></el-table-column>
      <el-table-column prop="name" label="课程种类"></el-table-column>
      <el-table-column label="课程封面" width="100">
        <template slot-scope="scope">
          <img :src="scope.row.thumbnail" width="40" height="40" class="thumbnail" />
        </template>
      </el-table-column>
      <el-table-column prop="title" label="课程标题"></el-table-column>、
      <el-table-column prop="orig_price" label="课程原价"></el-table-column>
      <el-table-column prop="price" label="课程现价"></el-table-column>
      <el-table-column prop="status" label="课程状态" :formatter="formatState"></el-table-column>
      <el-table-column prop="sort" label="顺序"></el-table-column>
      <el-table-column label="视频列表" min-width="180" align="center">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit-outline" @click="$router.push({path:'/videoList',query:{id:scope.row.id}})">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column label="课程详情" min-width="180" align="center">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit-outline" @click="$router.push({path:'/classDetails',query:{id:scope.row.id}})">修改</el-button>
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
</template>

<script>
  import {mapState} from 'vuex'
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
        videoCategory:state=>state.videoCategory
      })
    },
		created() {
			this.getVideoCourse();
			this.getVideoCategory();
		},
		methods: {
			//格式化课程状态
			formatState: function(row, column) {
				return row.status === 1 ? '已发布' : "未发布"
			},
      //改变每页条数
			handleSizeChange(size) {
				this.pageSize = size;
				this.getVideoCourse();
			},
      //翻页
			handleCurrentChange(currentPage) {
				this.pageNum = currentPage;
				this.getVideoCourse();
			},
      //多选
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			//获取视频课程列表
			getVideoCourse() {
				this.$http('/admin/video/get', {
						...this.filterForm,
						page: this.pageNum,
						size: this.pageSize
				}).then(res => {
					if (res.code == 0) {
						this.tableData = res.data.list
						this.total = res.data.totalRow
					}
				})
			},
			//获取视频种类管理
			getVideoCategory() {
				this.$store.dispatch('getVideoCategory');
			},
      //批量删除
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
          this.$http('/admin/video/deleteByIds',{
            ids:ids
          }).then(r=>{
            if(r.code==0){
              this.$message.success('删除成功！');
              this.getVideoCourse();
            }
          })
        }).catch(() => {

        });
      },
      //导出
      export2Excel(){
        require.ensure([], () => {
          let { export_json_to_excel } = require('../../util/Export2Excel');
          let tHeader = ['序号','课程种类', '课程标题', '课程封面', '课程原价', '课程现价','课程状态'];
          let filterVal = ['id','name', 'title', 'thumbnail', 'orig_price', 'price','status'];
          let list = this.tableData;
          let data = this.formatJson(filterVal, list);
           for(var i=0;i<data.length;i++){
             data[i][7] = data[i][7]==1?"已发布":'未发布';
           }
          export_json_to_excel(tHeader, data, '视频课程列表excel');
        })
      },
		}
	}
</script>

<style lang="scss">
	.videoCourse {
		.el-header {
			background-color: white;
			padding: 10px 30px;
			margin-bottom: 6px;
		}

		.thumbnail {
			display: block;
			width: 100%;
			height: auto;
		}
	}
</style>
