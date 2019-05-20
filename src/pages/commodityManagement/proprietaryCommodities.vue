<template>
	<div class="proprietaryCommodities container">
    <el-form :inline="true" :model="filterForm">
      <el-form-item>
        <el-input v-model="filterForm.title" placeholder="请输入商品名称搜索" prefix-icon="el-icon-search" @keyup.enter.native='getCommodityList'></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="filterForm.status" placeholder="请选择状态" @change='getCommodityList'>
          <el-option label="请选择状态" value=""></el-option>
          <el-option label="上架" value="1"></el-option>
          <el-option label="下架" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getCommodityList">查询</el-button>
      </el-form-item>
      <el-form-item class="pull-right">
        <el-button @click="$router.push({path:'/commodityInfo'})">新增商品</el-button>
        <el-button @click="remove()">批量删除</el-button>
        <el-button @click="export2Excel">批量导出</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" border class="table" ref="multipleTable" @select="handleSelectionChange">
      <el-table-column type="selection" width="40" align="center"></el-table-column>
      <el-table-column prop="id" label="序号" min-width="50"></el-table-column>
      <el-table-column prop="title" label="商品名称" min-width="150"></el-table-column>
      <el-table-column prop="category_name" label="所属分类"></el-table-column>
      <el-table-column prop="orig_price" label="原价"></el-table-column>
      <el-table-column prop="price" label="现价"></el-table-column>
      <el-table-column prop="status_name" label="状态"></el-table-column>
      <el-table-column prop="stock" label="库存数量"></el-table-column>
      <el-table-column prop="is_popular" label="推荐" :formatter="formatPopular"></el-table-column>
      <el-table-column prop="sort" label="顺序"></el-table-column>
      <el-table-column label="操作"  align="center" width="290px">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-message" @click="$router.push({path:'/commodityComment',query:{id:scope.row.content_id}})">评论</el-button>
          <el-button type="text" icon="el-icon-edit-outline" @click="$router.push({path:'/commodityInfo',query:{id:scope.row.id}})">修改</el-button>
          <el-button type="text" icon="el-icon-menu" @click="$router.push({path:'/commoditySpecification',query:{id:scope.row.content_id}})">规格</el-button>
          <!--<el-button type="text" icon="el-icon-delete" @click="remove(scope.row.id)">删除</el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" class='page' :current-page="pageNum"
                     :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				filterForm:{
          title: '',
          status:'',
        },
				pageSize: 10,
				pageNum: 1,
				total: 0,
				tableData: [],
			}
		},
		created() {
			this.getCommodityList();
		},
		methods: {
		  //格式化
      formatPopular(row,col){
        return this.popular(row.is_popular);
      },
      popular(val){
        var str='';
        switch (val) {
          case 0:
            str='不推荐';
            break;
          case 1:
            str='商城推荐';
            break;
          case 2:
            str='首页推荐';
            break;
          case 3:
            str='首页、商城推荐';
            break;
        }
        return str;
      },
		  //翻页
			handleSizeChange(size) {
				this.pageSize = size;
        this.getCommodityList();
			},
      //改变每页条目
			handleCurrentChange(currentPage) {
				this.pageNum = currentPage;
        this.getCommodityList();
			},
      //多选
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
      //删除
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
			  this.$confirm('是否删除?', '提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
          this.$http('/admin/commodity/deleteCommodityByIds',{
            ids:ids
          }).then(r=>{
            if(r.code==0){
              this.$message.success('删除成功');
              this.getCommodityList();
            }
          })
        })
      },
			//获取商品列表
			getCommodityList() {
				this.$http('/admin/commodity/getCommodityList', {
						page: this.pageNum,
						size: this.pageSize,
						title:this.filterForm.title,
						status:this.filterForm.status
				}).then(res => {
					if(res.code == 0){
						this.tableData = res.data.list
						this.total = res.data.totalRow
					}
				})
			},
      //导出
      export2Excel(){
        require.ensure([], () => {
          let { export_json_to_excel } = require('../../util/Export2Excel');
          let tHeader = ['序号','商品名称', '所属分类', '原价', '现价', '状态','库存数量','推荐'];
          let filterVal = ['id','title', 'category_name', 'orig_price', 'price', 'status_name','stock','is_popular'];
          let list = this.tableData;
          let data = this.formatJson(filterVal, list);
          for(var i=0;i<data.length;i++){
            data[i][7] = this.popular(data[i][7]);
          }
          export_json_to_excel(tHeader, data, '商品列表excel');
        })
      },
		}
	}
</script>

<style lang='scss'>
	.proprietaryCommodities {

	}
</style>
