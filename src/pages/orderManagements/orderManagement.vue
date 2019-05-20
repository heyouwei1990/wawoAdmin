<template>
	<div class="selfClassification container" >
        <el-form  :inline="true" :model="conditionform">
          <el-form-item>
            <el-input v-model="conditionform.order_no" placeholder="请输入订单号搜索" prefix-icon="el-icon-search" @keyup.enter.native="getOrderList"></el-input>
          </el-form-item>
          <el-form-item>
            <el-select v-model="conditionform.module_id" placeholder="全部订单类型" @change='getOrderList'>
              <el-option label="全部订单类型" value=""></el-option>
              <el-option label="商品" value="1"></el-option>
              <el-option label="线下课程" value="2"></el-option>
              <el-option label="文章/秘籍" value="3"></el-option>
              <el-option label="线上视频课程" value="5"></el-option>
              <el-option label="购买会员" value="6"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="conditionform.status" placeholder="全部订单状态"  @change='getOrderList'>
              <el-option label="全部订单状态" value="0"></el-option>
              <el-option label="待付款" value="1"></el-option>
              <el-option label="待发货" value="2"></el-option>
              <el-option label="已发货(未签到)" value="3"></el-option>
              <el-option label="已完成(线下课程已签到/商品待评价)" value="4"></el-option>
              <el-option label="申请退款中" value="5"></el-option>
              <el-option label="退款成功" value="6"></el-option>
              <el-option label="已完成(已评价)" value="7"></el-option>
              <el-option label="已取消" value="-1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button @click="getOrderList" type="primary">查询</el-button>
          </el-form-item>
          <el-form-item class="pull-right">
            <el-button @click="export2Excel">批量导出</el-button>
          </el-form-item>
        </el-form>
					<el-table :data="tableData" border class="table" ref="multipleTable" @select="handleSelectionChange">
						<el-table-column type="selection" width="40" align="center"></el-table-column>
						<el-table-column prop="id" label="序号" min-width="50"></el-table-column>
						<el-table-column prop="module_name" label="订单类型"></el-table-column>
						<el-table-column prop="order_no" label="订单号"></el-table-column>
						<el-table-column prop="c_time" label="下单时间"></el-table-column>
						<el-table-column prop="status_name" label="订单状态"></el-table-column>
						<el-table-column prop="customer_name" label="下单人"></el-table-column>
						<el-table-column prop="payment_amount" label="订单总额"></el-table-column>
						<el-table-column prop="is_share" label="是否分润" :formatter="formatShare"></el-table-column>
						<el-table-column label="订单详情"  align="center">
							<template slot-scope="scope">
									<el-button type="text" icon="el-icon-view"  @click="$router.push({path:'/commodityInformation',query:{id:scope.row.id}})">查看</el-button>
							</template>
						</el-table-column>
						<!--<el-table-column label="分润信息" align="center">-->
							<!--<template slot-scope="scope">-->
								<!--<router-link to="/distributingInformation">-->
									<!--<el-button type="text" icon="el-icon-view"  @click="delete_dialog = true"></el-button>-->
								<!--</router-link>-->
							<!--</template>-->
						<!--</el-table-column>-->
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
				pageSize: 10,
				pageNum: 1,
				total: 0,
        conditionform:{
          module_id: '',
          status: '0',
          order_no: '',
        },
				tableData: []
			}
		},
		created() {
			this.getOrderList();
		},
		methods: {
		  //格式化是否分润
      formatShare: function(row, column) {
        return row.is_share === 0 ? '未分润':'已分润'
      },
			handleSizeChange(size) {
				this.pageSize = size;
				this.getOrderList();
			},
			handleCurrentChange(currentPage) {
				this.pageNum = currentPage;
				this.getOrderList();
			},
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			//获取订单列表
			getOrderList() {
				this.$http('/admin/order/getOrderList', {
						page: this.pageNum,
						size: this.pageSize,
						...this.conditionform
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
          let tHeader = ['序号','订单类型', '订单号', '下单时间', '下单状态', '下单人','订单总额','是否分润'];
          let filterVal = ['id','module_name', 'order_no', 'c_time', 'status_name', 'customer_name','payment_amount','is_share'];
          let list = this.tableData;
          let data = this.formatJson(filterVal, list);
           for(var i=0;i<data.length;i++){
             data[i][7] = data[i][7]==0 ? '未分润':'已分润'
           }
          export_json_to_excel(tHeader, data, '订单管理excel');
        })
      },
		}
	}
</script>

<style lang='scss'>
	.selfClassification {

	}
</style>
