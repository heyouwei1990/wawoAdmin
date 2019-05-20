<template>
	<div class="classManagement container">
    <el-form :inline="true" :model="filterForm">
      <el-form-item>
        <el-input v-model="filterForm.phone" placeholder="请输入手机号关键字搜索" prefix-icon="el-icon-search" @keyup.enter.native='getClassManageList'></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="filterForm.status" placeholder="全部上课状态" @change='getClassManageList'>
          <el-option label="全部" value=""></el-option>
          <el-option label="未签到" value="3"></el-option>
          <el-option label="已签到" value="4"></el-option>
          <el-option label="已完成" value="7"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getClassManageList">查询</el-button>
      </el-form-item>
      <el-form-item class="pull-right">
        <el-button @click="bulkSignIn">批量签到</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" border class="table" ref="multipleTable" @select="handleSelectionChange">
      <el-table-column type="selection" width="40" align="center"></el-table-column>
      <el-table-column prop="id" label="序号" min-width="50"></el-table-column>
      <el-table-column prop="customer_name" label="姓名"></el-table-column>
      <el-table-column prop="gender" label="性别" :formatter="formatSex"></el-table-column>
      <el-table-column prop="phone" label="手机号"></el-table-column>
      <el-table-column prop="rank_name" label="等级"></el-table-column>
      <el-table-column prop="recommend_name" label="推荐人"></el-table-column>
      <el-table-column prop="team_name" label="所属团队"></el-table-column>
      <el-table-column prop="status" label="上课状态" :formatter="formatStatus"></el-table-column>
      <el-table-column label="操作" min-width="80" align="center">
        <template slot-scope="scope">
          <el-button type="text" v-if="scope.row.status==3" icon="el-icon-edit-outline" @click="signIn(scope.row.id)">签到</el-button>
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
			  filterForm:{
			    phone:'',
          status:''
        },
				pageSize: 10,
				pageNum: 1,
				total: 0,
        multipleSelection:'',
				tableData: [],
				form: {
					class_state: ''
				},
			}
		},
		created(){
			this.getClassManageList()
		},
		methods: {
			//格式化性别
			formatSex: function(row, column) {
				return row.gender === 0 ? '未知' : row.gender === 1 ? '男' : '女'
			},
      formatStatus(row, column){
			  var str='';
			  switch (row.status) {
          case 3:
            str='未签到';
            break;
          case 4:
            str='已签到';
            break;
          case 7:
            str='已完成';
            break;
        }
        return str;
      },
			handleSizeChange(size) {
				this.pageSize = size;
				this.getClassManageList()
			},
			handleCurrentChange(currentPage) {
				this.pageNum = currentPage;
				this.getClassManageList()
			},
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
      bulkSignIn(){
        this.$confirm('是否批量签到?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var arr=[];
          for(var i=0;i<this.multipleSelection.length;i++){
            arr.push(this.multipleSelection[i].id);
          }
          var ids=arr.join(',');
          if(!ids){
            return;
          }
          this.$http('/admin/course/signByOrderIds',{
            order_ids:ids
          }).then(r=>{
            if(r.code==0){
              this.$message.success('批量签到成功！');
              this.getClassManageList();
            }
          })
        })
      },
			//获取上课管理列表
			getClassManageList() {
				this.$http('/admin/course/getSignList', {
						page: this.pageNum,
						size: this.pageSize,
						phone:this.filterForm.phone,
						content_id:this.$route.query.id,
						status:this.filterForm.status
				}).then(res => {
					if(res.code == 0){
						this.tableData = res.data.list
						this.total = res.data.totalRow
					}
				})
			},
      signIn(pkid){
        this.$confirm('是否确认签到?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http('/admin/course/signByOrderId',{
            order_id:pkid
          }).then(r=>{
            if(r.code==0){
              this.$message.success('签到成功！');
              this.getClassManageList();
            }
          })
        })
      },
		}
	}
</script>

<style lang="scss">
	.classManagement {
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
