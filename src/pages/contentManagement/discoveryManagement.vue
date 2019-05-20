<template>
	<div class="discoveryManagement">
			<div class="container">
        <el-form  :inline="true" :model="filterForm">
          <el-form-item>
            <el-input v-model="filterForm.keyword" placeholder="请输入发现标题关键字搜索" prefix-icon="el-icon-search" @keyup.enter.native='getDiscoveryInfo'></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="getDiscoveryInfo" type="primary">查询</el-button>
          </el-form-item>
          <el-form-item class="pull-right">
            <el-button @click="export2Excel">批量导出</el-button>
          </el-form-item>
          <el-form-item class="pull-right">
            <el-button @click="remove()">批量删除</el-button>
          </el-form-item>
        </el-form>
					<el-table :data="tableData" border class="table" ref="multipleTable" @select="handleSelectionChange">
						<el-table-column type="selection" width="40" align="center"></el-table-column>
						<el-table-column prop="id" label="序号" min-width="50"></el-table-column>
						<el-table-column prop="customer_name" label="昵称"></el-table-column>
						<el-table-column prop="detail" label="内容"></el-table-column>
						<el-table-column label="图片" align="center">
							<template slot-scope="scope">
								<el-button type="text" icon="el-icon-view" :disabled="scope.row.photos.length==0" @click="getPhotosUrl(scope)">查看</el-button>
							</template>
						</el-table-column>
						<el-table-column prop="c_time" label="发布时间"></el-table-column>
						<el-table-column label="操作" align="center">
							<template slot-scope="scope">
								<el-button type="text" icon="el-icon-delete" @click="remove(scope.row.id)">删除</el-button>
							</template>
						</el-table-column>
					</el-table>
					<div class="pagination">
						<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" class='page' :current-page="pageNum"
						 :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
						</el-pagination>
					</div>
			</div>
		<!--查看图片详情弹出框-->
		<el-dialog title="查看图片详情" :visible.sync="photos_dialog" width="50%" class='photos-dialog'>
			<div v-for='item in photos' :key='item' class='photos-box'>
				<img :src="item" alt="">
			</div>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		data() {
			return {
        filterForm:{
          keyword: ''
        },
				batchDelete_dialog: false,
				photos_dialog:false,
				pageSize: 10,
				pageNum: 1,
				total: 0,
				tableData: [],
				photos:[],
				deleteArr:[]
			}
		},
		created() {
			this.getDiscoveryInfo();
		},
		methods: {
			handleSizeChange(size) {
				this.pageSize = size;
				this.getDiscoveryInfo();
			},
			handleCurrentChange(currentPage) {
				this.pageNum = currentPage;
				this.getDiscoveryInfo();
			},
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			//获取所有发现页信息
			getDiscoveryInfo() {
				this.$http('/admin/moments/get', {
						page: this.pageNum,
						size: this.pageSize,
						keyword: this.filterForm.keyword

				}).then(res => {
					if (res.code == 0) {
						this.tableData = res.data.list
						this.total = res.data.totalRow
					}
				})
			},
			//获取所有图片Url
			getPhotosUrl(scope){
				this.photos_dialog = true;
				this.photos = scope.row.photos;
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
        this.$confirm('是否删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http('/admin/moments/deleteIds',{ids:ids}).then(res=>{
            if(res.code == 0){
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              this.deleteArr = [];
              this.getDiscoveryInfo();
            }
          })
        }).catch(() => {
          this.deleteArr = [];
        });
      },
      //导出
      export2Excel(){
        require.ensure([], () => {
          let { export_json_to_excel } = require('../../util/Export2Excel');
          let tHeader = ['序号','昵称', '内容', '发布时间'];
          let filterVal = ['id','customer_name', 'detail',  'c_time'];
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
	.discoveryManagement {
		.container {
			.title {
				font-size: 15px;
				padding-bottom: 20px;
			}
		}
		.photos-dialog{
			.photos-box{
				width: 33.3333%;
				display: inline-block;
				box-sizing: border-box;
				padding: 10px;
				img{
					width: 100%;
					height:150px;
				}
			}
		}
	}
</style>
