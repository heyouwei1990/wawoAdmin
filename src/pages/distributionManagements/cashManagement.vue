<template>
	<div class="cashManagement container">
        <el-form  :inline="true" :model="searchform">
          <el-form-item>
            <el-input v-model="searchform.proposer" placeholder="请输入申请人昵称搜索" prefix-icon="el-icon-search" @keyup.enter.native="getWithdrawList"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="getWithdrawList" type="primary">查询</el-button>
          </el-form-item>
          <el-form-item class="pull-right">
            <el-button @click="setProfit_dialog = true">提现手续费设置</el-button>
          </el-form-item>
          <el-form-item class="pull-right">
            <el-button @click="export2Excel">批量导出</el-button>
          </el-form-item>
        </el-form>
					<el-table :data="tableData" border class="table" ref="multipleTable" @select="handleSelectionChange">
						<el-table-column type="selection" width="40" align="center"></el-table-column>
						<el-table-column prop="id" label="序号" min-width="50"></el-table-column>
						<el-table-column prop="proposer" label="申请人"></el-table-column>
						<el-table-column prop="real_name" label="银行卡持卡人"></el-table-column>
						<el-table-column prop="bank_card_no" label="银行卡号"></el-table-column>
						<el-table-column prop="bank_name" label="开户行"></el-table-column>
						<el-table-column prop="withdraw_price" label="提现金额"></el-table-column>
						<el-table-column prop="service_price" label="手续费"></el-table-column>
						<el-table-column prop="arrival_price" label="实际到账金额"></el-table-column>
						<el-table-column prop="is_success" label="提现状态" :formatter="formatStatus"></el-table-column>
						<el-table-column label="审批" min-width="180" align="center">
							<template slot-scope="scope">
								<el-button type="text" icon="el-icon-edit-outline" @click="approval(scope)">审批</el-button>
							</template>
						</el-table-column>
					</el-table>
					<div class="pagination">
						<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" class='page' :current-page="pageNum"
						 :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
						</el-pagination>
					</div>
		<!--设置分润比例弹出框-->
		<el-dialog title="提现手续费设置" :visible.sync="setProfit_dialog">
			<el-form :model="form" label-width="140px">
				<el-form-item label="手续费(%)">
					<el-input v-model="form.profit" placeholder="请输入手续费百分比"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="setWithdrawalFee">保 存</el-button>
			</div>
		</el-dialog>
		<!--审批弹出框-->
		<el-dialog title="提现审批" :visible.sync="operation_dialog">
			<el-form :model="form1" label-width="140px">
				<el-form-item label="审批结果">
					<el-select v-model="form1.is_succeed">
            <el-option label="请选择审批结果" value=""></el-option>
						<el-option label="通过" value="1"></el-option>
						<el-option label="拒绝" value="2"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="updateWithdraw">保 存</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				setProfit_dialog: false,
				operation_dialog: false,
				pageSize: 10,
				pageNum: 1,
				total: 0,
        searchform:{
          proposer: ''
        },
				tableData: [],
				form: {
					profit: ''
				},
				form1: {
          is_succeed : '',
          id:''
				}
			}
		},
    created(){
		  this.getWithdrawList()
    },
		methods: {
      //格式化提现状态
      formatStatus: function(row, column) {
        return row.is_success === 0 ? '提现中':row.is_success === 1?'提现成功':'提现失败'
      },
			handleSizeChange(size) {
        this.pageSize = size;
        this.getWithdrawList()
			},
			handleCurrentChange(currentPage) {
        this.pageNum = currentPage;
        this.getWithdrawList()
			},
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
      //获取提现管理列表
        getWithdrawList(){
          this.$http('/admin/profit/getWithdrawList',{
            page: this.pageNum,
            size: this.pageSize,
            proposer:this.searchform.proposer
          }).then(res=>{
            if(res.code == 0){
              this.tableData = res.data.list
              this.total = res.data.totalRow
            }
          })
        },
      //提现手续费设置
      setWithdrawalFee(){
        this.$http('/admin/profit/updateWithdrawalFee',{
          Withdrawal_fee:this.form.profit
        }).then(res=>{
          if(res.code == 0){
            this.$message({
              message:'设置成功',
              type:'success'
            })
          }else{
            this.$message(res.message)
          }
          this.getWithdrawList()
          this.setProfit_dialog = false
          this.form.profit = ''
        })
      },
      //审批
      approval(scope){
        this.form1.is_succeed = ''
        this.operation_dialog = true
        this.form1.id = scope.row.id
      },
        updateWithdraw(){
        console.log(this.form1)
          this.$http('/admin/profit/updateWithdraw',{
            ...this.form1
          }).then(res=>{
            if(res.code == 0){
              this.$message.success('设置成功')
            }else{
              this.$message.error(res.message)
            }
            this.form1.is_succeed = ''
            this.operation_dialog = false
            this.getWithdrawList()
          })
        },
      //导出
      export2Excel(){
        require.ensure([], () => {
          let { export_json_to_excel } = require('../../util/Export2Excel');
          let tHeader = ['序号','申请人', '银行卡持卡人', '银行卡号', '开行户', '提现金额','手续费','实际到账金额','提现状态'];
          let filterVal = ['id','proposer', 'real_name', 'bank_card_no', 'bank_name', 'withdraw_price','service_price','arrival_price','is_success'];
          let list = this.tableData;
          let data = this.formatJson(filterVal, list);
           for(var i=0;i<data.length;i++){
             data[i][8] = data[i][8]==0 ? '提现中': data[i][8] == 1?'提现成功':'提现失败'
           }
          export_json_to_excel(tHeader, data, '提现管理excel');
        })
      },
		}
	}
</script>

<style lang='scss'>
	.cashManagement {

	}
</style>
