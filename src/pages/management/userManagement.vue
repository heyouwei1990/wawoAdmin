<template>
	<div class="userManagement container">
        <el-form  :inline="true" :model="filterForm">
          <el-form-item>
            <el-input v-model="filterForm.input" placeholder="请根据用户姓名或手机号关键字搜索" prefix-icon="el-icon-search" @keyup.enter.native="getCustomerList"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="getCustomerList" type="primary">查询</el-button>
          </el-form-item>
          <el-form-item class="pull-right">
            <el-button @click="export2Excel">批量导出</el-button>
          </el-form-item>
        </el-form>
					<el-table :data="tableData" border class="table" ref="multipleTable" @select="handleSelectionChange">
						<el-table-column type="selection" width="40" align="center"></el-table-column>
						<el-table-column prop="id" label="序号" min-width="50"></el-table-column>
						<el-table-column prop="customer_name" label="昵称"></el-table-column>
						<el-table-column prop="gender" label="性别" :formatter="formatSex"></el-table-column>
						<el-table-column prop="phone" label="手机号"></el-table-column>
						<el-table-column prop="rank_name" label="等级"></el-table-column>
						<el-table-column prop="recommend_name" label="推荐人"></el-table-column>
						<el-table-column prop="recommend_phone" label="推荐人手机号"></el-table-column>
						<el-table-column prop="team_name" label="团队名称"></el-table-column>
						<el-table-column prop="credit_values" label="信用值"></el-table-column>
						<el-table-column prop="status" label="状态" :formatter="formatStatus"></el-table-column>
						<el-table-column label="操作" min-width="180" align="center">
							<template slot-scope="scope">
								<el-button type="text" icon="el-icon-edit-outline
			" @click="getCustomerDetail(scope)">修改</el-button>
								<el-button type="text" icon="el-icon-goods
			" @click="getStatus(scope)">冻结</el-button>
							</template>
						</el-table-column>
					</el-table>
					<div class="pagination">
						<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" class='page' :current-page="pageNum"
						 :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
						</el-pagination>
					</div>
		<el-dialog title="修改用户信息" :visible.sync="dialogFormVisible">
			<!--头像弹出框-->
			<el-dialog width="30%" title="头像" :visible.sync="avatar_dialog" append-to-body>
				<div class='avatarBox'>
					<img :src="editForm.avatar" alt="">
				</div>
			</el-dialog>
			<!--信用值明细弹出框-->
			<el-dialog width="40%" title="信用值明细" :visible.sync="credit_values_dialog" append-to-body>
				<el-table :data="creditValues" >
					<el-table-column prop="c_time">
					</el-table-column>
					<el-table-column prop="score">
					</el-table-column>
					<el-table-column prop="content">
					</el-table-column>
				</el-table>
			</el-dialog>
			<!--收益明细-->
			<el-dialog width="40%" title="收益明细" :visible.sync="money_values_dialog" append-to-body>
				<el-table :data="moneyValues" >
					<el-table-column prop="c_time">
					</el-table-column>
					<el-table-column prop="amount">
					</el-table-column>
					<el-table-column prop="type_name">
					</el-table-column>
				</el-table>
			</el-dialog>
			<el-form ref="editForm" :model="editForm" label-width="80px" :rules="rules">
				<el-row>
					<el-col :span="12">
						<el-form-item label="姓名">
							<el-input v-model="editForm.real_name"   :disabled="true"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="性别" prop="gender">
							<el-select v-model="editForm.gender" placeholder="性别">
                <el-option v-if="allGender.length" :label="item.name" :value="item.value" v-for="(item,index) in allGender" :key="index"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="手机号">
							<el-input v-model="editForm.phone" placeholder="手机号" :disabled="true"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="昵称" prop="customer_name">
							<el-input v-model="editForm.customer_name" placeholder="昵称" ></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="等级:">
							<div>
								{{editForm.rank_name}}
							</div>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="团队">
							<el-input v-model="editForm.team_name" placeholder="团队"  :disabled="true"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="推荐人手机号" label-width='110px' prop="recommend_phone">
							<el-input v-model="editForm.recommend_phone" placeholder="推荐人手机号" >
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="3" :offset='1'>
						<el-button @click='getRecommend'>搜索</el-button>
					</el-col>
					<el-col :span="7">
						<el-form-item label="推荐人姓名:" label-width='100px'>
							<div class="red">{{editForm.recommend_name}}</div>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="2">
						<el-form-item label="实名认证">
						</el-form-item>
					</el-col>
					<el-col :span="1" :offset='1'>
						<el-checkbox v-model="editForm.checked"  class="checkbox"></el-checkbox>
					</el-col>
					<el-col :span="4" :offset='2'>
						<el-button>查看详情</el-button>
					</el-col>
					<el-col :span="4" :offset='2'>
						<el-form-item label="头像">
						</el-form-item>
					</el-col>
					<el-col :span="4" :offset='2'>
						<el-button @click='avatar_dialog = true'>查看</el-button>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="4">
						<el-form-item label="信用值:">
							<div>{{editForm.credit_values}}</div>
						</el-form-item>
					</el-col>
					<el-col :span="4" :offset='2'>
						<el-button @click='getCreditValue'>明细</el-button>
					</el-col>
					<el-col :span="4" :offset='2'>
						<el-form-item label="收益:">
							<div>{{editForm.money_values}}</div>
						</el-form-item>
					</el-col>
					<el-col :span="4" :offset='2'>
						<el-button @click='getMoneyValue'>明细</el-button>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24" class="save">
						<el-button type="primary" @click="updateCustomer">保存</el-button>
					</el-col>
				</el-row>
			</el-form>
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
        filterForm:{
          input: '',
        },
				id:'',
        editForm: {},
				tableData: [],
				dialogFormVisible: false,
				centerDialogVisible: false,
				avatar_dialog: false,
				credit_values_dialog: false,
				money_values_dialog: false,
				creditValues: [],
				moneyValues: [],
        allGender:[{
				  name:'未知',
          value:0
        },{
          name:'男',
          value:1
        },{
          name:'女',
          value:2
        }],
        rules:{
          gender:[{required:true,message:'请选择性别',trigger:'change'}],
          customer_name:[{required:true,message:'昵称是必填项',trigger:'blur'}],
          recommend_phone:[{required:true,message:'推荐人手机号是必填项',trigger:'blur'}],
        }
			}
		},
		created() {
			this.getCustomerList();
		},
		methods: {
			//格式化性别
			formatSex: function(row, column) {
				return row.gender === 0 ? '未知' : row.gender === 1 ? '男' : '女'
			},
			//格式化状态
			formatStatus: function(row, column) {
				return row.status === 0 ? '正常' : '已冻结'
			},
      //翻页
			handleSizeChange(size) {
				this.pageSize = size;
				this.getCustomerList();
			},
      //改变每页条目
			handleCurrentChange(currentPage) {
				this.pageNum = currentPage;
				this.getCustomerList();
			},
      //多选
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			//获取用户列表
			getCustomerList() {
				this.$http('/admin/customer/getCustomerList', {
						page: this.pageNum,
						size: this.pageSize,
						name_or_phone: this.filterForm.input
				}).then(res => {
					if ( res.code == 0) {
						this.tableData = res.data.list
						this.total = res.data.totalRow
					}
				})
			},
			//获得点击行用户信息详情
			getCustomerDetail(scope) {
				this.dialogFormVisible = true
				this.editForm = scope.row
				this.editForm.gender = this.editForm.gender
				this.getCustomerList();
			},
			//搜索手机号搜索
			getRecommend() {
				this.$http('/admin/customer/getByPhone', {
						phone: this.editForm.recommend_phone
				}).then(res => {
					if (res.code == 0) {
						this.editForm.recommend_name = res.data.customer_name
					}
          this.getCustomerList();
				})
			},
			//信用值明细查询
			getCreditValue() {
				this.credit_values_dialog = true
				this.$http('/admin/customer/getFlowRecord', {
						id: this.editForm.id,
				}).then(res => {
					if (res.code == 0) {
						this.creditValues = res.data.list
					}
				})
			},
			//收益明细查询
			getMoneyValue() {
				this.money_values_dialog = true
				this.$http('/admin/customer/getMoneyRecord', {
						id: this.editForm.id
				}).then(res => {
					if (res.code == 0) {
						this.moneyValues = res.data.list
					}
				})
			},
			//修改用户信息
			updateCustomer() {
        this.$refs['editForm'].validate(valid=>{
          if(valid){
            this.dialogFormVisible = false
            this.$http('/admin/customer/updateCustomer', {
              id: this.editForm.id,
              real_name: this.editForm.real_name,
              phone: this.editForm.phone,
              customer_name: this.editForm.customer_name,
              gender: this.editForm.gender,
              recommend_phone: this.editForm.recommend_phone,
              recommend_name: this.editForm.recommend_name
            }).then(res => {
              if (res.code == 0) {
                this.$message({
                  message: res.data,
                  type: 'success'
                })
              } else {
                this.$message.error(res.message)
              }
              this.getCustomerList();
            })
          }
        })

			},
			//冻结操作
			getStatus(scope) {
				this.centerDialogVisible = true
				this.id = scope.row.id
        this.$confirm('是否冻结/解冻该用户?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http('/admin/customer/updateStatus',{id:this.id}).then(res=>{
            if(res.code ==0){
              this.$message({
                message: '操作成功',
                type: 'success'
              })
            }else{
              this.$message.error(res.message)
            }
            this.centerDialogVisible = false
            this.getCustomerList();
          })
        }).catch(() => {

        });
			},
      //导出
      export2Excel(){
        require.ensure([], () => {
          let { export_json_to_excel } = require('../../util/Export2Excel');
          let tHeader = ['序号','昵称', '性别', '手机号', '等级', '推荐人','推荐人手机号','团队名称','信用值','状态'];
          let filterVal = ['id','customer_name', 'gender', 'phone', 'rank_name', 'recommend_name','recommend_phone','team_name','credit_values','status'];
          let list = this.tableData;
          let data = this.formatJson(filterVal, list);
           for(var i=0;i<data.length;i++){
             data[i][2] = data[i][2]==0?"未知":data[i][2]==1?"男":"女"
             data[i][9] = data[i][9]==0? '正常' : '已冻结'
           }
          export_json_to_excel(tHeader, data, '用户管理excel');
        })
      },
		}
	}
</script>

<style lang="scss">
	.userManagement {
		.checkbox{
      line-height: 40px;
    }
		.container {
			padding: 20px;
		}
	}
	.el-dialog {
		.el-row {
			padding: 10px;
		}
		.avatarBox {
			margin: 0 auto;
			width: 350px;
			height: 350px;
			img {
				width: 100%;
				height: 100%;
			}
		}
    .save{
      text-align: center;
    }
	}
</style>
