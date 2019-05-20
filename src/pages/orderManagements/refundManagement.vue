<template>
  <div class="cashManagement container">
    <el-form  :inline="true" :model="searchform">
      <el-form-item>
        <el-input v-model="searchform.order_no" placeholder="请输入订单号搜索" prefix-icon="el-icon-search" @keyup.enter.native="getRefundList"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getRefundList" type="primary">查询</el-button>
      </el-form-item>
      <el-form-item class="pull-right">
        <el-button @click="export2Excel">批量导出</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" border class="table" ref="multipleTable" @select="handleSelectionChange">
      <el-table-column type="selection" width="40" align="center"></el-table-column>
      <el-table-column prop="id" label="序号" min-width="50"></el-table-column>
      <el-table-column prop="order_no" label="订单号"></el-table-column>
      <el-table-column prop="real_name" label="收款人"></el-table-column>
      <el-table-column prop="bank_card_no" label="银行卡号"></el-table-column>
      <el-table-column prop="amount" label="退款金额"></el-table-column>
      <el-table-column prop="refund_desc" label="退款原因"></el-table-column>
      <el-table-column prop="method" label="退款方式" :formatter="formatMethod"></el-table-column>
      <el-table-column prop="payment_type" label="支付方式" :formatter="formatPayment"></el-table-column>
      <el-table-column prop="is_success" label="退款状态" :formatter="formatStatus"></el-table-column>
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
        operation_dialog: false,
        pageSize: 10,
        pageNum: 1,
        total: 0,
        searchform:{
          order_no: ''
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
      this.getRefundList()
    },
    methods: {
      //格式化退款方式
      formatMethod: function(row, column) {
        return row.method === 1 ? '原路退款': '打款'
      },
      //格式化支付方式
      formatPayment: function(row, column) {
        return row.payment_type === 1 ? '微信':  row.payment_type === 2 ? '支付宝' : '信用分'
      },
      //格式化退款状态
      formatStatus: function(row, column) {
        return row.is_success === 0 ? '申请退款中':  row.is_success === 1 ? '退款成功' : '退款失败'
      },
      handleSizeChange(size) {
        this.pageSize = size;
        this.getRefundList()
      },
      handleCurrentChange(currentPage) {
        this.pageNum = currentPage;
        this.getRefundList()
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      //获取退款列表
      getRefundList(){
        this.$http('/admin/order/getRefundList',{
          page: this.pageNum,
          size: this.pageSize,
          order_no:this.searchform.order_no
        }).then(res=>{
          if(res.code == 0){
            this.tableData = res.data.list
            this.total = res.data.totalRow
          }
        })
      },
      //审批
      approval(scope){
        this.form1.is_succeed = ''
        this.operation_dialog = true
        this.form1.id = scope.row.id
      },
      updateWithdraw(){
        this.$http('/admin/order/updateRefund',{
          ...this.form1
        }).then(res=>{
          if(res.code == 0){
            this.$message.success('设置成功')
          }else{
            this.$message.error(res.message)
          }
          this.form1.is_succeed = ''
          this.operation_dialog = false
          this.getRefundList()
        })
      },
      //导出
      export2Excel(){
        require.ensure([], () => {
          let { export_json_to_excel } = require('../../util/Export2Excel');
          let tHeader = ['序号','订单号', '收款人', '银行卡号', '退款金额', '退款原因','退款方式','支付方式','退款状态'];
          let filterVal = ['id','order_no', 'real_name', 'bank_card_no', 'amount', 'refund_desc','method','payment_type','is_success'];
          let list = this.tableData;
          let data = this.formatJson(filterVal, list);
          for(var i=0;i<data.length;i++){
            data[i][6] = data[i][6]==1 ? '原路退款': '打款'
            data[i][7] = data[i][7]==1 ? '微信': data[i][8] == 2?'支付宝':'信用分'
            data[i][8] = data[i][8]==0 ? '申请退款中': data[i][8] == 1?'退款成功':'退款失败'
          }
          export_json_to_excel(tHeader, data, '退款管理excel');
        })
      },
    }
  }
</script>

<style lang='scss'>
  .cashManagement {

  }
</style>
