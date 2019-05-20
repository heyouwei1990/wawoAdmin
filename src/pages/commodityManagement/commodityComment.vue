<template>
	<div class="container commodityComment">
      <el-form :inline="true" :model="filterForm">
        <el-form-item>
          <el-input v-model="filterForm.key" placeholder="请输入评论内容搜索" prefix-icon="el-icon-search" @keyup.enter.native="getCommentList"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="getCommentList" type="primary">查询</el-button>
        </el-form-item>
        <el-form-item class="pull-right">
          <el-button @click="remove()">批量删除</el-button>
          <el-button @click="export2Excel">批量导出</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="tableData" border class="table" ref="multipleTable" @select="handleSelectionChange">
        <el-table-column type="selection" width="40" align="center"></el-table-column>
        <el-table-column prop="id" label="序号" min-width="50"></el-table-column>
        <el-table-column prop="customer_name" label="昵称"></el-table-column>
        <el-table-column prop="phone" label="手机号" ></el-table-column>
        <el-table-column prop="title" label="评价商品"></el-table-column>
        <el-table-column prop="c_time" label="评价时间"></el-table-column>
        <el-table-column prop="desc" label="评价内容"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-delete" @click="remove(scope.row.id)"></el-button>
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
	export default {
		data() {
			return {
				pageSize: 10,
				pageNum: 1,
				total: 0,
				tableData: [],
        filterForm:{
				  key:''
        }
			}
		},
    created(){
      this.getCommentList()
    },
		methods: {
		  //改变每页条数
			handleSizeChange(size) {
        this.pageSize = size;
        this.getCommentList()
			},
      //翻页
			handleCurrentChange(currentPage) {
        this.pageNum = currentPage;
        this.getCommentList()
			},
      //多选
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
      //获取商品评价
      getCommentList(){
        this.$http('/admin/commodity/getOrderCommentList',{
          page: this.pageNum,
          size: this.pageSize,
          desc:this.filterForm.key,
          content_id:this.$route.query.id
        }).then(res=>{
          if(res.code == 0){
            this.tableData = res.data.list
            this.total = res.data.totalRow
          }
        })
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
          this.$http('/admin/commodity/deleteCommentByIds',{
            ids:ids
          }).then(r=>{
            if(r.code==0){
              this.$message.success('删除成功');
              this.getCommentList();
            }
          })
        })
      },

      //导出
      export2Excel(){
        require.ensure([], () => {
          let { export_json_to_excel } = require('../../util/Export2Excel');
          let tHeader = ['序号','昵称', '手机号', '评价商品', '评价时间', '评价内容'];
          let filterVal = ['id','customer_name', 'phone', 'title', 'c_time', 'desc'];
          let list = this.tableData;
          let data = this.formatJson(filterVal, list);
          /* for(var i=0;i<data.length;i++){
             data[i][2] = data[i][2]==''?"无":this.formatImg(data[i][2]);
             data[i][8] = data[i][8]==0?"0":tool.timeFormat(data[i][8]);
           }*/
          export_json_to_excel(tHeader, data, '评价列表excel');
        })
      },
		}

	}
</script>

<style lang="scss">
	.commodityComment {

	}
</style>
